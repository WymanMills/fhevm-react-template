/**
 * FHEVM instance creation and management
 */

import { createInstance } from 'fhevmjs'
import { BrowserProvider, JsonRpcProvider, type Signer, type Provider } from 'ethers'
import type {
  FhevmConfig,
  FhevmInstance,
  FhevmjsInstance,
  NetworkConfig,
  NetworkName,
} from '../types'
import { getNetworkConfig, validateNetworkConfig } from '../utils/network'
import { NetworkError, FhevmError } from '../utils/errors'

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
export async function createFhevmInstance(config: FhevmConfig): Promise<FhevmInstance> {
  try {
    // Parse network configuration
    const networkConfig = parseNetworkConfig(config)

    // Provider available for future use if needed
    // const provider = config.provider || (await getDefaultProvider(networkConfig))

    // Create fhevmjs instance
    const fhevmjsInstance = await createInstance({
      networkUrl: networkConfig.rpcUrl,
      gatewayUrl: networkConfig.gatewayUrl,
      aclAddress: networkConfig.aclAddress,
      chainId: networkConfig.chainId,
    })

    // Get public key
    const publicKey = fhevmjsInstance.getPublicKey()

    return {
      instance: fhevmjsInstance as any as FhevmjsInstance,
      config: networkConfig,
      ready: true,
      publicKey: publicKey || undefined,
    } as FhevmInstance
  } catch (error) {
    throw new FhevmError(`Failed to create FHEVM instance: ${error}`)
  }
}

/**
 * Parse network configuration from user input
 */
function parseNetworkConfig(config: FhevmConfig): NetworkConfig {
  if (typeof config.network === 'string') {
    // Network name provided
    const baseConfig = getNetworkConfig(config.network as NetworkName)

    // Merge with custom values
    const merged: NetworkConfig = {
      ...baseConfig,
      ...(config.gatewayUrl && { gatewayUrl: config.gatewayUrl }),
      ...(config.chainId && { chainId: config.chainId }),
    }

    validateNetworkConfig(merged)
    return merged
  }

  // Full network config provided
  const networkConfig = config.network as NetworkConfig
  validateNetworkConfig(networkConfig)
  return networkConfig
}

/**
 * Get default provider for the network
 */
async function getDefaultProvider(config: NetworkConfig): Promise<Provider> {
  // Try to use browser provider first (MetaMask, etc.)
  if (typeof window !== 'undefined' && (window as any).ethereum) {
    try {
      const browserProvider = new BrowserProvider((window as any).ethereum)
      const network = await browserProvider.getNetwork()

      // Verify chain ID matches
      if (Number(network.chainId) !== config.chainId) {
        throw new NetworkError(
          `Connected wallet is on chain ${network.chainId}, expected ${config.chainId}`
        )
      }

      return browserProvider
    } catch (error) {
      console.warn('Browser provider not available or wrong network:', error)
    }
  }

  // Fallback to JSON-RPC provider
  return new JsonRpcProvider(config.rpcUrl, config.chainId)
}

/**
 * Get signer from provider
 */
export async function getSigner(instance: FhevmInstance, provider?: Provider): Promise<Signer> {
  const targetProvider = provider || (await getDefaultProvider(instance.config))

  if ('getSigner' in targetProvider && typeof targetProvider.getSigner === 'function') {
    return await (targetProvider as any).getSigner()
  }

  throw new FhevmError('Provider does not support getting signer')
}


/**
 * Check if FHEVM instance is ready
 */
export function isInstanceReady(instance: FhevmInstance | null): instance is FhevmInstance {
  return instance !== null && instance.ready
}

/**
 * Get public key from instance
 */
export function getPublicKey(instance: FhevmInstance): string {
  if (!instance.publicKey) {
    const key = instance.instance.getPublicKey()
    instance.publicKey = key || undefined
  }

  if (!instance.publicKey) {
    throw new FhevmError('Public key not available')
  }

  return instance.publicKey
}

/**
 * Reinitialize FHEVM instance with new configuration
 */
export async function reinitializeInstance(
  currentInstance: FhevmInstance,
  newConfig: Partial<FhevmConfig>
): Promise<FhevmInstance> {
  const mergedConfig: FhevmConfig = {
    network: currentInstance.config,
    ...newConfig,
  }

  return await createFhevmInstance(mergedConfig)
}
