/**
 * Error classes tests
 */

import { describe, it, expect } from 'vitest'
import {
  FhevmError,
  FhevmNotReadyError,
  EncryptionError,
  DecryptionError,
  NetworkError,
  ValidationError,
  PermissionError,
} from '../src/utils/errors'

describe('Error Classes', () => {
  describe('FhevmError', () => {
    it('should create error with message', () => {
      const error = new FhevmError('Test error')
      expect(error.message).toBe('Test error')
      expect(error.name).toBe('FhevmError')
      expect(error instanceof Error).toBe(true)
      expect(error instanceof FhevmError).toBe(true)
    })
  })

  describe('FhevmNotReadyError', () => {
    it('should create error with predefined message', () => {
      const error = new FhevmNotReadyError()
      expect(error.message).toContain('not ready')
      expect(error.name).toBe('FhevmNotReadyError')
      expect(error instanceof FhevmError).toBe(true)
    })
  })

  describe('EncryptionError', () => {
    it('should create error with encryption message', () => {
      const error = new EncryptionError('Invalid input')
      expect(error.message).toContain('Encryption failed')
      expect(error.message).toContain('Invalid input')
      expect(error.name).toBe('EncryptionError')
      expect(error instanceof FhevmError).toBe(true)
    })
  })

  describe('DecryptionError', () => {
    it('should create error with decryption message', () => {
      const error = new DecryptionError('Invalid handle')
      expect(error.message).toContain('Decryption failed')
      expect(error.message).toContain('Invalid handle')
      expect(error.name).toBe('DecryptionError')
      expect(error instanceof FhevmError).toBe(true)
    })
  })

  describe('NetworkError', () => {
    it('should create error with network message', () => {
      const error = new NetworkError('Connection timeout')
      expect(error.message).toContain('Network error')
      expect(error.message).toContain('Connection timeout')
      expect(error.name).toBe('NetworkError')
      expect(error instanceof FhevmError).toBe(true)
    })
  })

  describe('ValidationError', () => {
    it('should create error with validation message', () => {
      const error = new ValidationError('Invalid address')
      expect(error.message).toContain('Validation error')
      expect(error.message).toContain('Invalid address')
      expect(error.name).toBe('ValidationError')
      expect(error instanceof FhevmError).toBe(true)
    })
  })

  describe('PermissionError', () => {
    it('should create error with permission message', () => {
      const error = new PermissionError('Access denied')
      expect(error.message).toContain('Permission error')
      expect(error.message).toContain('Access denied')
      expect(error.name).toBe('PermissionError')
      expect(error instanceof FhevmError).toBe(true)
    })
  })
})
