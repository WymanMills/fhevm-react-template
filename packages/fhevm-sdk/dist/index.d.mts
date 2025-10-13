export { DecryptionError, EncryptionError, FhevmError, FhevmNotReadyError, INPUT_TO_ENCRYPTED_TYPE, NETWORK_CONFIGS, NetworkError, PermissionError, ValidationError, areEncryptedValuesEqual, checkPermission, createFhevmInstance, encryptBatch, encryptValue, generatePermission, getChainId, getEncryptedSize, getEncryptedType, getGatewayUrl, getNetworkConfig, getPermittedAddresses, getPublicKey, getSigner, grantPermission, isDecryptionReady, isInstanceReady, isSupportedNetwork, isValidAddress, isValidHex, mergeNetworkConfig, normalizeValue, reinitializeInstance, requestBatchDecryption, requestDecryption, requestDecryptionWithSignature, requestPermission, revokePermission, toBigInt, toContractInput, toHex, validateContractAddress, validateEncryptionInput, validateHandle, validateNetworkConfig, waitForDecryption } from './vue/index.mjs';
export { D as DecryptionRequest, e as DecryptionResult, E as EncryptedType, d as EncryptedValue, b as FhevmConfig, c as FhevmInstance, h as FhevmProviderProps, F as FhevmjsInstance, I as InputType, a as NetworkConfig, N as NetworkName, P as PermissionConfig, g as UseDecryptResult, f as UseEncryptResult, U as UseFhevmState } from './index-DgoIT4PI.mjs';
export { FhevmContext, FhevmContextValue, FhevmProvider, useDecrypt, useEncrypt, useFhevm } from './react/index.mjs';
import 'ethers';
import 'react';
import 'react/jsx-runtime';

/**
 * FHEVM SDK - Universal Framework-Agnostic SDK
 *
 * @packageDocumentation
 * A universal, framework-agnostic SDK for building confidential frontends with FHEVM.
 *
 * @example
 * ```typescript
 * // React
 * import { FhevmProvider, useFhevm } from 'fhevm-sdk'
 *
 * // Vue
 * import { useFhevmComposable } from 'fhevm-sdk/vue'
 *
 * // Node.js
 * import { createFhevmInstance } from 'fhevm-sdk/node'
 * ```
 */

declare const VERSION = "1.0.0";

export { VERSION };
