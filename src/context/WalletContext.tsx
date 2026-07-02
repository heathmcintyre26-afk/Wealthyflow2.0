import { createContext, useState, useEffect, useCallback, ReactNode } from 'react'

interface WalletContextType {
  account: string | null
  chainId: number | null
  isConnecting: boolean
  error: string | null
  connect: () => Promise<void>
  disconnect: () => void
}

export const WalletContext = createContext<WalletContextType | null>(null)

export function WalletProvider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<string | null>(null)
  const [chainId, setChainId] = useState<number | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAccountsChanged = useCallback((accounts: string[]) => {
    if (accounts.length === 0) {
      setAccount(null)
      setChainId(null)
    } else {
      setAccount(accounts[0])
    }
  }, [])

  const handleChainChanged = useCallback((chainIdHex: string) => {
    setChainId(parseInt(chainIdHex, 16))
  }, [])

  useEffect(() => {
    const eth = (window as Window & { ethereum?: { request: (args: { method: string }) => Promise<unknown>; on: (event: string, handler: (data: unknown) => void) => void; removeListener: (event: string, handler: (data: unknown) => void) => void } }).ethereum
    if (!eth) return

    // Restore session if already connected
    eth.request({ method: 'eth_accounts' }).then((accounts) => {
      const accs = accounts as string[]
      if (accs.length > 0) {
        setAccount(accs[0])
        eth.request({ method: 'eth_chainId' }).then((id) => {
          setChainId(parseInt(id as string, 16))
        })
      }
    })

    eth.on('accountsChanged', handleAccountsChanged as (data: unknown) => void)
    eth.on('chainChanged', handleChainChanged as (data: unknown) => void)

    return () => {
      eth.removeListener('accountsChanged', handleAccountsChanged as (data: unknown) => void)
      eth.removeListener('chainChanged', handleChainChanged as (data: unknown) => void)
    }
  }, [handleAccountsChanged, handleChainChanged])

  const connect = useCallback(async () => {
    const eth = (window as Window & { ethereum?: { request: (args: { method: string }) => Promise<unknown> } }).ethereum
    if (!eth) {
      setError('No wallet detected. Please install MetaMask.')
      return
    }
    setIsConnecting(true)
    setError(null)
    try {
      const accounts = await eth.request({ method: 'eth_requestAccounts' }) as string[]
      setAccount(accounts[0])
      const id = await eth.request({ method: 'eth_chainId' }) as string
      setChainId(parseInt(id, 16))
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to connect wallet'
      setError(message)
    } finally {
      setIsConnecting(false)
    }
  }, [])

  const disconnect = useCallback(() => {
    setAccount(null)
    setChainId(null)
    setError(null)
  }, [])

  return (
    <WalletContext.Provider value={{ account, chainId, isConnecting, error, connect, disconnect }}>
      {children}
    </WalletContext.Provider>
  )
}

