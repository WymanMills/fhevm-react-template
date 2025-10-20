# FHEVM SDK - Next.js Demo

This is a demonstration of the Universal FHEVM SDK in a Next.js application.

## Features

- ✅ Next.js 14 App Router
- ✅ Server-Side Rendering (SSR) compatible
- ✅ TypeScript support
- ✅ FHEVM SDK integration
- ✅ Client-side encryption demo
- ✅ Production-ready code

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

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## How It Works

This demo showcases the FHEVM SDK in a Next.js application with the App Router.

### 1. Provider Setup

The `FhevmProvider` is set up in `src/app/providers.tsx`:

```typescript
'use client'

import { FhevmProvider } from 'fhevm-sdk'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <FhevmProvider network="sepolia">
      {children}
    </FhevmProvider>
  )
}
```

**Why separate file?**
- Next.js App Router uses Server Components by default
- The `FhevmProvider` needs client-side state
- Separating providers keeps the layout clean

### 2. Using Hooks in Components

In `src/app/page.tsx`:

```typescript
'use client'

import { useFhevm, useEncrypt } from 'fhevm-sdk'

function DemoContent() {
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
nextjs-demo/
├── src/
│   └── app/
│       ├── layout.tsx          # Root layout
│       ├── page.tsx            # Main demo page
│       ├── providers.tsx       # FHEVM Provider setup
│       └── globals.css         # Global styles
├── package.json
├── tsconfig.json
├── next.config.js
└── README.md
```

## Key Concepts

### Server vs Client Components

- **Layout** (`layout.tsx`): Server Component (default)
- **Providers** (`providers.tsx`): Client Component (`'use client'`)
- **Page** (`page.tsx`): Client Component (needs FHEVM hooks)

### FHEVM SDK Integration

The SDK works seamlessly with Next.js:

1. **Initialization**: Automatic on mount
2. **Loading States**: Built-in loading/error handling
3. **Type Safety**: Full TypeScript support
4. **SSR Compatible**: Works with Next.js rendering

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Or connect your GitHub repository to Vercel for automatic deployments.

### Environment Variables

No environment variables required for this demo. For production apps with smart contracts:

```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_GATEWAY_URL=https://gateway.sepolia.zama.ai
```

## Extending This Demo

### Add Smart Contract Integration

```typescript
import { Contract, BrowserProvider } from 'ethers'

// After encrypting
const provider = new BrowserProvider(window.ethereum)
const signer = await provider.getSigner()
const contract = new Contract(address, abi, signer)

const tx = await contract.submitEncryptedValue(encrypted.data)
await tx.wait()
```

### Add Decryption

```typescript
import { useDecrypt } from 'fhevm-sdk'

function ResultDisplay() {
  const { decrypt } = useDecrypt()

  const decrypted = await decrypt(
    contractAddress,
    ciphertextHandle,
    'euint32'
  )
}
```

## Troubleshooting

### Build Errors

If you encounter build errors:

1. Clear `.next` directory:
   ```bash
   rm -rf .next
   ```

2. Reinstall dependencies:
   ```bash
   rm -rf node_modules
   npm install
   ```

### Webpack Errors

If you see module resolution errors, check `next.config.js`:

```javascript
webpack: (config) => {
  config.resolve.fallback = {
    ...config.resolve.fallback,
    fs: false,
    net: false,
    tls: false,
  }
  return config
}
```

## Learn More

- [FHEVM SDK Documentation](../../packages/fhevm-sdk/README.md)
- [Next.js Documentation](https://nextjs.org/docs)
- [Zama FHEVM](https://docs.zama.ai/fhevm)

## License

MIT
