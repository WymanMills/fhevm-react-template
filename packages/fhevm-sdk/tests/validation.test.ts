/**
 * Validation utilities tests
 */

import { describe, it, expect } from 'vitest'
import {
  validateEncryptionInput,
  validateContractAddress,
  validateHandle,
  toBigInt,
} from '../src/utils/validation'
import { ValidationError } from '../src/utils/errors'

describe('Validation Utilities', () => {
  describe('validateEncryptionInput', () => {
    it('should validate boolean inputs', () => {
      expect(() => validateEncryptionInput(true, 'bool')).not.toThrow()
      expect(() => validateEncryptionInput(false, 'bool')).not.toThrow()
      expect(() => validateEncryptionInput(1, 'bool')).toThrow(ValidationError)
    })

    it('should validate uint8 inputs', () => {
      expect(() => validateEncryptionInput(0, 'uint8')).not.toThrow()
      expect(() => validateEncryptionInput(255, 'uint8')).not.toThrow()
      expect(() => validateEncryptionInput(256, 'uint8')).toThrow(ValidationError)
      expect(() => validateEncryptionInput(-1, 'uint8')).toThrow(ValidationError)
    })

    it('should validate uint16 inputs', () => {
      expect(() => validateEncryptionInput(0, 'uint16')).not.toThrow()
      expect(() => validateEncryptionInput(65535, 'uint16')).not.toThrow()
      expect(() => validateEncryptionInput(65536, 'uint16')).toThrow(ValidationError)
    })

    it('should validate uint32 inputs', () => {
      expect(() => validateEncryptionInput(0, 'uint32')).not.toThrow()
      expect(() => validateEncryptionInput(4294967295, 'uint32')).not.toThrow()
      expect(() => validateEncryptionInput(4294967296, 'uint32')).toThrow(ValidationError)
    })

    it('should validate address inputs', () => {
      expect(() =>
        validateEncryptionInput('0x1234567890123456789012345678901234567890', 'address')
      ).not.toThrow()
      expect(() => validateEncryptionInput('invalid', 'address')).toThrow(ValidationError)
      expect(() => validateEncryptionInput(123, 'address')).toThrow(ValidationError)
    })

    it('should validate bytes inputs', () => {
      expect(() => validateEncryptionInput('0x1234', 'bytes')).not.toThrow()
      expect(() => validateEncryptionInput('invalid', 'bytes')).toThrow(ValidationError)
      expect(() => validateEncryptionInput(123, 'bytes')).toThrow(ValidationError)
    })

    it('should reject boolean for numeric types', () => {
      expect(() => validateEncryptionInput(true, 'uint8')).toThrow(ValidationError)
      expect(() => validateEncryptionInput(false, 'uint32')).toThrow(ValidationError)
    })
  })

  describe('validateContractAddress', () => {
    it('should accept valid Ethereum addresses', () => {
      expect(() =>
        validateContractAddress('0x1234567890123456789012345678901234567890')
      ).not.toThrow()
      expect(() =>
        validateContractAddress('0xabcdefABCDEF1234567890123456789012345678')
      ).not.toThrow()
    })

    it('should reject invalid addresses', () => {
      expect(() => validateContractAddress('invalid')).toThrow(ValidationError)
      expect(() => validateContractAddress('0x123')).toThrow(ValidationError)
      expect(() => validateContractAddress('')).toThrow(ValidationError)
    })
  })

  describe('validateHandle', () => {
    it('should accept valid hex handles', () => {
      expect(() => validateHandle('0x1234')).not.toThrow()
      expect(() => validateHandle('0xabcdef')).not.toThrow()
    })

    it('should reject invalid handles', () => {
      expect(() => validateHandle('invalid')).toThrow(ValidationError)
      expect(() => validateHandle('123')).toThrow(ValidationError)
      expect(() => validateHandle('')).toThrow(ValidationError)
    })
  })

  describe('toBigInt', () => {
    it('should convert numbers to BigInt', () => {
      expect(toBigInt(0)).toBe(BigInt(0))
      expect(toBigInt(123)).toBe(BigInt(123))
      expect(toBigInt(999999)).toBe(BigInt(999999))
    })

    it('should convert string numbers to BigInt', () => {
      expect(toBigInt('0')).toBe(BigInt(0))
      expect(toBigInt('123')).toBe(BigInt(123))
      expect(toBigInt('999999999999999999')).toBe(BigInt('999999999999999999'))
    })

    it('should pass through BigInt values', () => {
      expect(toBigInt(BigInt(123))).toBe(BigInt(123))
    })

    it('should reject decimal numbers', () => {
      expect(() => toBigInt(1.5)).toThrow(ValidationError)
      expect(() => toBigInt(3.14)).toThrow(ValidationError)
    })

    it('should reject invalid strings', () => {
      expect(() => toBigInt('invalid')).toThrow(ValidationError)
      expect(() => toBigInt('12.34')).toThrow(ValidationError)
    })
  })
})
