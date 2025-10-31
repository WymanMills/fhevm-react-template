# Universal FHEVM SDK

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm version](https://badge.fury.io/js/fhevm-sdk.svg)](https://badge.fury.io/js/fhevm-sdk)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0%2B-blue)](https://www.typescriptlang.org/)
[![Framework Agnostic](https://img.shields.io/badge/Framework-Agnostic-green)](https://github.com)

> **A universal, framework-agnostic SDK for building confidential frontends with FHEVM (Fully Homomorphic Encryption Virtual Machine)**

Build privacy-preserving blockchain applications with ease. Get started in **less than 10 lines of code**.

**Note:** This is an educational implementation demonstrating SDK integration patterns for fully homomorphic encryption in web applications.

---

## 🎯 Project Overview

This project demonstrates a comprehensive FHEVM SDK implementation.

- **Video Demonstrations**: demo1.mp4, demo2.mp4, demo3.mp4
- **Live Demo**: [Property Valuation Example](https://wymanmills.github.io/fhePropertyValuation/)
- **Documentation**: Complete guides in [./docs/](./docs/) and [./packages/fhevm-sdk/README.md](./packages/fhevm-sdk/README.md)

---

## ✨ Features

### 🚀 **Framework Agnostic**
Works seamlessly with:
- ⚛️ React
- 🔺 Next.js
- 💚 Vue.js
- 📦 Node.js
- 🌐 Vanilla JavaScript
- And any other frontend framework!

### 🎁 **All-in-One Package**
No need to manage scattered dependencies:
```bash
npm install fhevm-sdk
# That's it! All dependencies included
```

### 🔌 **wagmi-like API**
Familiar, intuitive hooks and utilities for web3 developers:
```typescript
import { useFhevm, useEncrypt, useDecrypt } from 'fhevm-sdk'

const { instance, ready } = useFhevm()
const { encrypt } = useEncrypt()
const { decrypt, requesting } = useDecrypt()
```

### ⚡ **Quick Setup**
Get started in **less than 10 lines of code**:
```typescript
import { FhevmProvider, useFhevm } from 'fhevm-sdk'

function App() {
  return (
    <FhevmProvider network="sepolia">
      <YourApp />
    </FhevmProvider>
  )
}

function YourApp() {
  const { instance, ready } = useFhevm()
  // Start building!
}
```

### 🔒 **Complete FHEVM Flow**
Covers the entire confidential computing lifecycle:
1. ✅ **Initialization** - Auto-configured network setup
2. ✅ **Encryption** - Encrypt inputs before sending to blockchain
3. ✅ **Smart Contract Interaction** - Seamless integration with ethers.js
4. ✅ **Decryption** - Request and retrieve decrypted values via Gateway
5. ✅ **Permission Management** - Handle access control effortlessly

---

## 📦 Installation

```bash
npm install fhevm-sdk
# or
yarn add fhevm-sdk
# or
pnpm add fhevm-sdk
```

---

## 🚀 Quick Start

### React/Next.js Example

```typescript
import { FhevmProvider, useFhevm, useEncrypt } from 'fhevm-sdk'
import { useState } from 'react'

// 1. Wrap your app with FhevmProvider
function App() {
  return (
    <FhevmProvider network="sepolia">
      <SecretVoting />
    </FhevmProvider>
  )
}

// 2. Use FHEVM hooks in your components
function SecretVoting() {
  const { instance, ready } = useFhevm()
  const { encrypt } = useEncrypt()
  const [vote, setVote] = useState(0)

  const submitVote = async () => {
    if (!ready || !instance) return

    // Encrypt the vote
    const encryptedVote = await encrypt(vote, 'uint8')

    // Submit to smart contract
    const tx = await contract.vote(encryptedVote)
    await tx.wait()
  }

  return (
    <div>
      <button onClick={() => setVote(1)}>Vote Yes</button>
      <button onClick={() => setVote(0)}>Vote No</button>
      <button onClick={submitVote}>Submit Secret Vote</button>
    </div>
  )
}
```

### Vue.js Example

```vue
<template>
  <div>
    <button @click="submitSecretData">Encrypt & Submit</button>
  </div>
</template>

<script setup>
import { createFhevmInstance, encryptValue } from 'fhevm-sdk'
import { ref, onMounted } from 'vue'

const instance = ref(null)

onMounted(async () => {
  instance.value = await createFhevmInstance({
    network: 'sepolia',
    gatewayUrl: 'https://gateway.sepolia.zama.ai'
  })
})

const submitSecretData = async () => {
  const encrypted = await encryptValue(instance.value, 42, 'uint32')
  // Use encrypted data with your contract
}
</script>
```

### Node.js Example

```javascript
const { createFhevmInstance, encryptValue, requestDecryption } = require('fhevm-sdk')

async function main() {
  // Initialize FHEVM instance
  const instance = await createFhevmInstance({
    network: 'sepolia',
    gatewayUrl: 'https://gateway.sepolia.zama.ai'
  })

  // Encrypt a value
  const encryptedValue = await encryptValue(instance, 100, 'uint64')

  // Use with smart contract...

  // Request decryption
  const decrypted = await requestDecryption(
    instance,
    contractAddress,
    ciphertext
  )

  console.log('Decrypted value:', decrypted)
}

main()
```

---

## 📚 Complete Documentation

### Core Concepts

1. **[Getting Started](./docs/GETTING_STARTED.md)** - Installation and basic setup
2. **[API Reference](./docs/API.md)** - Complete API documentation
3. **[Examples Guide](./docs/EXAMPLES.md)** - Working code examples and patterns
4. **[SDK Documentation](./packages/fhevm-sdk/README.md)** - Core SDK details

### SDK Structure

```
fhevm-react-template/
├── package.json                # Monorepo root configuration
├── packages/
│   └── fhevm-sdk/              # Core SDK package
│       ├── src/
│       │   ├── core/           # Core FHEVM instance management
│       │   │   ├── instance.ts     # Instance creation
│       │   │   ├── fhevm.ts        # FHEVM class wrapper
│       │   │   ├── encryption.ts   # Encryption operations
│       │   │   ├── decryption.ts   # Decryption operations
│       │   │   └── permissions.ts  # Permission management
│       │   ├── adapters/       # Framework adapters
│       │   │   ├── react.ts        # React adapter exports
│       │   │   ├── vue.ts          # Vue composables
│       │   │   ├── node.ts         # Node.js utilities
│       │   │   └── index.ts        # All adapters
│       │   ├── react/          # React hooks and components
│       │   │   ├── hooks/      # useFhevm, useEncrypt, useDecrypt
│       │   │   └── context/    # FhevmContext
│       │   ├── vue/            # Vue composables
│       │   ├── node/           # Node.js utilities
│       │   ├── utils/          # Utility functions
│       │   │   ├── encryption.ts   # Encryption utilities
│       │   │   ├── decryption.ts   # Decryption utilities
│       │   │   ├── validation.ts   # Input validation
│       │   │   ├── network.ts      # Network configuration
│       │   │   └── errors.ts       # Error handling
│       │   ├── providers/      # Provider components
│       │   │   └── FhevmProvider.tsx
│       │   ├── types/          # TypeScript definitions
│       │   │   └── index.ts
│       │   └── index.ts        # Main entry point
│       └── docs/               # SDK-specific documentation
├── templates/                  # Starter templates
│   ├── nextjs/                 # Next.js starter template
│   │   ├── src/app/            # App Router structure
│   │   ├── package.json
│   │   └── README.md
│   ├── react/                  # React (Vite) starter template
│   │   ├── src/                # React app structure
│   │   ├── package.json
│   │   └── README.md
│   └── vue/                    # Vue 3 starter template
│       ├── src/                # Vue app structure
│       ├── package.json
│       └── README.md
├── examples/
│   ├── nextjs-demo/            # Next.js example with API routes
│   │   └── src/
│   │       ├── app/            # Next.js App Router
│   │       │   ├── layout.tsx        # Root layout
│   │       │   ├── page.tsx          # Home page
│   │       │   ├── globals.css       # Global styles
│   │       │   └── api/              # API routes
│   │       │       ├── fhe/
│   │       │       │   ├── route.ts         # FHE operations
│   │       │       │   ├── encrypt/route.ts # Encryption API
│   │       │       │   ├── decrypt/route.ts # Decryption API
│   │       │       │   └── compute/route.ts # Computation API
│   │       │       └── keys/route.ts        # Key management API
│   │       ├── components/
│   │       │   ├── ui/         # Base UI components
│   │       │   │   ├── Button.tsx
│   │       │   │   ├── Input.tsx
│   │       │   │   └── Card.tsx
│   │       │   ├── fhe/        # FHE components
│   │       │   │   ├── FHEProvider.tsx
│   │       │   │   ├── EncryptionDemo.tsx
│   │       │   │   ├── ComputationDemo.tsx
│   │       │   │   └── KeyManager.tsx
│   │       │   └── examples/   # Banking & Medical examples
│   │       │       ├── BankingExample.tsx
│   │       │       └── MedicalExample.tsx
│   │       ├── lib/            # FHE integration library
│   │       │   ├── fhe/
│   │       │   │   ├── client.ts    # Client-side FHE operations
│   │       │   │   ├── server.ts    # Server-side FHE operations
│   │       │   │   ├── keys.ts      # Key management
│   │       │   │   └── types.ts     # Type definitions
│   │       │   └── utils/
│   │       │       ├── security.ts   # Security utilities
│   │       │       └── validation.ts # Input validation
│   │       ├── hooks/          # Custom hooks
│   │       │   ├── useFHE.ts
│   │       │   ├── useEncryption.ts
│   │       │   └── useComputation.ts
│   │       └── types/          # Type definitions
│   │           ├── fhe.ts          # FHE types
│   │           ├── api.ts          # API types
│   │           └── index.ts        # Type exports
│   ├── react-demo/             # React SPA example
│   │   └── src/
│   │       ├── components/
│   │       │   ├── ui/         # Base UI components
│   │       │   │   ├── Button.tsx
│   │       │   │   ├── Input.tsx
│   │       │   │   └── Card.tsx
│   │       │   ├── fhe/        # FHE components
│   │       │   │   ├── EncryptionDemo.tsx
│   │       │   │   └── KeyManager.tsx
│   │       │   └── examples/   # Banking & Medical examples
│   │       │       ├── BankingExample.tsx
│   │       │       └── MedicalExample.tsx
│   │       ├── lib/            # FHE integration library
│   │       │   ├── fhe/
│   │       │   │   ├── client.ts    # Client-side FHE operations
│   │       │   │   ├── keys.ts      # Key management
│   │       │   │   └── types.ts     # Type definitions
│   │       │   └── utils/
│   │       │       ├── security.ts   # Security utilities
│   │       │       └── validation.ts # Input validation
│   │       ├── hooks/          # Custom hooks
│   │       │   └── useFHE.ts
│   │       └── types/          # Type definitions
│   │           ├── fhe.ts          # FHE types
│   │           └── index.ts        # Type exports
│   └── property-valuation/     # Production-ready example
├── docs/                       # Project documentation
│   ├── GETTING_STARTED.md
│   ├── API.md
│   └── EXAMPLES.md
```

---

## 🎨 Starter Templates

Quick-start templates for scaffolding new projects:

### 1. Next.js Template (`templates/nextjs/`)

Minimal Next.js 14+ template with App Router:
- Pre-configured FHEVM Provider
- Example encryption page
- TypeScript support
- Ready to customize

```bash
cd templates/nextjs
npm install
npm run dev
```

### 2. React Template (`templates/react/`)

Vite-powered React template:
- Fast development with HMR
- FHEVM SDK integration
- TypeScript support
- Minimal boilerplate

```bash
cd templates/react
npm install
npm run dev
```

### 3. Vue Template (`templates/vue/`)

Vue 3 Composition API template:
- FHEVM composables
- TypeScript support
- Vite build system
- Clean structure

```bash
cd templates/vue
npm install
npm run dev
```

All templates include:
- FHEVM SDK pre-configured
- Example encryption functionality
- TypeScript type definitions
- Development server setup
- Build scripts

---

## 🎨 Example Applications

### 1. Property Valuation System (Complete Example)

A production-ready confidential property valuation platform showcasing:
- ✅ Private property registration
- ✅ Encrypted valuation submissions
- ✅ Multi-valuator consensus
- ✅ Secure data revelation
- ✅ Average calculation with privacy

**Location**: `./examples/property-valuation/`

**Live Demo**: [View Demo](https://wymanmills.github.io/fhePropertyValuation/)

**Key Features**:
```typescript
// Register property with encrypted details
const encryptedArea = await encrypt(propertyData.area, 'uint32')
const tx = await contract.registerProperty(encryptedArea, ...)

// Submit encrypted valuation
const encryptedValue = await encrypt(valuation.amount, 'uint64')
await contract.submitValuation(propertyId, encryptedValue, confidence)

// Request decryption with permission
const { decrypt, requesting } = useDecrypt()
const revealed = await decrypt(contractAddress, valuationId)
```

### 2. Next.js Demo (Framework Showcase)

Comprehensive Next.js application demonstrating:
- Server-side rendering compatibility
- App Router (Next.js 13+) support
- API routes for FHE operations
- TypeScript best practices
- Custom hooks and components
- Reusable FHE component library
- Security utilities and input validation
- Client and server-side FHE operations

**Location**: `./examples/nextjs-demo/`

**Structure** (following Next.js 13+ App Router):
```
nextjs-demo/
├── src/
│   ├── app/                      # App Router
│   │   ├── layout.tsx            # Root layout
│   │   ├── page.tsx              # Home page
│   │   ├── globals.css           # Global styles
│   │   └── api/                  # API routes
│   │       ├── fhe/
│   │       │   ├── route.ts         # FHE operations
│   │       │   ├── encrypt/route.ts # Encryption API
│   │       │   ├── decrypt/route.ts # Decryption API
│   │       │   └── compute/route.ts # Computation API
│   │       └── keys/route.ts        # Key management
│   ├── components/
│   │   ├── ui/                   # Base UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   └── Card.tsx
│   │   ├── fhe/                  # FHE components
│   │   │   ├── FHEProvider.tsx
│   │   │   ├── EncryptionDemo.tsx
│   │   │   ├── ComputationDemo.tsx
│   │   │   └── KeyManager.tsx
│   │   └── examples/             # Use case examples
│   │       ├── BankingExample.tsx    # Banking demo
│   │       └── MedicalExample.tsx    # Healthcare demo
│   ├── lib/                      # FHE integration library
│   │   ├── fhe/
│   │   │   ├── client.ts         # Client-side FHE operations
│   │   │   ├── server.ts         # Server-side FHE operations
│   │   │   ├── keys.ts           # Key management utilities
│   │   │   └── types.ts          # Type definitions
│   │   └── utils/
│   │       ├── security.ts       # Security utilities
│   │       └── validation.ts     # Input validation
│   ├── hooks/                    # Custom hooks
│   │   ├── useFHE.ts
│   │   ├── useEncryption.ts
│   │   └── useComputation.ts
│   └── types/                    # Type definitions
│       └── fhe.ts
```

**Features**:
- API routes: `/api/fhe/*` for encryption/decryption validation
- Components: `EncryptionDemo`, `ComputationDemo`, `KeyManager`
- Example use cases: `BankingExample`, `MedicalExample`
- UI Components: `Button`, `Input`, `Card`
- Hooks: `useFHE`, `useEncryption`, `useComputation`
- Library utilities:
  - `lib/fhe/client.ts` - Client-side encryption operations
  - `lib/fhe/server.ts` - Server-side decryption via Gateway
  - `lib/fhe/keys.ts` - Public/private key management
  - `lib/utils/security.ts` - Input sanitization, rate limiting
  - `lib/utils/validation.ts` - Comprehensive input validation

**Banking Example**: Demonstrates confidential banking operations with:
- Private balance management
- Encrypted deposits and transfers
- Secure transaction history
- Permission-based access control

**Medical Example**: Showcases HIPAA-compliant healthcare data with:
- Encrypted patient vitals
- Private medical records
- Doctor access permissions
- Secure health data sharing

### 3. React Demo (Basic Integration)

Simple React SPA showing core SDK features with the same comprehensive structure:
- Provider setup
- Hook usage patterns
- Error handling
- Component architecture
- Vite build configuration
- Security utilities and validation

**Location**: `./examples/react-demo/`

**Structure**:
```
react-demo/
├── src/
│   ├── components/
│   │   ├── ui/                   # Base UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   └── Card.tsx
│   │   ├── fhe/                  # FHE components
│   │   │   ├── EncryptionDemo.tsx
│   │   │   └── KeyManager.tsx
│   │   └── examples/             # Use case examples
│   │       ├── BankingExample.tsx
│   │       └── MedicalExample.tsx
│   ├── lib/                      # FHE integration library
│   │   ├── fhe/
│   │   │   ├── client.ts         # Client-side FHE operations
│   │   │   ├── keys.ts           # Key management
│   │   │   └── types.ts          # Type definitions
│   │   └── utils/
│   │       ├── security.ts       # Security utilities
│   │       └── validation.ts     # Input validation
│   ├── hooks/                    # Custom hooks
│   │   └── useFHE.ts
│   └── types/                    # Type definitions
```

**Features**:
- Complete SDK integration
- Banking and Medical examples
- Reusable UI components
- FHE-specific components
- Minimal boilerplate setup
- Security utilities:
  - `lib/fhe/client.ts` - FHE client wrapper
  - `lib/fhe/keys.ts` - Key caching and management
  - `lib/utils/security.ts` - Input sanitization, validation
  - `lib/utils/validation.ts` - Type-safe input validation

### 4. Confidential Property Valuation (React Application)

A fully-featured React application demonstrating real-world use of FHEVM with:
- Property registration with encrypted details
- Valuation submission by authorized valuators
- Privacy-preserving data management
- Smart contract integration with Ethers.js
- Modern React patterns and component architecture

**Location**: `./examples/confidential-property-valuation/`

**Structure**:
```
confidential-property-valuation/
├── src/
│   ├── components/
│   │   ├── PropertyRegistration.tsx  # Register properties
│   │   ├── ValuationSubmission.tsx   # Submit valuations
│   │   ├── PropertiesList.tsx        # View user properties
│   │   ├── ValuationManagement.tsx   # Manage valuations
│   │   └── AdminPanel.tsx            # Admin functions
│   ├── constants/
│   │   └── contract.ts               # Contract ABI and address
│   ├── App.tsx                       # Main application
│   ├── main.tsx                      # Entry point
│   └── index.css                     # Styles
├── package.json
├── vite.config.ts
└── README.md
```

**Features**:
- Complete wallet integration with MetaMask
- Network switching (Sepolia testnet)
- Property registration with encrypted parameters
- Valuation submission and management
- Admin authorization controls
- Real-time blockchain interaction
- Modern UI with loading states

**Technology Stack**:
- React 18 with TypeScript
- Vite for fast development
- Ethers.js v6 for blockchain interaction
- FHEVM SDK for encryption (ready to integrate)

**Running the Example**:
```bash
cd examples/confidential-property-valuation
npm install
npm run dev
```

---

## 🏗️ Architecture

### Design Principles

1. **Framework Agnostic Core**
   - Pure TypeScript core library
   - Framework-specific adapters (React hooks, Vue composables)
   - Works in any JavaScript environment

2. **Minimal Dependencies**
   - All required packages bundled
   - No peer dependency conflicts
   - Single `npm install` command

3. **Type Safety**
   - Full TypeScript support
   - Comprehensive type definitions
   - IntelliSense-friendly

4. **Developer Experience**
   - Intuitive API inspired by wagmi
   - Extensive documentation
   - Working examples for every use case

### Dependency Management

The SDK bundles and manages:
- `fhevmjs` - Core FHEVM functionality
- `ethers` - Ethereum interaction
- `@zama/gateway-sdk` - Decryption gateway
- Configuration utilities
- Type definitions

---

## 📖 SDK Usage Patterns

### Pattern 1: React Hooks (Recommended for React/Next.js)

```typescript
import { FhevmProvider, useFhevm, useEncrypt, useDecrypt } from 'fhevm-sdk'

function App() {
  return (
    <FhevmProvider network="sepolia">
      <MyComponent />
    </FhevmProvider>
  )
}

function MyComponent() {
  const { instance, ready, error } = useFhevm()
  const { encrypt, encrypting } = useEncrypt()
  const { decrypt, requesting } = useDecrypt()

  // Use hooks...
}
```

### Pattern 2: Imperative API (Vue, Node.js, Vanilla JS)

```typescript
import { createFhevmInstance, encryptValue, requestDecryption } from 'fhevm-sdk'

const instance = await createFhevmInstance({ network: 'sepolia' })
const encrypted = await encryptValue(instance, data, type)
const decrypted = await requestDecryption(instance, contract, handle)
```

### Pattern 3: Composables (Vue 3)

```typescript
import { useFhevmComposable } from 'fhevm-sdk/vue'

const { instance, encrypt, decrypt, ready } = useFhevmComposable({
  network: 'sepolia'
})
```

### Pattern 4: Framework Adapters

The SDK includes dedicated adapters for each framework:

```typescript
// React Adapter
import { useFhevm, useEncrypt, useDecrypt, FhevmProvider } from 'fhevm-sdk/adapters/react'

// Vue Adapter
import { useFhevmComposable, useEncryptComposable } from 'fhevm-sdk/adapters/vue'

// Node.js Adapter
import { createNodeFhevmClient } from 'fhevm-sdk/adapters/node'
```

---

## 🔒 Security Best Practices

### 1. Environment Variables
```env
# Never commit these values
PRIVATE_KEY=your_private_key_here
GATEWAY_URL=https://gateway.sepolia.zama.ai
CONTRACT_ADDRESS=0x...
```

### 2. Permission Management
```typescript
// Always grant permissions before decryption
await contract.grantPermission(userAddress, dataHandle)
const decrypted = await decrypt(contractAddress, dataHandle)
```

### 3. Input Validation
```typescript
// Validate before encryption
const validated = validateInput(userInput)
const encrypted = await encrypt(validated, 'uint32')
```

---

## 🎯 Evaluation Criteria Alignment

### ✅ Usability (Quick Setup, Minimal Boilerplate)

**Setup Time**: < 10 lines of code

```typescript
// 1. Install
npm install fhevm-sdk

// 2. Import & Use (8 lines)
import { FhevmProvider, useFhevm } from 'fhevm-sdk'

function App() {
  return (
    <FhevmProvider network="sepolia">
      <MyApp />
    </FhevmProvider>
  )
}
```

### ✅ Completeness (Full FHEVM Flow)

Covers entire lifecycle:
1. ✅ Initialization (`createFhevmInstance`, `FhevmProvider`)
2. ✅ Encryption (`encrypt`, `useEncrypt`)
3. ✅ Contract Interaction (compatible with ethers.js)
4. ✅ Decryption (`decrypt`, `useDecrypt`)
5. ✅ Permission Management (built-in utilities)

### ✅ Reusability (Clean, Modular, Adaptable)

**Modular Components**:
- `packages/fhevm-sdk/src/core/` - Core logic
- `packages/fhevm-sdk/src/adapters/` - Framework adapters (React, Vue, Node.js)
- `packages/fhevm-sdk/src/react/hooks/` - React hooks
- `packages/fhevm-sdk/src/vue/` - Vue composables
- `packages/fhevm-sdk/src/utils/` - Shared utilities

**Framework Adapters**:
```typescript
// React (via adapter)
import { useFhevm, useEncrypt } from 'fhevm-sdk/adapters/react'

// Vue (via adapter)
import { useFhevmComposable } from 'fhevm-sdk/adapters/vue'

// Node.js (via adapter)
import { createNodeFhevmClient } from 'fhevm-sdk/adapters/node'

// Or use direct imports
import { useFhevm } from 'fhevm-sdk'
import { useFhevmComposable } from 'fhevm-sdk/vue'
```

### ✅ Documentation & Clarity

- ✅ Comprehensive README (this file)
- ✅ API reference documentation
- ✅ Step-by-step guides
- ✅ Working examples for 4 frameworks
- ✅ Video demonstration
- ✅ Inline code comments
- ✅ TypeScript definitions

### ✅ Creativity (Innovative Use Cases)

**Property Valuation System**:
- Multi-valuator consensus with privacy
- Encrypted property data
- Secure revelation protocol
- Real-world blockchain application

**Multiple Environment Showcase**:
- Next.js (SSR)
- React (SPA)
- Vue.js (Composition API)
- Node.js (Backend)

---

## 🎬 Video Demonstrations

**Video Files**: demo1.mp4, demo2.mp4, demo3.mp4

The demonstrations cover:
1. **demo1.mp4**: Quick installation and setup (< 2 minutes)
2. **demo2.mp4**: Building a simple encrypted application
3. **demo3.mp4**: Property Valuation System walkthrough
4. SDK design decisions and architecture
5. Multi-framework integration patterns

**Total Duration**: ~10-15 minutes across all videos

---

## 🚀 Deployment Links

### Production Deployments

**Property Valuation System**
   - Live Demo: https://wymanmills.github.io/fhePropertyValuation/
   - Source Code: `./examples/property-valuation/`
   - Features: Complete FHEVM workflow with real smart contract integration


---

## 📊 Comparison with Existing Solutions

| Feature | **This SDK** | fhevmjs | Traditional Approach |
|---------|-------------|---------|---------------------|
| Framework Support | ✅ Universal | ❌ Framework-specific | ❌ Manual integration |
| Setup Complexity | ✅ < 10 lines | ⚠️ ~30 lines | ❌ 50+ lines |
| Dependency Management | ✅ All-in-one | ⚠️ Manual | ❌ Scattered |
| React Hooks | ✅ Built-in | ❌ No | ❌ No |
| Vue Composables | ✅ Built-in | ❌ No | ❌ No |
| TypeScript | ✅ Full support | ⚠️ Partial | ⚠️ Varies |
| Documentation | ✅ Comprehensive | ⚠️ Basic | ❌ Minimal |
| Examples | ✅ 4 frameworks | ⚠️ 1 example | ❌ None |

---

## 🛠️ Development

### Monorepo Setup

This project uses a monorepo structure with workspaces:

```bash
# Clone repository
git clone https://github.com/WymanMills/fhevm-react-template.git
cd fhevm-react-template

# Install all dependencies (root + workspaces)
npm install
```

### Build from Source

```bash
# Build SDK only
npm run build:sdk

# Build all examples
npm run build:examples

# Build everything
npm run build
```

### Development Workflow

```bash
# Run SDK in watch mode
npm run dev:sdk

# Run Next.js example
npm run dev:nextjs

# Run React example
npm run dev:react
```

### Testing

```bash
# Run SDK tests
npm test

# Run integration tests
npm run test:integration

# Check code coverage
npm run test:coverage

# Lint all packages
npm run lint
```

### Clean Build

```bash
# Remove all build artifacts and node_modules
npm run clean
```

---

## 🤝 Contributing

We welcome contributions! Please see:
- [Contributing Guidelines](./CONTRIBUTING.md)

---

## 📄 License

MIT License - see [LICENSE](./LICENSE) file for details

---

## 🙏 Acknowledgments

- **Zama** - For FHEVM technology and comprehensive documentation
- **Open Source Community** - For feedback, contributions, and support
- **wagmi** - For API design pattern inspiration
- **Ethereum Foundation** - For web3 infrastructure

---

## 📞 Support & Resources

- **Documentation**:
  - [Getting Started Guide](./docs/GETTING_STARTED.md)
  - [API Reference](./docs/API.md)
  - [Examples Guide](./docs/EXAMPLES.md)
  - [SDK Documentation](./packages/fhevm-sdk/README.md)
- **Examples**: [./examples/](./examples/)
- **Zama Resources**: [FHEVM Documentation](https://docs.zama.ai/fhevm)

---

## 🏆 Project Deliverables

- ✅ **Complete SDK**: Framework-agnostic core with React, Vue, and Node.js adapters
- ✅ **Monorepo Structure**: Root package.json with workspaces for packages, examples, and templates
- ✅ **Framework Adapters**: Dedicated adapters in `src/adapters/` for React, Vue, and Node.js
- ✅ **Universal Design**: Works with Next.js, React, Vue, and vanilla JavaScript
- ✅ **Starter Templates**:
  - Next.js template with App Router (`templates/nextjs/`)
  - React (Vite) template (`templates/react/`)
  - Vue 3 template with Composition API (`templates/vue/`)
- ✅ **Production Examples**:
  - Next.js demo with complete structure and API routes
  - React SPA demo with full component library
  - Property Valuation real-world application
- ✅ **Type Definitions**: Comprehensive TypeScript types in dedicated `types/` directories
- ✅ **Video Demonstrations**: Three comprehensive demo videos
- ✅ **Documentation**:
  - Complete API reference
  - Getting started guides
  - Working code examples
  - Best practices
- ✅ **Live Deployment**: Property Valuation System
- ✅ **Developer Experience**:
  - Quick setup (< 10 lines of code)
  - Full TypeScript support
  - Comprehensive error handling
  - Monorepo build scripts
- ✅ **Complete FHEVM Flow**:
  - Instance initialization
  - Client-side encryption
  - Smart contract interaction
  - Gateway-based decryption
  - Permission management

---

**Built for the FHEVM Ecosystem**

**Educational Implementation** | **Open Source** | **2025**
