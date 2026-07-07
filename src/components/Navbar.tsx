import { useState } from 'react'
import { Menu, X, Wallet } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useWallet } from '../hooks/useWallet'

const ADMIN_ADDRESS = (import.meta.env.VITE_ADMIN_ADDRESS as string | undefined)?.toLowerCase()

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { account, isConnecting, error, connect, disconnect } = useWallet()

  const shortAddress = account
    ? `${account.slice(0, 6)}...${account.slice(-4)}`
    : null

  const isAdmin = !ADMIN_ADDRESS || (!!account && account.toLowerCase() === ADMIN_ADDRESS)

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
            {account ? (
              <button
                onClick={disconnect}
                className="btn-primary text-sm flex items-center space-x-2"
                title="Click to disconnect"
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
            {isAdmin && (
              <Link to="/admin" className="text-gray-300 hover:text-crypto-accent transition text-sm">
                Admin
              </Link>
            )}
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
            <Link to="/" className="block py-2 text-gray-300 hover:text-white" onClick={() => setIsOpen(false)}>Home</Link>
            <Link to="/dashboard" className="block py-2 text-gray-300 hover:text-white" onClick={() => setIsOpen(false)}>Dashboard</Link>
            <Link to="/courses" className="block py-2 text-gray-300 hover:text-white" onClick={() => setIsOpen(false)}>Courses</Link>
            <Link to="/pricing" className="block py-2 text-gray-300 hover:text-white" onClick={() => setIsOpen(false)}>Pricing</Link>
            {isAdmin && (
              <Link to="/admin" className="block py-2 text-gray-300 hover:text-white" onClick={() => setIsOpen(false)}>Admin</Link>
            )}
            {account ? (
              <button
                onClick={disconnect}
                className="btn-primary w-full mt-4 text-sm flex items-center justify-center space-x-2"
              >
                <span className="w-2 h-2 rounded-full bg-crypto-success inline-block"></span>
                <span>{shortAddress}</span>
              </button>
            ) : (
              <button
                onClick={connect}
                disabled={isConnecting}
                className="btn-primary w-full mt-4 text-sm disabled:opacity-60"
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
