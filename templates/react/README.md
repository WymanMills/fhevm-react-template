# FHEVM React Template

A minimal React (Vite) starter template for building confidential applications with FHEVM SDK.

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

- React 18 with Vite
- FHEVM SDK integration
- TypeScript support
- Fast refresh with HMR
- Ready-to-use FHEVM Provider setup
- Example encryption/decryption components

## Usage

1. Wrap your app with `FhevmProvider`:

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

2. Use FHEVM hooks in your components:

```tsx
import { useFhevm, useEncrypt } from 'fhevm-sdk'

function MyComponent() {
  const { ready } = useFhevm()
  const { encrypt } = useEncrypt()

  const handleEncrypt = async () => {
    const encrypted = await encrypt(42, 'uint32')
    // Use encrypted data with your contract
  }

  return <button onClick={handleEncrypt}>Encrypt</button>
}
```

## Documentation

- [FHEVM SDK Documentation](../../packages/fhevm-sdk/README.md)
- [Getting Started Guide](../../docs/GETTING_STARTED.md)
- [API Reference](../../docs/API.md)
- [Examples](../../examples/)

## License

MIT
