import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

interface Props {
  children: ReactNode
  /** Role required. 'admin' checks for 'premium' tier as a proxy until a proper role column exists. */
  requireAdmin?: boolean
}

export default function ProtectedRoute({ children, requireAdmin = false }: Props) {
  const { user, tier, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-crypto-dark flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-crypto-accent" />
      </div>
    )
  }

  if (!user) return <Navigate to="/auth" replace />

  if (requireAdmin && tier !== 'premium') {
    return (
      <div className="min-h-screen bg-crypto-dark flex items-center justify-center px-4 text-center">
        <div className="glass-effect p-12 max-w-md">
          <h2 className="text-2xl font-bold mb-3">Admin Access Required</h2>
          <p className="text-gray-400 mb-6">This page is restricted to Premium account holders.</p>
          <a href="/pricing" className="btn-premium">Upgrade to Premium</a>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
