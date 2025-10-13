/**
 * Encryption utilities for FHEVM
 */

import type { FhevmInstance, InputType, EncryptedValue } from '../types'
import { validateEncryptionInput, normalizeValue, getEncryptedType } from '../utils/validation'
import { EncryptionError, FhevmNotReadyError } from '../utils/errors'

/**
 * Encrypt a value using the FHEVM instance
 *
 * @param instance - FHEVM instance to use for encryption
 * @param value - Value to encrypt
 * @param type - Type of the value
 * @returns Promise resolving to encrypted value
 *
 * @example
 * ```typescript
 * const instance = await createFhevmInstance({ network: 'sepolia' })
 *
 * // Encrypt a number
 * const encrypted = await encryptValue(instance, 42, 'uint32')
 *
 * // Encrypt a boolean
 * const encryptedBool = await encryptValue(instance, true, 'bool')
 *
 * // Encrypt an address
 * const encryptedAddr = await encryptValue(
 *   instance,
 *   '0x1234567890123456789012345678901234567890',
 *   'address'
 * )
 * ```
 */
export async function encryptValue<T extends InputType>(
  instance: FhevmInstance,
  value: number | boolean | bigint | string,
  type: T
): Promise<EncryptedValue<T>> {
  // Validate instance is ready
  if (!instance || !instance.ready) {
    throw new FhevmNotReadyError()
  }

  // Validate input
  validateEncryptionInput(value, type)

  // Normalize value
  const normalized = normalizeValue(value, type)

  try {
    // Encrypt using fhevmjs
    const encrypted = await encryptWithFhevmjs(instance, normalized, type)

    return {
      data: encrypted,
      type,
      encryptedType: getEncryptedType(type),
    }
  } catch (error) {
    throw new EncryptionError(`Failed to encrypt ${type}: ${error}`)
  }
}

/**
 * Encrypt value using fhevmjs instance
 */
async function encryptWithFhevmjs(
  instance: FhevmInstance,
  value: number | boolean | bigint | string,
  type: InputType
): Promise<Uint8Array> {
  const fhevmInstance = instance.instance

  switch (type) {
    case 'bool':
      return fhevmInstance.encrypt_bool(value as boolean)

    case 'uint8':
      return fhevmInstance.encrypt_uint8(Number(value))

    case 'uint16':
      return fhevmInstance.encrypt_uint16(Number(value))

    case 'uint32':
      return fhevmInstance.encrypt_uint32(Number(value))

    case 'uint64':
      return fhevmInstance.encrypt_uint64(BigInt(value))

    case 'uint128':
      return fhevmInstance.encrypt_uint128(BigInt(value))

    case 'uint256':
      return fhevmInstance.encrypt_uint256(BigInt(value))

    case 'address':
      return fhevmInstance.encrypt_address(value as string)

    case 'bytes':
      return fhevmInstance.encrypt_bytes256(value as string)

    default:
      throw new EncryptionError(`Unsupported encryption type: ${type}`)
  }
}

/**
 * Encrypt multiple values at once
 *
 * @param instance - FHEVM instance
 * @param values - Array of values with their types
 * @returns Promise resolving to array of encrypted values
 *
 * @example
 * ```typescript
 * const encrypted = await encryptBatch(instance, [
 *   { value: 42, type: 'uint32' },
 *   { value: true, type: 'bool' },
 *   { value: 100n, type: 'uint64' }
 * ])
 * ```
 */
export async function encryptBatch(
  instance: FhevmInstance,
  values: Array<{ value: number | boolean | bigint | string; type: InputType }>
): Promise<EncryptedValue[]> {
  if (!instance || !instance.ready) {
    throw new FhevmNotReadyError()
  }

  try {
    const encrypted = await Promise.all(
      values.map(({ value, type }) => encryptValue(instance, value, type))
    )
    return encrypted
  } catch (error) {
    throw new EncryptionError(`Batch encryption failed: ${error}`)
  }
}

/**
 * Convert encrypted value to contract input format
 *
 * @param encrypted - Encrypted value
 * @returns Formatted data for contract call
 *
 * @example
 * ```typescript
 * const encrypted = await encryptValue(instance, 42, 'uint32')
 * const input = toContractInput(encrypted)
 * await contract.submitValue(input)
 * ```
 */
export function toContractInput(encrypted: EncryptedValue): Uint8Array {
  return encrypted.data
}

/**
 * Convert encrypted value to hex string
 *
 * @param encrypted - Encrypted value
 * @returns Hex string representation
 */
export function toHex(encrypted: EncryptedValue): string {
  return '0x' + Array.from(encrypted.data).map((b) => b.toString(16).padStart(2, '0')).join('')
}

/**
 * Get size of encrypted value in bytes
 *
 * @param encrypted - Encrypted value
 * @returns Size in bytes
 */
export function getEncryptedSize(encrypted: EncryptedValue): number {
  return encrypted.data.length
}

/**
 * Check if two encrypted values are equal (same ciphertext)
 *
 * @param a - First encrypted value
 * @param b - Second encrypted value
 * @returns True if equal
 */
export function areEncryptedValuesEqual(a: EncryptedValue, b: EncryptedValue): boolean {
  if (a.data.length !== b.data.length) {
    return false
  }

  for (let i = 0; i < a.data.length; i++) {
    if (a.data[i] !== b.data[i]) {
      return false
    }
  }

  return true
}
