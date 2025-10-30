# Examples Guide

This document provides an overview of all examples included with the FHEVM SDK.

## Available Examples

### 1. Next.js Demo

**Location:** `examples/nextjs-demo/`

A complete Next.js application demonstrating:
- Server-side rendering compatibility
- App Router (Next.js 13+)
- API routes for FHE operations
- TypeScript integration
- Custom hooks and components

**Key Features:**
- ✅ Encryption demo
- ✅ API routes for validation
- ✅ Custom hooks (`useFHE`, `useEncryption`, `useComputation`)
- ✅ Reusable components

**Run the demo:**
```bash
cd examples/nextjs-demo
npm install
npm run dev
```

### 2. React Demo

**Location:** `examples/react-demo/`

A simple React SPA showcasing:
- Basic SDK integration
- Vite build tool
- Component-based architecture
- State management

**Key Features:**
- ✅ Simple encryption interface
- ✅ Instance status display
- ✅ Minimal boilerplate

**Run the demo:**
```bash
cd examples/react-demo
npm install
npm run dev
```

### 3. Property Valuation System

**Location:** `examples/property-valuation/`

A production-ready confidential property valuation platform featuring:
- Private property registration
- Encrypted valuation submissions
- Multi-valuator consensus
- Secure data revelation
- Permission management

**Key Features:**
- ✅ Complete FHEVM workflow
- ✅ Smart contract integration
- ✅ Real-world use case
- ✅ Decryption via Gateway
- ✅ Permission system

**Run the demo:**
```bash
cd examples/property-valuation
npm install
npm run dev
```

## Code Examples

### Basic Encryption

```typescript
import { FhevmProvider, useEncrypt } from 'fhevm-sdk'

function App() {
  return (
    <FhevmProvider network="sepolia">
      <EncryptDemo />
    </FhevmProvider>
  )
}

function EncryptDemo() {
  const { encrypt, encrypting } = useEncrypt()

  const handleEncrypt = async () => {
    const encrypted = await encrypt(42, 'uint32')
    console.log(encrypted.data)
  }

  return (
    <button onClick={handleEncrypt} disabled={encrypting}>
      Encrypt
    </button>
  )
}
```

### Decryption with Permissions

```typescript
import { useDecrypt } from 'fhevm-sdk'
import { ethers } from 'ethers'

function DecryptDemo() {
  const { decrypt, requesting } = useDecrypt()

  const handleDecrypt = async () => {
    // First, grant permission in the contract
    const contract = new ethers.Contract(address, abi, signer)
    await contract.grantPermission(userAddress, handle)

    // Then decrypt
    const value = await decrypt(contractAddress, handle)
    console.log('Decrypted value:', value)
  }

  return (
    <button onClick={handleDecrypt} disabled={requesting}>
      Decrypt
    </button>
  )
}
```

### Homomorphic Computation

```typescript
import { useEncrypt } from 'fhevm-sdk'
import { ethers } from 'ethers'

function ComputeDemo() {
  const { encrypt } = useEncrypt()

  const performComputation = async () => {
    // Encrypt two values
    const encrypted1 = await encrypt(10, 'uint32')
    const encrypted2 = await encrypt(20, 'uint32')

    // Send to contract for computation
    const contract = new ethers.Contract(address, abi, signer)
    const tx = await contract.add(encrypted1.data, encrypted2.data)
    await tx.wait()

    // Result is encrypted on-chain
    // Can be decrypted later with permissions
  }

  return (
    <button onClick={performComputation}>
      Compute 10 + 20 (encrypted)
    </button>
  )
}
```

### Vue.js Integration

```vue
<template>
  <div>
    <input v-model="value" type="number" />
    <button @click="encrypt" :disabled="encrypting">
      Encrypt
    </button>
    <div v-if="result">Result: {{ result }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { createFhevmInstance, encryptValue } from 'fhevm-sdk'

const value = ref('')
const result = ref(null)
const encrypting = ref(false)
const instance = ref(null)

onMounted(async () => {
  instance.value = await createFhevmInstance({
    network: 'sepolia',
    gatewayUrl: 'https://gateway.sepolia.zama.ai'
  })
})

async function encrypt() {
  encrypting.value = true
  try {
    const encrypted = await encryptValue(
      instance.value,
      parseInt(value.value),
      'uint32'
    )
    result.value = '0x' + Array.from(encrypted.data)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
  } finally {
    encrypting.value = false
  }
}
</script>
```

### Node.js Backend

```javascript
const { createFhevmInstance, encryptValue } = require('fhevm-sdk')
const { ethers } = require('ethers')

async function processData(userData) {
  // Initialize FHEVM
  const instance = await createFhevmInstance({
    network: 'sepolia',
    gatewayUrl: 'https://gateway.sepolia.zama.ai'
  })

  // Encrypt user data
  const encrypted = await encryptValue(instance, userData, 'uint64')

  // Submit to blockchain
  const provider = new ethers.providers.JsonRpcProvider(RPC_URL)
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider)
  const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, wallet)

  const tx = await contract.submitData(encrypted.data)
  await tx.wait()

  return tx.hash
}
```

## Project Structure

Each example follows a similar structure:

```
example-name/
├── src/
│   ├── components/       # React components
│   │   └── fhe/         # FHE-specific components
│   ├── hooks/           # Custom hooks
│   ├── lib/             # Utility libraries
│   └── app/             # Main application (Next.js)
├── package.json
├── tsconfig.json
└── README.md
```

## Best Practices

1. **Always check `ready` state** before using encryption/decryption
2. **Handle errors gracefully** with try-catch blocks
3. **Grant permissions** before requesting decryption
4. **Validate inputs** before encryption
5. **Use TypeScript** for better type safety

## Learning Path

1. Start with **React Demo** for basic concepts
2. Explore **Next.js Demo** for advanced patterns
3. Study **Property Valuation** for production patterns
4. Build your own application!

## Running All Examples

To run all examples at once:

```bash
# From repository root
npm install

# Run Next.js demo
cd examples/nextjs-demo && npm run dev

# Run React demo
cd examples/react-demo && npm run dev

# Run Property Valuation
cd examples/property-valuation && npm run dev
```

## Additional Resources

- [Getting Started Guide](./GETTING_STARTED.md)
- [API Reference](./API.md)
- [FHEVM Documentation](https://docs.zama.ai/fhevm)
