/**
 * Input validation utilities for FHEVM SDK
 */

import type { InputType, EncryptedType } from '../types'
import { ValidationError } from './errors'

/**
 * Mapping from input types to encrypted types
 */
export const INPUT_TO_ENCRYPTED_TYPE: Record<InputType, EncryptedType> = {
  bool: 'ebool',
  uint8: 'euint8',
  uint16: 'euint16',
  uint32: 'euint32',
  uint64: 'euint64',
  uint128: 'euint128',
  uint256: 'euint256',
  address: 'eaddress',
  bytes: 'ebytes256',
}

/**
 * Maximum values for unsigned integer types
 */
const MAX_VALUES: Record<string, bigint> = {
  uint8: BigInt(2 ** 8 - 1),
  uint16: BigInt(2 ** 16 - 1),
  uint32: BigInt(2 ** 32 - 1),
  uint64: BigInt(2 ** 64 - 1),
  uint128: BigInt(2 ** 128 - 1),
  uint256: (BigInt(2) ** BigInt(256)) - BigInt(1),
}

/**
 * Validate input value for encryption
 */
export function validateEncryptionInput(
  value: number | boolean | bigint | string,
  type: InputType
): void {
  if (type === 'bool') {
    if (typeof value !== 'boolean') {
      throw new ValidationError(`Expected boolean for type 'bool', got ${typeof value}`)
    }
    return
  }

  if (type === 'address') {
    if (typeof value !== 'string') {
      throw new ValidationError(`Expected string for type 'address', got ${typeof value}`)
    }
    if (!isValidAddress(value)) {
      throw new ValidationError(`Invalid Ethereum address: ${value}`)
    }
    return
  }

  if (type === 'bytes') {
    if (typeof value !== 'string') {
      throw new ValidationError(`Expected string for type 'bytes', got ${typeof value}`)
    }
    if (!isValidHex(value)) {
      throw new ValidationError(`Invalid hex string for bytes: ${value}`)
    }
    return
  }

  // Numeric types - ensure we have a valid numeric value
  if (typeof value === 'boolean') {
    throw new ValidationError(`Expected numeric value for type '${type}', got boolean`)
  }

  const numericValue = toBigInt(value)
  const maxValue = MAX_VALUES[type]

  if (!maxValue) {
    throw new ValidationError(`Unknown numeric type: ${type}`)
  }

  if (numericValue < BigInt(0)) {
    throw new ValidationError(`Value must be non-negative for type '${type}'`)
  }

  if (numericValue > maxValue) {
    throw new ValidationError(
      `Value ${numericValue} exceeds maximum for type '${type}' (max: ${maxValue})`
    )
  }
}

/**
 * Convert value to BigInt safely
 */
export function toBigInt(value: number | bigint | string): bigint {
  try {
    if (typeof value === 'bigint') {
      return value
    }
    if (typeof value === 'number') {
      if (!Number.isInteger(value)) {
        throw new ValidationError('Decimal numbers not supported')
      }
      return BigInt(value)
    }
    if (typeof value === 'string') {
      return BigInt(value)
    }
    throw new ValidationError(`Cannot convert ${typeof value} to BigInt`)
  } catch (error) {
    if (error instanceof ValidationError) {
      throw error
    }
    throw new ValidationError(`Failed to convert value to BigInt: ${error}`)
  }
}

/**
 * Validate Ethereum address format
 */
export function isValidAddress(address: string): boolean {
  return /^0x[0-9a-fA-F]{40}$/.test(address)
}

/**
 * Validate hex string format
 */
export function isValidHex(hex: string): boolean {
  return /^0x[0-9a-fA-F]*$/.test(hex)
}

/**
 * Get encrypted type for input type
 */
export function getEncryptedType(inputType: InputType): EncryptedType {
  const encryptedType = INPUT_TO_ENCRYPTED_TYPE[inputType]
  if (!encryptedType) {
    throw new ValidationError(`Unknown input type: ${inputType}`)
  }
  return encryptedType
}

/**
 * Validate contract address
 */
export function validateContractAddress(address: string): void {
  if (!isValidAddress(address)) {
    throw new ValidationError(`Invalid contract address: ${address}`)
  }
}

/**
 * Validate handle (ciphertext identifier)
 */
export function validateHandle(handle: string): void {
  if (!handle || typeof handle !== 'string') {
    throw new ValidationError('Handle must be a non-empty string')
  }
  // Handle is typically a hex string or similar identifier
  if (!isValidHex(handle) && !/^[0-9a-fA-F]+$/.test(handle)) {
    throw new ValidationError(`Invalid handle format: ${handle}`)
  }
}

/**
 * Normalize value for encryption
 */
export function normalizeValue(
  value: number | boolean | bigint | string,
  type: InputType
): number | boolean | bigint | string {
  if (type === 'bool') {
    return Boolean(value)
  }

  if (type === 'address') {
    const addr = String(value).toLowerCase()
    if (!addr.startsWith('0x')) {
      return '0x' + addr
    }
    return addr
  }

  if (type === 'bytes') {
    const hex = String(value).toLowerCase()
    if (!hex.startsWith('0x')) {
      return '0x' + hex
    }
    return hex
  }

  // Numeric types - return as-is after validation
  return value
}
