import { useState } from 'react'
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { useFhevm, useEncrypt } from 'fhevm-sdk'
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../contract'

interface Props {
  showToast: (message: string, type?: 'success' | 'error') => void
}

export default function RegisterPropertyForm({ showToast }: Props) {
  const { address } = useAccount()
  const { ready: fhevmReady } = useFhevm()
  const { encrypt, encrypting } = useEncrypt()

  const [area, setArea] = useState('')
  const [bedrooms, setBedrooms] = useState('')
  const [bathrooms, setBathrooms] = useState('')
  const [yearBuilt, setYearBuilt] = useState('')
  const [floorLevel, setFloorLevel] = useState('')
  const [locationScore, setLocationScore] = useState('')

  const { writeContract, data: hash, isPending, error } = useWriteContract()
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!address) {
      showToast('Please connect your wallet first', 'error')
      return
    }

    if (!fhevmReady) {
      showToast('FHEVM is not ready yet, please wait...', 'error')
      return
    }

    try {
      // Encrypt all property values using FHEVM SDK
      showToast('Encrypting property data...', 'success')

      const encryptedArea = await encrypt(parseInt(area), 'uint32')
      const encryptedBedrooms = await encrypt(parseInt(bedrooms), 'uint32')
      const encryptedBathrooms = await encrypt(parseInt(bathrooms), 'uint32')
      const encryptedYearBuilt = await encrypt(parseInt(yearBuilt), 'uint32')
      const encryptedFloorLevel = await encrypt(parseInt(floorLevel), 'uint32')
      const encryptedLocationScore = await encrypt(parseInt(locationScore), 'uint32')

      showToast('Submitting encrypted property to blockchain...', 'success')

      writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'registerProperty',
        args: [
          encryptedArea.data,
          encryptedBedrooms.data,
          encryptedBathrooms.data,
          encryptedYearBuilt.data,
          encryptedFloorLevel.data,
          encryptedLocationScore.data,
        ],
      })
    } catch (err: any) {
      showToast(err.message || 'Failed to register property', 'error')
    }
  }

  if (hash && !isConfirming && !error) {
    showToast(`Property registered! Transaction: ${hash.substring(0, 10)}...`)
    // Reset form
    setArea('')
    setBedrooms('')
    setBathrooms('')
    setYearBuilt('')
    setFloorLevel('')
    setLocationScore('')
  }

  return (
    <div className="glass-card">
      <h2 className="section-title">📝 Register Property</h2>
      <div className="info-text mb-4">
        Register your property with encrypted details. All sensitive information is protected using
        FHE encryption.
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-2">Area (square meters):</label>
          <input
            type="number"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            className="form-input"
            min="1"
            placeholder="e.g., 120"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Bedrooms:</label>
            <input
              type="number"
              value={bedrooms}
              onChange={(e) => setBedrooms(e.target.value)}
              className="form-input"
              min="0"
              placeholder="e.g., 3"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Bathrooms:</label>
            <input
              type="number"
              value={bathrooms}
              onChange={(e) => setBathrooms(e.target.value)}
              className="form-input"
              min="0"
              placeholder="e.g., 2"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Year Built:</label>
            <input
              type="number"
              value={yearBuilt}
              onChange={(e) => setYearBuilt(e.target.value)}
              className="form-input"
              min="1800"
              max="2024"
              placeholder="e.g., 2010"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Floor Level:</label>
            <input
              type="number"
              value={floorLevel}
              onChange={(e) => setFloorLevel(e.target.value)}
              className="form-input"
              min="0"
              placeholder="e.g., 5"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Location Score (1-100):</label>
          <input
            type="number"
            value={locationScore}
            onChange={(e) => setLocationScore(e.target.value)}
            className="form-input"
            min="1"
            max="100"
            placeholder="e.g., 85"
            required
          />
        </div>

        <button
          type="submit"
          disabled={!address || !fhevmReady || isPending || isConfirming || encrypting}
          className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {encrypting
            ? 'Encrypting...'
            : isPending || isConfirming
            ? 'Registering...'
            : !fhevmReady
            ? 'Initializing FHEVM...'
            : 'Register Property'}
        </button>

        {error && <div className="text-error text-sm">Error: {error.message}</div>}
      </form>
    </div>
  )
}
