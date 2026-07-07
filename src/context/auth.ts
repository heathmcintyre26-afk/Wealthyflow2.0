import { createContext } from 'react'
import type { User, Session } from '@supabase/supabase-js'

export type SubscriptionTier = 'free' | 'pro' | 'premium'

export interface AuthContextType {
  user: User | null
  session: Session | null
  tier: SubscriptionTier
  isLoading: boolean
  signUp: (email: string, password: string) => Promise<string | null>
  signIn: (email: string, password: string) => Promise<string | null>
  signOut: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | null>(null)
