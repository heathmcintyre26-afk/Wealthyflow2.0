import { useState, useEffect, useMemo, useCallback } from 'react'
import { TrendingUp, TrendingDown, DollarSign, Target, Plus, Trash2, Save } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { fetchHoldings, upsertHolding, deleteHolding, fetchCoinPrices, type Holding, type CoinPrice } from '../lib/api'

interface HoldingRow extends Holding {
  price: number
  change24h: number
  marketCap: number
  positionValue: number
}

const fmt = (v: number) => v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const fmtQty = (v: number) => v.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 6 })

const additionalAssets = [
  { id: 'cash', label: 'USD Cash Reserve', value: 4200.00, change24h: 0.2 },
  { id: 'staking', label: 'Staking Rewards', value: 980.45, change24h: 1.1 },
]
const liabilities = [
  { id: 'margin', label: 'Margin Balance', value: 1850.25, change24h: -0.9 },
  { id: 'loan', label: 'Hardware Wallet Loan', value: 640.00, change24h: 0.4 },
]

const getChangeClass = (v: number, positiveIsGood = true) => {
  if (v === 0) return 'text-gray-400'
  if (positiveIsGood) return v > 0 ? 'text-crypto-success' : 'text-crypto-danger'
  return v < 0 ? 'text-crypto-success' : 'text-crypto-danger'
}

