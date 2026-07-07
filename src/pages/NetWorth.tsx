import { useState, useEffect, useRef } from 'react'
import { Plus, Trash2, TrendingUp, TrendingDown, DollarSign, Home, Car, Briefcase, CreditCard, PiggyBank, BarChart3 } from 'lucide-react'

interface LineItem {
  id: string
  name: string
  value: number
}

interface Category {
  id: string
  label: string
  icon: React.ElementType
  color: string
  items: LineItem[]
}

const ASSET_TEMPLATES: Omit<Category, 'items'>[] = [
  { id: 'crypto',      label: 'Crypto',           icon: TrendingUp, color: 'text-blue-400',   },
  { id: 'cash',        label: 'Cash & Bank',       icon: PiggyBank,  color: 'text-green-400',  },
  { id: 'stocks',      label: 'Stocks & ETFs',     icon: BarChart3,  color: 'text-purple-400', },
  { id: 'real_estate', label: 'Real Estate',       icon: Home,       color: 'text-yellow-400', },
  { id: 'vehicles',    label: 'Vehicles',          icon: Car,        color: 'text-orange-400', },
  { id: 'other_asset', label: 'Other Assets',      icon: Briefcase,  color: 'text-gray-400',   },
]

const LIABILITY_TEMPLATES: Omit<Category, 'items'>[] = [
  { id: 'mortgage',     label: 'Mortgage',         icon: Home,       color: 'text-red-400',    },
  { id: 'car_loan',     label: 'Car Loans',        icon: Car,        color: 'text-orange-400', },
  { id: 'credit_card',  label: 'Credit Cards',     icon: CreditCard, color: 'text-rose-400',   },
  { id: 'student_loan', label: 'Student Loans',    icon: Briefcase,  color: 'text-pink-400',   },
  { id: 'other_liab',   label: 'Other Liabilities',icon: DollarSign, color: 'text-gray-400',   },
]

const STORAGE_KEY = 'wealthflow_networth'

interface StoredData {
  assetItems:    Record<string, LineItem[]>
  liabilityItems: Record<string, LineItem[]>
}

function uid() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  // Fallback for older browsers
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

function loadData(): StoredData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as StoredData
  } catch { /* ignore */ }
  return { assetItems: {}, liabilityItems: {} }
}

