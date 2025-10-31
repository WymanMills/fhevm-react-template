/**
 * React Adapter for FHEVM SDK
 * Provides React-specific hooks and components for FHEVM integration
 */

// Re-export all React hooks
export { useFhevm } from '../react/hooks/useFhevm'
export { useEncrypt } from '../react/hooks/useEncrypt'
export { useDecrypt } from '../react/hooks/useDecrypt'

// Re-export React context
export { FhevmContext, FhevmProvider } from '../react/context/FhevmContext'

// Re-export types
export type { FhevmContextValue } from '../types'
