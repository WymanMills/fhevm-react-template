import { useState } from 'react'
import { ethers } from 'ethers'

interface AdminPanelProps {
  contract: ethers.Contract | null
}

export function AdminPanel({ contract }: AdminPanelProps) {
  const [valuatorAddress, setValuatorAddress] = useState('')
  const [loading, setLoading] = useState(false)

  const authorizeValuator = async () => {
    if (!contract) {
      alert('Please connect your wallet first')
      return
    }

    if (!valuatorAddress) {
      alert('Please enter a valuator address')
      return
    }

    try {
      setLoading(true)

      const tx = await contract.authorizeValuator(valuatorAddress)
      await tx.wait()

      alert('Valuator authorized successfully!')
      setValuatorAddress('')
    } catch (error: any) {
      console.error('Authorization failed:', error)
      alert(`Authorization failed: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const revokeValuator = async () => {
    if (!contract) {
      alert('Please connect your wallet first')
      return
    }

    if (!valuatorAddress) {
      alert('Please enter a valuator address')
      return
    }

    try {
      setLoading(true)

      const tx = await contract.revokeValuator(valuatorAddress)
      await tx.wait()

      alert('Valuator revoked successfully!')
      setValuatorAddress('')
    } catch (error: any) {
      console.error('Revocation failed:', error)
      alert(`Revocation failed: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <h2 className="section-title">⚙️ Admin Functions</h2>
      <div className="info-text">
        Contract owner can manage valuator authorizations.
      </div>

      <div className="form-group">
        <label htmlFor="valuatorAddress">Valuator Address:</label>
        <input
          type="text"
          id="valuatorAddress"
          placeholder="0x..."
          value={valuatorAddress}
          onChange={(e) => setValuatorAddress(e.target.value)}
        />
      </div>

      <button className="btn" onClick={authorizeValuator} disabled={loading}>
        {loading ? 'Processing...' : 'Authorize Valuator'}
      </button>
      <button className="btn btn-secondary" onClick={revokeValuator} disabled={loading}>
        {loading ? 'Processing...' : 'Revoke Valuator'}
      </button>

      {loading && (
        <div className="loading show">
          <div className="spinner"></div>
          <p>Processing admin action...</p>
        </div>
      )}
    </div>
  )
}
