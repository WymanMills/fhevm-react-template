/**
 * FHEVM Core - Main wrapper class for FHEVM operations
 *
 * This file provides a unified class-based interface for all FHEVM operations
 */

import { createFhevmInstance, getSigner, isInstanceReady, getPublicKey } from './instance'
import { encryptValue, encryptBool, encryptAddress } from './encryption'
import { requestDecryption, userDecrypt, publicDecrypt } from './decryption'
import { grantPermission, revokePermission, hasPermission } from './permissions'
import type { FhevmConfig, FhevmInstance, EncryptedValue } from '../types'

/**
 * FHEVM Class - Main interface for all FHEVM operations
 *
 * @example
 * ```typescript
 * const fhevm = new FHEVM({ network: 'sepolia' })
 * await fhevm.init()
 *
 * const encrypted = await fhevm.encrypt(42, 'uint32')
 * const decrypted = await fhevm.decrypt(contractAddress, handle)
 * ```
 */
export class FHEVM {
  private instance: FhevmInstance | null = null
  private config: FhevmConfig

  constructor(config: FhevmConfig) {
    this.config = config
  }

  /**
   * Initialize the FHEVM instance
   */
  async init(): Promise<void> {
    this.instance = await createFhevmInstance(this.config)
  }

  /**
   * Get the current instance
   */
  getInstance(): FhevmInstance | null {
    return this.instance
  }

  /**
   * Check if instance is ready
   */
  isReady(): boolean {
    return isInstanceReady(this.instance)
  }

  /**
   * Get public key
   */
  getPublicKey(): string {
    if (!this.instance) {
      throw new Error('Instance not initialized')
    }
    return getPublicKey(this.instance)
  }

  /**
   * Encrypt a value
   */
  async encrypt(
    value: number | boolean | bigint,
    type: string
  ): Promise<EncryptedValue> {
    if (!this.instance) {
      throw new Error('Instance not initialized')
    }

    if (typeof value === 'boolean') {
      return await encryptBool(this.instance, value)
    }

    return await encryptValue(this.instance, value, type)
  }

  /**
   * Encrypt an address
   */
  async encryptAddress(address: string): Promise<EncryptedValue> {
    if (!this.instance) {
      throw new Error('Instance not initialized')
    }
    return await encryptAddress(this.instance, address)
  }

  /**
   * Request decryption from Gateway
   */
  async decrypt(
    contractAddress: string,
    handle: bigint | string
  ): Promise<bigint> {
    if (!this.instance) {
      throw new Error('Instance not initialized')
    }
    return await requestDecryption(this.instance, contractAddress, handle)
  }

  /**
   * User-initiated decryption
   */
  async userDecrypt(
    handle: bigint | string,
    privateKey: string
  ): Promise<bigint> {
    if (!this.instance) {
      throw new Error('Instance not initialized')
    }
    return await userDecrypt(this.instance, handle, privateKey)
  }

  /**
   * Public decryption (for public values)
   */
  async publicDecrypt(handle: bigint | string): Promise<bigint> {
    if (!this.instance) {
      throw new Error('Instance not initialized')
    }
    return await publicDecrypt(this.instance, handle)
  }

  /**
   * Grant permission to access encrypted data
   */
  async grantPermission(
    contractAddress: string,
    targetAddress: string,
    signer: any
  ): Promise<void> {
    if (!this.instance) {
      throw new Error('Instance not initialized')
    }
    return await grantPermission(this.instance, contractAddress, targetAddress, signer)
  }

  /**
   * Revoke permission
   */
  async revokePermission(
    contractAddress: string,
    targetAddress: string,
    signer: any
  ): Promise<void> {
    if (!this.instance) {
      throw new Error('Instance not initialized')
    }
    return await revokePermission(this.instance, contractAddress, targetAddress, signer)
  }

  /**
   * Check if permission exists
   */
  async hasPermission(
    contractAddress: string,
    targetAddress: string
  ): Promise<boolean> {
    if (!this.instance) {
      throw new Error('Instance not initialized')
    }
    return await hasPermission(this.instance, contractAddress, targetAddress)
  }
}

export default FHEVM
