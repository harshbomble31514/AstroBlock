/// AstroProof Treasury Management Contract
/// This contract handles all financial operations including payments, refunds, and treasury management.
module astroproof::treasury {
    use std::signer;
    use std::timestamp;
    use std::vector;
    use std::string::{Self, String};
    use aptos_framework::coin;
    use aptos_framework::aptos_coin::AptosCoin;
    use aptos_framework::event;
    use aptos_framework::account;

    /// Error codes
    const E_NOT_AUTHORIZED: u64 = 1;
    const E_INSUFFICIENT_BALANCE: u64 = 2;
    const E_PAYMENT_NOT_FOUND: u64 = 3;
    const E_ALREADY_REFUNDED: u64 = 4;
    const E_REFUND_WINDOW_EXPIRED: u64 = 5;
    const E_INVALID_AMOUNT: u64 = 6;
    const E_ALREADY_EXISTS: u64 = 7;

    /// Constants
    const REFUND_WINDOW_SECONDS: u64 = 300; // 5 minutes for refunds
    const MIN_PAYMENT_AMOUNT: u64 = 1000; // Minimum 0.00001 APT

    /// Payment record structure
    struct PaymentRecord has store {
        /// Address that made the payment
        payer: address,
        /// Amount paid in APT octas
        amount: u64,
        /// Purpose of payment (e.g., "one_guru_pass", "all_gurus_pass")
        purpose: String,
        /// Timestamp when payment was made
        paid_at: u64,
        /// Whether this payment has been refunded
        is_refunded: bool,
        /// Additional metadata
        metadata: String,
    }

    /// Treasury state
    struct TreasuryState has key {
        /// Admin who can manage treasury settings
        admin: address,
        /// Address to receive treasury funds
        treasury_address: address,
        /// Total amount collected
        total_collected: u64,
        /// Total amount refunded
        total_refunded: u64,
        /// Payment records by transaction ID
        payments: vector<PaymentRecord>,
        /// Treasury balance
        balance: u64,
    }

    /// Events
    #[event]
    struct PaymentReceived has drop, store {
        payer: address,
        amount: u64,
        purpose: String,
        paid_at: u64,
        tx_id: u64,
    }

    #[event]
    struct RefundIssued has drop, store {
        recipient: address,
        amount: u64,
        original_tx_id: u64,
        refunded_at: u64,
        reason: String,
    }

    #[event]
    struct TreasuryWithdrawal has drop, store {
        admin: address,
        amount: u64,
        withdrawn_at: u64,
        recipient: address,
    }

    /// Initialize the treasury contract
    public entry fun initialize(
        admin: &signer,
        treasury_addr: address,
    ) {
        let admin_addr = signer::address_of(admin);
        
        // Ensure this is called only once
        assert!(!exists<TreasuryState>(admin_addr), E_ALREADY_EXISTS);

        // Initialize treasury state
        move_to(admin, TreasuryState {
            admin: admin_addr,
            treasury_address: treasury_addr,
            total_collected: 0,
            total_refunded: 0,
            payments: vector::empty<PaymentRecord>(),
            balance: 0,
        });
    }

    /// Process a payment for a service
    public entry fun process_payment(
        payer: &signer,
        amount: u64,
        purpose: String,
        metadata: String,
    ): u64 acquires TreasuryState {
        let payer_addr = signer::address_of(payer);
        assert!(amount >= MIN_PAYMENT_AMOUNT, E_INVALID_AMOUNT);

        let state = borrow_global_mut<TreasuryState>(@astroproof);
        
        // Transfer coins to treasury
        coin::transfer<AptosCoin>(payer, state.treasury_address, amount);

        let current_time = timestamp::now_seconds();
        let tx_id = vector::length(&state.payments);

        // Create payment record
        let payment_record = PaymentRecord {
            payer: payer_addr,
            amount,
            purpose,
            paid_at: current_time,
            is_refunded: false,
            metadata,
        };

        // Store payment record
        vector::push_back(&mut state.payments, payment_record);

        // Update treasury stats
        state.total_collected = state.total_collected + amount;
        state.balance = state.balance + amount;

        // Emit payment event
        event::emit(PaymentReceived {
            payer: payer_addr,
            amount,
            purpose,
            paid_at: current_time,
            tx_id,
        });

        tx_id
    }

