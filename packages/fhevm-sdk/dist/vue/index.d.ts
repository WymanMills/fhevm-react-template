import { b as FhevmConfig, c as FhevmInstance, I as InputType, d as EncryptedValue, E as EncryptedType, N as NetworkName, a as NetworkConfig } from '../index-DgoIT4PI.js';
export { D as DecryptionRequest, e as DecryptionResult, h as FhevmProviderProps, F as FhevmjsInstance, P as PermissionConfig, g as UseDecryptResult, f as UseEncryptResult, U as UseFhevmState } from '../index-DgoIT4PI.js';
import { Provider, Signer } from 'ethers';

/**
 * FHEVM instance creation and management
 */

/**
 * Create a new FHEVM instance
 *
 * @param config - Configuration for the FHEVM instance
 * @returns Promise resolving to an FhevmInstance
 *
 * @example
 * ```typescript
 * // Simple usage with network name
 * const instance = await createFhevmInstance({ network: 'sepolia' })
 *
 * // With custom provider
 * const provider = new BrowserProvider(window.ethereum)
 * const instance = await createFhevmInstance({
 *   network: 'sepolia',
 *   provider
 * })
 *
 * // With full custom config
 * const instance = await createFhevmInstance({
 *   network: {
 *     name: 'custom',
 *     chainId: 31337,
 *     rpcUrl: 'http://localhost:8545',
 *     gatewayUrl: 'http://localhost:3000'
 *   }
 * })
 * ```
 */
declare function createFhevmInstance(config: FhevmConfig): Promise<FhevmInstance>;
/**
 * Get signer from provider
 */
declare function getSigner(instance: FhevmInstance, provider?: Provider): Promise<Signer>;
/**
 * Check if FHEVM instance is ready
 */
declare function isInstanceReady(instance: FhevmInstance | null): instance is FhevmInstance;
/**
 * Get public key from instance
 */
declare function getPublicKey(instance: FhevmInstance): string;
/**
 * Reinitialize FHEVM instance with new configuration
 */
declare function reinitializeInstance(currentInstance: FhevmInstance, newConfig: Partial<FhevmConfig>): Promise<FhevmInstance>;

/**
 * Encryption utilities for FHEVM
 */

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
declare function encryptValue<T extends InputType>(instance: FhevmInstance, value: number | boolean | bigint | string, type: T): Promise<EncryptedValue<T>>;
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
declare function encryptBatch(instance: FhevmInstance, values: Array<{
    value: number | boolean | bigint | string;
    type: InputType;
}>): Promise<EncryptedValue[]>;
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
declare function toContractInput(encrypted: EncryptedValue): Uint8Array;
/**
 * Convert encrypted value to hex string
 *
 * @param encrypted - Encrypted value
 * @returns Hex string representation
 */
declare function toHex(encrypted: EncryptedValue): string;
/**
 * Get size of encrypted value in bytes
 *
 * @param encrypted - Encrypted value
 * @returns Size in bytes
 */
declare function getEncryptedSize(encrypted: EncryptedValue): number;
/**
 * Check if two encrypted values are equal (same ciphertext)
 *
 * @param a - First encrypted value
 * @param b - Second encrypted value
 * @returns True if equal
 */
declare function areEncryptedValuesEqual(a: EncryptedValue, b: EncryptedValue): boolean;

/**
 * Decryption utilities for FHEVM via Gateway
 */

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
declare function requestDecryption<T = unknown>(instance: FhevmInstance, contractAddress: string, handle: string, type?: EncryptedType): Promise<T>;
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
declare function requestDecryptionWithSignature<T = unknown>(instance: FhevmInstance, contractAddress: string, handle: string, signature: string, type?: EncryptedType): Promise<T>;
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
declare function requestBatchDecryption(instance: FhevmInstance, requests: Array<{
    contractAddress: string;
    handle: string;
    type?: EncryptedType;
}>): Promise<unknown[]>;
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
declare function waitForDecryption<T = unknown>(instance: FhevmInstance, contractAddress: string, handle: string, options?: {
    timeout?: number;
    interval?: number;
    type?: EncryptedType;
}): Promise<T>;
/**
 * Check if decryption is available for a handle
 *
 * @param instance - FHEVM instance
 * @param contractAddress - Contract address
 * @param handle - Ciphertext handle
 * @returns True if decryption is available
 */
declare function isDecryptionReady(instance: FhevmInstance, contractAddress: string, handle: string): Promise<boolean>;

/**
 * Permission management utilities for FHEVM
 */

/**
 * Generate permission signature for decryption
 *
 * @param instance - FHEVM instance
 * @param contractAddress - Address of the contract
 * @param userAddress - Address of the user requesting permission (optional, defaults to signer)
 * @returns Permission signature
 *
 * @example
 * ```typescript
 * const signature = await generatePermission(instance, contractAddress)
 * // Use signature for decryption requests
 * ```
 */
declare function generatePermission(instance: FhevmInstance, contractAddress: string, userAddress?: string): Promise<string>;
/**
 * Request permission from contract (ACL-based)
 *
 * @param instance - FHEVM instance
 * @param contractAddress - Contract address
 * @param handle - Ciphertext handle
 * @returns Transaction receipt
 *
 * @example
 * ```typescript
 * // Request permission to decrypt a specific ciphertext
 * await requestPermission(instance, contractAddress, handle)
 * ```
 */
