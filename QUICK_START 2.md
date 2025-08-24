# 🚀 Quick Start Guide

## Run AstroProof Locally (Step by Step)

### 1. Copy Environment Variables
Create a `.env.local` file by copying from `env.example`:

```bash
cp env.example .env.local
```

### 2. Minimal Configuration (to get started)
Edit `.env.local` and add these minimum values:

```bash
# Required for basic functionality
NEXT_PUBLIC_APTOS_NETWORK=testnet
NEXT_PUBLIC_COLLECTION_NAME=AstroProofs
NEXT_PUBLIC_PASS_COLLECTION=AstroPasses
NEXT_PUBLIC_APP_VERSION=web-mvp-1.0

# Your OpenAI key (already set in env.example)
OPENAI_API_KEY=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

# Payment settings (testnet treasury)
NEXT_PUBLIC_TREASURY_ADDRESS=0x742d35Cc6634C0532925a3b8D5c9AC65DA77c0F2
NEXT_PUBLIC_PRICE_ONE_GURU_APT=0.20
NEXT_PUBLIC_PRICE_ALL_GURUS_APT=0.50
NEXT_PUBLIC_FREE_CHATS_PER_DAY=3
NEXT_PUBLIC_DAYPASS_HOURS=24

# Feature flags
NEXT_PUBLIC_ENCRYPT_CHAT=false
NEXT_PUBLIC_ATOMIC_PAY_TO_MINT=false

# Leave Firebase empty for now (will work in read-only mode)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

### 3. Start Development Server

```bash
npm run dev
```

### 4. Visit the App
Open [http://localhost:3000](http://localhost:3000)

## What Works Without Firebase
- ✅ Browse gurus directory (`/gurus`)
- ✅ View pricing (`/pricing`) 
- ✅ Read guru profiles (`/gurus/[slug]`)
- ✅ Basic chat interface (`/chat`)
- ✅ OpenAI-powered responses with persona fallbacks
- ✅ Wallet connection (Petra wallet)
- ⚠️ Limited: Usage tracking, payment flow, reading proofs

## What Needs Firebase Setup
- Payment/subscription system
- Usage tracking (free tier limits)
- Encrypted storage for reading proofs
- Account management

## Setup Firebase (Optional for Full Features)
1. Create Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Authentication (Anonymous)
3. Enable Firestore Database
4. Enable Storage
5. Copy config to `.env.local`

## Next Steps
1. **Install Petra Wallet**: [petra.app](https://petra.app/)
2. **Get Testnet APT**: [Aptos Faucet](https://aptoslabs.com/testnet-faucet)
3. **Create Collections**: Run `npm run create:collection` (needs private key)

## Troubleshooting
- **Build errors**: Make sure all dependencies installed with `npm install`
- **Wallet issues**: Ensure Petra wallet is on Aptos testnet
- **OpenAI errors**: Check API key is valid (app falls back to deterministic responses)
- **Firebase errors**: Leave Firebase vars empty for demo mode

The app is designed to gracefully degrade - core features work without full setup!
