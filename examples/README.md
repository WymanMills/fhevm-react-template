# FHEVM SDK - Example Applications

This directory contains example applications demonstrating the Universal FHEVM SDK across different frameworks and use cases.

## 📁 Available Examples

### 1. Next.js Demo (Required)
**Directory**: `nextjs-demo/`

A complete Next.js 14 App Router application showcasing the FHEVM SDK.

**Features**:
- ✅ Server-Side Rendering (SSR) compatible
- ✅ App Router architecture
- ✅ TypeScript support
- ✅ Client-side encryption demo
- ✅ Production-ready code

**Quick Start**:
```bash
cd nextjs-demo
npm install
npm run dev
```

**Live Demo**: [Coming Soon]

---

### 2. React Demo
**Directory**: `react-demo/`

A Single Page Application built with React 18 and Vite.

**Features**:
- ✅ React 18 with hooks
- ✅ Vite for fast development
- ✅ TypeScript support
- ✅ Clean component structure
- ✅ Encryption demonstration

**Quick Start**:
```bash
cd react-demo
npm install
npm run dev
```

**Live Demo**: [Coming Soon]

---

### 3. Property Valuation System
**Directory**: `property-valuation/`

A real-world application demonstrating confidential property valuations with multi-valuator consensus.

**Features**:
- ✅ Complete FHEVM integration
- ✅ Smart contract interactions
- ✅ Multi-valuator workflow
- ✅ Encrypted property data
- ✅ Privacy-preserving analytics
- ✅ 47+ test cases

**Quick Start**:
```bash
cd property-valuation
npm install
npm run dev
```

**Live Demo**: [Coming Soon]

---

### 4. Confidential Property Valuation (React Application)
**Directory**: `confidential-property-valuation/`

A fully-featured React application demonstrating real-world blockchain integration with privacy-preserving property valuations.

**Features**:
- ✅ Complete wallet integration (MetaMask)
- ✅ Network switching (Sepolia testnet)
- ✅ Property registration with encrypted details
- ✅ Valuation submission and management
- ✅ Admin authorization controls
- ✅ Real-time blockchain interaction
- ✅ Modern React architecture
- ✅ TypeScript support

**Quick Start**:
```bash
cd confidential-property-valuation
npm install
npm run dev
```

**Technology Stack**:
- React 18 with TypeScript
- Vite for development
- Ethers.js v6
- Smart contract deployed on Sepolia

**Live Demo**: [Coming Soon]

---

### 5. Vue Demo (Optional)
**Directory**: `vue-demo/`

A Vue 3 application using the Composition API.

**Status**: Coming soon

**Features**:
- Vue 3 Composition API
- FHEVM composables
- TypeScript support
- Vite development

---

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm, yarn, or pnpm
- MetaMask or compatible Web3 wallet (for contract interactions)

### Installation

Install all examples at once from the root directory:

```bash
# From root directory
npm install

# Or install individually
cd examples/nextjs-demo && npm install
cd examples/react-demo && npm install
cd examples/property-valuation && npm install
cd examples/confidential-property-valuation && npm install
```

### Development

Each example can be run independently:

```bash
# Next.js
cd nextjs-demo && npm run dev
# Open http://localhost:3000

# React
cd react-demo && npm run dev
# Open http://localhost:5173

# Property Valuation
cd property-valuation && npm run dev
# Open http://localhost:5174

# Confidential Property Valuation
cd confidential-property-valuation && npm run dev
# Open http://localhost:3002
```

### Production Build

```bash
# Next.js
cd nextjs-demo && npm run build && npm start

# React
cd react-demo && npm run build && npm run preview

# Property Valuation
cd property-valuation && npm run build && npm run preview

# Confidential Property Valuation
cd confidential-property-valuation && npm run build && npm run preview
```

---

## 📖 Learning Path

### Beginner: Start with Next.js Demo

The Next.js demo is the simplest example, perfect for understanding the basics:

1. How to wrap your app with `FhevmProvider`
2. How to use `useFhevm()` hook
3. How to encrypt values
4. Basic state management

**Estimated Time**: 10 minutes

---

### Intermediate: Explore React Demo

The React demo shows a traditional SPA architecture:

1. Vite configuration for FHEVM
2. React hooks patterns
3. Client-side encryption
4. Error handling

**Estimated Time**: 15 minutes

---

### Advanced: Property Valuation System

The complete real-world application demonstrating:

1. Smart contract integration
2. Multi-step encrypted workflows
3. Decryption via Gateway
4. Permission management
5. Production deployment

**Estimated Time**: 30-45 minutes

---

## 🎯 Common Patterns

### Pattern 1: Basic Setup

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

### Pattern 2: Encryption

