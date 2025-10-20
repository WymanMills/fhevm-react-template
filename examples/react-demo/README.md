# FHEVM SDK - React Demo

This is a demonstration of the Universal FHEVM SDK in a React Single Page Application.

## Features

- ✅ React 18 with TypeScript
- ✅ Vite for fast development
- ✅ FHEVM SDK integration
- ✅ Client-side encryption demo
- ✅ Clean, production-ready code

## Quick Start

### Installation

```bash
npm install
# or
yarn install
# or
pnpm install
```

### Development

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

## How It Works

This demo showcases the FHEVM SDK in a React SPA built with Vite.

### 1. Provider Setup

The `FhevmProvider` wraps the entire application in `src/App.tsx`:

```typescript
import { FhevmProvider } from 'fhevm-sdk'

function App() {
  return (
    <FhevmProvider network="sepolia">
      <EncryptionDemo />
    </FhevmProvider>
  )
}
```

### 2. Using Hooks

Inside components, use the FHEVM hooks:

```typescript
import { useFhevm, useEncrypt } from 'fhevm-sdk'

function EncryptionDemo() {
  const { instance, ready, error, loading } = useFhevm()
  const { encrypt, encrypting } = useEncrypt()

  const handleEncrypt = async () => {
    const encrypted = await encrypt(value, 'uint32')
    // Use encrypted.data with your contract
  }
}
```

### 3. Encryption Flow

1. User enters a value
2. Click "Encrypt Value"
3. SDK encrypts using FHEVM
4. Encrypted data displayed as hex string
5. This data can be sent to smart contracts

## Code Structure

```
react-demo/
├── src/
│   ├── App.tsx              # Main application component
│   ├── main.tsx             # Application entry point
│   └── index.css            # Global styles
├── index.html               # HTML template
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Key Concepts

### FHEVM SDK Integration

The SDK provides React hooks that make it easy to work with FHEVM:

1. **`useFhevm()`** - Access the FHEVM instance
2. **`useEncrypt()`** - Encrypt values
3. **`useDecrypt()`** - Decrypt values
4. **`FhevmProvider`** - Context provider for the SDK

### State Management

All FHEVM state is managed by the SDK:
- Loading states
- Error handling
- Instance readiness
- Encryption progress

## Deployment

### Vercel

```bash
npm i -g vercel
vercel
```

### Netlify

```bash
npm run build
# Upload the 'dist' folder to Netlify
```

### GitHub Pages

```bash
npm run build
# Deploy the 'dist' folder to GitHub Pages
```

## Extending This Demo

### Add Smart Contract Integration

```typescript
import { Contract, BrowserProvider } from 'ethers'

async function submitToContract() {
  // Get encrypted data
  const encrypted = await encrypt(value, 'uint32')

  // Connect to contract
  const provider = new BrowserProvider(window.ethereum)
  const signer = await provider.getSigner()
  const contract = new Contract(address, abi, signer)

  // Submit encrypted value
  const tx = await contract.submitEncryptedValue(encrypted.data)
  await tx.wait()
}
```

### Add Decryption

```typescript
import { useDecrypt } from 'fhevm-sdk'

function ResultDisplay() {
  const { decrypt, requesting } = useDecrypt()

  const loadResult = async () => {
    const decrypted = await decrypt(
      contractAddress,
      ciphertextHandle,
      'euint32'
    )
    console.log('Decrypted:', decrypted)
  }
}
```

### Add Multiple Encryption Types

```typescript
// Encrypt different types
const encryptedBool = await encrypt(true, 'bool')
const encryptedUint8 = await encrypt(255, 'uint8')
const encryptedUint64 = await encrypt(1000000n, 'uint64')
const encryptedAddress = await encrypt('0x...', 'address')
```

## Troubleshooting

### Module Resolution Errors

If you encounter module resolution errors:

1. Clear cache:
   ```bash
   rm -rf node_modules
   npm install
   ```

2. Check `vite.config.ts`:
   ```typescript
   optimizeDeps: {
     exclude: ['fhevm-sdk'],
   }
   ```

### Build Errors

Clear Vite cache:
```bash
rm -rf node_modules/.vite
npm run dev
```

## Learn More

- [FHEVM SDK Documentation](../../packages/fhevm-sdk/README.md)
- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Zama FHEVM](https://docs.zama.ai/fhevm)

## License

MIT
