import { useState, useEffect, useMemo, useCallback } from 'react'
import { TrendingUp, TrendingDown, DollarSign, Target, Wallet } from 'lucide-react'
import { useWallet } from '../hooks/useWallet'
import { WindowWithEthereum } from '../context/wallet'

interface CryptoData {
  id: string
  name: string
  symbol: string
  price: number
  change24h: number
  marketCap: number
  quantity: number
}

interface CoinGeckoMarketData {
  id: string
  current_price: number
  price_change_percentage_24h: number | null
  market_cap: number
}

interface PortfolioAsset {
  id: string
  marketId: string
  name: string
  symbol: string
  quantity: number
  isWalletBalanceSource?: boolean
}

interface BalanceLineItem {
  id: string
  label: string
  value: number
  change24h: number
}

const currencyFormat = { minimumFractionDigits: 2, maximumFractionDigits: 2 } as const
const quantityFormat = { minimumFractionDigits: 0, maximumFractionDigits: 4 } as const
const ethDecimals = 18
const weiPerEth = 10n ** 18n
const coinGeckoMarketsUrl = 'https://api.coingecko.com/api/v3/coins/markets'
const minMarketRefreshIntervalMs = 30000

const getValidatedRefreshInterval = () => {
  const configured = Number(import.meta.env.VITE_MARKET_REFRESH_MS ?? minMarketRefreshIntervalMs)
  return Number.isFinite(configured) ? Math.max(configured, minMarketRefreshIntervalMs) : minMarketRefreshIntervalMs
}

const weiToEth = (wei: bigint) => {
  const whole = (wei / weiPerEth).toString()
  const fractionPadded = (wei % weiPerEth).toString().padStart(ethDecimals, '0')
  const fractionTrimmed = fractionPadded.replace(/0+$/, '')
  return Number.parseFloat(fractionTrimmed ? `${whole}.${fractionTrimmed}` : whole)
}

const isCoinGeckoMarketData = (value: unknown): value is CoinGeckoMarketData => {
  if (!value || typeof value !== 'object') return false
  const candidate = value as Record<string, unknown>
  return (
    typeof candidate.id === 'string'
    && typeof candidate.current_price === 'number'
    && (typeof candidate.price_change_percentage_24h === 'number' || candidate.price_change_percentage_24h === null)
    && typeof candidate.market_cap === 'number'
  )
}

// Refresh no faster than 30s to reduce risk of public API throttling.
const marketRefreshIntervalMs = getValidatedRefreshInterval()

