/**
 * React hook for encryption functionality
 */

import { useState, useCallback } from 'react'
import { useFhevm } from './useFhevm'
import { encryptValue } from '../../core/encryption'
import type { UseEncryptResult, InputType, EncryptedValue } from '../../types'

/**
 * Hook for encrypting values
 *
 * @returns Encryption utilities
 *
 * @example
 * ```typescript
 * function MyComponent() {
 *   const { encrypt, encrypting, error } = useEncrypt()
 *
 *   const handleSubmit = async (value: number) => {
 *     try {
 *       const encrypted = await encrypt(value, 'uint32')
 *       // Use encrypted data with contract
 *       await contract.submitValue(encrypted.data)
 *     } catch (err) {
 *       console.error('Encryption failed:', err)
 *     }
 *   }
 *
 *   return (
 *     <button onClick={() => handleSubmit(42)} disabled={encrypting}>
 *       {encrypting ? 'Encrypting...' : 'Submit'}
 *     </button>
 *   )
 * }
 * ```
 */
export function useEncrypt(): UseEncryptResult {
  const { instance, ready } = useFhevm()
  const [encrypting, setEncrypting] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const encrypt = useCallback(
    async <T extends InputType>(
      value: number | boolean | bigint | string,
      type: T
    ): Promise<EncryptedValue<T>> => {
      if (!instance || !ready) {
        const err = new Error('FHEVM instance not ready')
        setError(err)
        throw err
      }

      setEncrypting(true)
      setError(null)

      try {
        const encrypted = await encryptValue(instance, value, type)
        return encrypted
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err))
        setError(error)
        throw error
      } finally {
        setEncrypting(false)
      }
    },
    [instance, ready]
  )

  return {
    encrypt,
    encrypting,
    error,
  }
}
