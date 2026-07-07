/** Authorized admin wallet address (lowercase). Set VITE_ADMIN_ADDRESS in .env.local.
 *  When unset, any connected wallet is granted admin access (development mode).
 */
export const ADMIN_ADDRESS = (import.meta.env.VITE_ADMIN_ADDRESS as string | undefined)?.toLowerCase()