    /// Issue a refund for a payment (within refund window)
    public entry fun issue_refund(
        admin: &signer,
        tx_id: u64,
        reason: String,
    ) acquires TreasuryState {
        let admin_addr = signer::address_of(admin);
        let state = borrow_global_mut<TreasuryState>(@astroproof);
        
        // Only admin can issue refunds
        assert!(admin_addr == state.admin, E_NOT_AUTHORIZED);

        // Check if payment exists
        assert!(tx_id < vector::length(&state.payments), E_PAYMENT_NOT_FOUND);

        let payment = vector::borrow_mut(&mut state.payments, tx_id);
        
        // Check if already refunded
        assert!(!payment.is_refunded, E_ALREADY_REFUNDED);

        // Check refund window (5 minutes)
        let current_time = timestamp::now_seconds();
        assert!(current_time <= payment.paid_at + REFUND_WINDOW_SECONDS, E_REFUND_WINDOW_EXPIRED);

        // Check treasury has sufficient balance
        assert!(state.balance >= payment.amount, E_INSUFFICIENT_BALANCE);

        // Process refund
        coin::transfer<AptosCoin>(admin, payment.payer, payment.amount);

        // Update payment record
        payment.is_refunded = true;

        // Update treasury stats
        state.total_refunded = state.total_refunded + payment.amount;
        state.balance = state.balance - payment.amount;

        // Emit refund event
        event::emit(RefundIssued {
            recipient: payment.payer,
            amount: payment.amount,
            original_tx_id: tx_id,
            refunded_at: current_time,
            reason,
        });
    }

    /// Admin function to withdraw treasury funds
    public entry fun withdraw_treasury(
        admin: &signer,
        amount: u64,
        recipient: address,
    ) acquires TreasuryState {
        let admin_addr = signer::address_of(admin);
        let state = borrow_global_mut<TreasuryState>(@astroproof);
        
        // Only admin can withdraw
        assert!(admin_addr == state.admin, E_NOT_AUTHORIZED);

        // Check treasury has sufficient balance
        assert!(state.balance >= amount, E_INSUFFICIENT_BALANCE);

        // Transfer funds
        coin::transfer<AptosCoin>(admin, recipient, amount);

        // Update balance
        state.balance = state.balance - amount;

        // Emit withdrawal event
        event::emit(TreasuryWithdrawal {
            admin: admin_addr,
            amount,
            withdrawn_at: timestamp::now_seconds(),
            recipient,
        });
    }

    /// Get payment information by transaction ID
    #[view]
    public fun get_payment(tx_id: u64): (address, u64, String, u64, bool, String) acquires TreasuryState {
        let state = borrow_global<TreasuryState>(@astroproof);
        assert!(tx_id < vector::length(&state.payments), E_PAYMENT_NOT_FOUND);

        let payment = vector::borrow(&state.payments, tx_id);
        (
            payment.payer,
            payment.amount,
            payment.purpose,
            payment.paid_at,
            payment.is_refunded,
            payment.metadata
        )
    }

    /// Get treasury statistics
    #[view]
    public fun get_treasury_stats(): (u64, u64, u64, u64) acquires TreasuryState {
        let state = borrow_global<TreasuryState>(@astroproof);
        (
            state.total_collected,
            state.total_refunded,
            state.balance,
            vector::length(&state.payments)
        )
    }

    /// Check if a payment can be refunded
    #[view]
    public fun can_refund(tx_id: u64): bool acquires TreasuryState {
        let state = borrow_global<TreasuryState>(@astroproof);
        
        if (tx_id >= vector::length(&state.payments)) {
            return false
        };

        let payment = vector::borrow(&state.payments, tx_id);
        let current_time = timestamp::now_seconds();
        
        !payment.is_refunded && 
        current_time <= payment.paid_at + REFUND_WINDOW_SECONDS &&
        state.balance >= payment.amount
    }

    /// Get payment history for a user
    #[view]
    public fun get_user_payments(user_addr: address): vector<u64> acquires TreasuryState {
        let state = borrow_global<TreasuryState>(@astroproof);
        let user_payments = vector::empty<u64>();
        let i = 0;
        let len = vector::length(&state.payments);

        while (i < len) {
            let payment = vector::borrow(&state.payments, i);
            if (payment.payer == user_addr) {
                vector::push_back(&mut user_payments, i);
            };
            i = i + 1;
        };

        user_payments
    }

    /// Admin function to update treasury address
    public entry fun update_treasury_address(
        admin: &signer,
        new_treasury_addr: address,
    ) acquires TreasuryState {
        let admin_addr = signer::address_of(admin);
        let state = borrow_global_mut<TreasuryState>(@astroproof);
        assert!(admin_addr == state.admin, E_NOT_AUTHORIZED);

        state.treasury_address = new_treasury_addr;
    }

    /// Check treasury balance
    #[view]
    public fun get_treasury_balance(): u64 acquires TreasuryState {
        let state = borrow_global<TreasuryState>(@astroproof);
        state.balance
    }

    #[test_only]
    use std::string;

    #[test(admin = @astroproof)]
    public fun test_initialize(admin: &signer) {
        let treasury = @0x999;
        initialize(admin, treasury);
        
        let state = borrow_global<TreasuryState>(signer::address_of(admin));
        assert!(state.total_collected == 0, 1);
        assert!(state.treasury_address == treasury, 2);
        assert!(state.balance == 0, 3);
    }

    #[test]
    public fun test_payment_validation() {
        // Test minimum payment amount
        assert!(MIN_PAYMENT_AMOUNT > 0, 4);
        assert!(REFUND_WINDOW_SECONDS > 0, 5);
    }
}
