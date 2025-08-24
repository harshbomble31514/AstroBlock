# Astroblock 🌟

AI astrology readings with cryptographic proof on Aptos blockchain. **Public proof, private details.**

## Overview

Astroblock combines ancient spiritual wisdom with modern blockchain technology, offering personalized astrology readings through AI embodiments of traditional gurus. Choose from subscription tiers ranging from free daily chats to unlimited access to specialized spiritual guides. All interactions are secured with client-side encryption and proven on the Aptos blockchain.

### Key Features

- 🧘 **Spiritual Gurus**: Chat with AI embodiments of traditional wisdom keepers
- 🎯 **Subscription Tiers**: Free daily chats, one guru passes, or all gurus access
- 🤖 **AI-Powered Guidance**: Personalized spiritual insights from specialized personas
- 🔒 **Client-Side Encryption**: All conversations encrypted in your browser
- ⛓️ **Blockchain Verification**: Immutable proof on Aptos with AccessPass NFTs
- 🔐 **Privacy First**: No personal data on-chain, only anonymous access tokens
- 📱 **Mobile-First UI**: Responsive design with dark mode
- 🎯 **Works Offline**: Deterministic fallback responses when OpenAI is unavailable

## Subscription Tiers

Astroblock offers three tiers of spiritual guidance:

### 🆓 Free Tier
- **Cost**: Free
- **Access**: 3 chats per day with Astro Chatbot
- **Features**: General astrology guidance, basic cosmic insights
- **Limitations**: No access to specialized gurus

### 👑 One Guru Day Pass
- **Cost**: 0.20 APT (24 hours)
- **Access**: Unlimited chats with one chosen specialized guru
- **Features**: Expert knowledge in chosen field, personalized guidance
- **Gurus**: Palmistry Sage, Numerology Oracle, Vastu Acharya, Tarot Seer, Vedic Astrologer, Relationship Guide

### ⭐ All Gurus Day Pass
- **Cost**: 0.50 APT (24 hours) 
- **Access**: Unlimited chats with ALL specialized gurus
- **Features**: Switch between gurus, compare perspectives, complete spiritual toolkit
- **Best Value**: Full access to ancient wisdom traditions

## Spiritual Gurus Directory

Our AI gurus represent authentic wisdom traditions:

1. **Astro Chatbot** (Free) - General astrology assistant
2. **Ravi Prasad** - Master Palmistry Sage specializing in hand reading
3. **Sophia Chen** - Numerology Oracle for sacred number guidance  
4. **Dr. Arvind Sharma** - Vastu Acharya for space harmonization
5. **Luna Nightshade** - Intuitive Tarot Seer for divine guidance
6. **Pandit Raj Kumar** - Vedic Astrology Master for karmic insights
7. **Dr. Priya Mehta** - Cosmic Relationship Guide for love and partnerships

## Quick Start

### 1. Prerequisites

- Node.js 18+ and pnpm (or npm)
- Aptos wallet (Petra recommended)
- Firebase project for encrypted storage and chat transcripts
- OpenAI API key (optional - app works without it)

### 2. Installation

```bash
# Clone and install dependencies
git clone <repository-url>
cd astroblock
pnpm install

# Copy environment template
cp env.example .env.local
```

### 3. Environment Setup

Edit `.env.local` with your configuration:

```bash
# Aptos Configuration
NEXT_PUBLIC_APTOS_NETWORK=testnet
NEXT_PUBLIC_COLLECTION_NAME=Astroblocks
NEXT_PUBLIC_PASS_COLLECTION=AstroPasses
NEXT_PUBLIC_APP_VERSION=web-mvp-1.0

# Firebase Configuration (Required)
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id

# OpenAI (Optional - fallback works without it)
OPENAI_API_KEY=your_openai_api_key

# Payment & Subscription Configuration
NEXT_PUBLIC_TREASURY_ADDRESS=your_treasury_wallet_address
NEXT_PUBLIC_PRICE_ONE_GURU_APT=0.20
NEXT_PUBLIC_PRICE_ALL_GURUS_APT=0.50
NEXT_PUBLIC_FREE_CHATS_PER_DAY=3
NEXT_PUBLIC_DAYPASS_HOURS=24

# Feature Flags
NEXT_PUBLIC_ENCRYPT_CHAT=true
NEXT_PUBLIC_ATOMIC_PAY_TO_MINT=false

# Collection Creator (Only for initial setup)
APTOS_PRIVATE_KEY=your_aptos_private_key_hex
```