function saveData(data: StoredData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

function CategorySection({
  templates,
  itemsMap,
  onAdd,
  onRemove,
  onChange,
}: {
  templates: Omit<Category, 'items'>[]
  itemsMap: Record<string, LineItem[]>
  onAdd: (catId: string) => void
  onRemove: (catId: string, itemId: string) => void
  onChange: (catId: string, itemId: string, field: 'name' | 'value', value: string) => void
}) {
  return (
    <div className="space-y-4">
      {templates.map((tpl) => {
        const Icon = tpl.icon
        const items = itemsMap[tpl.id] ?? []
        const total = items.reduce((s, i) => s + (i.value || 0), 0)
        return (
          <div key={tpl.id} className="glass-effect p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Icon className={`w-5 h-5 ${tpl.color}`} />
                <span className="font-semibold">{tpl.label}</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-400">
                  ${total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
                <button
                  onClick={() => onAdd(tpl.id)}
                  className="p-1 rounded hover:bg-white/10 transition"
                  title="Add item"
                >
                  <Plus className="w-4 h-4 text-crypto-accent" />
                </button>
              </div>
            </div>

            {items.length === 0 && (
              <p className="text-gray-500 text-sm text-center py-2">No items yet — click + to add one</p>
            )}

            <div className="space-y-2">
              {items.map((item) => (
                <div key={item.id} className="flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder="Description"
                    value={item.name}
                    onChange={(e) => onChange(tpl.id, item.id, 'name', e.target.value)}
                    className="flex-1 bg-white/5 border border-white/10 rounded px-3 py-1.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-crypto-accent"
                  />
                  <div className="relative">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                    <input
                      type="number"
                      placeholder="0"
                      min="0"
                      value={item.value || ''}
                      onChange={(e) => onChange(tpl.id, item.id, 'value', e.target.value)}
                      className="w-32 bg-white/5 border border-white/10 rounded pl-6 pr-3 py-1.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-crypto-accent"
                    />
                  </div>
                  <button
                    onClick={() => onRemove(tpl.id, item.id)}
                    className="p-1 rounded hover:bg-red-500/20 transition"
                    title="Remove"
                  >
                    <Trash2 className="w-4 h-4 text-gray-500 hover:text-red-400" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default function NetWorth() {
  const [assetItems, setAssetItems] = useState<Record<string, LineItem[]>>({})
  const [liabilityItems, setLiabilityItems] = useState<Record<string, LineItem[]>>({})

  // Load from localStorage on mount
  useEffect(() => {
    const data = loadData()
    setAssetItems(data.assetItems)
    setLiabilityItems(data.liabilityItems)
  }, [])

  // Debounced persist — skip initial mount to avoid writing back data just loaded
  const hasMountedRef = useRef(false)
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true
      return
    }
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    saveTimerRef.current = setTimeout(() => {
      saveData({ assetItems, liabilityItems })
    }, 300)
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    }
  }, [assetItems, liabilityItems])

  const totalAssets = ASSET_TEMPLATES.reduce((sum, tpl) => {
    return sum + (assetItems[tpl.id] ?? []).reduce((s, i) => s + (i.value || 0), 0)
  }, 0)

  const totalLiabilities = LIABILITY_TEMPLATES.reduce((sum, tpl) => {
    return sum + (liabilityItems[tpl.id] ?? []).reduce((s, i) => s + (i.value || 0), 0)
  }, 0)

  const netWorth = totalAssets - totalLiabilities
  const isPositive = netWorth >= 0

  // Handlers — assets
  const addAssetItem = (catId: string) => {
    setAssetItems((prev) => ({
      ...prev,
      [catId]: [...(prev[catId] ?? []), { id: uid(), name: '', value: 0 }],
    }))
  }

  const removeAssetItem = (catId: string, itemId: string) => {
    setAssetItems((prev) => ({
      ...prev,
      [catId]: (prev[catId] ?? []).filter((i) => i.id !== itemId),
    }))
  }

  const changeAssetItem = (catId: string, itemId: string, field: 'name' | 'value', value: string) => {
    setAssetItems((prev) => ({
      ...prev,
      [catId]: (prev[catId] ?? []).map((i) =>
        i.id === itemId ? { ...i, [field]: field === 'value' ? Math.max(0, parseFloat(value) || 0) : value } : i
      ),
    }))
  }

  // Handlers — liabilities
  const addLiabilityItem = (catId: string) => {
    setLiabilityItems((prev) => ({
      ...prev,
      [catId]: [...(prev[catId] ?? []), { id: uid(), name: '', value: 0 }],
    }))
  }

  const removeLiabilityItem = (catId: string, itemId: string) => {
    setLiabilityItems((prev) => ({
      ...prev,
      [catId]: (prev[catId] ?? []).filter((i) => i.id !== itemId),
    }))
  }

  const changeLiabilityItem = (catId: string, itemId: string, field: 'name' | 'value', value: string) => {
    setLiabilityItems((prev) => ({
      ...prev,
      [catId]: (prev[catId] ?? []).map((i) =>
        i.id === itemId ? { ...i, [field]: field === 'value' ? Math.max(0, parseFloat(value) || 0) : value } : i
      ),
    }))
  }

  const fmt = (n: number) =>
    n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  return (
    <div className="min-h-screen bg-crypto-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-2">Net Worth</h1>
          <p className="text-gray-400">Track your total wealth across all assets and liabilities</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Net Worth */}
          <div className="glass-effect p-6 md:col-span-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-2">Net Worth</p>
                <p className={`text-3xl font-bold ${isPositive ? 'text-crypto-success' : 'text-crypto-danger'}`}>
                  {isPositive ? '' : '-'}${fmt(Math.abs(netWorth))}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${isPositive ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                {isPositive
                  ? <TrendingUp className="w-6 h-6 text-crypto-success" />
                  : <TrendingDown className="w-6 h-6 text-crypto-danger" />
                }
              </div>
            </div>
          </div>

          {/* Total Assets */}
          <div className="glass-effect p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-2">Total Assets</p>
                <p className="text-3xl font-bold text-white">${fmt(totalAssets)}</p>
              </div>
              <div className="gradient-crypto p-3 rounded-lg">
                <DollarSign className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Total Liabilities */}
          <div className="glass-effect p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-2">Total Liabilities</p>
                <p className="text-3xl font-bold text-white">${fmt(totalLiabilities)}</p>
              </div>
              <div className="bg-red-500/20 p-3 rounded-lg">
                <CreditCard className="w-6 h-6 text-red-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Assets */}
          <div>
            <h2 className="text-2xl font-bold mb-4 flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-crypto-success" />
              <span>Assets</span>
              <span className="ml-auto text-lg font-semibold text-crypto-success">${fmt(totalAssets)}</span>
            </h2>
            <CategorySection
              templates={ASSET_TEMPLATES}
              itemsMap={assetItems}
              onAdd={addAssetItem}
              onRemove={removeAssetItem}
              onChange={changeAssetItem}
            />
          </div>

          {/* Liabilities */}
          <div>
            <h2 className="text-2xl font-bold mb-4 flex items-center space-x-2">
              <TrendingDown className="w-5 h-5 text-crypto-danger" />
              <span>Liabilities</span>
              <span className="ml-auto text-lg font-semibold text-crypto-danger">${fmt(totalLiabilities)}</span>
            </h2>
            <CategorySection
              templates={LIABILITY_TEMPLATES}
              itemsMap={liabilityItems}
              onAdd={addLiabilityItem}
              onRemove={removeLiabilityItem}
              onChange={changeLiabilityItem}
            />
          </div>
        </div>

        {/* Info tip */}
        <div className="mt-10 glass-effect p-5 border-l-4 border-crypto-accent">
          <p className="text-gray-300 text-sm">
            💡 <strong>Your data stays private.</strong> All net worth figures are stored locally in your browser — nothing is sent to a server.
          </p>
        </div>
      </div>
    </div>
  )
}
