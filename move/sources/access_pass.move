/// AstroProof AccessPass Contract
/// This contract manages subscription-based access passes for premium guru consultations.
/// Each pass is an NFT with expiration time and specific guru access rights.
module astroproof::access_pass {
    use std::string::{Self, String};
    use std::vector;
    use std::signer;
    use std::timestamp;
    use std::option::{Self, Option};
    use aptos_framework::object::{Self, Object, ObjectCore};
    use aptos_framework::event;
    use aptos_framework::coin;
    use aptos_framework::aptos_coin::AptosCoin;
    use aptos_token_objects::collection;
    use aptos_token_objects::token;
    use aptos_token_objects::property_map;

    /// Error codes
    const E_NOT_AUTHORIZED: u64 = 1;
    const E_COLLECTION_NOT_FOUND: u64 = 2;
    const E_PASS_EXPIRED: u64 = 3;
    const E_PASS_NOT_FOUND: u64 = 4;
    const E_INSUFFICIENT_PAYMENT: u64 = 5;
    const E_ALREADY_EXISTS: u64 = 6;
    const E_INVALID_TIER: u64 = 7;
    const E_INVALID_GURU: u64 = 8;

    /// Constants
    const COLLECTION_NAME: vector<u8> = b"AstroPasses";
    const COLLECTION_DESCRIPTION: vector<u8> = b"AstroProof Access Passes: Time-limited access tokens for premium guru consultations.";
    const COLLECTION_URI: vector<u8> = b"https://astroproof.app/passes";
    const APP_VERSION: vector<u8> = b"web-mvp-1.0";
    const SECONDS_IN_DAY: u64 = 86400;

    /// Access tier types
    const TIER_ONE_GURU: vector<u8> = b"ONE_GURU";
    const TIER_ALL_GURUS: vector<u8> = b"ALL_GURUS";

    /// Pricing (in APT octas - 1 APT = 100,000,000 octas)
    const PRICE_ONE_GURU: u64 = 20_000_000; // 0.20 APT
    const PRICE_ALL_GURUS: u64 = 50_000_000; // 0.50 APT

    /// Valid guru slugs
    const VALID_GURUS: vector<vector<u8>> = vector[
        b"astro-chatbot",
        b"palmistry-sage", 
        b"numerology-oracle",
        b"vastu-acharya",
        b"tarot-seer",
        b"vedic-astrologer",
        b"relationship-guide"
    ];

    /// AccessPass structure representing a subscription
    struct AccessPass has key {
        /// Type of access: "ONE_GURU" or "ALL_GURUS"
        tier: String,
        /// Specific guru slug for ONE_GURU tier (empty for ALL_GURUS)
        guru_slug: String,
        /// Timestamp when the pass was issued
        issued_at: u64,
        /// Timestamp when the pass expires
        expires_at: u64,
        /// Application version
        app_version: String,
        /// Original purchaser address
        owner: address,
        /// Whether the pass is currently active
        is_active: bool,
    }

    /// Global state for AccessPass management
    struct AccessPassState has key {
        /// Collection object for all access passes
        collection: Object<collection::Collection>,
        /// Admin address who can manage pricing and settings
        admin: address,
        /// Treasury address to receive payments
        treasury: address,
        /// Total number of passes issued
        total_passes: u64,
        /// Current pricing
        price_one_guru: u64,
        price_all_gurus: u64,
        /// Pass duration in seconds (default 24 hours)
        pass_duration: u64,
    }

    /// Events
    #[event]
    struct PassPurchased has drop, store {
        token_address: address,
        owner: address,
        tier: String,
        guru_slug: String,
        issued_at: u64,
        expires_at: u64,
        price_paid: u64,
    }

    #[event]
    struct PassExpired has drop, store {
        token_address: address,
        owner: address,
        expired_at: u64,
    }

    #[event]
    struct PassActivated has drop, store {
        token_address: address,
        owner: address,
        activated_at: u64,
    }

    /// Initialize the AccessPass contract
    public entry fun initialize(
        admin: &signer,
        treasury_addr: address,
    ) {
        let admin_addr = signer::address_of(admin);
        
        // Ensure this is called only once
        assert!(!exists<AccessPassState>(admin_addr), E_ALREADY_EXISTS);

        // Create the collection for access passes
        let collection_constructor_ref = collection::create_unlimited_collection(
            admin,
            string::utf8(COLLECTION_DESCRIPTION),
            string::utf8(COLLECTION_NAME),
            option::none(), // No royalty
            string::utf8(COLLECTION_URI)
        );

        let collection_object = object::object_from_constructor_ref(&collection_constructor_ref);

        // Store global state
        move_to(admin, AccessPassState {
            collection: collection_object,
            admin: admin_addr,
            treasury: treasury_addr,
            total_passes: 0,
            price_one_guru: PRICE_ONE_GURU,
            price_all_gurus: PRICE_ALL_GURUS,
            pass_duration: SECONDS_IN_DAY, // 24 hours default
        });
    }

