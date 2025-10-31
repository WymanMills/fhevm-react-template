<template>
  <div class="container">
    <h1>FHEVM Vue Template</h1>

    <div v-if="loading" class="loading">Loading FHEVM...</div>
    <div v-else-if="error" class="error">Error: {{ error.message }}</div>
    <div v-else>
      <p>Status: {{ ready ? '✅ Ready' : '⏳ Initializing...' }}</p>

      <div class="card">
        <h2>Encrypt a Value</h2>
        <input
          v-model="value"
          type="number"
          placeholder="Enter a number"
          class="input"
        />
        <button
          @click="handleEncrypt"
          :disabled="!ready || encrypting || !value"
          class="button"
        >
          {{ encrypting ? 'Encrypting...' : 'Encrypt' }}
        </button>

        <div v-if="result" class="result">
          <strong>Encrypted:</strong>
          <code>{{ result }}</code>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useFhevmComposable } from 'fhevm-sdk/vue'

const { instance, ready, loading, error, encrypt } = useFhevmComposable({
  network: 'sepolia'
})

const value = ref('')
const result = ref('')
const encrypting = ref(false)

const handleEncrypt = async () => {
  try {
    encrypting.value = true
    const encrypted = await encrypt(parseInt(value.value), 'uint32')
    const hex = '0x' + Array.from(encrypted.data)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
    result.value = hex
  } catch (err) {
    console.error('Encryption failed:', err)
  } finally {
    encrypting.value = false
  }
}
</script>

<style>
@import './style.css';
</style>
