/**
 * Node.js exports for FHEVM SDK
 *
 * This module provides server-side compatible exports for Node.js environments.
 */

// Core functions - fully compatible with Node.js
export * from '../core/instance'
export * from '../core/encryption'
export * from '../core/decryption'
export * from '../core/permissions'

// Types
export * from '../types'

// Utilities
export * from '../utils/errors'
export * from '../utils/network'
export * from '../utils/validation'

// Note: React hooks are not exported in this entry point
// as they require a browser/React environment
