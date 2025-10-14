import { Provider, Signer } from 'ethers';

/**
 * Type definitions for FHEVM SDK
 */

/**
 * FHEVM.js instance type (from fhevmjs library)
 */
interface FhevmjsInstance {
    createEncryptedInput: (contractAddress: string, userAddress: string) => any;
    generateKeypair: () => {
        publicKey: string;
        privateKey: string;
    };
    createEIP712: (publicKey: string, contractAddress: string, userAddress?: string) => any;
    reencrypt: (handle: bigint, privateKey: string, publicKey: string, signature: string, contractAddress: string, userAddress: string) => Promise<bigint>;
    getPublicKey: () => string | null;
    decrypt?: (contractAddress: string, handle: string, signature?: string) => Promise<any>;
    encrypt_bool: (value: boolean) => any;
    encrypt_uint8: (value: number) => any;
    encrypt_uint16: (value: number) => any;
    encrypt_uint32: (value: number) => any;
    encrypt_uint64: (value: bigint) => any;
    encrypt_uint128: (value: bigint) => any;
    encrypt_uint256: (value: bigint) => any;
    encrypt_address: (value: string) => any;
    encrypt_bytes256: (value: string) => any;
    generatePermitSignature?: (contractAddress: string, signer: any) => Promise<string>;
}
/**
 * Supported encrypted data types in FHEVM
 */
type EncryptedType = 'ebool' | 'euint4' | 'euint8' | 'euint16' | 'euint32' | 'euint64' | 'euint128' | 'euint256' | 'eaddress' | 'ebytes64' | 'ebytes128' | 'ebytes256';
/**
 * Supported input data types for encryption
 */
type InputType = 'bool' | 'uint8' | 'uint16' | 'uint32' | 'uint64' | 'uint128' | 'uint256' | 'address' | 'bytes';
/**
 * Network configuration
 */
type NetworkName = 'sepolia' | 'mainnet' | 'localhost' | 'custom';
/**
 * Network configuration details
 */
interface NetworkConfig {
    name: NetworkName;
    chainId: number;
    rpcUrl: string;
    gatewayUrl: string;
    aclAddress?: string;
}
/**
 * FHEVM instance configuration
 */
interface FhevmConfig {
    network: NetworkName | NetworkConfig;
    provider?: Provider;
    signer?: Signer;
    gatewayUrl?: string;
    publicKey?: string;
    chainId?: number;
}
/**
 * FHEVM instance wrapper
 */
interface FhevmInstance {
    instance: FhevmjsInstance;
    config: NetworkConfig;
    ready: boolean;
    publicKey?: string;
}
/**
 * Encrypted value result
 */
interface EncryptedValue<T extends InputType = InputType> {
    data: Uint8Array;
    type: T;
    encryptedType: EncryptedType;
}
/**
 * Decryption request result
 */
interface DecryptionRequest {
    requestId: string;
    contractAddress: string;
    handle: string;
    type: EncryptedType;
    status: 'pending' | 'fulfilled' | 'rejected';
}
/**
 * Decryption result
 */
interface DecryptionResult<T = unknown> {
    value: T;
    type: EncryptedType;
    handle: string;
}
/**
 * Permission configuration
 */
interface PermissionConfig {
    contractAddress: string;
    userAddress: string;
    signature?: string;
}
/**
 * Hook state for useFhevm
 */
interface UseFhevmState {
    instance: FhevmInstance | null;
    ready: boolean;
    error: Error | null;
    loading: boolean;
}
/**
 * Hook result for useEncrypt
 */
interface UseEncryptResult {
    encrypt: <T extends InputType>(value: number | boolean | bigint | string, type: T) => Promise<EncryptedValue<T>>;
    encrypting: boolean;
    error: Error | null;
}
/**
 * Hook result for useDecrypt
 */
interface UseDecryptResult {
    decrypt: <T = unknown>(contractAddress: string, handle: string, type?: EncryptedType) => Promise<T>;
    requesting: boolean;
    error: Error | null;
}
/**
 * Provider props
 */
interface FhevmProviderProps {
    children: React.ReactNode;
    config: FhevmConfig;
    network?: NetworkName;
}

export type { DecryptionRequest as D, EncryptedType as E, FhevmjsInstance as F, InputType as I, NetworkName as N, PermissionConfig as P, UseFhevmState as U, NetworkConfig as a, FhevmConfig as b, FhevmInstance as c, EncryptedValue as d, DecryptionResult as e, UseEncryptResult as f, UseDecryptResult as g, FhevmProviderProps as h };
