import { supabase } from './supabase'
import axios from 'axios'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Holding {
  id?: string
  user_id?: string
  coin_id: string      // CoinGecko id, e.g. 'bitcoin'
  symbol: string       // e.g. 'BTC'
  name: string
  quantity: number
}

export interface Enrollment {
  id?: string
  user_id?: string
  course_id: number
  enrolled_at?: string
  completed_at?: string | null
}

export interface Transaction {
  id?: string
  user_id: string
  course_id: number | null
  amount: number
  status: 'completed' | 'pending' | 'failed'
  created_at?: string
}

export interface CoinPrice {
  id: string
  name: string
  symbol: string
  current_price: number
  price_change_percentage_24h: number
  market_cap: number
}

// ─── Holdings ─────────────────────────────────────────────────────────────────

export async function fetchHoldings(userId: string): Promise<Holding[]> {
  const { data, error } = await supabase
    .from('holdings')
    .select('*')
    .eq('user_id', userId)
  if (error) throw error
  return (data ?? []) as Holding[]
}

export async function upsertHolding(holding: Holding): Promise<void> {
  const { error } = await supabase
    .from('holdings')
    .upsert(holding, { onConflict: 'user_id,coin_id' })
  if (error) throw error
}

export async function deleteHolding(userId: string, coinId: string): Promise<void> {
  const { error } = await supabase
    .from('holdings')
    .delete()
    .eq('user_id', userId)
    .eq('coin_id', coinId)
  if (error) throw error
}

// ─── Enrollments ──────────────────────────────────────────────────────────────

export async function fetchEnrollments(userId: string): Promise<Enrollment[]> {
  const { data, error } = await supabase
    .from('enrollments')
    .select('*')
    .eq('user_id', userId)
  if (error) throw error
  return (data ?? []) as Enrollment[]
}

export async function enroll(userId: string, courseId: number): Promise<void> {
  const { error } = await supabase
    .from('enrollments')
    .upsert({ user_id: userId, course_id: courseId }, { onConflict: 'user_id,course_id' })
  if (error) throw error
}

// ─── Transactions (admin) ─────────────────────────────────────────────────────

export async function fetchTransactions(): Promise<Transaction[]> {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []) as Transaction[]
}

export async function insertTransaction(tx: Omit<Transaction, 'id' | 'created_at'>): Promise<void> {
  const { error } = await supabase.from('transactions').insert(tx)
  if (error) throw error
}

// ─── Profiles ─────────────────────────────────────────────────────────────────

export async function updateSubscriptionTier(
  userId: string,
  tier: 'free' | 'pro' | 'premium',
): Promise<void> {
  const { error } = await supabase
    .from('profiles')
    .update({ subscription_tier: tier })
    .eq('id', userId)
  if (error) throw error
}

// ─── CoinGecko prices ─────────────────────────────────────────────────────────

const COINGECKO_BASE = 'https://api.coingecko.com/api/v3'

export async function fetchCoinPrices(coinIds: string[]): Promise<CoinPrice[]> {
  if (coinIds.length === 0) return []
  const ids = coinIds.join(',')
  const { data } = await axios.get<CoinPrice[]>(
    `${COINGECKO_BASE}/coins/markets`,
    {
      params: {
        vs_currency: 'usd',
        ids,
        order: 'market_cap_desc',
        per_page: coinIds.length,
        page: 1,
        sparkline: false,
      },
    },
  )
  return data
}
