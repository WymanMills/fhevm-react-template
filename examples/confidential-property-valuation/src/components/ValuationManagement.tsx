import { useState } from 'react'
import { ethers } from 'ethers'

interface ValuationManagementProps {
  contract: ethers.Contract | null
}

interface AverageResult {
  hasRevealed: boolean
  averageValue: bigint
  averageConfidence: bigint
  valuationCount: bigint
}

export function ValuationManagement({ contract }: ValuationManagementProps) {
  const [valuationId, setValuationId] = useState('')
  const [propertyId, setPropertyId] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<AverageResult | null>(null)

  const requestReveal = async () => {
    if (!contract) {
      alert('Please connect your wallet first')
      return
    }

    if (!valuationId) {
      alert('Please enter a valuation ID')
      return
    }

    try {
      setLoading(true)

      const tx = await contract.requestValuationReveal(parseInt(valuationId))
      await tx.wait()

      alert('Valuation reveal requested successfully!')
      setValuationId('')
    } catch (error: any) {
      console.error('Reveal request failed:', error)
      alert(`Reveal request failed: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const getAverage = async () => {
    if (!contract) {
      alert('Please connect your wallet first')
      return
    }

    if (!propertyId) {
      alert('Please enter a property ID')
      return
    }

    try {
      setLoading(true)

      const data = await contract.calculateAverageValuation(parseInt(propertyId))
      setResult({
        hasRevealed: data[0],
        averageValue: data[1],
        averageConfidence: data[2],
        valuationCount: data[3]
      })
    } catch (error: any) {
      console.error('Failed to get average valuation:', error)
      alert(`Failed to get average valuation: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <h2 className="section-title">🔍 Valuation Management</h2>
      <div className="info-text">
        Request revelation of valuations and view average estimates.
      </div>

      <div className="form-group">
        <label htmlFor="valuationId">Valuation ID:</label>
        <input
          type="number"
          id="valuationId"
          min="1"
          placeholder="e.g., 1"
          value={valuationId}
          onChange={(e) => setValuationId(e.target.value)}
        />
      </div>

      <button className="btn" onClick={requestReveal} disabled={loading}>
        {loading ? 'Processing...' : 'Request Valuation Reveal'}
      </button>

      <div className="form-group" style={{ marginTop: '30px' }}>
        <label htmlFor="propertyId">Property ID for Average:</label>
        <input
          type="number"
          id="propertyId"
          min="1"
          placeholder="e.g., 1"
          value={propertyId}
          onChange={(e) => setPropertyId(e.target.value)}
        />
      </div>

      <button className="btn" onClick={getAverage} disabled={loading}>
        {loading ? 'Processing...' : 'Get Average Valuation'}
      </button>

      {loading && (
        <div className="loading show">
          <div className="spinner"></div>
          <p>Processing request...</p>
        </div>
      )}

      {result && (
        <div>
          {result.hasRevealed ? (
            <div className="valuation-item">
              <h4>Average Valuation for Property #{propertyId}</h4>
              <p><strong>Average Value:</strong> ${result.averageValue.toString()}</p>
              <p><strong>Average Confidence:</strong> {result.averageConfidence.toString()}%</p>
              <p><strong>Number of Valuations:</strong> {result.valuationCount.toString()}</p>
            </div>
          ) : (
            <div className="info-text">
              No revealed valuations found for property #{propertyId}.
              Total valuations: {result.valuationCount.toString()}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
