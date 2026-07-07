import { useState } from 'react'
import { Menu, X, Wallet, LogOut, User } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useWallet } from '../hooks/useWallet'
import { useAuth } from '../hooks/useAuth'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { account, isConnecting, error, connect, disconnect } = useWallet()
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const shortAddress = account
    ? `${account.slice(0, 6)}...${account.slice(-4)}`
    : null

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  const shortEmail = user?.email
    ? user.email.length > 20 ? `${user.email.slice(0, 17)}…` : user.email
    : null

  return (
    <nav className="bg-crypto-light border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="gradient-crypto p-2 rounded-lg group-hover:scale-110 transition-transform">
              <Wallet className="w-6 h-6" />
            </div>
            <span className="font-bold text-xl">wealthflow.444</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-300 hover:text-white transition">Home</Link>
            <Link to="/dashboard" className="text-gray-300 hover:text-white transition">Dashboard</Link>
            <Link to="/courses" className="text-gray-300 hover:text-white transition">Courses</Link>
            <Link to="/pricing" className="text-gray-300 hover:text-white transition">Pricing</Link>

            {/* Wallet connect */}
            {account ? (
              <button
                onClick={disconnect}
                className="btn-primary text-sm flex items-center space-x-2"
                title="Click to disconnect wallet"
              >
                <span className="w-2 h-2 rounded-full bg-crypto-success inline-block"></span>
                <span>{shortAddress}</span>
              </button>
            ) : (
              <button
                onClick={connect}
                disabled={isConnecting}
                className="btn-primary text-sm disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isConnecting ? 'Connecting…' : 'Connect Wallet'}
              </button>
            )}

            {/* Auth state */}
            {user ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-300 flex items-center space-x-1">
                  <User size={14} />
                  <span>{shortEmail}</span>
                </span>
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-1 text-sm text-gray-400 hover:text-white transition"
                  title="Sign out"
                >
                  <LogOut size={16} />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <Link to="/auth" className="text-sm text-crypto-accent hover:text-blue-400 transition font-semibold">
                Sign In
              </Link>
            )}

            <Link to="/admin" className="text-gray-300 hover:text-crypto-accent transition text-sm">
              Admin
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-300 hover:text-white"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Error banner */}
        {error && (
          <div className="pb-2">
            <p className="text-crypto-danger text-sm text-center">{error}</p>
          </div>
        )}

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 border-t border-white/10">
            <Link to="/" className="block py-2 text-gray-300 hover:text-white">Home</Link>
            <Link to="/dashboard" className="block py-2 text-gray-300 hover:text-white">Dashboard</Link>
            <Link to="/courses" className="block py-2 text-gray-300 hover:text-white">Courses</Link>
            <Link to="/pricing" className="block py-2 text-gray-300 hover:text-white">Pricing</Link>
            <Link to="/admin" className="block py-2 text-gray-300 hover:text-white">Admin</Link>
            {user ? (
              <div className="mt-4 space-y-2">
                <p className="text-sm text-gray-400 flex items-center space-x-1 py-1">
                  <User size={14} /><span>{user.email}</span>
                </p>
                <button
                  onClick={handleSignOut}
                  className="btn-secondary w-full flex items-center justify-center space-x-2 text-sm"
                >
                  <LogOut size={16} /><span>Sign Out</span>
                </button>
              </div>
            ) : (
              <Link to="/auth" className="block mt-4 btn-primary text-center text-sm">
                Sign In / Sign Up
              </Link>
            )}
            {account ? (
              <button
                onClick={disconnect}
                className="btn-primary w-full mt-2 text-sm flex items-center justify-center space-x-2"
              >
                <span className="w-2 h-2 rounded-full bg-crypto-success inline-block"></span>
                <span>{shortAddress}</span>
              </button>
            ) : (
              <button
                onClick={connect}
                disabled={isConnecting}
                className="btn-primary w-full mt-2 text-sm disabled:opacity-60"
              >
                {isConnecting ? 'Connecting…' : 'Connect Wallet'}
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
