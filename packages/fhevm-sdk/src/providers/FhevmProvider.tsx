/**
 * React Provider for FHEVM instance
 */

import { useState, useEffect, useMemo } from 'react'
import { FhevmContext } from '../react/context/FhevmContext'
import { createFhevmInstance } from '../core/instance'
import type { FhevmInstance, FhevmConfig, FhevmProviderProps } from '../types'

export type { FhevmProviderProps } from '../types'

/**
 * Provider component for FHEVM instance
 *
 * Wrap your application with this provider to enable FHEVM hooks throughout the component tree.
 *
 * @example
 * ```typescript
 * // Simple usage with network name
 * function App() {
 *   return (
 *     <FhevmProvider network="sepolia">
 *       <MyApp />
 *     </FhevmProvider>
 *   )
 * }
 *
 * // With custom configuration
 * function App() {
 *   return (
 *     <FhevmProvider config={{ network: 'sepolia', gatewayUrl: 'https://custom-gateway.com' }}>
 *       <MyApp />
 *     </FhevmProvider>
 *   )
 * }
 * ```
 */
export function FhevmProvider({ children, network = 'sepolia', config }: FhevmProviderProps) {
  const [instance, setInstance] = useState<FhevmInstance | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function initializeFhevm() {
      try {
        setLoading(true)
        setError(null)

        // Use provided config or create from network name
        const fhevmConfig: FhevmConfig = config || { network }

        // Create FHEVM instance
        const fhevmInstance = await createFhevmInstance(fhevmConfig)

        if (!cancelled) {
          setInstance(fhevmInstance)
          setReady(fhevmInstance.ready)
          setLoading(false)
        }
      } catch (err) {
        if (!cancelled) {
          const error = err instanceof Error ? err : new Error(String(err))
          setError(error)
          setLoading(false)
          setReady(false)
          console.error('Failed to initialize FHEVM:', error)
        }
      }
    }

    initializeFhevm()

    return () => {
      cancelled = true
    }
  }, [network, config])

  const contextValue = useMemo(
    () => ({
      instance,
      ready,
      error,
      loading,
    }),
    [instance, ready, error, loading]
  )

  return <FhevmContext.Provider value={contextValue}>{children}</FhevmContext.Provider>
}