    /// Purchase a ONE_GURU access pass
    public entry fun purchase_one_guru_pass(
        buyer: &signer,
        guru_slug: String,
    ) acquires AccessPassState {
        let state = borrow_global_mut<AccessPassState>(@astroproof);
        let buyer_addr = signer::address_of(buyer);

        // Validate guru slug
        assert!(is_valid_guru(&guru_slug), E_INVALID_GURU);

        // Process payment
        let price = state.price_one_guru;
        coin::transfer<AptosCoin>(buyer, state.treasury, price);

        // Create the access pass
        create_access_pass(
            buyer,
            string::utf8(TIER_ONE_GURU),
            guru_slug,
            price,
            state
        );
    }

    /// Purchase an ALL_GURUS access pass
    public entry fun purchase_all_gurus_pass(
        buyer: &signer,
    ) acquires AccessPassState {
        let state = borrow_global_mut<AccessPassState>(@astroproof);
        let buyer_addr = signer::address_of(buyer);

        // Process payment
        let price = state.price_all_gurus;
        coin::transfer<AptosCoin>(buyer, state.treasury, price);

        // Create the access pass
        create_access_pass(
            buyer,
            string::utf8(TIER_ALL_GURUS),
            string::utf8(b""), // Empty guru slug for all gurus
            price,
            state
        );
    }

    /// Internal function to create an access pass
    fun create_access_pass(
        owner: &signer,
        tier: String,
        guru_slug: String,
        price_paid: u64,
        state: &mut AccessPassState,
    ) {
        let owner_addr = signer::address_of(owner);
        let current_time = timestamp::now_seconds();
        let expires_at = current_time + state.pass_duration;

        // Generate pass name and description
        let pass_name = if (tier == string::utf8(TIER_ONE_GURU)) {
            string::utf8(b"One Guru Day Pass")
        } else {
            string::utf8(b"All Gurus Day Pass")
        };

        let pass_description = if (tier == string::utf8(TIER_ONE_GURU)) {
            string::utf8(b"24-hour unlimited access to one spiritual guru")
        } else {
            string::utf8(b"24-hour unlimited access to all spiritual gurus")
        };

        let token_uri = string::utf8(b"https://astroproof.app/passes/");
        string::append(&mut token_uri, tier);

        // Create the token
        let token_constructor_ref = token::create_named_token(
            owner,
            string::utf8(COLLECTION_NAME),
            pass_description,
            pass_name,
            option::none(), // No royalty
            token_uri,
        );

        let token_signer = object::generate_signer(&token_constructor_ref);
        let token_address = signer::address_of(&token_signer);

        // Create and store the access pass data
        let access_pass = AccessPass {
            tier,
            guru_slug,
            issued_at: current_time,
            expires_at,
            app_version: string::utf8(APP_VERSION),
            owner: owner_addr,
            is_active: true,
        };

        move_to(&token_signer, access_pass);

        // Add properties to the token
        let properties = vector::empty<String>();
        let values = vector::empty<String>();
        let types = vector::empty<String>();

        vector::push_back(&mut properties, string::utf8(b"tier"));
        vector::push_back(&mut values, tier);
        vector::push_back(&mut types, string::utf8(b"String"));

        vector::push_back(&mut properties, string::utf8(b"guru_slug"));
        vector::push_back(&mut values, guru_slug);
        vector::push_back(&mut types, string::utf8(b"String"));

        vector::push_back(&mut properties, string::utf8(b"expires_at"));
        vector::push_back(&mut values, string::utf8(b""));
        vector::push_back(&mut types, string::utf8(b"String"));

        vector::push_back(&mut properties, string::utf8(b"app_version"));
        vector::push_back(&mut values, string::utf8(APP_VERSION));
        vector::push_back(&mut types, string::utf8(b"String"));

        property_map::init(&token_constructor_ref, properties, values, types);

        // Update global state
        state.total_passes = state.total_passes + 1;

        // Emit event
        event::emit(PassPurchased {
            token_address,
            owner: owner_addr,
            tier,
            guru_slug,
            issued_at: current_time,
            expires_at,
            price_paid,
        });
    }

