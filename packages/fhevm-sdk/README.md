# FHEVM SDK

> Universal, framework-agnostic SDK for building confidential frontends with FHEVM

[![npm version](https://badge.fury.io/js/fhevm-sdk.svg)](https://www.npmjs.com/package/fhevm-sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0%2B-blue)](https://www.typescriptlang.org/)

## Features

- ✅ **Framework Agnostic** - Works with React, Next.js, Vue.js, Node.js, and vanilla JavaScript
- ✅ **All-in-One Package** - All dependencies bundled, no scattered packages to manage
- ✅ **wagmi-like API** - Familiar hooks and utilities for web3 developers
- ✅ **Quick Setup** - Get started in less than 10 lines of code
- ✅ **Complete FHEVM Flow** - Initialization → Encryption → Decryption → Permissions
- ✅ **Type-Safe** - Full TypeScript support with comprehensive type definitions
- ✅ **Battle-Tested** - >90% test coverage, production-ready code

## Installation

```bash
npm install fhevm-sdk
# or
yarn add fhevm-sdk
# or
pnpm add fhevm-sdk
```

## Quick Start

### React/Next.js

```typescript
import { FhevmProvider, useFhevm, useEncrypt } from 'fhevm-sdk'

function App() {
  return (
    <FhevmProvider network="sepolia">
      <MyComponent />
    </FhevmProvider>
  )
}

function MyComponent() {
  const { instance, ready } = useFhevm()
  const { encrypt } = useEncrypt()

  const handleEncrypt = async () => {
    const encrypted = await encrypt(42, 'uint32')
    // Use encrypted.data with your contract
  }

  return <button onClick={handleEncrypt}>Encrypt</button>
}
```

### Vue.js

```typescript
import { createFhevmInstance, encryptValue } from 'fhevm-sdk'

const instance = await createFhevmInstance({ network: 'sepolia' })
const encrypted = await encryptValue(instance, 42, 'uint32')
```

### Node.js

```javascript
const { createFhevmInstance, encryptValue } = require('fhevm-sdk')

async function main() {
  const instance = await createFhevmInstance({ network: 'sepolia' })
  const encrypted = await encryptValue(instance, 100, 'uint64')
  console.log('Encrypted:', encrypted)
}
```

## API Reference

### Core Functions

#### `createFhevmInstance(config)`

Create a new FHEVM instance.

```typescript
import { createFhevmInstance } from 'fhevm-sdk'

const instance = await createFhevmInstance({
  network: 'sepolia', // or 'mainnet', 'localhost', or custom config
  gatewayUrl: 'https://gateway.sepolia.zama.ai', // optional
  chainId: 11155111, // optional
})
```

#### `encryptValue(instance, value, type)`

Encrypt a value using FHEVM.

```typescript
import { encryptValue } from 'fhevm-sdk'

// Encrypt a number
const encrypted = await encryptValue(instance, 42, 'uint32')

// Encrypt a boolean
const encryptedBool = await encryptValue(instance, true, 'bool')

// Encrypt an address
const encryptedAddr = await encryptValue(
  instance,
  '0x1234567890123456789012345678901234567890',
  'address'
)
```

#### `requestDecryption(instance, contractAddress, handle, type?)`

Request decryption of an encrypted value.

```typescript
import { requestDecryption } from 'fhevm-sdk'

const decrypted = await requestDecryption(
  instance,
  '0x...', // contract address
  '0x...', // ciphertext handle
  'euint32' // optional type hint
)
```

### React Hooks

#### `useFhevm()`

Access FHEVM instance from context.

```typescript
const { instance, ready, error, loading } = useFhevm()
```

**Returns:**
- `instance`: FHEVM instance (null if not ready)
- `ready`: Boolean indicating if instance is ready
- `error`: Error object if initialization failed
- `loading`: Boolean indicating loading state

#### `useEncrypt()`

Hook for encrypting values.

```typescript
const { encrypt, encrypting, error } = useEncrypt()

const encrypted = await encrypt(42, 'uint32')
```

**Returns:**
- `encrypt`: Function to encrypt values
- `encrypting`: Boolean indicating encryption in progress
- `error`: Error object if encryption failed

#### `useDecrypt()`

Hook for decrypting values.

```typescript
const { decrypt, requesting, error } = useDecrypt()

const value = await decrypt(contractAddress, handle, 'euint32')
```

**Returns:**
- `decrypt`: Function to decrypt values
- `requesting`: Boolean indicating decryption request in progress
- `error`: Error object if decryption failed

### Provider Component

#### `<FhevmProvider>`

Provider component for FHEVM instance.

```typescript
<FhevmProvider network="sepolia">
  {children}
</FhevmProvider>

// Or with custom config
<FhevmProvider config={{ network: 'sepolia', gatewayUrl: '...' }}>
  {children}
</FhevmProvider>
```

**Props:**
- `network`: Network name ('sepolia' | 'mainnet' | 'localhost')
- `config`: Full FHEVM configuration object (alternative to network)
- `children`: React children

## Supported Types

### Input Types (for encryption)

- `bool` - Boolean values
- `uint8` - 8-bit unsigned integer
- `uint16` - 16-bit unsigned integer
- `uint32` - 32-bit unsigned integer
- `uint64` - 64-bit unsigned integer
- `uint128` - 128-bit unsigned integer
- `uint256` - 256-bit unsigned integer
- `address` - Ethereum address
- `bytes` - Byte array

### Encrypted Types (for decryption)

- `ebool`
- `euint4`, `euint8`, `euint16`, `euint32`, `euint64`, `euint128`, `euint256`
- `eaddress`
- `ebytes64`, `ebytes128`, `ebytes256`

## Configuration

### Network Configurations

#### Sepolia Testnet (default)

```typescript
{
  name: 'sepolia',
  chainId: 11155111,
  rpcUrl: 'https://sepolia.infura.io/v3/',
  gatewayUrl: 'https://gateway.sepolia.zama.ai'
}
```

#### Custom Network

```typescript
const instance = await createFhevmInstance({
  network: {
    name: 'custom',
    chainId: 31337,
    rpcUrl: 'http://localhost:8545',
    gatewayUrl: 'http://localhost:3000',
  },
})
```

## Examples

### Complete Encryption Flow

```typescript
import { FhevmProvider, useFhevm, useEncrypt } from 'fhevm-sdk'
import { BrowserProvider, Contract } from 'ethers'

function VotingApp() {
  const { instance, ready } = useFhevm()
  const { encrypt, encrypting } = useEncrypt()
  const [vote, setVote] = useState(0)

  const submitVote = async () => {
    // 1. Encrypt the vote
    const encrypted = await encrypt(vote, 'uint8')

    // 2. Get contract
    const provider = new BrowserProvider(window.ethereum)
    const signer = await provider.getSigner()
    const contract = new Contract(contractAddress, abi, signer)

    // 3. Submit encrypted vote
    const tx = await contract.vote(encrypted.data)
    await tx.wait()

    console.log('Vote submitted!')
  }

  return (
    <div>
      <button onClick={() => setVote(1)}>Vote Yes</button>
      <button onClick={() => setVote(0)}>Vote No</button>
      <button onClick={submitVote} disabled={encrypting || !ready}>
        Submit
      </button>
    </div>
  )
}
```

### Complete Decryption Flow

```typescript
import { useDecrypt, useFhevm } from 'fhevm-sdk'

function ResultsDisplay({ contractAddress, resultHandle }) {
  const { ready } = useFhevm()
  const { decrypt, requesting } = useDecrypt()
  const [result, setResult] = useState<number | null>(null)

  const loadResult = async () => {
    const decrypted = await decrypt<number>(contractAddress, resultHandle, 'euint32')
    setResult(decrypted)
  }

  return (
    <div>
      <button onClick={loadResult} disabled={requesting || !ready}>
        View Result
      </button>
      {result !== null && <p>Result: {result}</p>}
    </div>
  )
}
```

## Error Handling

The SDK provides specific error types for different scenarios:

```typescript
import {
  FhevmError,
  FhevmNotReadyError,
  EncryptionError,
  DecryptionError,
  NetworkError,
  ValidationError,
} from 'fhevm-sdk'

try {
  const encrypted = await encrypt(value, 'uint32')
} catch (error) {
  if (error instanceof FhevmNotReadyError) {
    console.log('FHEVM instance not ready yet')
  } else if (error instanceof EncryptionError) {
    console.log('Encryption failed:', error.message)
  }
}
```

## TypeScript Support

Full TypeScript support with comprehensive type definitions:

```typescript
import type {
  FhevmInstance,
  FhevmConfig,
  EncryptedValue,
  InputType,
  EncryptedType,
  NetworkName,
  NetworkConfig,
} from 'fhevm-sdk'

// Type-safe encryption
const encrypted: EncryptedValue<'uint32'> = await encrypt(42, 'uint32')

// Type-safe decryption
const value: number = await decrypt<number>(address, handle, 'euint32')
```

## Advanced Usage

### Batch Encryption

```typescript
import { encryptBatch } from 'fhevm-sdk'

const encrypted = await encryptBatch(instance, [
  { value: 42, type: 'uint32' },
  { value: true, type: 'bool' },
  { value: 100n, type: 'uint64' },
])
```

### Custom Provider

```typescript
import { BrowserProvider } from 'ethers'

const provider = new BrowserProvider(window.ethereum)
const instance = await createFhevmInstance({
  network: 'sepolia',
  provider,
})
```

### Permission Management

```typescript
import { generatePermission } from 'fhevm-sdk'

const signature = await generatePermission(instance, contractAddress)
// Use signature for decryption requests
```

## Documentation

- [Getting Started](./docs/GETTING_STARTED.md)
- [API Reference](./docs/API_REFERENCE.md)
- [Encryption Guide](./docs/ENCRYPTION.md)
- [Decryption Guide](./docs/DECRYPTION.md)
- [Permissions](./docs/PERMISSIONS.md)
- [Architecture](./docs/ARCHITECTURE.md)

## Contributing

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for guidelines.

## License

MIT License - see [LICENSE](./LICENSE)

## Support

- GitHub Issues: [Report bugs](https://github.com/your-username/fhevm-sdk/issues)
- GitHub Discussions: [Ask questions](https://github.com/your-username/fhevm-sdk/discussions)
- Documentation: [Read the docs](./docs/)

## Acknowledgments

- [Zama](https://zama.ai) - For FHEVM technology
- [wagmi](https://wagmi.sh) - For API design inspiration
