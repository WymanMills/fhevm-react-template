import { useState } from 'react'
import { FhevmProvider, useFhevm, useEncrypt } from 'fhevm-sdk'

function EncryptionDemo() {
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
              {encryptedData}
            </div>
            <p style={{ fontSize: '0.875rem', marginTop: '1rem' }}>
              This encrypted data can now be safely sent to a smart contract
              where computations can be performed on the encrypted value without
              ever revealing the plaintext!
            </p>
          </div>
        )}
      </div>

      <div className="grid">
        <div className="card">
          <h2>🚀 Quick Setup</h2>
          <p>This entire app was built with less than 10 lines of setup code:</p>
          <div className="code">
{`import { FhevmProvider, useFhevm } from 'fhevm-sdk'

function App() {
  return (
    <FhevmProvider network="sepolia">
      <MyApp />
    </FhevmProvider>
  )
}

function MyApp() {
  const { encrypt } = useEncrypt()
  const encrypted = await encrypt(42, 'uint32')
}`}
          </div>
        </div>

        <div className="card">
          <h2>🔒 Privacy Guaranteed</h2>
          <p>Your data is encrypted client-side before leaving your browser:</p>
          <ul style={{ paddingLeft: '1.5rem', color: '#4a5568' }}>
            <li style={{ marginBottom: '0.5rem' }}>
              No plaintext ever sent to blockchain
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              Computations on encrypted data
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              Selective decryption via Gateway
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              Full privacy preservation
            </li>
          </ul>
        </div>
      </div>

      <div className="card">
        <h2>📚 Learn More</h2>
        <p>Explore the complete FHEVM SDK documentation and examples:</p>
        <div style={{ marginTop: '1rem' }}>
          <a
            href="https://github.com/your-username/fhevm-sdk"
            className="button"
            target="_blank"
            rel="noopener noreferrer"
          >
            View on GitHub
          </a>
          <a
            href="https://docs.zama.ai/fhevm"
            className="button"
            target="_blank"
            rel="noopener noreferrer"
          >
            FHEVM Documentation
          </a>
        </div>
      </div>
    </>
  )
}

function App() {
  return (
    <FhevmProvider network="sepolia">
      <div className="app">
        <h1>FHEVM SDK - React Demo</h1>
        <EncryptionDemo />
      </div>
    </FhevmProvider>
  )
}

export default App
