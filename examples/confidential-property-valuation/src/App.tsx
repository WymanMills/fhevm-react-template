import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { PropertyRegistration } from './components/PropertyRegistration'
import { ValuationSubmission } from './components/ValuationSubmission'
import { PropertiesList } from './components/PropertiesList'
import { ValuationManagement } from './components/ValuationManagement'
import { AdminPanel } from './components/AdminPanel'
import { CONTRACT_ADDRESS, CONTRACT_ABI } from './constants/contract'

function App() {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null)
  const [signer, setSigner] = useState<ethers.Signer | null>(null)
  const [contract, setContract] = useState<ethers.Contract | null>(null)
  const [userAddress, setUserAddress] = useState<string>('')
  const [connectionStatus, setConnectionStatus] = useState<{
    message: string
    isError: boolean
  }>({
    message: 'Not Connected',
    isError: false
  })
  const [showSwitchNetwork, setShowSwitchNetwork] = useState(false)

  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      const web3Provider = new ethers.BrowserProvider(window.ethereum)
      setProvider(web3Provider)
      setConnectionStatus({ message: 'MetaMask detected', isError: false })
    } else {
      setConnectionStatus({
        message: 'MetaMask not detected. Please install MetaMask.',
        isError: true
      })
    }

    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length === 0) {
          setConnectionStatus({
            message: 'Please connect to MetaMask',
            isError: true
          })
          setSigner(null)
          setContract(null)
          setUserAddress('')
        } else {
          connectWallet()
        }
      })

      window.ethereum.on('chainChanged', () => {
        window.location.reload()
      })
    }
  }, [])

  const connectWallet = async () => {
    if (!provider) return

    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' })
      const walletSigner = await provider.getSigner()
      const address = await walletSigner.getAddress()
      setSigner(walletSigner)
      setUserAddress(address)

      const network = await provider.getNetwork()
      const sepoliaChainId = 11155111n

      if (network.chainId !== sepoliaChainId) {
        setShowSwitchNetwork(true)
        setConnectionStatus({
          message: `Connected to ${address.substring(0, 6)}...${address.substring(38)} (Wrong network)`,
          isError: true
        })
      } else {
        const contractInstance = new ethers.Contract(
          CONTRACT_ADDRESS,
          CONTRACT_ABI,
          walletSigner
        )
        setContract(contractInstance)
        setConnectionStatus({
          message: `Connected to ${address.substring(0, 6)}...${address.substring(38)} on Sepolia`,
          isError: false
        })
        setShowSwitchNetwork(false)
      }
    } catch (error) {
      console.error('Connection failed:', error)
      setConnectionStatus({
        message: 'Failed to connect wallet',
        isError: true
      })
    }
  }

  const switchToSepolia = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0xaa36a7' }]
      })

      setTimeout(connectWallet, 1000)
      setShowSwitchNetwork(false)
    } catch (error) {
      console.error('Failed to switch network:', error)
      setConnectionStatus({
        message: 'Failed to switch to Sepolia network',
        isError: true
      })
    }
  }

  return (
    <div className="container">
      <div className="header">
        <h1>🏠 Confidential Property Valuation System</h1>
        <p>Privacy-Preserving Real Estate Assessment Platform</p>
      </div>

      <div className={`status-box ${connectionStatus.isError ? 'status-error' : 'status-connected'}`}>
        <strong>Connection Status:</strong> {connectionStatus.message}
      </div>

      <div className="card">
        <button
          className="btn"
          onClick={connectWallet}
          disabled={!!contract}
        >
          {contract ? 'Connected' : 'Connect MetaMask Wallet'}
        </button>
        {showSwitchNetwork && (
          <button className="btn btn-secondary" onClick={switchToSepolia}>
            Switch to Sepolia
          </button>
        )}
      </div>

      <div className="grid">
        <PropertyRegistration contract={contract} />
        <ValuationSubmission contract={contract} />
      </div>

      <div className="grid">
        <PropertiesList contract={contract} userAddress={userAddress} />
        <ValuationManagement contract={contract} />
      </div>

      <AdminPanel contract={contract} />
    </div>
  )
}

export default App
