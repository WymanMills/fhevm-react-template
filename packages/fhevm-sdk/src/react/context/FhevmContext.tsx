/**
 * React Context for FHEVM instance
 */

import { createContext } from 'react'
import type { FhevmInstance } from '../../types'

export interface FhevmContextValue {
  instance: FhevmInstance | null
  ready: boolean
  error: Error | null
  loading: boolean
}

export const FhevmContext = createContext<FhevmContextValue | null>(null)

FhevmContext.displayName = 'FhevmContext'
