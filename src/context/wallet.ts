import { createContext } from 'react'

export interface WalletContextType {
  account: string | null
  chainId: number | null
  isConnecting: boolean
  error: string | null
  connect: () => Promise<void>
  disconnect: () => void
}

export interface EthereumProvider {
  request: (args: { method: string }) => Promise<unknown>
  on: (event: string, handler: (data: unknown) => void) => void
  removeListener: (event: string, handler: (data: unknown) => void) => void
}

export type WindowWithEthereum = Window & { ethereum?: EthereumProvider }

export const WalletContext = createContext<WalletContextType | null>(null)
