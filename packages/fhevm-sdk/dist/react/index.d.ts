import { U as UseFhevmState, f as UseEncryptResult, g as UseDecryptResult, c as FhevmInstance, h as FhevmProviderProps } from '../index-DgoIT4PI.js';
import * as react from 'react';
import * as react_jsx_runtime from 'react/jsx-runtime';
import 'ethers';

/**
 * React hook for accessing FHEVM instance
 */

/**
 * Hook to access FHEVM instance from context
 *
 * @returns FHEVM instance state
 *
 * @example
 * ```typescript
 * function MyComponent() {
 *   const { instance, ready, error, loading } = useFhevm()
 *
 *   if (loading) return <div>Loading FHEVM...</div>
 *   if (error) return <div>Error: {error.message}</div>
 *   if (!ready) return <div>Initializing...</div>
 *
 *   return <div>FHEVM ready!</div>
 * }
 * ```
 */
declare function useFhevm(): UseFhevmState;

/**
 * React hook for encryption functionality
 */

/**
 * Hook for encrypting values
 *
 * @returns Encryption utilities
 *
 * @example
 * ```typescript
 * function MyComponent() {
 *   const { encrypt, encrypting, error } = useEncrypt()
 *
 *   const handleSubmit = async (value: number) => {
 *     try {
 *       const encrypted = await encrypt(value, 'uint32')
 *       // Use encrypted data with contract
 *       await contract.submitValue(encrypted.data)
 *     } catch (err) {
 *       console.error('Encryption failed:', err)
 *     }
 *   }
 *
 *   return (
 *     <button onClick={() => handleSubmit(42)} disabled={encrypting}>
 *       {encrypting ? 'Encrypting...' : 'Submit'}
 *     </button>
 *   )
 * }
 * ```
 */
declare function useEncrypt(): UseEncryptResult;

/**
 * React hook for decryption functionality
 */

/**
 * Hook for decrypting values
 *
 * @returns Decryption utilities
 *
 * @example
 * ```typescript
 * function MyComponent() {
 *   const { decrypt, requesting, error } = useDecrypt()
 *   const [value, setValue] = useState<number | null>(null)
 *
 *   const handleDecrypt = async () => {
 *     try {
 *       const decrypted = await decrypt<number>(
 *         contractAddress,
 *         ciphertextHandle,
 *         'euint32'
 *       )
 *       setValue(decrypted)
 *     } catch (err) {
 *       console.error('Decryption failed:', err)
 *     }
 *   }
 *
 *   return (
 *     <div>
 *       <button onClick={handleDecrypt} disabled={requesting}>
 *         {requesting ? 'Decrypting...' : 'Decrypt'}
 *       </button>
 *       {value !== null && <p>Decrypted value: {value}</p>}
 *     </div>
 *   )
 * }
 * ```
 */
declare function useDecrypt(): UseDecryptResult;

interface FhevmContextValue {
    instance: FhevmInstance | null;
    ready: boolean;
    error: Error | null;
    loading: boolean;
}
declare const FhevmContext: react.Context<FhevmContextValue | null>;

/**
 * Provider component for FHEVM instance
 *
 * Wrap your application with this provider to enable FHEVM hooks throughout the component tree.
 *
 * @example
 * ```typescript
 * // Simple usage with network name
 * function App() {
 *   return (
 *     <FhevmProvider network="sepolia">
 *       <MyApp />
 *     </FhevmProvider>
 *   )
 * }
 *
 * // With custom configuration
 * function App() {
 *   return (
 *     <FhevmProvider config={{ network: 'sepolia', gatewayUrl: 'https://custom-gateway.com' }}>
 *       <MyApp />
 *     </FhevmProvider>
 *   )
 * }
 * ```
 */
declare function FhevmProvider({ children, network, config }: FhevmProviderProps): react_jsx_runtime.JSX.Element;

export { FhevmContext, type FhevmContextValue, FhevmProvider, FhevmProviderProps, useDecrypt, useEncrypt, useFhevm };
