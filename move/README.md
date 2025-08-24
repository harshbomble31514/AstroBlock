# AstroProof Move Contracts

This directory contains the Move smart contracts for AstroProof, implementing on-chain verification, access pass management, and treasury functions on Aptos blockchain.

## 🏗️ Contract Architecture

### 1. **AstroProof Contract** (`astroproof.move`)
- **Purpose**: Manages astrology reading verification and proof creation
- **Key Features**:
  - Creates reading proof NFTs with cryptographic hashes
  - Verifies reading integrity on-chain
  - Stores only hashes and encrypted URIs (privacy-preserving)
  - Emits events for reading creation and verification

### 2. **AccessPass Contract** (`access_pass.move`)
- **Purpose**: Handles subscription-based access to premium gurus
- **Key Features**:
  - Two tier system: ONE_GURU and ALL_GURUS passes
  - Time-limited access (24-hour default)
  - Integrated payment processing in APT
  - Validates guru access permissions

### 3. **Treasury Contract** (`treasury.move`)
- **Purpose**: Manages all financial operations and payments
- **Key Features**:
  - Secure payment processing
  - Refund mechanism (5-minute window)
  - Treasury management and withdrawals
  - Payment history and analytics

## 📋 Prerequisites

Before deploying the Move contracts, ensure you have:

1. **Aptos CLI** installed
   ```bash
   curl -fsSL "https://aptos.dev/scripts/install_cli.py" | python3
   ```

2. **Funded Aptos Account** (testnet/mainnet)
   - Create account: `aptos init`
   - Fund testnet account: https://aptoslabs.com/testnet-faucet

3. **Environment Variables** configured
   ```bash
   APTOS_PRIVATE_KEY=your_private_key_here
   NEXT_PUBLIC_APTOS_NETWORK=testnet
   NEXT_PUBLIC_TREASURY_ADDRESS=your_treasury_address
   ```

## 🚀 Deployment Guide

### Step 1: Compile Contracts

```bash
# From project root
npm run move:compile

# Or manually
cd move && aptos move compile
```

### Step 2: Deploy and Initialize

```bash
# Deploy using npm script
npm run deploy:move

# Or manually
cd move && aptos move publish --private-key $APTOS_PRIVATE_KEY --assume-yes
```

### Step 3: Update Configuration

After successful deployment, update your `.env.local`:

```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0x123...  # Your deployed contract address
NEXT_PUBLIC_TREASURY_ADDRESS=0x456...  # Treasury address
NEXT_PUBLIC_USE_MOVE_CONTRACTS=true
```

## 🧪 Testing

Run Move contract tests:

```bash
npm run move:test
# Or: cd move && aptos move test
```

## 📖 Contract Functions

### AstroProof Functions

```move
// Create a reading proof NFT
public entry fun create_reading_proof(
    owner: &signer,
    session_hash: String,      // 64-char SHA-256 hash
    report_hash: String,       // 64-char SHA-256 hash
    encrypted_uri: String,     // HTTPS URI to encrypted reading
    name: String,              // Human-readable name
    description: String,       // Description
)

// Verify reading integrity
public entry fun verify_reading(
    verifier: &signer,
    token_address: address,
    expected_session_hash: String,
    expected_report_hash: String,
)

// View functions
#[view] public fun get_reading_proof(token_address: address)
#[view] public fun get_total_readings(): u64
#[view] public fun reading_exists(token_address: address): bool
```

### AccessPass Functions

```move
// Purchase passes
public entry fun purchase_one_guru_pass(buyer: &signer, guru_slug: String)
public entry fun purchase_all_gurus_pass(buyer: &signer)

// Check access
#[view] public fun has_guru_access(
    user_addr: address,
    guru_slug: String,
    pass_addresses: vector<address>
): bool

// View functions
#[view] public fun get_access_pass(token_address: address)
#[view] public fun is_pass_valid(token_address: address): bool
#[view] public fun get_pricing(): (u64, u64)
```

### Treasury Functions

```move
// Process payments
public entry fun process_payment(
    payer: &signer,
    amount: u64,           // Amount in APT octas
    purpose: String,       // Payment purpose
    metadata: String,      // Optional metadata
): u64                     // Returns transaction ID

// Admin functions
public entry fun issue_refund(admin: &signer, tx_id: u64, reason: String)
public entry fun withdraw_treasury(admin: &signer, amount: u64, recipient: address)

// View functions
#[view] public fun get_payment(tx_id: u64)
#[view] public fun get_treasury_stats(): (u64, u64, u64, u64)
#[view] public fun can_refund(tx_id: u64): bool
```

