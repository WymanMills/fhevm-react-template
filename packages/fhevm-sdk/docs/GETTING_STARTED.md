# Getting Started with FHEVM SDK

This guide will help you get started with the Universal FHEVM SDK in less than 5 minutes.

## Prerequisites

- Node.js >= 18.0.0
- npm, yarn, or pnpm
- Basic knowledge of React or your chosen framework
- MetaMask or compatible Web3 wallet (for contract interactions)

## Installation

```bash
npm install fhevm-sdk
# or
yarn add fhevm-sdk
# or
pnpm add fhevm-sdk
```

## Quick Start (React/Next.js)

### Step 1: Wrap Your App with Provider

```typescript
import { FhevmProvider } from 'fhevm-sdk'

function App() {
  return (
    <FhevmProvider network="sepolia">
      <YourApp />
    </FhevmProvider>
  )
}
```

### Step 2: Use Hooks in Components

```typescript
import { useFhevm, useEncrypt } from 'fhevm-sdk'

function MyComponent() {
  const { instance, ready } = useFhevm()
  const { encrypt, encrypting } = useEncrypt()

  const handleEncrypt = async () => {
    const encrypted = await encrypt(42, 'uint32')
    console.log('Encrypted:', encrypted)
  }

  if (!ready) return <div>Loading FHEVM...</div>

  return <button onClick={handleEncrypt}>Encrypt</button>
}
```

That's it! You're ready to start encrypting data.

## Quick Start (Vue.js)

```typescript
import { createFhevmInstance, encryptValue } from 'fhevm-sdk'
import { ref, onMounted } from 'vue'

const instance = ref(null)

onMounted(async () => {
  instance.value = await createFhevmInstance({
    network: 'sepolia'
  })
})

async function encrypt(value: number) {
  const encrypted = await encryptValue(instance.value, value, 'uint32')
  console.log('Encrypted:', encrypted)
}
```

## Quick Start (Node.js)

```javascript
const { createFhevmInstance, encryptValue } = require('fhevm-sdk')

async function main() {
  const instance = await createFhevmInstance({
    network: 'sepolia'
  })

  const encrypted = await encryptValue(instance, 100, 'uint64')
  console.log('Encrypted:', encrypted)
}

main()
```

## Understanding the Basics

### What is FHEVM?

FHEVM (Fully Homomorphic Encryption Virtual Machine) allows computations to be performed on encrypted data without decrypting it first. This enables true privacy-preserving applications on the blockchain.

### Core Concepts

1. **Encryption**: Convert plaintext to ciphertext client-side
2. **Smart Contract**: Process encrypted data without seeing plaintext
3. **Decryption**: Retrieve results via Gateway with proper permissions

### Supported Types

**Input Types** (for encryption):
- `bool` - Boolean values
- `uint8`, `uint16`, `uint32`, `uint64`, `uint128`, `uint256` - Unsigned integers
- `address` - Ethereum addresses
- `bytes` - Byte arrays

**Encrypted Types** (for decryption):
- `ebool`
- `euint8`, `euint16`, `euint32`, `euint64`, `euint128`, `euint256`
- `eaddress`
- `ebytes64`, `ebytes128`, `ebytes256`

## Network Configuration

### Using Predefined Networks

```typescript
// Sepolia Testnet (default)
<FhevmProvider network="sepolia">

// Mainnet
<FhevmProvider network="mainnet">

// Local development
<FhevmProvider network="localhost">
```

### Custom Network

```typescript
<FhevmProvider config={{
  network: {
    name: 'custom',
    chainId: 31337,
    rpcUrl: 'http://localhost:8545',
    gatewayUrl: 'http://localhost:3000'
  }
}}>
```

## Common Patterns

### Pattern 1: Basic Encryption

```typescript
import { useEncrypt } from 'fhevm-sdk'

function EncryptDemo() {
  const { encrypt } = useEncrypt()

  const handleSubmit = async (value: number) => {
    const encrypted = await encrypt(value, 'uint32')
    // encrypted.data is Uint8Array ready for contract
  }
}
```

### Pattern 2: With Smart Contract

```typescript
import { useEncrypt } from 'fhevm-sdk'
import { Contract, BrowserProvider } from 'ethers'

function ContractDemo() {
  const { encrypt } = useEncrypt()

  const submitToContract = async (value: number) => {
    // 1. Encrypt
    const encrypted = await encrypt(value, 'uint32')

    // 2. Get contract
    const provider = new BrowserProvider(window.ethereum)
    const signer = await provider.getSigner()
    const contract = new Contract(address, abi, signer)

    // 3. Submit
    const tx = await contract.submitValue(encrypted.data)
    await tx.wait()
  }
}
```

### Pattern 3: Loading States

```typescript
import { useFhevm, useEncrypt } from 'fhevm-sdk'

function LoadingDemo() {
  const { ready, loading, error } = useFhevm()
  const { encrypt, encrypting } = useEncrypt()

  if (loading) return <div>Initializing...</div>
  if (error) return <div>Error: {error.message}</div>
  if (!ready) return <div>Not ready</div>

  return (
    <button onClick={() => encrypt(42, 'uint32')} disabled={encrypting}>
      {encrypting ? 'Encrypting...' : 'Encrypt'}
    </button>
  )
}
```

## Error Handling

```typescript
import { EncryptionError, FhevmNotReadyError } from 'fhevm-sdk'

try {
  const encrypted = await encrypt(value, 'uint32')
} catch (error) {
  if (error instanceof FhevmNotReadyError) {
    console.log('Instance not ready')
  } else if (error instanceof EncryptionError) {
    console.log('Encryption failed:', error.message)
  } else {
    console.log('Unknown error:', error)
  }
}
```

## Next Steps

- [Encryption Guide](./ENCRYPTION.md) - Learn about encryption in detail
- [Decryption Guide](./DECRYPTION.md) - Learn about decryption
- [API Reference](./API_REFERENCE.md) - Complete API documentation
- [Examples](../../examples/README.md) - Working code examples

## Troubleshooting

### Instance Not Ready

If you see "FHEVM instance not ready" errors:

1. Check that you wrapped your app with `<FhevmProvider>`
2. Wait for the `ready` state before calling encrypt/decrypt
3. Check network connectivity

### Module Resolution Errors

If you encounter module resolution errors:

```bash
# Clear cache
rm -rf node_modules
npm install
```

### TypeScript Errors

Make sure your `tsconfig.json` includes:

```json
{
  "compilerOptions": {
    "moduleResolution": "bundler",
    "esModuleInterop": true
  }
}
```

## Getting Help

- [GitHub Issues](https://github.com/your-username/fhevm-sdk/issues)
- [GitHub Discussions](https://github.com/your-username/fhevm-sdk/discussions)
- [Zama Documentation](https://docs.zama.ai/fhevm)
