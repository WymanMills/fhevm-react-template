/**
 * Network configuration utilities for FHEVM SDK
 */

import type { NetworkName, NetworkConfig } from '../types'
import { NetworkError } from './errors'

/**
 * Predefined network configurations
 */
export const NETWORK_CONFIGS: Record<NetworkName, NetworkConfig> = {
  sepolia: {
    name: 'sepolia',
    chainId: 11155111,
    rpcUrl: 'https://sepolia.infura.io/v3/',
    gatewayUrl: 'https://gateway.sepolia.zama.ai',
    aclAddress: '0x9d6f6d3D3D3D3D3D3D3D3D3D3D3D3D3D3D3D3D3D',
  },
  mainnet: {
    name: 'mainnet',
    chainId: 1,
    rpcUrl: 'https://mainnet.infura.io/v3/',
    gatewayUrl: 'https://gateway.zama.ai',
    aclAddress: '0x0000000000000000000000000000000000000000',
  },
  localhost: {
    name: 'localhost',
    chainId: 31337,
    rpcUrl: 'http://localhost:8545',
    gatewayUrl: 'http://localhost:3000',
  },
  custom: {
    name: 'custom',
    chainId: 0,
    rpcUrl: '',
    gatewayUrl: '',
  },
}

/**
 * Get network configuration by name
 */
export function getNetworkConfig(network: NetworkName): NetworkConfig {
  const config = NETWORK_CONFIGS[network]
  if (!config) {
    throw new NetworkError(`Unknown network: ${network}`)
  }
  return { ...config }
}

/**
 * Validate network configuration
 */
export function validateNetworkConfig(config: NetworkConfig): void {
  if (!config.chainId || config.chainId <= 0) {
    throw new NetworkError('Invalid chainId')
  }

  if (!config.rpcUrl || !isValidUrl(config.rpcUrl)) {
    throw new NetworkError('Invalid RPC URL')
  }

  if (!config.gatewayUrl || !isValidUrl(config.gatewayUrl)) {
    throw new NetworkError('Invalid gateway URL')
  }
}

/**
 * Merge custom config with default network config
 */
export function mergeNetworkConfig(
  network: NetworkName,
  customConfig: Partial<NetworkConfig>
): NetworkConfig {
  const baseConfig = getNetworkConfig(network)
  const merged = { ...baseConfig, ...customConfig }
  validateNetworkConfig(merged)
  return merged
}

/**
 * Validate URL format
 */
function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * Get chain ID from network name
 */
export function getChainId(network: NetworkName): number {
  return getNetworkConfig(network).chainId
}

/**
 * Get gateway URL from network name
 */
export function getGatewayUrl(network: NetworkName): string {
  return getNetworkConfig(network).gatewayUrl
}

/**
 * Check if network is supported
 */
export function isSupportedNetwork(network: string): network is NetworkName {
  return network in NETWORK_CONFIGS
}
