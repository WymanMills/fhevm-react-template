/**
 * Custom error classes for FHEVM SDK
 */

export class FhevmError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'FhevmError'
    Object.setPrototypeOf(this, FhevmError.prototype)
  }
}

export class FhevmNotReadyError extends FhevmError {
  constructor() {
    super('FHEVM instance is not ready. Wait for initialization to complete.')
    this.name = 'FhevmNotReadyError'
    Object.setPrototypeOf(this, FhevmNotReadyError.prototype)
  }
}

export class EncryptionError extends FhevmError {
  constructor(message: string) {
    super(`Encryption failed: ${message}`)
    this.name = 'EncryptionError'
    Object.setPrototypeOf(this, EncryptionError.prototype)
  }
}

export class DecryptionError extends FhevmError {
  constructor(message: string) {
    super(`Decryption failed: ${message}`)
    this.name = 'DecryptionError'
    Object.setPrototypeOf(this, DecryptionError.prototype)
  }
}

export class NetworkError extends FhevmError {
  constructor(message: string) {
    super(`Network error: ${message}`)
    this.name = 'NetworkError'
    Object.setPrototypeOf(this, NetworkError.prototype)
  }
}

export class ValidationError extends FhevmError {
  constructor(message: string) {
    super(`Validation error: ${message}`)
    this.name = 'ValidationError'
    Object.setPrototypeOf(this, ValidationError.prototype)
  }
}

export class PermissionError extends FhevmError {
  constructor(message: string) {
    super(`Permission error: ${message}`)
    this.name = 'PermissionError'
    Object.setPrototypeOf(this, PermissionError.prototype)
  }
}
