/**
 * Network configuration tests
 */

import { describe, it, expect } from 'vitest'
import { getNetworkConfig, validateNetworkConfig } from '../src/utils/network'
import { NetworkError } from '../src/utils/errors'

describe('Network Utilities', () => {
  describe('getNetworkConfig', () => {
    it('should return sepolia configuration', () => {
      const config = getNetworkConfig('sepolia')
      expect(config.name).toBe('sepolia')
      expect(config.chainId).toBe(11155111)
      expect(config.rpcUrl).toContain('sepolia')
      expect(config.gatewayUrl).toBeTruthy()
    })

    it('should return localhost configuration', () => {
      const config = getNetworkConfig('localhost')
      expect(config.name).toBe('localhost')
      expect(config.chainId).toBe(31337)
      expect(config.rpcUrl).toContain('localhost')
    })

    it('should throw for unknown network', () => {
      expect(() => getNetworkConfig('unknown' as any)).toThrow(NetworkError)
    })
  })

  describe('validateNetworkConfig', () => {
    it('should accept valid configuration', () => {
      const config = {
        name: 'sepolia' as const,
        chainId: 11155111,
        rpcUrl: 'https://sepolia.infura.io/v3/test',
        gatewayUrl: 'https://gateway.test.com',
      }
      expect(() => validateNetworkConfig(config)).not.toThrow()
    })

    it('should reject invalid chain ID', () => {
      const config = {
        name: 'sepolia' as const,
        chainId: -1,
        rpcUrl: 'https://sepolia.infura.io/v3/test',
        gatewayUrl: 'https://gateway.test.com',
      }
      expect(() => validateNetworkConfig(config)).toThrow(NetworkError)
    })

    it('should reject invalid RPC URL', () => {
      const config = {
        name: 'sepolia' as const,
        chainId: 11155111,
        rpcUrl: 'invalid-url',
        gatewayUrl: 'https://gateway.test.com',
      }
      expect(() => validateNetworkConfig(config)).toThrow(NetworkError)
    })

    it('should reject invalid gateway URL', () => {
      const config = {
        name: 'sepolia' as const,
        chainId: 11155111,
        rpcUrl: 'https://sepolia.infura.io/v3/test',
        gatewayUrl: 'invalid-url',
      }
      expect(() => validateNetworkConfig(config)).toThrow(NetworkError)
    })
  })
})