```typescript
import { useEncrypt } from 'fhevm-sdk'

function MyComponent() {
  const { encrypt, encrypting } = useEncrypt()

  const handleSubmit = async (value: number) => {
    const encrypted = await encrypt(value, 'uint32')
    // Use encrypted.data with contract
  }
}
```

### Pattern 3: Decryption

```typescript
import { useDecrypt } from 'fhevm-sdk'

function ResultDisplay() {
  const { decrypt, requesting } = useDecrypt()

  const loadResult = async () => {
    const result = await decrypt(
      contractAddress,
      handle,
      'euint32'
    )
    console.log('Decrypted:', result)
  }
}
```

### Pattern 4: Smart Contract Integration

```typescript
import { Contract, BrowserProvider } from 'ethers'
import { useEncrypt } from 'fhevm-sdk'

function ContractInteraction() {
  const { encrypt } = useEncrypt()

  const submitToContract = async () => {
    // Encrypt data
    const encrypted = await encrypt(42, 'uint32')

    // Get contract
    const provider = new BrowserProvider(window.ethereum)
    const signer = await provider.getSigner()
    const contract = new Contract(address, abi, signer)

    // Submit
    const tx = await contract.submitValue(encrypted.data)
    await tx.wait()
  }
}
```

---

## 🌐 Deployment

### Vercel (Recommended)

All examples are ready to deploy to Vercel:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from example directory
cd nextjs-demo
vercel
```

### Netlify

```bash
# Build
npm run build

# Deploy dist/ folder to Netlify
```

### GitHub Pages

```bash
# Build
npm run build

# Deploy dist/ folder to gh-pages branch
```

---

## 🔧 Configuration

### Network Configuration

All examples default to Sepolia testnet. To change:

```typescript
<FhevmProvider network="mainnet">
  {children}
</FhevmProvider>

// Or custom network
<FhevmProvider config={{
  network: {
    name: 'custom',
    chainId: 31337,
    rpcUrl: 'http://localhost:8545',
    gatewayUrl: 'http://localhost:3000'
  }
}}>
  {children}
</FhevmProvider>
```

### Environment Variables

For production deployments with smart contracts:

```env
# .env.local or .env

# Contract addresses
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...

# Gateway URL (optional, defaults to Sepolia)
NEXT_PUBLIC_GATEWAY_URL=https://gateway.sepolia.zama.ai

# Network (optional, defaults to sepolia)
NEXT_PUBLIC_NETWORK=sepolia
```

---

## 📊 Comparison Matrix

| Feature | Next.js Demo | React Demo | Property Valuation | Confidential Property Valuation |
|---------|--------------|------------|--------------------|--------------------------------|
| Framework | Next.js 14 | React 18 | React 18 + Vite | React 18 + Vite |
| Rendering | SSR + CSR | CSR only | CSR only | CSR only |
| Complexity | Simple | Simple | Advanced | Intermediate |
| Smart Contracts | ❌ | ❌ | ✅ | ✅ |
| Decryption | ❌ | ❌ | ✅ | ✅ (Ready) |
| Wallet Integration | ❌ | ❌ | ✅ | ✅ |
| Production Ready | ✅ | ✅ | ✅ | ✅ |
| Lines of Code | ~150 | ~130 | ~2000+ | ~800 |
| Learning Time | 10 min | 15 min | 30-45 min | 20 min |

---

## 🐛 Troubleshooting

### Common Issues

#### Module Resolution

If you see errors like `Cannot find module 'fhevm-sdk'`:

```bash
# Clear cache and reinstall
rm -rf node_modules
npm install

# For Vite projects
rm -rf node_modules/.vite
```

#### Webpack/Vite Errors

Check configuration files:

**Next.js** (`next.config.js`):
```javascript
webpack: (config) => {
  config.resolve.fallback = {
    fs: false,
    net: false,
    tls: false,
  }
  return config
}
```

**Vite** (`vite.config.ts`):
```typescript
optimizeDeps: {
  exclude: ['fhevm-sdk'],
}
```

#### MetaMask Connection

Ensure MetaMask is:
1. Installed
2. Connected to the correct network (Sepolia)
3. Has testnet ETH for transactions

Get Sepolia ETH: https://sepoliafaucet.com/

---

## 📚 Additional Resources

- [FHEVM SDK Documentation](../packages/fhevm-sdk/README.md)
- [API Reference](../packages/fhevm-sdk/docs/API_REFERENCE.md)
- [Zama FHEVM Docs](https://docs.zama.ai/fhevm)
- [Competition Submission](../COMPETITION_SUBMISSION.md)

---

## 🤝 Contributing

Found a bug or have an improvement? See [CONTRIBUTING.md](../CONTRIBUTING.md)

---

## 📄 License

All examples are licensed under MIT License.
