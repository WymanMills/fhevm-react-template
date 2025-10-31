/**
 * Encryption utility functions
 *
 * Helper functions for encrypting data with FHEVM
 */

import type { FhevmInstance, EncryptedValue } from '../types'
import { encryptValue as coreEncryptValue, encryptBool, encryptAddress } from '../core/encryption'

/**
 * Encrypt a numeric value
 */
export async function encrypt(
  instance: FhevmInstance,
  value: number | bigint,
  type: string
): Promise<EncryptedValue> {
  return await coreEncryptValue(instance, value, type)
}

/**
 * Encrypt a boolean value
 */
export async function encryptBoolean(
  instance: FhevmInstance,
  value: boolean
): Promise<EncryptedValue> {
  return await encryptBool(instance, value)
}

/**
 * Encrypt an Ethereum address
 */
export async function encryptEthAddress(
  instance: FhevmInstance,
  address: string
): Promise<EncryptedValue> {
  return await encryptAddress(instance, address)
}

/**
 * Batch encrypt multiple values
 */
export async function encryptBatch(
  instance: FhevmInstance,
  values: Array<{ value: number | bigint | boolean; type: string }>
): Promise<EncryptedValue[]> {
  const results: EncryptedValue[] = []

  for (const item of values) {
    if (typeof item.value === 'boolean') {
      results.push(await encryptBool(instance, item.value))
    } else {
      results.push(await coreEncryptValue(instance, item.value, item.type))
    }
  }

  return results
}

/**
 * Convert encrypted value to hex string
 */
export function encryptedToHex(encrypted: EncryptedValue): string {
  return '0x' + Array.from(encrypted.data)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

/**
 * Convert hex string back to Uint8Array
 */
export function hexToEncrypted(hex: string): Uint8Array {
  const cleanHex = hex.startsWith('0x') ? hex.slice(2) : hex
  const bytes = new Uint8Array(cleanHex.length / 2)

  for (let i = 0; i < cleanHex.length; i += 2) {
    bytes[i / 2] = parseInt(cleanHex.substr(i, 2), 16)
  }

  return bytes
}

export { coreEncryptValue as encryptValue, encryptBool, encryptAddress }
