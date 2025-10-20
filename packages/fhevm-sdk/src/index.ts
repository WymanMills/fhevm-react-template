/**
 * FHEVM SDK - Universal Framework-Agnostic SDK
 *
 * @packageDocumentation
 * A universal, framework-agnostic SDK for building confidential frontends with FHEVM.
 *
 * @example
 * ```typescript
 * // React
 * import { FhevmProvider, useFhevm } from 'fhevm-sdk'
 *
 * // Vue
 * import { useFhevmComposable } from 'fhevm-sdk/vue'
 *
 * // Node.js
 * import { createFhevmInstance } from 'fhevm-sdk/node'
 * ```
 */

// Core exports
export * from './core/instance'
export * from './core/encryption'
export * from './core/decryption'
export * from './core/permissions'

// Utility exports
export * from './utils/validation'
export * from './utils/network'
export * from './utils/errors'

// Type exports
export * from './types'

// React exports (conditional)
export * from './react'

// Provider exports
export { FhevmProvider } from './providers/FhevmProvider'

// Version
export const VERSION = '1.0.0'
