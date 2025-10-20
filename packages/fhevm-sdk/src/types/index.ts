/**
 * Type definitions for FHEVM SDK
 */

import type { Signer, Provider } from 'ethers'

/**
 * FHEVM.js instance type (from fhevmjs library)
 */
export interface FhevmjsInstance {
  createEncryptedInput: (contractAddress: string, userAddress: string) => any
  generateKeypair: () => {
    publicKey: string
    privateKey: string
  }
  createEIP712: (publicKey: string, contractAddress: string, userAddress?: string) => any
  reencrypt: (
    handle: bigint,
    privateKey: string,
    publicKey: string,
    signature: string,
    contractAddress: string,
    userAddress: string
  ) => Promise<bigint>
  getPublicKey: () => string | null
  decrypt?: (contractAddress: string, handle: string, signature?: string) => Promise<any>

  // Encryption methods
  encrypt_bool: (value: boolean) => any
  encrypt_uint8: (value: number) => any
  encrypt_uint16: (value: number) => any
  encrypt_uint32: (value: number) => any
  encrypt_uint64: (value: bigint) => any
  encrypt_uint128: (value: bigint) => any
  encrypt_uint256: (value: bigint) => any
  encrypt_address: (value: string) => any
  encrypt_bytes256: (value: string) => any

  // Permission methods
  generatePermitSignature?: (contractAddress: string, signer: any) => Promise<string>
}

/**
 * Supported encrypted data types in FHEVM
 */
export type EncryptedType =
  | 'ebool'
  | 'euint4'
  | 'euint8'
  | 'euint16'
  | 'euint32'
  | 'euint64'
  | 'euint128'
  | 'euint256'
  | 'eaddress'
  | 'ebytes64'
  | 'ebytes128'
  | 'ebytes256'

/**
 * Supported input data types for encryption
 */
export type InputType =
  | 'bool'
  | 'uint8'
  | 'uint16'
  | 'uint32'
  | 'uint64'
  | 'uint128'
  | 'uint256'
  | 'address'
  | 'bytes'

/**
 * Network configuration
 */
export type NetworkName = 'sepolia' | 'mainnet' | 'localhost' | 'custom'

/**
 * Network configuration details
 */
export interface NetworkConfig {
  name: NetworkName
  chainId: number
  rpcUrl: string
  gatewayUrl: string
  aclAddress?: string
}

/**
 * FHEVM instance configuration
 */
export interface FhevmConfig {
  network: NetworkName | NetworkConfig
  provider?: Provider
  signer?: Signer
  gatewayUrl?: string
  publicKey?: string
  chainId?: number
}

/**
 * FHEVM instance wrapper
 */
export interface FhevmInstance {
  instance: FhevmjsInstance
  config: NetworkConfig
  ready: boolean
  publicKey?: string
}

/**
 * Encrypted value result
 */
export interface EncryptedValue<T extends InputType = InputType> {
  data: Uint8Array
  type: T
  encryptedType: EncryptedType
}

/**
 * Decryption request result
 */
export interface DecryptionRequest {
  requestId: string
  contractAddress: string
  handle: string
  type: EncryptedType
  status: 'pending' | 'fulfilled' | 'rejected'
}

/**
 * Decryption result
 */
export interface DecryptionResult<T = unknown> {
  value: T
  type: EncryptedType
  handle: string
}

/**
 * Permission configuration
 */
export interface PermissionConfig {
  contractAddress: string
  userAddress: string
  signature?: string
}

/**
 * Hook state for useFhevm
 */
export interface UseFhevmState {
  instance: FhevmInstance | null
  ready: boolean
  error: Error | null
  loading: boolean
}

/**
 * Hook result for useEncrypt
 */
export interface UseEncryptResult {
  encrypt: <T extends InputType>(
    value: number | boolean | bigint | string,
    type: T
  ) => Promise<EncryptedValue<T>>
  encrypting: boolean
  error: Error | null
}

/**
 * Hook result for useDecrypt
 */
export interface UseDecryptResult {
  decrypt: <T = unknown>(
    contractAddress: string,
    handle: string,
    type?: EncryptedType
  ) => Promise<T>
  requesting: boolean
  error: Error | null
}

/**
 * Provider props
 */
export interface FhevmProviderProps {
  children: React.ReactNode
  config: FhevmConfig
  network?: NetworkName
}
