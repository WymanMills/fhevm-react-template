import { useState } from 'react'
import { ethers } from 'ethers'

interface ValuationSubmissionProps {
  contract: ethers.Contract | null
}

export function ValuationSubmission({ contract }: ValuationSubmissionProps) {
  const [formData, setFormData] = useState({
    propertyId: '',
    amount: '',
    confidence: ''
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async () => {
    if (!contract) {
      alert('Please connect your wallet first')
      return
    }

    const { propertyId, amount, confidence } = formData

    if (!propertyId || !amount || !confidence) {
      alert('Please fill in all fields')
      return
    }

    try {
      setLoading(true)

      const tx = await contract.submitValuation(
        parseInt(propertyId),
        parseInt(amount),
        parseInt(confidence)
      )

      const receipt = await tx.wait()

      const event = receipt.logs.find((log: any) => {
        try {
          const parsed = contract.interface.parseLog(log)
          return parsed?.name === 'ValuationSubmitted'
        } catch {
          return false
        }
      })

      let valuationId = 'Unknown'
      if (event) {
        const parsed = contract.interface.parseLog(event)
        valuationId = parsed?.args.valuationId.toString()
      }

      alert(`Valuation submitted successfully! Valuation ID: ${valuationId}`)

      setFormData({
        propertyId: '',
        amount: '',
        confidence: ''
      })
    } catch (error: any) {
      console.error('Valuation submission failed:', error)
      alert(`Valuation submission failed: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <h2 className="section-title">💰 Submit Valuation</h2>
      <div className="info-text">
        Authorized valuators can submit encrypted property valuations.
      </div>

      <div className="form-group">
        <label htmlFor="propertyId">Property ID:</label>
        <input
          type="number"
          id="propertyId"
          name="propertyId"
          min="1"
          placeholder="e.g., 1"
          value={formData.propertyId}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="amount">Estimated Value (USD):</label>
        <input
          type="number"
          id="amount"
          name="amount"
          min="1"
          placeholder="e.g., 500000"
          value={formData.amount}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="confidence">Confidence Score (1-100):</label>
        <input
          type="number"
          id="confidence"
          name="confidence"
          min="1"
          max="100"
          placeholder="e.g., 90"
          value={formData.confidence}
          onChange={handleChange}
        />
      </div>

      <button className="btn" onClick={handleSubmit} disabled={loading}>
        {loading ? 'Submitting...' : 'Submit Valuation'}
      </button>

      {loading && (
        <div className="loading show">
          <div className="spinner"></div>
          <p>Submitting encrypted valuation...</p>
        </div>
      )}
    </div>
  )
}
