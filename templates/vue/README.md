# FHEVM Vue Template

A minimal Vue 3 starter template for building confidential applications with FHEVM SDK.

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Features

- Vue 3 with Composition API
- FHEVM SDK integration
- TypeScript support
- Fast refresh with HMR
- Vue composables for FHEVM operations
- Example encryption/decryption components

## Usage

Use FHEVM composables in your Vue components:

```vue
<template>
  <div>
    <p v-if="ready">✅ FHEVM Ready</p>
    <button @click="handleEncrypt" :disabled="!ready">Encrypt</button>
  </div>
</template>

<script setup>
import { useFhevmComposable } from 'fhevm-sdk/vue'
import { ref } from 'vue'

const { instance, ready, encrypt } = useFhevmComposable({
  network: 'sepolia'
})

const handleEncrypt = async () => {
  const encrypted = await encrypt(42, 'uint32')
  // Use encrypted data with your contract
}
</script>
```

## Documentation

- [FHEVM SDK Documentation](../../packages/fhevm-sdk/README.md)
- [Getting Started Guide](../../docs/GETTING_STARTED.md)
- [API Reference](../../docs/API.md)
- [Examples](../../examples/)

## License

MIT
