/**
 * Vue Adapter for FHEVM SDK
 * Provides Vue-specific composables for FHEVM integration
 */

import { ref, computed, onMounted, type Ref } from 'vue'
import { createFhevmInstance } from '../core/instance'
import { encryptValue } from '../core/encryption'
import { requestDecryption } from '../core/decryption'
import type { FhevmInstance } from '../core/fhevm'
import type { EncryptionType, FhevmConfig } from '../types'

/**
 * Vue composable for FHEVM functionality
 * Provides reactive state and methods for encryption and decryption
 *
 * @param config - FHEVM configuration options
 * @returns Object containing FHEVM instance and methods
 *
 * @example
 * ```vue
 * <script setup>
 * import { useFhevmComposable } from 'fhevm-sdk/vue'
 *
 * const { instance, ready, encrypt, decrypt } = useFhevmComposable({
 *   network: 'sepolia'
 * })
 *
 * const handleEncrypt = async () => {
 *   const encrypted = await encrypt(42, 'uint32')
 * }
 * </script>
 * ```
 */
export function useFhevmComposable(config: FhevmConfig) {
  const instance: Ref<FhevmInstance | null> = ref(null)
  const loading = ref(true)
  const error: Ref<Error | null> = ref(null)

  const ready = computed(() => instance.value !== null && !loading.value)

  onMounted(async () => {
    try {
      instance.value = await createFhevmInstance(config)
      loading.value = false
    } catch (err) {
      error.value = err instanceof Error ? err : new Error('Failed to initialize FHEVM')
      loading.value = false
    }
  })

  /**
   * Encrypt a value using FHEVM
   */
  const encrypt = async (value: number | bigint | boolean, type: EncryptionType) => {
    if (!instance.value) {
      throw new Error('FHEVM instance not initialized')
    }
    return encryptValue(instance.value, value, type)
  }

  /**
   * Request decryption of an encrypted value
   */
  const decrypt = async (contractAddress: string, handle: bigint | string) => {
    if (!instance.value) {
      throw new Error('FHEVM instance not initialized')
    }
    return requestDecryption(instance.value, contractAddress, handle)
  }

  return {
    instance,
    ready,
    loading,
    error,
    encrypt,
    decrypt,
  }
}

/**
 * Vue composable for encryption operations
 */
export function useEncryptComposable() {
  const encrypting = ref(false)
  const error: Ref<Error | null> = ref(null)

  const encrypt = async (
    instance: FhevmInstance,
    value: number | bigint | boolean,
    type: EncryptionType
  ) => {
    encrypting.value = true
    error.value = null
    try {
      const result = await encryptValue(instance, value, type)
      return result
    } catch (err) {
      error.value = err instanceof Error ? err : new Error('Encryption failed')
      throw error.value
    } finally {
      encrypting.value = false
    }
  }

  return {
    encrypt,
    encrypting,
    error,
  }
}

/**
 * Vue composable for decryption operations
 */
export function useDecryptComposable() {
  const requesting = ref(false)
  const error: Ref<Error | null> = ref(null)

  const decrypt = async (
    instance: FhevmInstance,
    contractAddress: string,
    handle: bigint | string
  ) => {
    requesting.value = true
    error.value = null
    try {
      const result = await requestDecryption(instance, contractAddress, handle)
      return result
    } catch (err) {
      error.value = err instanceof Error ? err : new Error('Decryption failed')
      throw error.value
    } finally {
      requesting.value = false
    }
  }

  return {
    decrypt,
    requesting,
    error,
  }
}