const portfolioAssets: PortfolioAsset[] = [
  { id: 'btc', marketId: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', quantity: 0.18 },
  { id: 'eth', marketId: 'ethereum', name: 'Ethereum', symbol: 'ETH', quantity: 2.4, isWalletBalanceSource: true },
  { id: 'ada', marketId: 'cardano', name: 'Cardano', symbol: 'ADA', quantity: 3200 },
  { id: 'sol', marketId: 'solana', name: 'Solana', symbol: 'SOL', quantity: 18 },
]

const additionalAssets: BalanceLineItem[] = [
  { id: 'cash', label: 'USD Cash Reserve', value: 4200.00, change24h: 0.2 },
  { id: 'staking', label: 'Staking Rewards', value: 980.45, change24h: 1.1 },
]

const liabilities: BalanceLineItem[] = [
  { id: 'margin', label: 'Margin Balance', value: 1850.25, change24h: -0.9 },
  { id: 'loan', label: 'Hardware Wallet Loan', value: 640.00, change24h: 0.4 },
]

const formatCurrency = (value: number) => value.toLocaleString('en-US', currencyFormat)
const formatQuantity = (value: number) => value.toLocaleString('en-US', quantityFormat)

const formatCurrencyChange = (value: number) => {
  const prefix = value > 0 ? '+' : value < 0 ? '-' : ''
  return `${prefix}$${Math.abs(value).toLocaleString('en-US', currencyFormat)}`
}

const getChangeClass = (value: number, positiveIsGood = true) => {
  if (value === 0) return 'text-gray-400'
  if (positiveIsGood) return value > 0 ? 'text-crypto-success' : 'text-crypto-danger'
  return value < 0 ? 'text-crypto-success' : 'text-crypto-danger'
}

export default function Dashboard() {
  const { account, connect, isConnecting } = useWallet()
  const [cryptos, setCryptos] = useState<CryptoData[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [walletWarning, setWalletWarning] = useState<string | null>(null)

  const getEthereumBalance = useCallback(async () => {
    if (!account) return null
    const ethereum = (window as WindowWithEthereum).ethereum
    if (!ethereum) return null

    const balanceHex = await ethereum.request({
      method: 'eth_getBalance',
      params: [account, 'latest'],
    })
    if (typeof balanceHex !== 'string') throw new Error('Wallet RPC returned an invalid balance value')
    return weiToEth(BigInt(balanceHex))
  }, [account])

  const fetchMarketData = useCallback(async () => {
    try {
      const ids = portfolioAssets.map((asset) => asset.marketId).join(',')
      const params = new URLSearchParams({
        vs_currency: 'usd',
        ids,
        price_change_percentage: '24h',
      })
      const response = await fetch(`${coinGeckoMarketsUrl}?${params.toString()}`)
      if (!response.ok) throw new Error(`Failed to load market data (${response.status})`)
      const responseJson = await response.json()
      if (!Array.isArray(responseJson) || !responseJson.every(isCoinGeckoMarketData)) {
        throw new Error('Unexpected market data response format')
      }
      const markets = responseJson
      const marketById = new Map(markets.map((market) => [market.id, market]))
      if (portfolioAssets.some((asset) => !marketById.has(asset.marketId))) {
        throw new Error('Market data missing one or more tracked assets')
      }
      let ethereumBalance: number | null = null
      if (account) {
        try {
          ethereumBalance = await getEthereumBalance()
          setWalletWarning(null)
        } catch (walletError: unknown) {
          const message = walletError instanceof Error ? walletError.message : 'Unknown wallet RPC error'
          console.error('Failed to refresh wallet ETH balance:', walletError)
          setWalletWarning(`Unable to refresh wallet ETH balance (${message}). Using configured ETH quantity.`)
        }
      } else {
        setWalletWarning(null)
      }

      const nextCryptos = portfolioAssets.map((asset) => {
        const market = marketById.get(asset.marketId)
        const quantity = asset.isWalletBalanceSource && ethereumBalance !== null ? ethereumBalance : asset.quantity
        return {
          id: asset.id,
          name: asset.name,
          symbol: asset.symbol,
          price: market!.current_price,
          change24h: market!.price_change_percentage_24h ?? 0,
          marketCap: market!.market_cap,
          quantity,
        }
      })

      setCryptos(nextCryptos)
      setLoadError(null)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unable to refresh market data'
      setLoadError(message)
    } finally {
      setLoading(false)
    }
  }, [account, getEthereumBalance])

  useEffect(() => {
    void fetchMarketData()
    const interval = window.setInterval(() => {
      void fetchMarketData()
    }, marketRefreshIntervalMs)
    return () => window.clearInterval(interval)
  }, [fetchMarketData])

  const { totalAssets, totalLiabilities, netWorth, assetChange, liabilityChange, netWorthChange } = useMemo(() => {
    const holdingsValue = cryptos.reduce((sum, crypto) => sum + (crypto.price * crypto.quantity), 0)
    const holdingsChange = cryptos.reduce(
      (sum, crypto) => sum + ((crypto.price * crypto.quantity) * (crypto.change24h / 100)),
      0,
    )
    const totalAssetsValue = holdingsValue + additionalAssets.reduce((sum, asset) => sum + asset.value, 0)
    const assetChangeValue = holdingsChange + additionalAssets.reduce(
      (sum, asset) => sum + (asset.value * (asset.change24h / 100)),
      0,
    )
    const totalLiabilitiesValue = liabilities.reduce((sum, liability) => sum + liability.value, 0)
    const liabilityChangeValue = liabilities.reduce(
      (sum, liability) => sum + (liability.value * (liability.change24h / 100)),
      0,
    )

    return {
      totalAssets: totalAssetsValue,
      totalLiabilities: totalLiabilitiesValue,
      netWorth: totalAssetsValue - totalLiabilitiesValue,
      assetChange: assetChangeValue,
      liabilityChange: liabilityChangeValue,
      netWorthChange: assetChangeValue - liabilityChangeValue,
    }
  }, [cryptos])

  return (
    <div className="min-h-screen bg-crypto-dark">
      {!account && (
        <div className="flex flex-col items-center justify-center min-h-screen space-y-6 px-4 text-center">
          <div className="gradient-crypto p-5 rounded-2xl">
            <Wallet className="w-12 h-12" />
          </div>
          <h2 className="text-3xl font-bold">Connect Your Wallet</h2>
          <p className="text-gray-400 max-w-md">
            Connect your wallet to view your portfolio, track your holdings, and start trading.
          </p>
          <button
            onClick={connect}
            disabled={isConnecting}
            className="btn-primary text-base disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isConnecting ? 'Connecting…' : 'Connect Wallet'}
          </button>
        </div>
      )}
      {account && (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Title */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">Portfolio Dashboard</h1>
          <p className="text-gray-400">Track your live net worth across crypto holdings, cash, and liabilities</p>
        </div>

        {/* Net Worth Stats */}
        {loadError && (
          <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            Live market refresh failed: {loadError}. Showing the latest available values.
          </div>
        )}
        {walletWarning && (
          <div className="mb-6 rounded-lg border border-yellow-500/30 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-100">
            {walletWarning}
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="glass-effect p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-2">Net Worth</p>
                <p className="text-3xl font-bold">${formatCurrency(netWorth)}</p>
              </div>
              <div className="gradient-crypto p-3 rounded-lg">
                <DollarSign className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="glass-effect p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-2">Total Assets</p>
                <p className="text-3xl font-bold text-crypto-success">
                  ${formatCurrency(totalAssets)}
                </p>
                <p className={`text-sm mt-2 ${getChangeClass(assetChange)}`}>
                  {formatCurrencyChange(assetChange)} today
                </p>
              </div>
              <div className="bg-green-500/20 p-3 rounded-lg">
                {assetChange > 0
                  ? <TrendingUp className="w-6 h-6 text-crypto-success" />
                  : assetChange < 0
                    ? <TrendingDown className="w-6 h-6 text-crypto-danger" />
                    : <Target className="w-6 h-6 text-crypto-accent" />}
              </div>
            </div>
          </div>

          <div className="glass-effect p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-2">Total Liabilities</p>
                <p className="text-3xl font-bold text-crypto-danger">
                  ${formatCurrency(totalLiabilities)}
                </p>
                <p className={`text-sm mt-2 ${getChangeClass(liabilityChange, false)}`}>
                  {formatCurrencyChange(liabilityChange)} today
                </p>
              </div>
              <div className="bg-red-500/20 p-3 rounded-lg">
                {liabilityChange < 0
                  ? <TrendingUp className="w-6 h-6 text-crypto-success" />
                  : liabilityChange > 0
                    ? <TrendingDown className="w-6 h-6 text-crypto-danger" />
                    : <Target className="w-6 h-6 text-crypto-accent" />}
              </div>
            </div>
          </div>

          <div className="glass-effect p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-2">24h Net Worth Change</p>
                <p className={`text-3xl font-bold ${getChangeClass(netWorthChange)}`}>
                  {formatCurrencyChange(netWorthChange)}
                </p>
              </div>
              <div className="bg-blue-500/20 p-3 rounded-lg">
                <Target className="w-6 h-6 text-crypto-accent" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-12">
          <div className="xl:col-span-2 glass-effect overflow-hidden">
            <div className="px-6 py-4 border-b border-white/10">
              <h2 className="text-xl font-bold">Asset Breakdown</h2>
            </div>
            <div className="divide-y divide-white/10">
              {[
                ...cryptos.map((crypto) => ({
                  id: crypto.id,
                  label: `${crypto.name} (${formatQuantity(crypto.quantity)} ${crypto.symbol})`,
                  value: crypto.price * crypto.quantity,
                })),
                ...additionalAssets,
              ].map((asset) => (
                <div key={asset.id} className="px-6 py-4 flex items-center justify-between">
                  <p className="text-gray-300">{asset.label}</p>
                  <p className="font-semibold text-crypto-success">
                    ${formatCurrency(asset.value)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-effect overflow-hidden">
            <div className="px-6 py-4 border-b border-white/10">
              <h2 className="text-xl font-bold">Liabilities</h2>
            </div>
            <div className="divide-y divide-white/10">
              {liabilities.map((liability) => (
                <div key={liability.id} className="px-6 py-4 flex items-center justify-between">
                  <p className="text-gray-300">{liability.label}</p>
                  <p className="font-semibold text-crypto-danger">
                    ${formatCurrency(liability.value)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Crypto Holdings Table */}
        <div className="glass-effect overflow-hidden">
          <div className="px-6 py-4 border-b border-white/10">
            <h2 className="text-xl font-bold">Your Holdings</h2>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-crypto-accent"></div>
              <p className="mt-4 text-gray-400">Loading market data...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-white/10">
                  <tr>
                    <th className="px-6 py-4 text-left text-gray-400 font-semibold">Coin</th>
                    <th className="px-6 py-4 text-left text-gray-400 font-semibold">Holdings</th>
                    <th className="px-6 py-4 text-left text-gray-400 font-semibold">Price</th>
                    <th className="px-6 py-4 text-left text-gray-400 font-semibold">Position Value</th>
                    <th className="px-6 py-4 text-left text-gray-400 font-semibold">24h Change</th>
                    <th className="px-6 py-4 text-left text-gray-400 font-semibold">Market Cap</th>
                    <th className="px-6 py-4 text-left text-gray-400 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {cryptos.map((crypto) => (
                    <tr key={crypto.id} className="border-b border-white/5 hover:bg-white/5 transition">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold">{crypto.name}</p>
                          <p className="text-gray-400 text-sm">{crypto.symbol}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-300">
                        {formatQuantity(crypto.quantity)}
                      </td>
                      <td className="px-6 py-4 font-semibold">
                        ${formatCurrency(crypto.price)}
                      </td>
                      <td className="px-6 py-4 font-semibold text-crypto-success">
                        ${formatCurrency(crypto.price * crypto.quantity)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-semibold ${
                          crypto.change24h >= 0
                            ? 'bg-green-500/20 text-crypto-success'
                            : 'bg-red-500/20 text-crypto-danger'
                        }`}>
                          {crypto.change24h >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                          <span>{crypto.change24h >= 0 ? '+' : ''}{crypto.change24h}%</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-300">
                        ${(crypto.marketCap / 1000000000).toFixed(0)}B
                      </td>
                      <td className="px-6 py-4">
                        <button className="text-crypto-accent hover:text-blue-400 font-semibold transition">
                          Trade
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="mt-8 glass-effect p-6 border-l-4 border-crypto-accent">
          <p className="text-gray-300">
            💡 <strong>Pro Tip:</strong> Keep an eye on market trends and set alerts for your target prices. wealthflow.444 will notify you when buying opportunities align with your investment strategy.
          </p>
        </div>
      </div>
      )}
    </div>
  )
}
