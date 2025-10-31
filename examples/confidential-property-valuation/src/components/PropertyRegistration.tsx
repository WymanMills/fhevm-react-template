import { useState } from 'react'
import { ethers } from 'ethers'

interface PropertyRegistrationProps {
  contract: ethers.Contract | null
}

export function PropertyRegistration({ contract }: PropertyRegistrationProps) {
  const [formData, setFormData] = useState({
    area: '',
    bedrooms: '',
    bathrooms: '',
    yearBuilt: '',
    floorLevel: '',
    locationScore: ''
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

    const { area, bedrooms, bathrooms, yearBuilt, floorLevel, locationScore } = formData

    if (!area || !bedrooms || !bathrooms || !yearBuilt || !floorLevel || !locationScore) {
      alert('Please fill in all fields')
      return
    }

    try {
      setLoading(true)

      const tx = await contract.registerProperty(
        parseInt(area),
        parseInt(bedrooms),
        parseInt(bathrooms),
        parseInt(yearBuilt),
        parseInt(floorLevel),
        parseInt(locationScore)
      )

      const receipt = await tx.wait()

      const event = receipt.logs.find((log: any) => {
        try {
          const parsed = contract.interface.parseLog(log)
          return parsed?.name === 'PropertyRegistered'
        } catch {
          return false
        }
      })

      let propertyId = 'Unknown'
      if (event) {
        const parsed = contract.interface.parseLog(event)
        propertyId = parsed?.args.propertyId.toString()
      }

      alert(`Property registered successfully! Property ID: ${propertyId}`)

      setFormData({
        area: '',
        bedrooms: '',
        bathrooms: '',
        yearBuilt: '',
        floorLevel: '',
        locationScore: ''
      })
    } catch (error: any) {
      console.error('Registration failed:', error)
      alert(`Registration failed: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <h2 className="section-title">📝 Register Property</h2>
      <div className="info-text">
        Register your property with encrypted details. All sensitive information is protected using FHE encryption.
      </div>

      <div className="form-group">
        <label htmlFor="area">Area (square meters):</label>
        <input
          type="number"
          id="area"
          name="area"
          min="1"
          placeholder="e.g., 120"
          value={formData.area}
          onChange={handleChange}
        />
      </div>

      <div className="two-column">
        <div className="form-group">
          <label htmlFor="bedrooms">Bedrooms:</label>
          <input
            type="number"
            id="bedrooms"
            name="bedrooms"
            min="0"
            placeholder="e.g., 3"
            value={formData.bedrooms}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="bathrooms">Bathrooms:</label>
          <input
            type="number"
            id="bathrooms"
            name="bathrooms"
            min="0"
            placeholder="e.g., 2"
            value={formData.bathrooms}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="two-column">
        <div className="form-group">
          <label htmlFor="yearBuilt">Year Built:</label>
          <input
            type="number"
            id="yearBuilt"
            name="yearBuilt"
            min="1800"
            max="2024"
            placeholder="e.g., 2010"
            value={formData.yearBuilt}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="floorLevel">Floor Level:</label>
          <input
            type="number"
            id="floorLevel"
            name="floorLevel"
            min="0"
            placeholder="e.g., 5"
            value={formData.floorLevel}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="locationScore">Location Score (1-100):</label>
        <input
          type="number"
          id="locationScore"
          name="locationScore"
          min="1"
          max="100"
          placeholder="e.g., 85"
          value={formData.locationScore}
          onChange={handleChange}
        />
      </div>

      <button className="btn" onClick={handleSubmit} disabled={loading}>
        {loading ? 'Registering...' : 'Register Property'}
      </button>

      {loading && (
        <div className="loading show">
          <div className="spinner"></div>
          <p>Registering property on blockchain...</p>
        </div>
      )}
    </div>
  )
}
