# PharmaChain Quick Start Guide

This guide will help you set up and run the PharmaChain project in a local development environment with real blockchain integration.

## 1. Prerequisites
*   **Node.js**: Version 18.x or higher.
*   **MetaMask**: Browser extension installed.

## 2. Installation
Clone the repository and install the dependencies:
```bash
npm install
```

## 3. Blockchain Setup (Terminal 1)
Start the local Hardhat network. This terminal will act as your local blockchain.
```bash
npx hardhat node
```
**Important:** Keep this terminal open while using the application.

## 4. Contract Deployment (Terminal 2)
In a new terminal, deploy the smart contracts to your local network:
```bash
npx hardhat run scripts/deploy.cjs --network localhost
```
After execution, look for the **Contract address** in the output. Copy it for the next step.

## 5. Environment Configuration
Create a `.env` file in the root directory:
```bash
# Required variables for Real Blockchain mode
VITE_USE_REAL_BLOCKCHAIN=true
VITE_CONTRACT_ADDRESS=0x... # Paste your deployed contract address here
VITE_PROVIDER_URL=http://127.0.0.1:8545
```

## 6. MetaMask Configuration
To interact with the app, you must connect MetaMask to your local network:

1.  **Add Network**:
    *   Network Name: `Hardhat Local`
    *   New RPC URL: `http://127.0.0.1:8545`
    *   Chain ID: `1337` (Some versions of Hardhat use `31337`)
    *   Currency Symbol: `ETH`
2.  **Import Account**:
    *   Go back to **Terminal 1** (`npx hardhat node`).
    *   Copy one of the **Private Keys** listed (e.g., Account #0).
    *   In MetaMask, select "Import Account" and paste the key.
3.  **Reset Account (If needed)**:
    *   If you see "Nonce too high" or "Transaction Underpriced" errors:
    *   In MetaMask: **Settings** > **Advanced** > **Clear activity tab data**.

## 7. Launch Application
Start the Vite development server:
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) (or the port shown in your terminal) and connect your imported MetaMask account.
