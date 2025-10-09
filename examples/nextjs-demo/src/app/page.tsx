'use client'

import { useState } from 'react'
import { useFhevm, useEncrypt } from 'fhevm-sdk'
import { Providers } from './providers'

function DemoContent() {
  const { instance, ready, error, loading } = useFhevm()
  const { encrypt, encrypting } = useEncrypt()

  const [inputValue, setInputValue] = useState('')
  const [encryptedData, setEncryptedData] = useState<string | null>(null)

  const handleEncrypt = async () => {
    if (!inputValue) return

    try {
      const value = parseInt(inputValue)
      if (isNaN(value)) {
        alert('Please enter a valid number')
        return
      }

      const encrypted = await encrypt(value, 'uint32')

      // Convert Uint8Array to hex string
      const hex = '0x' + Array.from(encrypted.data)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('')

      setEncryptedData(hex)
    } catch (err) {
      console.error('Encryption failed:', err)
      alert(`Encryption failed: ${err}`)
    }
  }

  if (loading) {
    return (
      <div className="status loading">
        <h3>Initializing FHEVM SDK...</h3>
        <p>Please wait while we set up the encryption instance.</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="status error">
        <h3>Initialization Error</h3>
        <p>{error.message}</p>
      </div>
    )
  }

  if (!ready) {
    return (
      <div className="status info">
        <h3>FHEVM Instance Not Ready</h3>
        <p>Waiting for instance to be ready...</p>
      </div>
    )
  }

  return (
    <>
      <div className="status success">
        <h3>✓ FHEVM SDK Ready!</h3>
        <p>Instance initialized on Sepolia testnet</p>
        <div className="badge success">Network: {instance?.config.name}</div>
        <div className="badge primary">Chain ID: {instance?.config.chainId}</div>
      </div>

      <div className="card">
        <h2>Encrypt a Value</h2>
        <p>Enter a number to encrypt using FHEVM (Fully Homomorphic Encryption).</p>

        <input
          type="number"
          className="input"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter a number (e.g., 42)"
          disabled={encrypting}
        />

        <button
          className="button"
          onClick={handleEncrypt}
          disabled={encrypting || !inputValue}
        >
          {encrypting ? 'Encrypting...' : 'Encrypt Value'}
        </button>

        {encryptedData && (
          <div className="status success">
            <h3>Encrypted Result</h3>
            <div className="code">
              <strong>Input:</strong> {inputValue}<br />
              <strong>Type:</strong> uint32<br />
              <strong>Encrypted Data:</strong><br />
              <small style={{ wordBreak: 'break-all' }}>{encryptedData}</small>
            </div>
            <p style={{ fontSize: '0.875rem', marginTop: '1rem' }}>
              This encrypted data can now be safely sent to a smart contract
              where computations can be performed on the encrypted value without
              ever revealing the plaintext!
            </p>
          </div>
        )}
      </div>

      <div className="card">
        <h2>How It Works</h2>
        <p>This demo shows the FHEVM SDK in action:</p>
        <ol style={{ paddingLeft: '1.5rem', color: '#4a5568' }}>
          <li style={{ marginBottom: '0.5rem' }}>
            <strong>Initialization:</strong> The SDK automatically creates an FHEVM
            instance when the app loads
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            <strong>Encryption:</strong> Your input is encrypted client-side using
            fully homomorphic encryption
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            <strong>Smart Contract Usage:</strong> The encrypted data can be sent
            to smart contracts for private computations
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            <strong>Decryption:</strong> Results can be decrypted via the Gateway
            (see full example in Property Valuation app)
          </li>
        </ol>
      </div>

      <div className="card">
        <h2>Code Example</h2>
        <p>This entire demo was built with less than 10 lines of setup:</p>
        <div className="code">
{`import { FhevmProvider, useFhevm, useEncrypt } from 'fhevm-sdk'

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

  const encrypted = await encrypt(42, 'uint32')
  // Use encrypted.data with your contract!
}`}
        </div>
      </div>
    </>
  )
}

export default function Home() {
  return (
    <Providers>
      <div className="container">
        <h1>FHEVM SDK - Next.js Demo</h1>
        <DemoContent />
      </div>
    </Providers>
  )
}
