/**
 * Vue 3 exports for FHEVM SDK
 *
 * This module provides Vue 3 Composition API composables for FHEVM integration.
 */

// Re-export core functions for imperative usage
export * from '../core/instance'
export * from '../core/encryption'
export * from '../core/decryption'
export * from '../core/permissions'

// Re-export types
export * from '../types'

// Re-export utilities
export * from '../utils/errors'
export * from '../utils/network'
export * from '../utils/validation'

// Note: Vue composables will be added in future versions
// For now, Vue users can use the core functions directly