declare function requestPermission(instance: FhevmInstance, contractAddress: string, handle: string): Promise<void>;
/**
 * Check if user has permission to decrypt a value
 *
 * @param instance - FHEVM instance
 * @param contractAddress - Contract address
 * @param handle - Ciphertext handle
 * @param userAddress - User address (optional, defaults to signer)
 * @returns True if user has permission
 *
 * @example
 * ```typescript
 * const hasPermission = await checkPermission(instance, contractAddress, handle)
 * if (hasPermission) {
 *   const decrypted = await requestDecryption(instance, contractAddress, handle)
 * }
 * ```
 */
declare function checkPermission(instance: FhevmInstance, contractAddress: string, handle: string, userAddress?: string): Promise<boolean>;
/**
 * Grant permission to another address
 *
 * @param instance - FHEVM instance
 * @param contractAddress - Contract address
 * @param targetAddress - Address to grant permission to
 * @param handle - Ciphertext handle
 * @returns Transaction receipt
 *
 * @example
 * ```typescript
 * // Grant permission to another user
 * await grantPermission(
 *   instance,
 *   contractAddress,
 *   '0x1234...', // target user
 *   handle
 * )
 * ```
 */
declare function grantPermission(instance: FhevmInstance, contractAddress: string, targetAddress: string, handle: string): Promise<void>;
/**
 * Revoke permission from an address
 *
 * @param instance - FHEVM instance
 * @param contractAddress - Contract address
 * @param targetAddress - Address to revoke permission from
 * @param handle - Ciphertext handle
 * @returns Transaction receipt
 */
declare function revokePermission(instance: FhevmInstance, contractAddress: string, targetAddress: string, handle: string): Promise<void>;
/**
 * Get all addresses with permission for a handle
 *
 * @param instance - FHEVM instance
 * @param contractAddress - Contract address
 * @param handle - Ciphertext handle
 * @returns Array of addresses with permission
 */
declare function getPermittedAddresses(instance: FhevmInstance, contractAddress: string, handle: string): Promise<string[]>;

/**
 * Input validation utilities for FHEVM SDK
 */

/**
 * Mapping from input types to encrypted types
 */
declare const INPUT_TO_ENCRYPTED_TYPE: Record<InputType, EncryptedType>;
/**
 * Validate input value for encryption
 */
declare function validateEncryptionInput(value: number | boolean | bigint | string, type: InputType): void;
/**
 * Convert value to BigInt safely
 */
declare function toBigInt(value: number | bigint | string): bigint;
/**
 * Validate Ethereum address format
 */
declare function isValidAddress(address: string): boolean;
/**
 * Validate hex string format
 */
declare function isValidHex(hex: string): boolean;
/**
 * Get encrypted type for input type
 */
declare function getEncryptedType(inputType: InputType): EncryptedType;
/**
 * Validate contract address
 */
declare function validateContractAddress(address: string): void;
/**
 * Validate handle (ciphertext identifier)
 */
declare function validateHandle(handle: string): void;
/**
 * Normalize value for encryption
 */
declare function normalizeValue(value: number | boolean | bigint | string, type: InputType): number | boolean | bigint | string;

/**
 * Network configuration utilities for FHEVM SDK
 */

/**
 * Predefined network configurations
 */
declare const NETWORK_CONFIGS: Record<NetworkName, NetworkConfig>;
/**
 * Get network configuration by name
 */
declare function getNetworkConfig(network: NetworkName): NetworkConfig;
/**
 * Validate network configuration
 */
declare function validateNetworkConfig(config: NetworkConfig): void;
/**
 * Merge custom config with default network config
 */
declare function mergeNetworkConfig(network: NetworkName, customConfig: Partial<NetworkConfig>): NetworkConfig;
/**
 * Get chain ID from network name
 */
declare function getChainId(network: NetworkName): number;
/**
 * Get gateway URL from network name
 */
declare function getGatewayUrl(network: NetworkName): string;
/**
 * Check if network is supported
 */
declare function isSupportedNetwork(network: string): network is NetworkName;

/**
 * Custom error classes for FHEVM SDK
 */
declare class FhevmError extends Error {
    constructor(message: string);
}
declare class FhevmNotReadyError extends FhevmError {
    constructor();
}
declare class EncryptionError extends FhevmError {
    constructor(message: string);
}
declare class DecryptionError extends FhevmError {
    constructor(message: string);
}
declare class NetworkError extends FhevmError {
    constructor(message: string);
}
declare class ValidationError extends FhevmError {
    constructor(message: string);
}
declare class PermissionError extends FhevmError {
    constructor(message: string);
}

export { DecryptionError, EncryptedType, EncryptedValue, EncryptionError, FhevmConfig, FhevmError, FhevmInstance, FhevmNotReadyError, INPUT_TO_ENCRYPTED_TYPE, InputType, NETWORK_CONFIGS, NetworkConfig, NetworkError, NetworkName, PermissionError, ValidationError, areEncryptedValuesEqual, checkPermission, createFhevmInstance, encryptBatch, encryptValue, generatePermission, getChainId, getEncryptedSize, getEncryptedType, getGatewayUrl, getNetworkConfig, getPermittedAddresses, getPublicKey, getSigner, grantPermission, isDecryptionReady, isInstanceReady, isSupportedNetwork, isValidAddress, isValidHex, mergeNetworkConfig, normalizeValue, reinitializeInstance, requestBatchDecryption, requestDecryption, requestDecryptionWithSignature, requestPermission, revokePermission, toBigInt, toContractInput, toHex, validateContractAddress, validateEncryptionInput, validateHandle, validateNetworkConfig, waitForDecryption };
