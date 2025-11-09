# ArtChain: Collaborative Digital Art Platform on Stellar Blockchain

ArtChain is a collaborative digital art platform built on the Stellar blockchain where artists worldwide can co-create artwork in real-time, mint their creations as NFTs, and sell them on an integrated marketplace.

## Project Overview and Problem Statement

Traditional digital art marketplaces fail to provide robust collaboration tools that allow multiple artists to work on a single piece while maintaining transparent attribution and fair revenue distribution. ArtChain addresses this by:

1. Enabling real-time collaborative art creation
2. Implementing blockchain-backed ownership and provenance tracking
3. Automating revenue distribution among contributors through smart contracts
4. Creating a transparent marketplace for NFT trading
5. Building a community feedback system for artwork valuation

## Technical Architecture

ArtChain is built as a full-stack JavaScript application with the following components:

### Architecture Diagram

The diagram below gives a high-level view of how the main pieces of ArtChain interact: the React client (browser), wallet providers, the Node.js backend (REST API + WebSocket collaboration server), storage, the Stellar network (Horizon), and external DeFi services like Blend Capital.

```mermaid
flowchart LR
  %% Client side
  subgraph CLIENT[Client (browser)]
    B["Browser / React + TypeScript"]
    W["Wallets<br/>(Freighter, xBull, Rabet, Albedo, WalletConnect)"]
  end

  %% Server side
  subgraph SERVER[Server]
    API["Node.js / Express API"]
    WS["WebSocket Collaboration Server"]
    S["Storage<br/>(in-memory, optional IPFS / S3)"]
  end

  %% Blockchain and external
  subgraph BLOCKCHAIN[Blockchain & External Services]
    ST["Stellar Network (Horizon)<br/>Testnet / Mainnet"]
    BL["Blend Capital (DeFi)<br/>External Protocols & Services"]
  end

  %% Flows
  B -->|HTTP / REST| API
  B -->|WebSocket (real-time collaboration)| WS
  B -->|Connect & Sign| W
  W -->|Signed transactions| API
  API -->|Stellar SDK / Horizon| ST
  API -->|Read / write| S
  WS -->|Sync / presence| API
  API -->|Integrate| BL
  ST -->|Events / confirmations| API

  %% Optional external storage
  S -->|optional| IPFS["IPFS / Object Storage"]

  classDef infra fill:#f9f,stroke:#333,stroke-width:1px;
  class SERVER,BLOCKCHAIN,CLIENT infra
````

> Note: this diagram focuses on the high-level data and message flows. Implementation details (for example which exact storage engine is used) are described elsewhere in this README and in the codebase (`client/src/lib/stellar.ts`, `server/*.ts`, `client/src/lib/blend.ts`).

## System Architecture

### High-Level Architecture Overview

```mermaid
graph TB
  subgraph "Frontend Layer"
    UI["React + Vite UI<br/>(Canvas, Studio, Marketplace)"]
    WALLET["Wallet Modal<br/>(Freighter, xBull, Rabet, Albedo, WalletConnect)"]
    CANVAS["Realtime Canvas<br/>(client/src/hooks/use-canvas.ts)"]
  end

  subgraph "Backend Layer"
    API["Node.js + Express API<br/>(server/index.ts, routes.ts)"]
    WS["WebSocket Collaboration Server<br/>(realtime sync)"]
    STORAGE["In-memory Storage<br/>(server/storage.ts)<br/>(optional: IPFS / S3)"]
  end

  subgraph "Blockchain & DeFi Layer"
    STELLAR["Stellar Network (Horizon)<br/>(client/src/lib/stellar.ts)"]
    BLEND["Blend Capital (client/src/lib/blend.ts)"]
  end

  subgraph "External Services"
    IPFS["IPFS / Object Storage (optional)"]
    HORIZON["Horizon API"]
  end

  UI -->|HTTP / REST| API
  UI -->|WebSocket (realtime)| WS
  UI -->|Open wallet modal / connect| WALLET
  CANVAS -->|draw events| WS
  WALLET -->|signed tx| API
  API -->|Stellar SDK / Horizon| STELLAR
  API -->|Blend integration| BLEND
  API -->|read/write| STORAGE
  STORAGE -->|optional| IPFS
  STELLAR -->|events / confirmations| API

  style API fill:#10b981,stroke:#059669,stroke-width:2px,color:#fff
  style STELLAR fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#fff
  style BLEND fill:#6366f1,stroke:#4f46e5,stroke-width:2px,color:#fff
```

### Detailed Component Architecture

```
Client Browser
 - React + Vite (client/src/*)
 - UI: App.tsx, pages (studio, marketplace, profile)
 - Components: client/src/components/ (canvas, wallet-modal)

Client-side Realtime Layer
 - WebSocket connection for collaboration (WS server)
 - Hooks: use-canvas, use-wallet

Backend (Server)
 - Node.js + Express (server/index.ts, server/routes.ts)
 - WebSocket Collaboration Server (realtime sync)
 - In-memory storage + API endpoints (server/storage.ts)

Storage
 - in-memory (default)
 - optional: IPFS / S3 / CDN for large assets

Blockchain / DeFi
 - Stellar (Horizon SDK) — client/src/lib/stellar.ts
 - Blend Capital connector — client/src/lib/blend.ts

External Integrations
 - Wallet providers: Freighter, xBull, Albedo, Rabet, WalletConnect
 - Horizon API & Stellar Testnet/Mainnet
 - Optional: IPFS, S3, CDN for serving large assets
```

### Frontend (React + TypeScript)
- Real-time canvas for artwork creation
- Multi-wallet integration via Stellar Wallet Kit (Freighter, xBull, Albedo, WalletConnect, Rabet)
- NFT minting and marketplace interfaces
- Profile management and collaboration tools
- DeFi integration with Blend Capital protocol

### Backend (Node.js + Express)
- In-memory storage for application data
- WebSocket server for real-time collaboration
- API endpoints for artwork, users, and NFTs
- Integration with Stellar blockchain

### Blockchain (Stellar)
- Smart contracts for NFT minting and ownership
- Revenue splitting functionality for collaborators
- Security and identity verification
- Testnet deployment for reduced transaction costs

## Stellar Integration Details

### Key Files for Stellar Implementation

The main Stellar integration code is contained in the following files:

1. **`client/src/lib/stellar.ts`**: Primary interface with Stellar SDK
   - Initializes connection to Stellar Testnet
   - Implements NFT minting operations
   - Handles transaction creation and submission
   - Manages revenue splitting functionality
   - Retrieves account details from the blockchain

2. **`client/src/lib/wallet-kit.ts`**: Stellar Wallet Kit integration
   - Unified API for all supported Stellar wallets
   - Wallet selection modal with automatic detection
   - Transaction signing across different wallet types
   - Network configuration management
   - Support for Freighter, xBull, Albedo, WalletConnect, and Rabet

3. **`client/src/lib/wallet.ts`**: Wallet utility functions
   - Address formatting and display utilities
   - Legacy wallet integration helpers
   - Transaction submission to Stellar network

4. **`client/src/hooks/use-wallet.ts`**: React hook for wallet state management
   - Multi-wallet connection support via Stellar Wallet Kit
   - Wallet addresses and display formatting
   - Connection/disconnection events
   - Persistent wallet state between sessions
   - Real-time wallet availability detection

5. **`client/src/components/ui/wallet-modal.tsx`**: Wallet selection UI
   - Custom-styled modal for all supported wallets
   - Automatic wallet detection and availability status
   - Responsive design with cyberpunk theme
   - One-click connection for any supported wallet

### Stellar Smart Contract Capabilities

ArtChain implements Stellar's smart contract capabilities through:

1. **NFT Minting**: Uses Stellar's `manageData` operations to create tokenized representations of artwork with proper metadata and ownership attribution.

2. **Ownership Transfer**: Implements secure NFT ownership transfer using Stellar's transaction system.

3. **Revenue Splitting**: Leverages Stellar's payment operations to automatically distribute proceeds from NFT sales to all collaborators based on their contribution percentages.

4. **Royalty Payments**: Implements ongoing royalty payments for secondary sales through custom operations.

## Deployment Information

### Stellar Testnet Deployment

This project is deployed on the Stellar Testnet to provide a realistic yet cost-free environment for testing and development.

- **Network**: Stellar Testnet
- **Deployed Contract Address**: `GBTA4QM67MZTTGHXOHQYKY7QNJKRHA2C7MYIB2DBIKVFHVWCBHTE4W25`
- **Transaction Hash**: `6a5347404e68acfedae7e1bc51ea1efb95cbf1dbf419a89ff50ab2312f9df71b`
- **[View on Stellar Expert](https://testnet.stellar.expert/explorer/testnet/account/GBTA4QM67MZTTGHXOHQYKY7QNJKRHA2C7MYIB2DBIKVFHVWCBHTE4W25)**: View the contract on Stellar Testnet Explorer
- **[View Transaction](https://testnet.stellar.expert/explorer/testnet/tx/6a5347404e68acfedae7e1bc51ea1efb95cbf1dbf419a89ff50ab2312f9df71b)**: View the deployment transaction

### Stellar Developer Tools Integration

- **Stellar SDK**: Used for all blockchain interactions
- **Stellar Wallet Kit**: Unified wallet integration supporting all major Stellar wallets
  - Freighter (browser extension)
  - xBull (PWA & extension)
  - Albedo (web wallet)
  - WalletConnect v2 (mobile wallets like Lobstr)
  - Rabet (browser extension)
- **Horizon API**: Utilized for account and transaction data
- **Stellar Laboratory**: Used for testing and transaction inspection
- **Scaffold Stellar**: Applied best practices for dApp development architecture

## Blend Capital DeFi Integration

ArtChain now integrates with **Blend Capital**, a decentralized lending protocol on Stellar, providing artists with advanced financial services.

### What is Blend Capital?

Blend is a DeFi protocol that allows any entity to create or utilize immutable lending markets. It brings decentralized, on-chain lending to the Stellar ecosystem with:

- **Security**: All lending pools are isolated with mandatory insurance through the backstop module
- **Capital Efficiency**: Reactive interest rates ensure optimal capital utilization
- **Permissionless**: Anyone can deploy new lending pools without governance approval

### Blend Integration in ArtChain

**File Location**: `client/src/lib/blend.ts` - Core Blend protocol integration
**UI Location**: `client/src/pages/finance.tsx` - Finance dashboard for DeFi operations

#### Key Features:

1. **Asset Lending**: Artists can lend their XLM, USDC, and other assets to earn interest
2. **Portfolio Borrowing**: Borrow against NFT portfolios and digital asset holdings
3. **BLND Token Integration**: Participate in backstop insurance with BLND tokens
4. **Real-time Analytics**: View lending pool statistics, APY rates, and utilization
5. **Health Factor Monitoring**: Track borrowing positions and liquidation risks

#### Smart Contract Addresses (Mainnet):

- **Blend Token Contract**: `CD25MNVTZDL4Y3XBCPCJXGXATV5WUHHOWMYFF4YBEGU5FCPGMYTVG5JY`
- **Pool Factory**: `CDSYOAVXFY7SM5S64IZPPPYB4GVGGLMQVFREPSQQEZVIWXX5R23G4QSU`
- **Backstop Module**: `CAQQR5SWBXKIGZKPBZDH3KM5GQ5GUTPKB7JAFCINLZBC5WXPJKRG3IM7`
- **BLND Asset**: `BLND-GDJEHTBE6ZHUXSWFI642DCGLUOECLHPF3KSXHPXTSTJ7E3JF6MQ5EZYY`

#### Available Operations:

- **Supply**: Deposit assets to earn lending interest
- **Borrow**: Take loans against collateral with competitive rates
- **Repay**: Pay back borrowed amounts with interest
- **Withdraw**: Remove supplied assets from lending pools
- **Backstop Participation**: Stake BLND tokens for protocol insurance rewards

### Benefits for Artists:

1. **Liquidity Access**: Borrow against art portfolios without selling NFTs
2. **Passive Income**: Earn yield on idle cryptocurrency holdings
3. **Capital Efficiency**: Leverage assets for new art projects and collaborations
4. **Risk Management**: Diversify income streams beyond NFT sales

## Technical Decisions and Justifications

1. **Stellar vs Ethereum**: Chosen for lower transaction fees, faster confirmation times, and simpler smart contract development.

2. **In-memory Database**: Used for prototyping, ensuring quick development without database setup complexity.

3. **Real-time Collaboration**: Implemented with WebSockets for minimal latency and better user experience.

4. **Universal Wallet Support**: Using Stellar Wallet Kit to support all major Stellar wallets (Freighter, xBull, Albedo, WalletConnect, Rabet) with a single unified API.

5. **Cyberpunk Design**: Adopted to align with the Web3 aesthetic and create a distinctive brand identity.

## Development Experience with Stellar

Our team has built several applications on Stellar, leveraging its strong documentation, developer-friendly tools, and active community. Key advantages we've found in developing on Stellar include:

1. **Low Transaction Costs**: Making microtransactions economically viable
2. **Fast Confirmation Times**: Providing better user experience  
3. **Simplified Asset Issuance**: Streamlining token creation processes
4. **Robust Documentation**: Accelerating the development lifecycle
5. **Strong Testing Environment**: Allowing for risk-free development on testnet
6. **Stellar Wallet Kit**: Unified wallet integration reducing development complexity
7. **Scaffold Stellar**: Best-practice templates and patterns for rapid dApp development

### Scaffold Stellar Integration

ArtChain follows best practices from the Scaffold Stellar framework:

- **Convention over Configuration**: Standardized project structure for maintainability
- **Auto-generated TypeScript Clients**: Type-safe contract interactions
- **Environment Management**: Easy switching between testnet and mainnet
- **Modern React Patterns**: Using latest React hooks and component patterns
- **Stellar SDK Integration**: Direct integration with Stellar's JavaScript SDK

Learn more at [scaffoldstellar.org](https://scaffoldstellar.org)

## Installation and Setup Instructions

### Prerequisites

- Node.js (v16+)
- npm or yarn
- At least one of the following Stellar wallets:
  - **Freighter** (recommended) - Browser extension for Chrome/Firefox
  - **xBull** - PWA or browser extension
  - **Albedo** - Web-based wallet
  - **WalletConnect compatible** - Lobstr and other mobile wallets
  - **Rabet** - Browser extension

### Installation Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/artchain.git
   cd artchain
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Access the application:
   Open your browser and navigate to `http://localhost:5000`

### Wallet Configuration

ArtChain uses **Stellar Wallet Kit** for seamless multi-wallet support. Choose any of the following:

1. **Freighter Wallet** (Recommended):
   - Install from [Chrome Web Store](https://chrome.google.com/webstore/detail/freighter/bcacfldlkkdogcmkkibnjlakofdplcbk)
   - Create or import a wallet
   - Switch to Testnet in settings
   - Get test XLM from [Friendbot](https://friendbot.stellar.org/)

2. **xBull Wallet**:
   - Install extension or use PWA at [xbull.app](https://xbull.app)
   - Create wallet and switch to Testnet
   - Fund with Friendbot

3. **Albedo**:
   - No installation needed - web-based wallet
   - Visit [albedo.link](https://albedo.link)
   - Works directly in browser

4. **WalletConnect (Mobile)**:
   - Install Lobstr or other WalletConnect-enabled Stellar wallet
   - Scan QR code to connect
   - Ensure testnet mode is enabled

5. **Rabet**:
   - Install browser extension
   - Create wallet and configure for Testnet

### Testing NFT Creation

1. Click "Connect Wallet" button in the navigation bar
2. Select your preferred wallet from the modal (Freighter, xBull, Albedo, etc.)
3. Approve the connection request in your wallet
4. Navigate to the Creation Studio
5. Create artwork using the drawing tools or upload an image
6. Add collaborators if desired
7. Click "Mint NFT" to tokenize your artwork
8. Sign the transaction in your connected wallet

### Testing Marketplace

1. Browse available NFTs on the Marketplace page
2. Click "Buy" on any NFT
3. Confirm the purchase transaction in your wallet
4. Check your Profile to see owned NFTs

## Future Roadmap

1. **Enhanced Collaboration Tools**: More sophisticated drawing tools and layer management
2. **Additional Blockchain Support**: Integration with more blockchain networks
3. **Mainnet Deployment**: Production deployment on Stellar mainnet
4. **Mobile Applications**: Native mobile apps for iOS and Android
5. **Community Governance**: DAO-based decision making for platform evolution
