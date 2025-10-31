import { useState } from 'react'
import { FhevmProvider, useFhevm, useEncrypt } from 'fhevm-sdk'

function EncryptionDemo() {
  const { ready, loading, error } = useFhevm()
  const { encrypt, encrypting } = useEncrypt()
  const [value, setValue] = useState('')
  const [result, setResult] = useState<string>('')

  const handleEncrypt = async () => {
    try {
      const encrypted = await encrypt(parseInt(value), 'uint32')
      const hex = '0x' + Array.from(encrypted.data)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('')
      setResult(hex)
    } catch (err) {
      console.error('Encryption failed:', err)
    }
  }

  if (loading) return <div className="container">Loading FHEVM...</div>
  if (error) return <div className="container">Error: {error.message}</div>

  return (
    <div className="container">
      <h1>FHEVM React Template</h1>
      <p>Status: {ready ? '✅ Ready' : '⏳ Initializing...'}</p>

      <div className="card">
        <h2>Encrypt a Value</h2>
        <input
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter a number"
          className="input"
        />
        <button
          onClick={handleEncrypt}
          disabled={!ready || encrypting || !value}
          className="button"
        >
          {encrypting ? 'Encrypting...' : 'Encrypt'}
        </button>

        {result && (
          <div className="result">
            <strong>Encrypted:</strong>
            <code>{result}</code>
          </div>
        )}
      </div>
    </div>
  )
}

function App() {
  return (
    <FhevmProvider network="sepolia">
      <EncryptionDemo />
    </FhevmProvider>
  )
}

export default App
