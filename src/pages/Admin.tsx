import { useState, useEffect } from 'react'
import { Wallet, Lock, LogOut, Copy, Check, RefreshCw } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { fetchTransactions, type Transaction } from '../lib/api'

const COURSE_NAMES: Record<number, string> = {
  1: 'Crypto Fundamentals',
  2: 'Technical Analysis Mastery',
  3: 'DeFi & Smart Contracts',
  4: 'Portfolio Management Pro',
  5: 'Risk Management & Trading Psychology',
  6: 'Advanced Trading Algorithms',
}

export default function Admin() {
  const { user } = useAuth()
  const [adminWallet, setAdminWallet] = useState<string | null>(null)
  const [walletInput, setWalletInput] = useState('')
  const [copied, setCopied] = useState(false)
  const [isConnected, setIsConnected] = useState(false)

  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loadingTx, setLoadingTx] = useState(true)
  const [txError, setTxError] = useState<string | null>(null)

  const loadTransactions = async () => {
    setLoadingTx(true)
    setTxError(null)
    try {
      const txs = await fetchTransactions()
      setTransactions(txs)
    } catch (err) {
      setTxError(err instanceof Error ? err.message : 'Failed to load transactions')
    } finally {
      setLoadingTx(false)
    }
  }

  useEffect(() => { loadTransactions() }, [])

  // Derived stats from real transactions
  const totalRevenue = transactions
    .filter((t) => t.status === 'completed')
    .reduce((s, t) => s + t.amount, 0)
  const pendingPayouts = transactions
    .filter((t) => t.status === 'pending')
    .reduce((s, t) => s + t.amount, 0)
  const courseRevenue = transactions
    .filter((t) => t.status === 'completed' && t.course_id !== null)
    .reduce((s, t) => s + t.amount, 0)

  const handleConnect = () => {
    if (walletInput.toLowerCase().startsWith('0x')) {
      setAdminWallet(walletInput)
      setIsConnected(true)
      setWalletInput('')
    } else {
      alert('Please enter a valid Ethereum wallet address')
    }
  }

  const handleDisconnect = () => {
    setAdminWallet(null)
    setIsConnected(false)
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-crypto-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-gray-400">
              Signed in as <span className="text-crypto-accent">{user?.email}</span>
            </p>
          </div>
          <button onClick={loadTransactions} className="flex items-center space-x-2 text-sm text-gray-400 hover:text-white transition">
            <RefreshCw size={16} /><span>Refresh</span>
          </button>
        </div>

        {/* Warning Alert */}
        <div className="glass-effect p-4 border-l-4 border-yellow-500 mb-8 flex items-start space-x-3">
          <Lock size={20} className="text-yellow-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-yellow-400">Security Notice</p>
            <p className="text-gray-300 text-sm">Only connect a dedicated wallet for revenue collection. Never share your private keys.</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column - Wallet Connection */}
          <div className="md:col-span-1">
            <div className="glass-effect p-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2">
                <Wallet size={24} />
                <span>Admin Wallet</span>
              </h2>

              {!isConnected ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Wallet Address</label>
                    <input
                      type="text"
                      placeholder="0x..."
                      value={walletInput}
                      onChange={(e) => setWalletInput(e.target.value)}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-crypto-accent"
                    />
                  </div>
                  <button onClick={handleConnect} className="w-full btn-primary">
                    Connect Wallet
                  </button>
                  <p className="text-xs text-gray-400 text-center">
                    This enables automated revenue distribution
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                    <p className="text-sm text-green-400 mb-2">✓ Wallet Connected</p>
                    <p className="font-mono text-sm text-white break-all">{adminWallet}</p>
                  </div>
                  <button
                    onClick={() => handleCopy(adminWallet ?? '')}
                    className="w-full flex items-center justify-center space-x-2 bg-white/10 hover:bg-white/20 rounded-lg px-4 py-2 transition"
                  >
                    {copied ? (
                      <><Check size={18} className="text-crypto-success" /><span>Copied!</span></>
                    ) : (
                      <><Copy size={18} /><span>Copy Address</span></>
                    )}
                  </button>
                  <button
                    onClick={handleDisconnect}
                    className="w-full flex items-center justify-center space-x-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg px-4 py-2 transition"
                  >
                    <LogOut size={18} />
                    <span>Disconnect</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Revenue Stats */}
          <div className="md:col-span-2 space-y-8">
            {/* Revenue Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="glass-effect p-6">
                <p className="text-gray-400 text-sm mb-2">Total Revenue</p>
                <p className="text-3xl font-bold text-crypto-success">
                  {loadingTx ? '—' : `$${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                </p>
              </div>
              <div className="glass-effect p-6">
                <p className="text-gray-400 text-sm mb-2">Course Revenue</p>
                <p className="text-3xl font-bold text-crypto-accent">
                  {loadingTx ? '—' : `$${courseRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                </p>
              </div>
              <div className="glass-effect p-6">
                <p className="text-gray-400 text-sm mb-2">Total Transactions</p>
                <p className="text-3xl font-bold text-yellow-400">
                  {loadingTx ? '—' : transactions.length}
                </p>
              </div>
              <div className="glass-effect p-6">
                <p className="text-gray-400 text-sm mb-2">Pending Payouts</p>
                <p className="text-3xl font-bold text-orange-400">
                  {loadingTx ? '—' : `$${pendingPayouts.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                </p>
              </div>
            </div>

            {/* Transactions Table */}
            <div className="glass-effect p-8">
              <h3 className="text-xl font-bold mb-6">Recent Transactions</h3>
              {txError && (
                <div className="mb-4 p-3 bg-red-500/20 border border-red-500/40 rounded-lg text-sm text-red-400">{txError}</div>
              )}
              {loadingTx ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-crypto-accent"></div>
                </div>
              ) : transactions.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No transactions yet.</p>
              ) : (
                <div className="space-y-4">
                  {transactions.slice(0, 20).map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between p-4 border-b border-white/10 last:border-0">
                      <div>
                        <p className="font-semibold">
                          {tx.course_id ? (COURSE_NAMES[tx.course_id] ?? `Course #${tx.course_id}`) : 'Subscription'}
                        </p>
                        <p className="text-sm text-gray-400">
                          {tx.created_at ? new Date(tx.created_at).toLocaleDateString() : '—'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${tx.amount.toFixed(2)}</p>
                        <p className={`text-sm ${
                          tx.status === 'completed' ? 'text-crypto-success' :
                          tx.status === 'pending' ? 'text-yellow-400' : 'text-crypto-danger'
                        }`}>
                          {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Withdrawal Options */}
            {isConnected && (
              <div className="glass-effect p-8">
                <h3 className="text-xl font-bold mb-4">Automatic Payouts</h3>
                <p className="text-gray-300 mb-6">All course revenue is automatically distributed to your connected wallet every week.</p>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <input type="checkbox" id="auto-payout" defaultChecked className="w-4 h-4" />
                    <label htmlFor="auto-payout" className="text-gray-300">Enable automatic payouts</label>
                  </div>
                  <button className="w-full btn-primary">
                    Withdraw ${pendingPayouts.toFixed(2)} Now
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
