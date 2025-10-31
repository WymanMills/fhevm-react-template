import { useState } from 'react'
import { ethers } from 'ethers'

interface PropertiesListProps {
  contract: ethers.Contract | null
  userAddress: string
}

export function PropertiesList({ contract, userAddress }: PropertiesListProps) {
  const [properties, setProperties] = useState<bigint[]>([])
  const [loading, setLoading] = useState(false)

  const loadProperties = async () => {
    if (!contract || !userAddress) {
      alert('Please connect your wallet first')
      return
    }

    try {
      setLoading(true)

      const propertyIds = await contract.getOwnerProperties(userAddress)
      setProperties(propertyIds)
    } catch (error: any) {
      console.error('Failed to load properties:', error)
      alert(`Failed to load properties: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <h2 className="section-title">📊 View Properties</h2>
      <div className="info-text">
        View properties you own and their valuation history.
      </div>

      <button className="btn" onClick={loadProperties} disabled={loading}>
        {loading ? 'Loading...' : 'Load My Properties'}
      </button>

      {loading && (
        <div className="loading show">
          <div className="spinner"></div>
          <p>Loading properties...</p>
        </div>
      )}

      <div>
        {properties.length === 0 && !loading && (
          <div className="info-text">No properties found.</div>
        )}

        {properties.map((propertyId) => (
          <div key={propertyId.toString()} className="property-item">
            <h4>Property #{propertyId.toString()}</h4>
            <p>Property registered on blockchain</p>
            <p><strong>Owner:</strong> You</p>
          </div>
        ))}
      </div>
    </div>
  )
}
