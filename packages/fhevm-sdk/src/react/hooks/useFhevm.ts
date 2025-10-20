/**
 * React hook for accessing FHEVM instance
 */

import { useContext } from 'react'
import { FhevmContext } from '../context/FhevmContext'
import type { UseFhevmState } from '../../types'
import { FhevmError } from '../../utils/errors'

/**
 * Hook to access FHEVM instance from context
 *
 * @returns FHEVM instance state
 *
 * @example
 * ```typescript
 * function MyComponent() {
 *   const { instance, ready, error, loading } = useFhevm()
 *
 *   if (loading) return <div>Loading FHEVM...</div>
 *   if (error) return <div>Error: {error.message}</div>
 *   if (!ready) return <div>Initializing...</div>
 *
 *   return <div>FHEVM ready!</div>
 * }
 * ```
 */
export function useFhevm(): UseFhevmState {
  const context = useContext(FhevmContext)

  if (!context) {
    throw new FhevmError(
      'useFhevm must be used within FhevmProvider. ' +
        'Wrap your component tree with <FhevmProvider>.'
    )
  }

  return {
    instance: context.instance,
    ready: context.ready,
    error: context.error,
    loading: context.loading,
  }
}
