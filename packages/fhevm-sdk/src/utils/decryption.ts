/**
 * Decryption utility functions
 *
 * Helper functions for decrypting data with FHEVM Gateway
 */

import type { FhevmInstance } from '../types'
import { requestDecryption as coreRequestDecryption, userDecrypt, publicDecrypt } from '../core/decryption'

/**
 * Request decryption from Gateway
 */
export async function decrypt(
  instance: FhevmInstance,
  contractAddress: string,
  handle: bigint | string
): Promise<bigint> {
  return await coreRequestDecryption(instance, contractAddress, handle)
}

/**
 * User-initiated decryption
 */
export async function decryptUser(
  instance: FhevmInstance,
  handle: bigint | string,
  privateKey: string
): Promise<bigint> {
  return await userDecrypt(instance, handle, privateKey)
}

/**
 * Public decryption (for publicly accessible encrypted values)
 */
export async function decryptPublic(
  instance: FhevmInstance,
  handle: bigint | string
): Promise<bigint> {
  return await publicDecrypt(instance, handle)
}

/**
 * Batch decrypt multiple handles
 */
export async function decryptBatch(
  instance: FhevmInstance,
  contractAddress: string,
  handles: Array<bigint | string>
): Promise<bigint[]> {
  const results: bigint[] = []

  for (const handle of handles) {
    const decrypted = await coreRequestDecryption(instance, contractAddress, handle)
    results.push(decrypted)
  }

  return results
}

/**
 * Decrypt and convert to number (for values that fit in number range)
 */
export async function decryptToNumber(
  instance: FhevmInstance,
  contractAddress: string,
  handle: bigint | string
): Promise<number> {
  const result = await coreRequestDecryption(instance, contractAddress, handle)
  return Number(result)
}

/**
 * Decrypt boolean value
 */
export async function decryptToBoolean(
  instance: FhevmInstance,
  contractAddress: string,
  handle: bigint | string
): Promise<boolean> {
  const result = await coreRequestDecryption(instance, contractAddress, handle)
  return result !== 0n
}

/**
 * Decrypt with timeout
 */
export async function decryptWithTimeout(
  instance: FhevmInstance,
  contractAddress: string,
  handle: bigint | string,
  timeoutMs: number = 30000
): Promise<bigint> {
  return Promise.race([
    coreRequestDecryption(instance, contractAddress, handle),
    new Promise<bigint>((_, reject) =>
      setTimeout(() => reject(new Error('Decryption timeout')), timeoutMs)
    ),
  ])
}

export { coreRequestDecryption as requestDecryption, userDecrypt, publicDecrypt }