    /// Check if a user has valid access to a specific guru
    #[view]
    public fun has_guru_access(
        user_addr: address,
        guru_slug: String,
        pass_addresses: vector<address>
    ): bool acquires AccessPass {
        let current_time = timestamp::now_seconds();
        let i = 0;
        let len = vector::length(&pass_addresses);

        while (i < len) {
            let pass_addr = *vector::borrow(&pass_addresses, i);
            
            if (exists<AccessPass>(pass_addr)) {
                let pass = borrow_global<AccessPass>(pass_addr);
                
                // Check if pass is owned by user, active, and not expired
                if (pass.owner == user_addr && 
                    pass.is_active && 
                    pass.expires_at > current_time) {
                    
                    // Check access type
                    if (pass.tier == string::utf8(TIER_ALL_GURUS)) {
                        return true
                    } else if (pass.tier == string::utf8(TIER_ONE_GURU) && 
                              pass.guru_slug == guru_slug) {
                        return true
                    }
                }
            }
            
            i = i + 1;
        };

        false
    }

    /// Get access pass information
    #[view]
    public fun get_access_pass(token_address: address): (String, String, u64, u64, String, address, bool) acquires AccessPass {
        assert!(exists<AccessPass>(token_address), E_PASS_NOT_FOUND);
        let pass = borrow_global<AccessPass>(token_address);
        (
            pass.tier,
            pass.guru_slug,
            pass.issued_at,
            pass.expires_at,
            pass.app_version,
            pass.owner,
            pass.is_active
        )
    }

    /// Check if an access pass is currently valid
    #[view]
    public fun is_pass_valid(token_address: address): bool acquires AccessPass {
        if (!exists<AccessPass>(token_address)) {
            return false
        };

        let pass = borrow_global<AccessPass>(token_address);
        let current_time = timestamp::now_seconds();
        
        pass.is_active && pass.expires_at > current_time
    }

    /// Get current pricing information
    #[view]
    public fun get_pricing(): (u64, u64) acquires AccessPassState {
        let state = borrow_global<AccessPassState>(@astroproof);
        (state.price_one_guru, state.price_all_gurus)
    }

    /// Get total number of passes issued
    #[view]
    public fun get_total_passes(): u64 acquires AccessPassState {
        let state = borrow_global<AccessPassState>(@astroproof);
        state.total_passes
    }

    /// Helper function to validate guru slugs
    fun is_valid_guru(guru_slug: &String): bool {
        let guru_bytes = string::bytes(guru_slug);
        let valid_gurus = VALID_GURUS;
        let i = 0;
        let len = vector::length(&valid_gurus);

        while (i < len) {
            if (guru_bytes == vector::borrow(&valid_gurus, i)) {
                return true
            };
            i = i + 1;
        };

        false
    }

    /// Admin function to update pricing
    public entry fun update_pricing(
        admin: &signer,
        new_price_one_guru: u64,
        new_price_all_gurus: u64,
    ) acquires AccessPassState {
        let admin_addr = signer::address_of(admin);
        let state = borrow_global_mut<AccessPassState>(@astroproof);
        assert!(admin_addr == state.admin, E_NOT_AUTHORIZED);

        state.price_one_guru = new_price_one_guru;
        state.price_all_gurus = new_price_all_gurus;
    }

    /// Admin function to update pass duration
    public entry fun update_pass_duration(
        admin: &signer,
        new_duration_seconds: u64,
    ) acquires AccessPassState {
        let admin_addr = signer::address_of(admin);
        let state = borrow_global_mut<AccessPassState>(@astroproof);
        assert!(admin_addr == state.admin, E_NOT_AUTHORIZED);

        state.pass_duration = new_duration_seconds;
    }

    /// Admin function to deactivate a pass (emergency use)
    public entry fun deactivate_pass(
        admin: &signer,
        token_address: address,
    ) acquires AccessPassState, AccessPass {
        let admin_addr = signer::address_of(admin);
        let state = borrow_global<AccessPassState>(@astroproof);
        assert!(admin_addr == state.admin, E_NOT_AUTHORIZED);

        assert!(exists<AccessPass>(token_address), E_PASS_NOT_FOUND);
        let pass = borrow_global_mut<AccessPass>(token_address);
        pass.is_active = false;
    }

    #[test_only]
    use std::string;

    #[test(admin = @astroproof)]
    public fun test_initialize(admin: &signer) {
        let treasury = @0x999;
        initialize(admin, treasury);
        
        let state = borrow_global<AccessPassState>(signer::address_of(admin));
        assert!(state.total_passes == 0, 1);
        assert!(state.treasury == treasury, 2);
    }

    #[test]
    public fun test_is_valid_guru() {
        let valid_guru = string::utf8(b"palmistry-sage");
        let invalid_guru = string::utf8(b"invalid-guru");
        
        assert!(is_valid_guru(&valid_guru), 3);
        assert!(!is_valid_guru(&invalid_guru), 4);
    }
}
