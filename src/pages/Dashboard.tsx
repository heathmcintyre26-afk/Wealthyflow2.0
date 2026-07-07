import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, DollarSign, Target, Wallet } from 'lucide-react'
import { useWallet } from '../hooks/useWallet'

interface CryptoData {
  id: string
  name: string
  symbol: string
  price: number
  change24h: number
  marketCap: number
  quantity: number
}

interface BalanceLineItem {
  id: string
  label: string
  value: number
  change24h: number
}

export default function Dashboard() {
  const { account, connect, isConnecting } = useWallet()
  const [cryptos, setCryptos] = useState<CryptoData[]>([])
  const [loading, setLoading] = useState(true)
  const additionalAssets: BalanceLineItem[] = [
    { id: 'cash', label: 'USD Cash Reserve', value: 4200.00, change24h: 0.2 },
    { id: 'staking', label: 'Staking Rewards', value: 980.45, change24h: 1.1 },
  ]
  const liabilities: BalanceLineItem[] = [
    { id: 'margin', label: 'Margin Balance', value: 1850.25, change24h: -0.9 },
    { id: 'loan', label: 'Hardware Wallet Loan', value: 640.00, change24h: 0.4 },
  ]

  // Sample data - replace with real API calls
  useEffect(() => {
    const sampleData: CryptoData[] = [
      { id: '1', name: 'Bitcoin', symbol: 'BTC', price: 42500, change24h: 2.5, marketCap: 850000000000, quantity: 0.18 },
      { id: '2', name: 'Ethereum', symbol: 'ETH', price: 2250, change24h: -1.2, marketCap: 270000000000, quantity: 2.4 },
      { id: '3', name: 'Cardano', symbol: 'ADA', price: 0.75, change24h: 3.8, marketCap: 27000000000, quantity: 3200 },
      { id: '4', name: 'Solana', symbol: 'SOL', price: 145, change24h: 5.2, marketCap: 62000000000, quantity: 18 },
    ]

    setTimeout(() => {
      setCryptos(sampleData)
      setLoading(false)
    }, 500)
  }, [])

  const holdingsValue = cryptos.reduce((sum, crypto) => sum + (crypto.price * crypto.quantity), 0)
  const totalAssets = holdingsValue + additionalAssets.reduce((sum, asset) => sum + asset.value, 0)
  const totalLiabilities = liabilities.reduce((sum, liability) => sum + liability.value, 0)
  const netWorth = totalAssets - totalLiabilities
  const holdingsChange = cryptos.reduce(
    (sum, crypto) => sum + ((crypto.price * crypto.quantity) * (crypto.change24h / 100)),
    0,
  )
  const assetChange = holdingsChange + additionalAssets.reduce(
    (sum, asset) => sum + (asset.value * (asset.change24h / 100)),
    0,
  )
  const liabilityChange = liabilities.reduce(
    (sum, liability) => sum + (liability.value * (liability.change24h / 100)),
    0,
  )
  const netWorthChange = assetChange - liabilityChange
  const previousNetWorth = netWorth - netWorthChange
  const netWorthChangePercent = previousNetWorth === 0 ? 0 : (netWorthChange / previousNetWorth) * 100

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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="glass-effect p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-2">Net Worth</p>
                <p className="text-3xl font-bold">${netWorth.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
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
                  ${totalAssets.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
                <p className={`text-sm mt-2 ${assetChange >= 0 ? 'text-crypto-success' : 'text-crypto-danger'}`}>
                  {assetChange >= 0 ? '+' : '-'}${Math.abs(assetChange).toLocaleString('en-US', { minimumFractionDigits: 2 })} today
                </p>
              </div>
              <div className="bg-green-500/20 p-3 rounded-lg">
                {assetChange >= 0
                  ? <TrendingUp className="w-6 h-6 text-crypto-success" />
                  : <TrendingDown className="w-6 h-6 text-crypto-danger" />}
              </div>
            </div>
          </div>

          <div className="glass-effect p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-2">Total Liabilities</p>
                <p className="text-3xl font-bold text-crypto-danger">
                  ${totalLiabilities.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
                <p className={`text-sm mt-2 ${liabilityChange <= 0 ? 'text-crypto-success' : 'text-crypto-danger'}`}>
                  {liabilityChange >= 0 ? '+' : '-'}${Math.abs(liabilityChange).toLocaleString('en-US', { minimumFractionDigits: 2 })} today
                </p>
              </div>
              <div className="bg-red-500/20 p-3 rounded-lg">
                {liabilityChange <= 0
                  ? <TrendingDown className="w-6 h-6 text-crypto-success" />
                  : <TrendingUp className="w-6 h-6 text-crypto-danger" />}
              </div>
            </div>
          </div>

          <div className="glass-effect p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-2">24h Net Worth Change</p>
                <p className={`text-3xl font-bold ${netWorthChange >= 0 ? 'text-crypto-success' : 'text-crypto-danger'}`}>
                  {netWorthChange >= 0 ? '+' : ''}${Math.abs(netWorthChange).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
                <p className={`text-sm mt-2 ${netWorthChangePercent >= 0 ? 'text-crypto-success' : 'text-crypto-danger'}`}>
                  {netWorthChangePercent >= 0 ? '+' : ''}{netWorthChangePercent.toFixed(2)}%
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
                  label: `${crypto.name} (${crypto.quantity.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 4 })} ${crypto.symbol})`,
                  value: crypto.price * crypto.quantity,
                })),
                ...additionalAssets,
              ].map((asset) => (
                <div key={asset.id} className="px-6 py-4 flex items-center justify-between">
                  <p className="text-gray-300">{asset.label}</p>
                  <p className="font-semibold text-crypto-success">
                    ${asset.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
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
                    ${liability.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
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
                        {crypto.quantity.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 4 })}
                      </td>
                      <td className="px-6 py-4 font-semibold">
                        ${crypto.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4 font-semibold text-crypto-success">
                        ${(crypto.price * crypto.quantity).toLocaleString('en-US', { minimumFractionDigits: 2 })}
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
