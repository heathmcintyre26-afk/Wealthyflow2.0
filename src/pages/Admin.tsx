import { useState } from 'react'
import { Wallet, Lock, Copy, Check, ShieldAlert } from 'lucide-react'
import { useWallet } from '../hooks/useWallet'
import { ADMIN_ADDRESS } from '../config/admin'

export default function Admin() {
  const { account, connect, isConnecting, disconnect } = useWallet()
  const [copied, setCopied] = useState(false)

  // Simulated revenue data
  const walletData = {
    balance: 45.25,
    revenue: 12450.50,
    pendingPayouts: 3200.00,
    totalEarnings: 52650.50,
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // --- Access guard ---
  // Require a wallet connection first
  if (!account) {
    return (
      <div className="min-h-screen bg-crypto-dark flex flex-col items-center justify-center space-y-6 px-4 text-center">
        <div className="gradient-crypto p-5 rounded-2xl">
          <ShieldAlert className="w-12 h-12" />
        </div>
        <h2 className="text-3xl font-bold">Admin Access</h2>
        <p className="text-gray-400 max-w-md">
          Connect the authorized admin wallet to access this page.
        </p>
        <button
          onClick={connect}
          disabled={isConnecting}
          className="btn-primary text-base disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isConnecting ? 'Connecting…' : 'Connect Wallet'}
        </button>
      </div>
    )
  }

  // If VITE_ADMIN_ADDRESS is configured, enforce address match
  if (ADMIN_ADDRESS && account.toLowerCase() !== ADMIN_ADDRESS) {
    return (
      <div className="min-h-screen bg-crypto-dark flex flex-col items-center justify-center space-y-6 px-4 text-center">
        <div className="bg-red-500/20 p-5 rounded-2xl">
          <ShieldAlert className="w-12 h-12 text-crypto-danger" />
        </div>
        <h2 className="text-3xl font-bold">Access Denied</h2>
        <p className="text-gray-400 max-w-md">
          The connected wallet is not authorized to view this page.
          Please connect the admin wallet to continue.
        </p>
        <p className="text-xs text-gray-500 font-mono break-all max-w-xs">{account}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-crypto-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-gray-400">Manage your admin wallet and earnings</p>
        </div>

        {/* Warning Alert */}
        <div className="glass-effect p-4 border-l-4 border-yellow-500 mb-8 flex items-start space-x-3">
          <Lock size={20} className="text-yellow-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-yellow-400">Security Notice</p>
            <p className="text-gray-300 text-sm">Only use a dedicated wallet for revenue collection. Never share your private keys.</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column - Connected Wallet */}
          <div className="md:col-span-1">
            <div className="glass-effect p-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2">
                <Wallet size={24} />
                <span>Admin Wallet</span>
              </h2>

              <div className="space-y-4">
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <p className="text-sm text-green-400 mb-2">✓ Wallet Connected</p>
                  <p className="font-mono text-sm text-white break-all">{account}</p>
                </div>
                <button
                  onClick={() => handleCopy(account)}
                  className="w-full flex items-center justify-center space-x-2 bg-white/10 hover:bg-white/20 rounded-lg px-4 py-2 transition"
                >
                  {copied ? (
                    <>
                      <Check size={18} className="text-crypto-success" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={18} />
                      <span>Copy Address</span>
                    </>
                  )}
                </button>
                <button
                  onClick={disconnect}
                  className="w-full flex items-center justify-center space-x-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg px-4 py-2 transition"
                >
                  <span>Disconnect</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Revenue Stats */}
          <div className="md:col-span-2 space-y-8">
            {/* Revenue Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="glass-effect p-6">
                <p className="text-gray-400 text-sm mb-2">Total Earnings</p>
                <p className="text-3xl font-bold text-crypto-success">${walletData.totalEarnings.toLocaleString()}</p>
              </div>
              <div className="glass-effect p-6">
                <p className="text-gray-400 text-sm mb-2">Course Revenue</p>
                <p className="text-3xl font-bold text-crypto-accent">${walletData.revenue.toLocaleString()}</p>
              </div>
              <div className="glass-effect p-6">
                <p className="text-gray-400 text-sm mb-2">Wallet Balance</p>
                <p className="text-3xl font-bold text-yellow-400">{walletData.balance} ETH</p>
              </div>
              <div className="glass-effect p-6">
                <p className="text-gray-400 text-sm mb-2">Pending Payouts</p>
                <p className="text-3xl font-bold text-orange-400">${walletData.pendingPayouts.toLocaleString()}</p>
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="glass-effect p-8">
              <h3 className="text-xl font-bold mb-6">Recent Transactions</h3>
              <div className="space-y-4">
                {[
                  { date: '2024-06-15', course: 'Technical Analysis', amount: 49, status: 'Completed' },
                  { date: '2024-06-14', course: 'DeFi & Smart Contracts', amount: 99, status: 'Completed' },
                  { date: '2024-06-13', course: 'Portfolio Management', amount: 59, status: 'Pending' },
                ].map((tx, i) => (
                  <div key={i} className="flex items-center justify-between p-4 border-b border-white/10 last:border-0">
                    <div>
                      <p className="font-semibold">{tx.course}</p>
                      <p className="text-sm text-gray-400">{tx.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${tx.amount}</p>
                      <p className={`text-sm ${
                        tx.status === 'Completed' ? 'text-crypto-success' : 'text-yellow-400'
                      }`}>
                        {tx.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Withdrawal Options */}
            <div className="glass-effect p-8">
              <h3 className="text-xl font-bold mb-4">Automatic Payouts</h3>
              <p className="text-gray-300 mb-6">All course revenue is automatically distributed to your connected wallet every week.</p>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <input type="checkbox" id="auto-payout" defaultChecked className="w-4 h-4" />
                  <label htmlFor="auto-payout" className="text-gray-300">Enable automatic payouts</label>
                </div>
                <button className="w-full btn-primary">
                  Withdraw ${walletData.pendingPayouts.toLocaleString()} Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
