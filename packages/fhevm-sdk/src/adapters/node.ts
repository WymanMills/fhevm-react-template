/**
 * Node.js Adapter for FHEVM SDK
 * Provides Node.js-specific utilities for FHEVM integration
 */

// Re-export core functionality for Node.js
export { createFhevmInstance } from '../core/instance'
export { FhevmInstance } from '../core/fhevm'
export { encryptValue } from '../core/encryption'
export { requestDecryption } from '../core/decryption'
export { grantPermission, hasPermission } from '../core/permissions'

// Re-export utilities
export * from '../utils/encryption'
export * from '../utils/decryption'
export * from '../utils/validation'
export * from '../utils/network'
export * from '../utils/errors'

// Re-export types
export type * from '../types'

/**
 * Node.js specific helper for creating and using FHEVM instance
 *
 * @example
 * ```typescript
 * import { createNodeFhevmClient } from 'fhevm-sdk/node'
 *
 * const client = await createNodeFhevmClient({
 *   network: 'sepolia',
 *   gatewayUrl: 'https://gateway.sepolia.zama.ai'
 * })
 *
 * const encrypted = await client.encrypt(42, 'uint32')
 * ```
 */
export async function createNodeFhevmClient(config: {
  network: 'sepolia' | 'localhost' | 'mainnet'
  gatewayUrl?: string
  aclAddress?: string
  kmsVerifierAddress?: string
}) {
  const { createFhevmInstance } = await import('../core/instance')
  const { encryptValue } = await import('../core/encryption')
  const { requestDecryption } = await import('../core/decryption')
  const { grantPermission, hasPermission } = await import('../core/permissions')

  const instance = await createFhevmInstance(config)

  return {
    instance,
    encrypt: async (value: number | bigint | boolean, type: string) => {
      return encryptValue(instance, value, type as any)
    },
    decrypt: async (contractAddress: string, handle: bigint | string) => {
      return requestDecryption(instance, contractAddress, handle)
    },
    grantPermission: async (contractAddress: string, userAddress: string) => {
      return grantPermission(instance, contractAddress, userAddress)
    },
    hasPermission: async (contractAddress: string, userAddress: string) => {
      return hasPermission(instance, contractAddress, userAddress)
    },
  }
}