### 4. Firebase Setup

1. Create a new Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable **Authentication** → **Anonymous** sign-in
3. Enable **Firestore Database** and **Storage**
4. Set up Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow users to read/write their own usage data
    match /usage/{wallet}/{document=**} {
      allow read, write: if request.auth != null;
    }
    
    // Allow users to read/write their own chat data
    match /chats/{wallet}/{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

5. Set up Storage security rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow users to read/write their own encrypted reports
    match /reports/{wallet}/{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

6. Copy configuration values to your `.env.local`

### 5. Aptos Wallet Setup

1. Install [Petra Wallet](https://petra.app/) browser extension
2. Create or import an account
3. Switch to **Testnet** network
4. Get testnet APT from [Aptos Faucet](https://aptoslabs.com/testnet-faucet)

### 6. Create Collections (One-time)

```bash
# Set your private key in .env.local first
pnpm create:collection
```

This creates both required NFT collections on Aptos testnet:
- **Astroblocks**: For astrology reading verifications
- **AstroPasses**: For subscription access passes

### 7. Run Development Server

```bash
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the app!

## 60-90 Second Demo Flow

### Complete User Journey Test

1. **Connect Wallet** (10s)
   - Click "Connect Wallet" → Choose Petra → Approve connection
   - Wallet address appears in header

2. **Free Tier Experience** (20s)
   - Go to `/chat` → Try "Astro Chatbot" 
   - Send 3 messages to test free daily limit
   - See limit reached notification

3. **Purchase One Guru Pass** (25s)
   - Go to `/gurus` → Select a specialized guru (e.g., "Palmistry Sage")
   - Click "Get Access" → Choose "One Guru Pass" 
   - Pay 0.20 APT → Mint AccessPass NFT
   - Verify transaction on Aptos Explorer

4. **Premium Chat Experience** (15s)
   - Return to `/chat` → Switch to purchased guru
   - Ask specialized questions unlimited
   - Notice persona-specific responses

5. **Account Management** (10s)
   - Visit `/account` → View active passes and expiry times
   - See pass details and blockchain links

6. **Verification & Sharing** (10s)
   - Go to `/me` → View owned reading proofs (if any)
   - Visit `/v/[tokenId]` to see public verification
   - Test owner deep-verify with passphrase

**Total Demo Time**: ~90 seconds  
**Result**: Full subscription flow with blockchain proof!

## Aptos Integration Deep Dive

### Smart Contract Architecture

Astroblock uses **Aptos Token v2 (Digital Assets)** for dual NFT functionality:

#### Astroblocks Collection
- **Purpose**: Astrology reading verifications  
- **Properties**: `session_hash`, `report_hash`, `created_at`, `app_version`, `uri`
- **Access**: Public verification, owner-only decryption

#### AstroPasses Collection  
- **Purpose**: Subscription access tokens
- **Properties**: `tier`, `guru_slug`, `issued_at`, `expires_at`, `app_version`
- **Access**: Determines chat permissions and guru availability

### Key Aptos Features Used

1. **Digital Asset Standard**: Latest Aptos NFT standard with rich metadata
2. **Immutable Properties**: Cryptographic hashes stored permanently on-chain
3. **Wallet Integration**: Petra wallet for seamless user experience
4. **Testnet**: Safe testing environment with free transactions

### Token Properties Schemas

#### Astroblocks (Reading Verification)
```typescript
interface ReadingProofProperties {
  session_hash: string    // SHA-256 of normalized birth data
  report_hash: string     // SHA-256 of reading content  
  created_at: string      // ISO timestamp
  app_version: string     // Version for future compatibility
  uri: string            // Link to encrypted report
}
```

#### AstroPasses (Access Control)
```typescript
interface AccessPassProperties {
  tier: 'ONE_GURU' | 'ALL_GURUS'  // Access level
  guru_slug: string               // Specific guru (empty for ALL_GURUS)
  issued_at: string               // ISO timestamp when purchased
  expires_at: string              // ISO timestamp when access ends
  app_version: string             // Version compatibility
}
```

### Security Model

- **On-Chain**: Only anonymous hashes and metadata
- **Off-Chain**: Encrypted reading content with user-controlled keys
- **Client-Side**: All encryption/decryption happens in browser
- **Firebase**: Stores encrypted blobs, can't decrypt without user passphrase

## User Flow Demo (60-90 seconds)

### Quick Demo Script

1. **Connect Wallet** (10s)
   - Click "Connect Wallet" → Choose Petra → Approve connection
   - Wallet address appears in header

2. **Generate Reading** (20s)
   - Fill form: Name (optional), DOB, Time, Place, Question (optional)
   - Click "Generate Reading" → AI creates personalized reading

3. **Save Encrypted** (15s)
   - Enter secure passphrase → Click "Save Reading"
   - Reading encrypted client-side, uploaded to Firebase

4. **Mint Proof** (20s)
   - Click "Mint Proof NFT" → Approve transaction in wallet
   - NFT minted with cryptographic hashes on Aptos

5. **Verify & Share** (15s)
   - View transaction on Aptos Explorer
   - Visit `/me` to see your proofs
   - Use share buttons for social media

**Result**: Verifiable astrology reading with blockchain proof!

## Project Structure

```
astroblock/
├── app/                          # Next.js 14 App Router
│   ├── components/              # UI Components
│   │   ├── WalletConnect.tsx    # Aptos wallet integration
│   │   ├── ReadingForm.tsx      # Birth data input form
│   │   ├── ReadingCard.tsx      # Display & actions for readings
│   │   ├── VerifyView.tsx       # Public verification UI
│   │   ├── OwnerDeepVerify.tsx  # Owner-only decrypt & verify
│   │   └── ShareCard.tsx        # Social sharing component
│   ├── lib/                     # Core Libraries
│   │   ├── aptos.ts            # Aptos SDK integration
│   │   ├── crypto.ts           # Client-side AES-GCM encryption
│   │   ├── hash.ts             # SHA-256 hashing utilities
│   │   ├── normalize.ts        # Input data normalization
│   │   ├── storage.ts          # Firebase encrypted storage
│   │   └── ai.ts               # OpenAI + deterministic fallback
│   ├── providers/              # React Context Providers
│   │   ├── WalletProvider.tsx  # Aptos wallet adapter
│   │   ├── FirebaseProvider.tsx # Firebase auth context
│   │   └── ThemeProvider.tsx   # Dark mode theme
│   ├── page.tsx                # Home: form → reading → save → mint
│   ├── me/page.tsx             # My Proofs: list owned NFTs
│   └── v/[tokenId]/page.tsx    # Verify: public + owner verification
├── scripts/
│   └── create-collection.ts    # One-time collection setup script
├── package.json                # Dependencies & scripts
└── README.md                   # This file
```

## API Reference

### Core Functions

```typescript
// Generate AI reading
const reading = await generateReading(normalizedInputs)

// Encrypt and save
const uri = await uploadEncrypted(reportData, passphrase, walletAddress, sessionId)

// Mint proof NFT
const txHash = await mintProofToken(account, {
  name: "Astroblock Reading abc123",
  description: "AI astrology reading with cryptographic verification",
  uri: encryptedReportUri,
  sessionHash: "64-char-hex",
  reportHash: "64-char-hex", 
  createdAt: "2024-01-01T00:00:00.000Z"
})

// Verify token
const tokenData = await readToken(tokenId)

// Deep verify (owner only)
const decryptedData = await downloadAndDecrypt(uri, passphrase)
const isValid = reportHash(decryptedData.reading) === tokenData.properties.report_hash
```

### Hash Functions

```typescript
// Session hash (for preventing duplicate inputs)
const sessionId = sessionHash(normalizedInputs) // SHA-256 of birth data

// Report hash (for content integrity)
const contentId = reportHash(readingText) // SHA-256 of reading content
```

## Scripts

```bash
# Development
pnpm dev                    # Start development server
pnpm build                  # Build for production
pnpm start                  # Start production server

# Quality
pnpm lint                   # ESLint check
pnpm typecheck             # TypeScript check

# Aptos
pnpm create:collection     # Create NFT collection (one-time)
```

## Troubleshooting

### Common Issues

1. **Wallet Connection Fails**
   - Ensure Petra wallet is installed and unlocked
   - Check network is set to Testnet
   - Refresh page and try again

2. **Collection Creation Fails**
   - Verify APTOS_PRIVATE_KEY is set correctly
   - Ensure account has sufficient APT balance
   - Check network connectivity

3. **Firebase Upload Fails**
   - Verify Firebase configuration in .env.local
   - Check Firebase Storage rules allow authenticated users
   - Ensure Anonymous Auth is enabled

4. **AI Reading Generation Fails**
   - App falls back to deterministic reading automatically
   - Check OPENAI_API_KEY if you want AI-generated content
   - Verify OpenAI account has available credits

### Getting Help

- Check browser console for detailed error messages
- Verify all environment variables are set correctly
- Ensure wallet has testnet APT for transactions
- Test with minimal inputs first

## Security Considerations

### What's On-Chain
- ✅ Session hash (anonymous fingerprint of birth data)
- ✅ Report hash (content integrity check)
- ✅ Creation timestamp
- ✅ Encrypted report URI

### What's Never On-Chain
- ❌ Birth date, time, or location
- ❌ Personal names or questions
- ❌ Reading content
- ❌ Encryption keys or passphrases

### Encryption Details
- **Algorithm**: AES-GCM 256-bit
- **Key Derivation**: PBKDF2 with 100,000 iterations
- **Client-Side Only**: Keys never leave your browser
- **Salt**: Random 16-byte salt per encryption

## Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Disclaimer

This application is for entertainment purposes only. Astrology readings are not intended as medical, legal, or financial advice. The blockchain proof system demonstrates technical capabilities and should not be considered as validation of astrological claims.

---

## Acceptance Criteria ✅

All core requirements have been implemented:

### Subscription System
- [x] **FREE tier**: 3 chats/day with Astro Chatbot only
- [x] **ONE_GURU tier**: Unlimited chats with chosen guru for 24h  
- [x] **ALL_GURUS tier**: Unlimited chats with any guru for 24h
- [x] Usage tracking in Firestore with daily limits
- [x] AccessPass NFTs minted on successful payment

### Chat & Guru System  
- [x] Robust chatbot UI with persona switching
- [x] 6+ specialized gurus with detailed profiles and sample prompts
- [x] Persona-specific AI responses (OpenAI + deterministic fallback)
- [x] Access gating based on subscription tier
- [x] Real-time usage limit enforcement

### Payment & Blockchain
- [x] MVP two-transaction flow: APT transfer → AccessPass mint
- [x] Aptos Token v2 integration with immutable properties
- [x] Treasury payment collection and verification
- [x] Explorer links for transaction transparency

### Pages & Navigation
- [x] `/pricing` - Three tiers with clear benefits and CTAs
- [x] `/gurus` - Directory with filtering and access controls  
- [x] `/gurus/[slug]` - Individual guru profiles with CTA based on access
- [x] `/chat` - Full chat interface with sidebar guru switching
- [x] `/account` - Access status, pass management, quick actions
- [x] Updated home page with navigation to all features

### Privacy & Security
- [x] No PII on-chain (only tier, guru_slug, timestamps)
- [x] Client-side encryption for chat transcripts (optional)
- [x] Anonymous hashes and access tokens only
- [x] Mobile-first responsive design with dark mode

### Technical Requirements
- [x] Next.js 14 + TypeScript + Tailwind + shadcn/ui
- [x] @aptos-labs/ts-sdk integration (no legacy SDK)
- [x] Firebase client for anonymous auth and Firestore
- [x] Works without OpenAI key via deterministic responses
- [x] Collection creation script for both Astroblocks & AstroPasses

---

**Built with ❤️ on Aptos blockchain**

- Framework: Next.js 14 + TypeScript
- Blockchain: Aptos Testnet + Token v2  
- Access Control: NFT-based subscription system
- Encryption: Web Crypto API (AES-GCM)
- Storage: Firebase + Firestore
- AI: OpenAI GPT-3.5-turbo + Deterministic Fallbacks
- UI: Tailwind CSS + shadcn/ui + Mobile-First Dark Mode
