# Confidential Property Valuation System

A privacy-preserving real estate assessment platform built with React and FHEVM (Fully Homomorphic Encryption Virtual Machine).

## Features

- **Property Registration**: Register properties with encrypted sensitive details
- **Valuation Submission**: Authorized valuators can submit encrypted property valuations
- **Privacy-Preserving**: All sensitive data is protected using FHE encryption
- **Decentralized**: Built on Ethereum blockchain with smart contracts
- **User-Friendly**: Modern React interface with real-time updates

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Blockchain**: Ethereum (Sepolia Testnet)
- **Web3**: Ethers.js v6
- **Encryption**: FHEVM SDK for fully homomorphic encryption

## Prerequisites

- Node.js >= 18.0.0
- MetaMask browser extension
- Sepolia testnet ETH

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

The application will be available at `http://localhost:3002`

## Build

```bash
npm run build
```

## Contract

The application interacts with a deployed smart contract on Sepolia testnet:

- **Contract Address**: `0x3836e3A8DF48cdcd2b10E0f81Cd88A49A0bDB691`
- **Network**: Sepolia (Chain ID: 11155111)

## Usage

1. **Connect Wallet**: Click "Connect MetaMask Wallet" to connect your wallet
2. **Switch Network**: If not on Sepolia, click "Switch to Sepolia"
3. **Register Property**: Fill in property details and submit
4. **Submit Valuation**: Authorized valuators can submit property valuations
5. **View Properties**: Load and view your registered properties
6. **Manage Valuations**: Request reveals and view average valuations
7. **Admin Functions**: Contract owner can authorize/revoke valuators

## Security

All sensitive property and valuation data is encrypted using FHEVM technology, ensuring privacy while maintaining the ability to perform computations on encrypted data.

## License

MIT
