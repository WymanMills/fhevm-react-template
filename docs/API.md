# API Reference

Complete API documentation for the Universal FHEVM SDK.

## React Hooks

### `useFhevm()`

Access the FHEVM instance and its state.

```typescript
const { instance, ready, loading, error } = useFhevm()
```

**Returns:**
- `instance: FhevmInstance | null` - The FHEVM instance
- `ready: boolean` - Whether the instance is ready
- `loading: boolean` - Whether initialization is in progress
- `error: Error | null` - Any initialization error

### `useEncrypt()`

Encrypt values for use in smart contracts.

```typescript
const { encrypt, encrypting, error } = useEncrypt()
```

**Returns:**
- `encrypt: (value: number, type: FHEDataType) => Promise<EncryptedData>` - Encryption function
- `encrypting: boolean` - Whether encryption is in progress
- `error: Error | null` - Any encryption error

**Example:**
```typescript
const encrypted = await encrypt(42, 'uint32')
```

### `useDecrypt()`

Request decryption from the Gateway.

```typescript
const { decrypt, requesting, error } = useDecrypt()
```

**Returns:**
- `decrypt: (contractAddress: string, handle: string) => Promise<number>` - Decryption function
- `requesting: boolean` - Whether decryption is in progress
- `error: Error | null` - Any decryption error

**Example:**
```typescript
const value = await decrypt('0x123...', '0xabc...')
```

## Provider

### `<FhevmProvider>`

Provider component to initialize and manage FHEVM instance.

```typescript
<FhevmProvider
  network="sepolia"
  gatewayUrl="https://gateway.sepolia.zama.ai"
>
  {children}
</FhevmProvider>
```

**Props:**
- `network: 'sepolia' | 'local' | 'custom'` - Network to use
- `gatewayUrl?: string` - Optional custom gateway URL
- `chainId?: number` - Custom chain ID (for custom networks)
- `children: ReactNode` - Child components

## Core Functions

### `createFhevmInstance()`

Create an FHEVM instance (for non-React usage).

```typescript
const instance = await createFhevmInstance(config)
```

**Parameters:**
- `config: FHEConfig` - Configuration object

**Returns:** `Promise<FhevmInstance>`

**Example:**
```typescript
const instance = await createFhevmInstance({
  network: 'sepolia',
  gatewayUrl: 'https://gateway.sepolia.zama.ai'
})
```

### `encryptValue()`

Encrypt a value using an FHEVM instance.

```typescript
const encrypted = await encryptValue(instance, value, type)
```

**Parameters:**
- `instance: FhevmInstance` - FHEVM instance
- `value: number` - Value to encrypt
- `type: FHEDataType` - Data type

**Returns:** `Promise<EncryptedData>`

**Example:**
```typescript
const encrypted = await encryptValue(instance, 100, 'uint64')
```

### `requestDecryption()`

Request decryption from the Gateway.

```typescript
const value = await requestDecryption(instance, contractAddress, handle)
```

**Parameters:**
- `instance: FhevmInstance` - FHEVM instance
- `contractAddress: string` - Smart contract address
- `handle: string` - Ciphertext handle

**Returns:** `Promise<number>`

## Types

### `FHEDataType`

```typescript
type FHEDataType = 'uint8' | 'uint16' | 'uint32' | 'uint64' | 'uint128' | 'uint256'
```

### `EncryptedData`

```typescript
interface EncryptedData {
  data: Uint8Array
  type: FHEDataType
}
```

### `FHEConfig`

```typescript
interface FHEConfig {
  network: 'sepolia' | 'local' | 'custom'
  gatewayUrl?: string
  chainId?: number
}
```

### `FhevmInstance`

```typescript
interface FhevmInstance {
  config: FHEConfig
  encrypt: (value: number, type: FHEDataType) => Promise<EncryptedData>
  decrypt: (contractAddress: string, handle: string) => Promise<number>
}
```

## Error Handling

All async functions can throw errors. Always wrap in try-catch:

```typescript
try {
  const encrypted = await encrypt(value, 'uint32')
} catch (error) {
  console.error('Encryption failed:', error)
}
```

## Advanced Usage

### Custom Network Configuration

```typescript
const instance = await createFhevmInstance({
  network: 'custom',
  chainId: 12345,
  gatewayUrl: 'https://custom-gateway.example.com'
})
```

### Manual Instance Management

```typescript
import { createFhevmInstance, encryptValue } from 'fhevm-sdk'

class MyService {
  private instance: FhevmInstance | null = null

  async init() {
    this.instance = await createFhevmInstance({
      network: 'sepolia'
    })
  }

  async encryptData(value: number) {
    if (!this.instance) throw new Error('Not initialized')
    return encryptValue(this.instance, value, 'uint32')
  }
}
```

### Integration with ethers.js

```typescript
import { ethers } from 'ethers'
import { useEncrypt } from 'fhevm-sdk'

function MyComponent() {
  const { encrypt } = useEncrypt()

  const submitToContract = async () => {
    // Encrypt data
    const encrypted = await encrypt(42, 'uint32')

    // Send to contract
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(address, abi, signer)

    const tx = await contract.submitEncrypted(encrypted.data)
    await tx.wait()
  }
}
```