const fmtChange = (v: number) => {
  const prefix = v > 0 ? '+' : v < 0 ? '-' : ''
  return `${prefix}$${Math.abs(v).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

// Default holdings to seed for new users
const DEFAULT_HOLDINGS: Omit<Holding, 'id' | 'user_id'>[] = [
  { coin_id: 'bitcoin',  symbol: 'BTC', name: 'Bitcoin',  quantity: 0.18 },
  { coin_id: 'ethereum', symbol: 'ETH', name: 'Ethereum', quantity: 2.4  },
  { coin_id: 'cardano',  symbol: 'ADA', name: 'Cardano',  quantity: 3200 },
  { coin_id: 'solana',   symbol: 'SOL', name: 'Solana',   quantity: 18   },
]

export default function Dashboard() {
  const { user } = useAuth()
  const [holdings, setHoldings] = useState<Holding[]>([])
  const [prices, setPrices] = useState<Record<string, CoinPrice>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Add-holding form state
  const [showAddForm, setShowAddForm] = useState(false)
  const [newCoinId, setNewCoinId] = useState('')
  const [newSymbol, setNewSymbol] = useState('')
  const [newName, setNewName] = useState('')
  const [newQty, setNewQty] = useState('')
  const [saving, setSaving] = useState(false)

  const loadData = useCallback(async () => {
    if (!user) return
    setLoading(true)
    setError(null)
    try {
      let h = await fetchHoldings(user.id)
      // Seed default holdings for brand-new users
      if (h.length === 0) {
        // Seed default holdings for brand-new users; tolerate partial failures
        await Promise.allSettled(DEFAULT_HOLDINGS.map((dh) => upsertHolding({ ...dh, user_id: user.id })))
        h = await fetchHoldings(user.id)
      }
      setHoldings(h)
      if (h.length > 0) {
        const coinIds = h.map((hh) => hh.coin_id)
        const priceList = await fetchCoinPrices(coinIds)
        const priceMap: Record<string, CoinPrice> = {}
        priceList.forEach((p) => { priceMap[p.id] = p })
        setPrices(priceMap)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load portfolio data')
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => { loadData() }, [loadData])

  const rows: HoldingRow[] = useMemo(() => holdings.map((h) => {
    const p = prices[h.coin_id]
    const price = p?.current_price ?? 0
    const change24h = p?.price_change_percentage_24h ?? 0
    const marketCap = p?.market_cap ?? 0
    return { ...h, price, change24h, marketCap, positionValue: price * h.quantity }
  }), [holdings, prices])

  const { totalAssets, totalLiabilities, netWorth, assetChange, liabilityChange, netWorthChange } = useMemo(() => {
    const holdingsValue = rows.reduce((s, r) => s + r.positionValue, 0)
    const holdingsChange = rows.reduce((s, r) => s + r.positionValue * (r.change24h / 100), 0)
    const extraValue = additionalAssets.reduce((s, a) => s + a.value, 0)
    const extraChange = additionalAssets.reduce((s, a) => s + a.value * (a.change24h / 100), 0)
    const liabValue = liabilities.reduce((s, l) => s + l.value, 0)
    const liabChange = liabilities.reduce((s, l) => s + l.value * (l.change24h / 100), 0)
    const ta = holdingsValue + extraValue
    const ac = holdingsChange + extraChange
    return {
      totalAssets: ta,
      totalLiabilities: liabValue,
      netWorth: ta - liabValue,
      assetChange: ac,
      liabilityChange: liabChange,
      netWorthChange: ac - liabChange,
    }
  }, [rows])

  const handleDelete = async (coinId: string) => {
    if (!user) return
    await deleteHolding(user.id, coinId)
    setHoldings((prev) => prev.filter((h) => h.coin_id !== coinId))
  }

  const handleUpdateQty = async (h: Holding, newQuantity: number) => {
    if (!user) return
    await upsertHolding({ ...h, user_id: user.id, quantity: newQuantity })
    setHoldings((prev) => prev.map((hh) => hh.coin_id === h.coin_id ? { ...hh, quantity: newQuantity } : hh))
  }

  const handleAddHolding = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !newCoinId || !newSymbol || !newName || !newQty) return
    setSaving(true)
    try {
      const holding: Holding = {
        user_id: user.id,
        coin_id: newCoinId.toLowerCase().trim(),
        symbol: newSymbol.toUpperCase().trim(),
        name: newName.trim(),
        quantity: parseFloat(newQty),
      }
      await upsertHolding(holding)
      await loadData()
      setNewCoinId(''); setNewSymbol(''); setNewName(''); setNewQty('')
      setShowAddForm(false)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-crypto-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Portfolio Dashboard</h1>
            <p className="text-gray-400">Track your live net worth across crypto holdings, cash, and liabilities</p>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="btn-primary flex items-center space-x-2 text-sm"
          >
            <Plus size={16} /><span>Add Holding</span>
          </button>
        </div>

        {/* Add Holding Form */}
        {showAddForm && (
          <form onSubmit={handleAddHolding} className="glass-effect p-6 mb-8 grid grid-cols-2 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">CoinGecko ID</label>
              <input value={newCoinId} onChange={(e) => setNewCoinId(e.target.value)} placeholder="bitcoin" required
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-crypto-accent" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Symbol</label>
              <input value={newSymbol} onChange={(e) => setNewSymbol(e.target.value)} placeholder="BTC" required
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-crypto-accent" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Name</label>
              <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Bitcoin" required
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-crypto-accent" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Quantity</label>
              <input type="number" step="any" min="0" value={newQty} onChange={(e) => setNewQty(e.target.value)} placeholder="0.5" required
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-crypto-accent" />
            </div>
            <div className="flex items-end">
              <button type="submit" disabled={saving} className="w-full btn-primary text-sm flex items-center justify-center space-x-1 disabled:opacity-60">
                <Save size={14} /><span>{saving ? 'Saving…' : 'Save'}</span>
              </button>
            </div>
          </form>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/40 rounded-lg text-red-400 text-sm">{error}</div>
        )}

        {/* Net Worth Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="glass-effect p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-2">Net Worth</p>
                <p className="text-3xl font-bold">${fmt(netWorth)}</p>
              </div>
              <div className="gradient-crypto p-3 rounded-lg"><DollarSign className="w-6 h-6" /></div>
            </div>
          </div>
          <div className="glass-effect p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-2">Total Assets</p>
                <p className="text-3xl font-bold text-crypto-success">${fmt(totalAssets)}</p>
                <p className={`text-sm mt-2 ${getChangeClass(assetChange)}`}>{fmtChange(assetChange)} today</p>
              </div>
              <div className="bg-green-500/20 p-3 rounded-lg">
                {assetChange >= 0 ? <TrendingUp className="w-6 h-6 text-crypto-success" /> : <TrendingDown className="w-6 h-6 text-crypto-danger" />}
              </div>
            </div>
          </div>
          <div className="glass-effect p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-2">Total Liabilities</p>
                <p className="text-3xl font-bold text-crypto-danger">${fmt(totalLiabilities)}</p>
                <p className={`text-sm mt-2 ${getChangeClass(liabilityChange, false)}`}>{fmtChange(liabilityChange)} today</p>
              </div>
              <div className="bg-red-500/20 p-3 rounded-lg">
                {liabilityChange <= 0 ? <TrendingUp className="w-6 h-6 text-crypto-success" /> : <TrendingDown className="w-6 h-6 text-crypto-danger" />}
              </div>
            </div>
          </div>
          <div className="glass-effect p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-2">24h Net Worth Change</p>
                <p className={`text-3xl font-bold ${getChangeClass(netWorthChange)}`}>{fmtChange(netWorthChange)}</p>
              </div>
              <div className="bg-blue-500/20 p-3 rounded-lg"><Target className="w-6 h-6 text-crypto-accent" /></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-12">
          <div className="xl:col-span-2 glass-effect overflow-hidden">
            <div className="px-6 py-4 border-b border-white/10"><h2 className="text-xl font-bold">Asset Breakdown</h2></div>
            <div className="divide-y divide-white/10">
              {[
                ...rows.map((r) => ({ id: r.coin_id, label: `${r.name} (${fmtQty(r.quantity)} ${r.symbol})`, value: r.positionValue })),
                ...additionalAssets,
              ].map((asset) => (
                <div key={asset.id} className="px-6 py-4 flex items-center justify-between">
                  <p className="text-gray-300">{asset.label}</p>
                  <p className="font-semibold text-crypto-success">${fmt(asset.value)}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="glass-effect overflow-hidden">
            <div className="px-6 py-4 border-b border-white/10"><h2 className="text-xl font-bold">Liabilities</h2></div>
            <div className="divide-y divide-white/10">
              {liabilities.map((l) => (
                <div key={l.id} className="px-6 py-4 flex items-center justify-between">
                  <p className="text-gray-300">{l.label}</p>
                  <p className="font-semibold text-crypto-danger">${fmt(l.value)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Holdings Table */}
        <div className="glass-effect overflow-hidden">
          <div className="px-6 py-4 border-b border-white/10"><h2 className="text-xl font-bold">Your Holdings</h2></div>
          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-crypto-accent"></div>
              <p className="mt-4 text-gray-400">Loading portfolio data…</p>
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
                    <th className="px-6 py-4 text-left text-gray-400 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.coin_id} className="border-b border-white/5 hover:bg-white/5 transition">
                      <td className="px-6 py-4">
                        <p className="font-semibold">{r.name}</p>
                        <p className="text-gray-400 text-sm">{r.symbol}</p>
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="number"
                          step="any"
                          min="0"
                          defaultValue={r.quantity}
                          onBlur={(e) => {
                            const v = parseFloat(e.target.value)
                            if (!isNaN(v) && v >= 0 && v !== r.quantity) handleUpdateQty(r, v)
                          }}
                          className="w-28 bg-white/10 border border-white/20 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-crypto-accent"
                        />
                      </td>
                      <td className="px-6 py-4 font-semibold">${fmt(r.price)}</td>
                      <td className="px-6 py-4 font-semibold text-crypto-success">${fmt(r.positionValue)}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-semibold ${
                          r.change24h >= 0 ? 'bg-green-500/20 text-crypto-success' : 'bg-red-500/20 text-crypto-danger'
                        }`}>
                          {r.change24h >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                          <span>{r.change24h >= 0 ? '+' : ''}{r.change24h.toFixed(2)}%</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-300">${(r.marketCap / 1_000_000_000).toFixed(0)}B</td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleDelete(r.coin_id)}
                          className="text-crypto-danger hover:text-red-400 transition"
                          title="Remove holding"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="mt-8 glass-effect p-6 border-l-4 border-crypto-accent">
          <p className="text-gray-300">
            💡 <strong>Pro Tip:</strong> Holdings are saved to your account. Edit quantities inline and they will sync automatically.
          </p>
        </div>
      </div>
    </div>
  )
}
