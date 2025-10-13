/**
 * Decryption utilities for FHEVM via Gateway
 */

import type { FhevmInstance, EncryptedType } from '../types'
import { validateContractAddress, validateHandle } from '../utils/validation'
import { DecryptionError, FhevmNotReadyError } from '../utils/errors'
// import { getSigner } from './instance' // For future use

/**
 * Request decryption of an encrypted value via the Gateway
 *
 * @param instance - FHEVM instance
 * @param contractAddress - Address of the contract holding the encrypted value
 * @param handle - Handle/identifier of the encrypted value (ciphertext)
 * @param type - Expected type of the decrypted value
 * @returns Promise resolving to decrypted value
 *
 * @example
 * ```typescript
 * // After submitting encrypted data to contract and getting a handle
 * const decrypted = await requestDecryption(
 *   instance,
 *   '0x1234...', // contract address
 *   '0xabcd...', // ciphertext handle
 *   'uint32'
 * )
 * console.log('Decrypted value:', decrypted)
 * ```
 */
export async function requestDecryption<T = unknown>(
  instance: FhevmInstance,
  contractAddress: string,
  handle: string,
  type?: EncryptedType
): Promise<T> {
  // Validate instance
  if (!instance || !instance.ready) {
    throw new FhevmNotReadyError()
  }

  // Validate inputs
  validateContractAddress(contractAddress)
  validateHandle(handle)

  try {
    // Get signer for signing the decryption request (for future use)
    // const signer = await getSigner(instance)
    // const userAddress = await signer.getAddress()

    // Create decryption request using fhevmjs - currently uses instance's internal methods
    if (!instance.instance.decrypt) {
      throw new DecryptionError('Decryption not supported by this instance')
    }
    const result = await instance.instance.decrypt(contractAddress, handle)

    // Parse result based on type
    return parseDecryptionResult<T>(result, type)
  } catch (error) {
    throw new DecryptionError(`Failed to decrypt value: ${error}`)
  }
}

/**
 * Request decryption with explicit permission signature
 *
 * @param instance - FHEVM instance
 * @param contractAddress - Contract address
 * @param handle - Ciphertext handle
 * @param signature - Permission signature from user
 * @param type - Expected type
 * @returns Decrypted value
 */
export async function requestDecryptionWithSignature<T = unknown>(
  instance: FhevmInstance,
  contractAddress: string,
  handle: string,
  signature: string,
  type?: EncryptedType
): Promise<T> {
  if (!instance || !instance.ready) {
    throw new FhevmNotReadyError()
  }

  validateContractAddress(contractAddress)
  validateHandle(handle)

  try {
    // Use provided signature instead of generating new one
    if (!instance.instance.decrypt) {
      throw new DecryptionError('Decryption not supported by this instance')
    }
    const result = await instance.instance.decrypt(contractAddress, handle, signature)
    return parseDecryptionResult<T>(result, type)
  } catch (error) {
    throw new DecryptionError(`Failed to decrypt with signature: ${error}`)
  }
}

/**
 * Request batch decryption
 *
 * @param instance - FHEVM instance
 * @param requests - Array of decryption requests
 * @returns Array of decrypted values
 *
 * @example
 * ```typescript
 * const results = await requestBatchDecryption(instance, [
 *   { contractAddress: '0x123...', handle: '0xabc...', type: 'uint32' },
 *   { contractAddress: '0x123...', handle: '0xdef...', type: 'bool' }
 * ])
 * ```
 */
export async function requestBatchDecryption(
  instance: FhevmInstance,
  requests: Array<{
    contractAddress: string
    handle: string
    type?: EncryptedType
  }>
): Promise<unknown[]> {
  if (!instance || !instance.ready) {
    throw new FhevmNotReadyError()
  }

  try {
    const results = await Promise.all(
      requests.map(({ contractAddress, handle, type }) =>
        requestDecryption(instance, contractAddress, handle, type)
      )
    )
    return results
  } catch (error) {
    throw new DecryptionError(`Batch decryption failed: ${error}`)
  }
}

/**
 * Parse decryption result based on expected type
 */
function parseDecryptionResult<T>(result: any, type?: EncryptedType): T {
  if (type === undefined) {
    return result as T
  }

  switch (type) {
    case 'ebool':
      return Boolean(result) as T

    case 'euint4':
    case 'euint8':
    case 'euint16':
    case 'euint32':
      return Number(result) as T

    case 'euint64':
    case 'euint128':
    case 'euint256':
      return BigInt(result) as T

    case 'eaddress':
      return String(result) as T

    case 'ebytes64':
    case 'ebytes128':
    case 'ebytes256':
      return String(result) as T

    default:
      return result as T
  }
}

/**
 * Wait for decryption to be fulfilled
 *
 * @param instance - FHEVM instance
 * @param contractAddress - Contract address
 * @param handle - Ciphertext handle
 * @param options - Polling options
 * @returns Decrypted value when ready
 *
 * @example
 * ```typescript
 * // Wait up to 30 seconds, polling every 2 seconds
 * const value = await waitForDecryption(
 *   instance,
 *   contractAddress,
 *   handle,
 *   { timeout: 30000, interval: 2000 }
 * )
 * ```
 */
export async function waitForDecryption<T = unknown>(
  instance: FhevmInstance,
  contractAddress: string,
  handle: string,
  options: {
    timeout?: number
    interval?: number
    type?: EncryptedType
  } = {}
): Promise<T> {
  const { timeout = 60000, interval = 1000, type } = options

  const startTime = Date.now()

  while (Date.now() - startTime < timeout) {
    try {
      const result = await requestDecryption<T>(instance, contractAddress, handle, type)
      return result
    } catch (error) {
      // If it's a "not ready" error, wait and retry
      if (error instanceof DecryptionError && error.message.includes('not ready')) {
        await new Promise((resolve) => setTimeout(resolve, interval))
        continue
      }
      // Other errors should be thrown immediately
      throw error
    }
  }

  throw new DecryptionError(`Decryption timeout after ${timeout}ms`)
}

/**
 * Check if decryption is available for a handle
 *
 * @param instance - FHEVM instance
 * @param contractAddress - Contract address
 * @param handle - Ciphertext handle
 * @returns True if decryption is available
 */
export async function isDecryptionReady(
  instance: FhevmInstance,
  contractAddress: string,
  handle: string
): Promise<boolean> {
  try {
    await requestDecryption(instance, contractAddress, handle)
    return true
  } catch (error) {
    return false
  }
}