## 🔐 Security Features

### Privacy Protection
- **No PII on-chain**: Only cryptographic hashes stored
- **Encrypted URIs**: Full readings stored off-chain, encrypted
- **Anonymous verification**: Anyone can verify without exposing content

### Financial Security
- **Atomic payments**: Integrated with Aptos Coin standard
- **Refund protection**: 5-minute refund window for payment errors
- **Access control**: Only admin can manage treasury and pricing

### Access Control
- **Time-limited passes**: Automatic expiration after 24 hours
- **Guru validation**: Only valid guru slugs accepted
- **Ownership verification**: Pass ownership checked on-chain

## 💰 Pricing Structure

Default pricing (configurable by admin):

- **One Guru Day Pass**: 0.20 APT (20,000,000 octas)
- **All Gurus Day Pass**: 0.50 APT (50,000,000 octas)

Valid guru slugs:
- `astro-chatbot` (free tier)
- `palmistry-sage`
- `numerology-oracle`
- `vastu-acharya`
- `tarot-seer`
- `vedic-astrologer`
- `relationship-guide`

## 📊 Events and Analytics

### Reading Events
```move
struct ReadingCreated {
    token_address: address,
    owner: address,
    session_hash: String,
    report_hash: String,
    created_at: u64,
}

struct ReadingVerified {
    token_address: address,
    verifier: address,
    verification_result: bool,
    verified_at: u64,
}
```

### Payment Events
```move
struct PaymentReceived {
    payer: address,
    amount: u64,
    purpose: String,
    paid_at: u64,
    tx_id: u64,
}

struct PassPurchased {
    token_address: address,
    owner: address,
    tier: String,
    guru_slug: String,
    expires_at: u64,
    price_paid: u64,
}
```

## 🛠️ Integration with TypeScript

The Move contracts are integrated with the TypeScript frontend through `app/lib/aptos.ts`:

```typescript
import { 
  createReadingProofWithContract,
  purchaseOneGuruPassWithContract,
  verifyReadingWithContract,
  isContractConfigured 
} from '@/lib/aptos'

// Create reading proof
const txHash = await createReadingProofWithContract(account, {
  sessionHash: '1234...',
  reportHash: 'abcd...',
  encryptedUri: 'https://storage.example.com/encrypted/reading',
  name: 'Astrology Reading',
  description: 'Personal astrology reading'
})

// Purchase guru pass
const passTxHash = await purchaseOneGuruPassWithContract(account, 'palmistry-sage')

// Verify reading
const isValid = await verifyReadingWithContract(
  verifierAccount, 
  tokenAddress, 
  expectedSessionHash, 
  expectedReportHash
)
```

## 🔧 Troubleshooting

### Common Issues

1. **Compilation Errors**
   ```bash
   # Clear cache and recompile
   cd move && rm -rf build/ && aptos move compile
   ```

2. **Insufficient Balance**
   - Fund your account from testnet faucet
   - Check gas fees for contract deployment

3. **Contract Already Exists**
   - Use different account address
   - Or update existing contract with new version

4. **Invalid Guru Slug**
   - Check `VALID_GURUS` array in `access_pass.move`
   - Ensure exact string match

### Error Codes

- `E_NOT_AUTHORIZED (1)`: Only admin can perform this action
- `E_INSUFFICIENT_BALANCE (2)`: Not enough APT for payment
- `E_INVALID_HASH (3)`: Hash must be exactly 64 characters
- `E_PASS_EXPIRED (3)`: Access pass has expired
- `E_INVALID_GURU (8)`: Guru slug not in approved list

## 📚 Additional Resources

- [Aptos Move Documentation](https://aptos.dev/move/book/)
- [Aptos TypeScript SDK](https://github.com/aptos-labs/aptos-ts-sdk)
- [Aptos Token Objects](https://aptos.dev/standards/aptos-token/)
- [Move Testing Guide](https://aptos.dev/move/book/unit-testing)

## 🤝 Contributing

When contributing to Move contracts:

1. **Test thoroughly** with `npm run move:test`
2. **Update TypeScript integration** in `app/lib/aptos.ts`
3. **Document new functions** in this README
4. **Follow Move best practices** for security and gas optimization

---

**⚠️ Security Notice**: These contracts handle financial transactions. Always test thoroughly on testnet before mainnet deployment.
