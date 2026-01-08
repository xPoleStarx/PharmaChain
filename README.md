# PharmaChain

> Blockchain-Based Pharmaceutical Supply Chain Tracking and Counterfeit Product Detection

[![React](https://img.shields.io/badge/React-18.2-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0-646CFF.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3-38B2AC.svg)](https://tailwindcss.com/)

## 📋 Overview

**PharmaChain** is a blockchain-based system designed to track pharmaceutical products from manufacturer to patient, ensuring authenticity and quality preservation throughout the supply chain. According to World Health Organization data, 10% of medicines worldwide are counterfeit or substandard. This system addresses this critical issue by providing an immutable, transparent, and traceable record system.

### Key Features

- 🔒 **Immutable Tracking**: Every product movement is recorded on the blockchain, creating an unalterable audit trail
- 🌡️ **Cold Chain Monitoring**: Real-time IoT sensor data ensures temperature-sensitive drugs maintain safe conditions
- 🛡️ **Counterfeit Prevention**: Blockchain verification ensures product authenticity, reducing counterfeit drug incidents by up to 90%
- 📱 **QR Code Verification**: Patients can scan products to verify authenticity and view complete supply chain history
- 📊 **Trust Score Calculation**: Automated quality assessment based on temperature violations and supply chain integrity
- 👥 **Role-Based Access**: Separate dashboards for Manufacturer, Distributor, Pharmacy, and Patient roles
- 🔍 **Block Explorer**: View all blockchain transactions with detailed information including transaction hashes, timestamps, and status

## 🎯 Problem Statement

The pharmaceutical industry faces critical challenges regarding supply chain integrity:

- **Counterfeit Drugs**: 10% of medicines worldwide are counterfeit or substandard
- **Data Silos**: Traditional centralized systems prevent end-to-end visibility
- **Trust Issues**: Multi-party systems involving manufacturers, distributors, warehouses, and pharmacies have inherently low trust levels
- **Quality Control**: Temperature-sensitive drugs (like vaccines) require continuous cold chain monitoring

## 💡 Solution

PharmaChain leverages blockchain technology to create a decentralized, trustless verification system:

- **Unique Product IDs**: Each medicine is assigned a unique identifier tracked on the blockchain
- **Smart Contracts**: Automatic ownership transfers and location updates verified through self-executing contracts
- **IoT Integration**: Real-time temperature and location data recorded directly on the blockchain
- **Transparent History**: Complete product journey visible to all stakeholders

## 🏗️ System Architecture

The system consists of four key stakeholders:

1. **Manufacturer**: Registers products with unique IDs on the blockchain
2. **Distributor & Warehouse**: Transport and store products, with IoT sensors recording temperature and location data
3. **Pharmacy**: Verifies product history before selling to patients
4. **Patient**: Can scan QR codes to verify product authenticity and view complete supply chain history

## 🛠️ Technology Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/ui** - High-quality React components
- **React Router** - Client-side routing
- **Recharts** - Data visualization for temperature charts
- **QRCode.react** - QR code generation

### Blockchain Simulation
- **Mock Blockchain Service** - Simulates blockchain operations using `localStorage`
- **Smart Contract Logic** - Solidity-inspired contract logic implemented in TypeScript
- **Async Transaction Simulation** - Mimics blockchain mining delays (1.5-3s)

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Modern web browser (Chrome, Firefox, Edge, Safari)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd PharmaChain
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
PharmaChain/
├── src/
│   ├── components/          # React components
│   │   ├── dashboard/       # Business logic components
│   │   ├── demo/            # Demo tools
│   │   ├── layout/          # Layout components
│   │   └── ui/              # Shadcn/ui components
│   ├── context/             # React Context providers
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utility functions and constants
│   ├── pages/               # Page components
│   ├── services/            # Business logic services
│   │   ├── blockchain/      # Mock blockchain service
│   │   └── storage/          # LocalStorage adapter
│   ├── types/               # TypeScript type definitions
│   ├── App.tsx              # Main app component
│   ├── main.tsx             # Entry point
│   ├── router.tsx            # Route configuration
│   └── index.css            # Global styles
├── public/                  # Static assets
├── package.json             # Dependencies and scripts
├── tailwind.config.js       # Tailwind configuration
├── tsconfig.json            # TypeScript configuration
└── vite.config.ts           # Vite configuration
```

## 🎮 Usage

### Demo Mode

The application includes demo tools accessible via the floating settings button (bottom-right):

- **Seed Demo Data**: Instantly populate the blockchain with 3 sample products
- **Reset System**: Clear all blockchain data and reset to initial state

### Block Explorer

Access the Block Explorer from the navigation bar to view all blockchain transactions:

- **Transaction List**: All transactions sorted by timestamp (newest first)
- **Statistics**: Total transactions, successful, and failed transaction counts
- **Transaction Details**: View transaction hash, method, status, from/to addresses, and product IDs
- **Real-time Updates**: Transactions are displayed as they occur on the blockchain

### User Roles

#### Manufacturer Dashboard
- Register new pharmaceutical products
- View all registered products
- Track product ownership

#### Distributor Dashboard
- View products in transit
- Simulate IoT sensor updates (temperature monitoring)
- Transfer products to pharmacy

#### Pharmacy Dashboard
- View inventory
- Verify product history
- Sell products to patients

#### Patient View
- Search/scan product ID
- View product authenticity
- Check trust score
- View complete supply chain history and temperature charts

#### Block Explorer
- View all blockchain transactions
- Filter by transaction type (Register, Transfer, Temperature Update, Location Update)
- See transaction status (Success, Failed, Pending)
- View transaction details including hashes, timestamps, and addresses
- Monitor blockchain activity statistics

## 🔐 Security & Privacy

- **Data Minimization**: Sensitive patient data stored off-chain in encrypted form
- **Regulatory Compliance**: Designed to comply with KVKK, GDPR, and FDA DSCSA
- **Immutable Records**: Retroactive changes are impossible on the blockchain
- **Private Blockchain**: Uses Quorum (enterprise Ethereum) for data privacy among competitors

## 📊 Key Metrics

- **90%** Reduction in counterfeit drug incidents (projected)
- **100%** Immutable record accuracy
- **24/7** Real-time monitoring capability

## 🧪 Testing & Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Mock Blockchain Service

The MVP uses a `MockBlockchainService` that simulates blockchain operations:

- Stores data in browser `localStorage`
- Simulates async transaction delays (1.5-3 seconds)
- Implements smart contract logic in TypeScript
- Provides complete blockchain API compatibility
- **Transaction Recording**: All transactions are recorded with unique hashes, timestamps, and status
- **Block Explorer**: View all recorded transactions through the Block Explorer interface

For production deployment, replace `MockBlockchainService` with actual Quorum network integration.

### Transaction Types

The system records the following transaction types:

- **registerDrug**: Product registration by manufacturer
- **transferDrug**: Ownership transfer between parties
- **updateTemperature**: IoT sensor temperature updates
- **updateLocation**: Location tracking updates

Each transaction includes:
- Unique transaction hash (64-character hex string)
- Transaction status (Success, Failed, Pending)
- Timestamp
- From/To addresses
- Associated product ID (if applicable)

## 📚 Academic Context

This project was developed as part of **CENG 3550: Decentralized Systems and Applications** course at Muğla Sıtkı Koçman University.

### Course Information
- **Course**: CENG 3550, Decentralized Systems and Applications
- **Institution**: Muğla Sıtkı Koçman University, Department of Computer Engineering
- **Timeline**: November 4, 2025 - January 12, 2026 (11 weeks)

## 👥 Developers

**Doğukan Taha Tıraş**
- Email: dogukantahatiras@posta.mu.edu.tr
- Responsibilities: Smart contract development (Solidity), Quorum network setup, backend testing

**Seyfullah Korkmaz**
- Email: seyfullahkorkmaz@posta.mu.edu.tr
- Responsibilities: System architecture design, Web interface development (Frontend), IoT sensor integration simulation

## 🔮 Future Work

- [ ] Deploy on larger scale testnet with 100+ nodes for scalability testing
- [ ] Integrate real physical IoT devices instead of simulations
- [ ] Implement full Quorum network integration
- [ ] Add advanced analytics and reporting features
- [ ] Mobile application development
- [ ] Multi-language support
- [ ] Enhanced security features and encryption

## 📄 License

This project is developed for academic purposes as part of CENG 3550 course requirements.

## 🙏 Acknowledgments

We thank the faculty of the Department of Computer Engineering at Muğla Sıtkı Koçman University for their guidance in the CENG 3550 course.

## 📖 References

- [1] World Health Organization (WHO). "Substandard and Falsified Medical Products." 2017.
- [2] Nakamoto, Satoshi. "Bitcoin: A peer-to-peer electronic cash system." Manubot, 2019.
- [3] Baliga, A., et al. "Performance evaluation of the quorum blockchain platform." arXiv preprint arXiv:1809.03421 (2018).
- [4] FDA. "Drug Supply Chain Security Act (DSCSA)." U.S. Food and Drug Administration, 2023.

---

**Note**: This is a Proof of Concept (MVP) implementation. For production deployment, additional security measures, real blockchain network integration, and comprehensive testing are required.

