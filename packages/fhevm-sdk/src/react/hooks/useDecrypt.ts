/**
 * React hook for decryption functionality
 */

import { useState, useCallback } from 'react'
import { useFhevm } from './useFhevm'
import { requestDecryption } from '../../core/decryption'
import type { UseDecryptResult, EncryptedType } from '../../types'

/**
 * Hook for decrypting values
 *
 * @returns Decryption utilities
 *
 * @example
 * ```typescript
 * function MyComponent() {
 *   const { decrypt, requesting, error } = useDecrypt()
 *   const [value, setValue] = useState<number | null>(null)
 *
 *   const handleDecrypt = async () => {
 *     try {
 *       const decrypted = await decrypt<number>(
 *         contractAddress,
 *         ciphertextHandle,
 *         'euint32'
 *       )
 *       setValue(decrypted)
 *     } catch (err) {
 *       console.error('Decryption failed:', err)
 *     }
 *   }
 *
 *   return (
 *     <div>
 *       <button onClick={handleDecrypt} disabled={requesting}>
 *         {requesting ? 'Decrypting...' : 'Decrypt'}
 *       </button>
 *       {value !== null && <p>Decrypted value: {value}</p>}
 *     </div>
 *   )
 * }
 * ```
 */
export function useDecrypt(): UseDecryptResult {
  const { instance, ready } = useFhevm()
  const [requesting, setRequesting] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const decrypt = useCallback(
    async <T = unknown>(
      contractAddress: string,
      handle: string,
      type?: EncryptedType
    ): Promise<T> => {
      if (!instance || !ready) {
        const err = new Error('FHEVM instance not ready')
        setError(err)
        throw err
      }

      setRequesting(true)
      setError(null)

      try {
        const decrypted = await requestDecryption<T>(instance, contractAddress, handle, type)
        return decrypted
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err))
        setError(error)
        throw error
      } finally {
        setRequesting(false)
      }
    },
    [instance, ready]
  )

  return {
    decrypt,
    requesting,
    error,
  }
}
