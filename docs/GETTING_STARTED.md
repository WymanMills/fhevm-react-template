# Getting Started with FHEVM SDK

This guide will help you get started with the Universal FHEVM SDK in your project.

## Installation

Install the SDK using your preferred package manager:

```bash
npm install fhevm-sdk
# or
yarn add fhevm-sdk
# or
pnpm add fhevm-sdk
```

## Quick Start (React/Next.js)

### 1. Wrap Your App with FhevmProvider

```tsx
import { FhevmProvider } from 'fhevm-sdk'

function App() {
  return (
    <FhevmProvider network="sepolia">
      <YourApp />
    </FhevmProvider>
  )
}
```

### 2. Use FHEVM Hooks

```tsx
import { useFhevm, useEncrypt, useDecrypt } from 'fhevm-sdk'

function YourComponent() {
  const { instance, ready, loading, error } = useFhevm()
  const { encrypt, encrypting } = useEncrypt()
  const { decrypt, requesting } = useDecrypt()

  const handleEncrypt = async () => {
    const encrypted = await encrypt(42, 'uint32')
    console.log('Encrypted:', encrypted.data)
  }

  if (loading) return <div>Initializing...</div>
  if (error) return <div>Error: {error.message}</div>
  if (!ready) return <div>Not ready</div>

  return (
    <button onClick={handleEncrypt} disabled={encrypting}>
      Encrypt Value
    </button>
  )
}
```

## Quick Start (Vue.js)

```vue
<template>
  <div>
    <button @click="handleEncrypt" :disabled="encrypting">
      Encrypt Value
    </button>
  </div>
</template>

<script setup>
import { createFhevmInstance, encryptValue } from 'fhevm-sdk'
import { ref, onMounted } from 'vue'

const instance = ref(null)
const encrypting = ref(false)

onMounted(async () => {
  instance.value = await createFhevmInstance({
    network: 'sepolia',
    gatewayUrl: 'https://gateway.sepolia.zama.ai'
  })
})

async function handleEncrypt() {
  encrypting.value = true
  try {
    const encrypted = await encryptValue(instance.value, 42, 'uint32')
    console.log('Encrypted:', encrypted.data)
  } finally {
    encrypting.value = false
  }
}
</script>
```

## Quick Start (Node.js)

```javascript
const { createFhevmInstance, encryptValue, requestDecryption } = require('fhevm-sdk')

async function main() {
  // Initialize
  const instance = await createFhevmInstance({
    network: 'sepolia',
    gatewayUrl: 'https://gateway.sepolia.zama.ai'
  })

  // Encrypt
  const encrypted = await encryptValue(instance, 100, 'uint64')
  console.log('Encrypted data:', encrypted.data)

  // Use with smart contract...
}

main()
```

## Core Concepts

### FHEVM Instance

The FHEVM instance manages encryption keys and configuration:

```typescript
const instance = await createFhevmInstance({
  network: 'sepolia',
  gatewayUrl: 'https://gateway.sepolia.zama.ai'
})
```

### Encryption

Encrypt values before sending to smart contracts:

```typescript
const encrypted = await encrypt(value, type)
// type: 'uint8' | 'uint16' | 'uint32' | 'uint64' | 'uint128' | 'uint256'
```

### Decryption

Request decryption through the Gateway:

```typescript
const decrypted = await decrypt(contractAddress, handle)
```

### Permissions

Grant permissions before decryption:

```typescript
await contract.grantPermission(userAddress, dataHandle)
const decrypted = await decrypt(contractAddress, dataHandle)
```

## Network Configuration

### Sepolia Testnet (Default)

```typescript
<FhevmProvider network="sepolia">
  {/* Your app */}
</FhevmProvider>
```

### Local Development

```typescript
<FhevmProvider
  network="local"
  gatewayUrl="http://localhost:8545"
>
  {/* Your app */}
</FhevmProvider>
```

### Custom Configuration

```typescript
const instance = await createFhevmInstance({
  network: 'custom',
  chainId: 12345,
  gatewayUrl: 'https://your-gateway.example.com'
})
```

## Next Steps

- Explore [Examples](../examples/README.md)
- Read [API Documentation](./API.md)
- Check out the [Property Valuation Demo](../examples/property-valuation)

## Troubleshooting

### Instance Not Initializing

Make sure you're using the FhevmProvider at the root of your app and waiting for the `ready` state.

### Encryption Fails

Verify that:
1. The FHEVM instance is ready
2. The value fits within the specified type range
3. Network connection is stable

### Decryption Fails

Check that:
1. Permissions are granted in the smart contract
2. The handle is valid
3. Gateway URL is correctly configured

## Support

- GitHub Issues: [Report a bug](https://github.com/your-repo/issues)
- Documentation: [Full docs](../README.md)
- Community: Join the discussion
