import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Wallet, Mail, Lock, UserPlus, LogIn } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

type Mode = 'signin' | 'signup'

export default function Auth() {
  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()
  const [mode, setMode] = useState<Mode>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setInfo(null)
    setLoading(true)

    if (mode === 'signin') {
      const err = await signIn(email, password)
      if (err) {
        setError(err)
      } else {
        navigate('/dashboard')
      }
    } else {
      const err = await signUp(email, password)
      if (err) {
        setError(err)
      } else {
        setInfo('Account created! Check your email to confirm your address, then sign in.')
        setMode('signin')
        setPassword('')
      }
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-crypto-dark flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center space-x-2 group">
            <div className="gradient-crypto p-3 rounded-xl group-hover:scale-110 transition">
              <Wallet className="w-8 h-8" />
            </div>
          </Link>
          <h1 className="text-3xl font-bold mt-4">wealthflow.444</h1>
          <p className="text-gray-400 mt-1">
            {mode === 'signin' ? 'Sign in to your account' : 'Create a new account'}
          </p>
        </div>

        {/* Card */}
        <div className="glass-effect p-8">
          {/* Tab switcher */}
          <div className="flex mb-8 border border-white/20 rounded-lg overflow-hidden">
            <button
              onClick={() => { setMode('signin'); setError(null); setInfo(null) }}
              className={`flex-1 py-3 text-sm font-semibold transition ${
                mode === 'signin'
                  ? 'bg-crypto-accent text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <LogIn size={16} className="inline mr-2" />Sign In
            </button>
            <button
              onClick={() => { setMode('signup'); setError(null); setInfo(null) }}
              className={`flex-1 py-3 text-sm font-semibold transition ${
                mode === 'signup'
                  ? 'bg-crypto-accent text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <UserPlus size={16} className="inline mr-2" />Sign Up
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/40 rounded-lg text-sm text-red-400">
              {error}
            </div>
          )}
          {info && (
            <div className="mb-4 p-3 bg-green-500/20 border border-green-500/40 rounded-lg text-sm text-green-400">
              {info}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-white/10 border border-white/20 rounded-lg pl-9 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-crypto-accent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/10 border border-white/20 rounded-lg pl-9 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-crypto-accent"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading
                ? 'Please wait…'
                : mode === 'signin' ? 'Sign In' : 'Create Account'}
            </button>
          </form>
        </div>

        <p className="text-center text-gray-500 text-sm mt-6">
          By signing up you agree to our{' '}
          <a href="#" className="text-crypto-accent hover:underline">Terms of Service</a>
          {' '}and{' '}
          <a href="#" className="text-crypto-accent hover:underline">Privacy Policy</a>.
        </p>
      </div>
    </div>
  )
}
