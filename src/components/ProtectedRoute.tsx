import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

interface Props {
  children: ReactNode
  /** When true, requires the user to have is_admin = true in their profile. */
  requireAdmin?: boolean
}

export default function ProtectedRoute({ children, requireAdmin = false }: Props) {
  const { user, isAdmin, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-crypto-dark flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-crypto-accent" />
      </div>
    )
  }

  if (!user) return <Navigate to="/auth" replace />

  if (requireAdmin && !isAdmin) {
    return (
      <div className="min-h-screen bg-crypto-dark flex items-center justify-center px-4 text-center">
        <div className="glass-effect p-12 max-w-md">
          <h2 className="text-2xl font-bold mb-3">Admin Access Required</h2>
          <p className="text-gray-400 mb-6">This page is restricted to administrators.</p>
          <a href="/" className="btn-secondary">Go Home</a>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
