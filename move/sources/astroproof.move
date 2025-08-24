/// AstroProof Reading Verification Contract
/// This contract manages the creation and verification of astrology reading proofs on Aptos blockchain.
/// It ensures privacy by storing only cryptographic hashes while maintaining verifiability.
module astroproof::astroproof {
    use std::string::{Self, String};
    use std::vector;
    use std::signer;
    use std::timestamp;
    use std::option::{Self, Option};
    use aptos_framework::object::{Self, Object, ObjectCore};
    use aptos_framework::event;
    use aptos_token_objects::collection;
    use aptos_token_objects::token;
    use aptos_token_objects::royalty;
    use aptos_token_objects::property_map;

    /// Error codes
    const E_NOT_AUTHORIZED: u64 = 1;
    const E_COLLECTION_NOT_FOUND: u64 = 2;
    const E_INVALID_HASH: u64 = 3;
    const E_READING_NOT_FOUND: u64 = 4;
    const E_VERIFICATION_FAILED: u64 = 5;
    const E_ALREADY_EXISTS: u64 = 6;

    /// Constants
    const COLLECTION_NAME: vector<u8> = b"AstroProofs";
    const COLLECTION_DESCRIPTION: vector<u8> = b"AI astrology readings with cryptographic verification on Aptos blockchain. Public proof, private details.";
    const COLLECTION_URI: vector<u8> = b"https://astroproof.app/collection";
    const APP_VERSION: vector<u8> = b"web-mvp-1.0";

    /// Reading proof structure
    struct ReadingProof has key {
        /// Hash of the normalized input data (birth info, questions)
        session_hash: String,
        /// Hash of the generated reading content
        report_hash: String,
        /// Timestamp when the reading was created
        created_at: u64,
        /// Encrypted URI pointing to the full reading
        encrypted_uri: String,
        /// Application version that generated this reading
        app_version: String,
        /// Address of the reading owner
        owner: address,
    }

    /// Global state for tracking collection
    struct AstroProofState has key {
        /// Collection object for all reading proofs
        collection: Object<collection::Collection>,
        /// Admin address who can manage the contract
        admin: address,
        /// Total number of readings created
        total_readings: u64,
    }

    /// Events
    #[event]
    struct ReadingCreated has drop, store {
        token_address: address,
        owner: address,
        session_hash: String,
        report_hash: String,
        created_at: u64,
    }

    #[event]
    struct ReadingVerified has drop, store {
        token_address: address,
        verifier: address,
        verification_result: bool,
        verified_at: u64,
    }

    /// Initialize the AstroProof contract
    /// This creates the main collection for reading proofs
    public entry fun initialize(admin: &signer) {
        let admin_addr = signer::address_of(admin);
        
        // Ensure this is called only once
        assert!(!exists<AstroProofState>(admin_addr), E_ALREADY_EXISTS);

        // Create the collection for reading proofs
        let collection_constructor_ref = collection::create_unlimited_collection(
            admin,
            string::utf8(COLLECTION_DESCRIPTION),
            string::utf8(COLLECTION_NAME),
            option::none(), // No royalty
            string::utf8(COLLECTION_URI)
        );

        let collection_object = object::object_from_constructor_ref(&collection_constructor_ref);

        // Store global state
        move_to(admin, AstroProofState {
            collection: collection_object,
            admin: admin_addr,
            total_readings: 0,
        });
    }

    /// Create a new reading proof NFT
    /// This function mints an NFT that represents a verified astrology reading
    public entry fun create_reading_proof(
        owner: &signer,
        session_hash: String,
        report_hash: String,
        encrypted_uri: String,
        name: String,
        description: String,
    ) acquires AstroProofState {
        let owner_addr = signer::address_of(owner);
        let state = borrow_global_mut<AstroProofState>(@astroproof);
        
        // Validate hash lengths (should be 64 characters for SHA-256)
        assert!(string::length(&session_hash) == 64, E_INVALID_HASH);
        assert!(string::length(&report_hash) == 64, E_INVALID_HASH);

        let current_time = timestamp::now_seconds();

        // Create the token
        let token_constructor_ref = token::create_named_token(
            owner,
            string::utf8(COLLECTION_NAME),
            description,
            name,
            option::none(), // No royalty
            encrypted_uri,
        );

        let token_signer = object::generate_signer(&token_constructor_ref);
        let token_address = signer::address_of(&token_signer);

        // Create and store the reading proof data
        let reading_proof = ReadingProof {
            session_hash,
            report_hash,
            created_at: current_time,
            encrypted_uri,
            app_version: string::utf8(APP_VERSION),
            owner: owner_addr,
        };

        move_to(&token_signer, reading_proof);

        // Add properties to the token
        let properties = vector::empty<String>();
        let values = vector::empty<String>();
        let types = vector::empty<String>();

        vector::push_back(&mut properties, string::utf8(b"session_hash"));
        vector::push_back(&mut values, session_hash);
        vector::push_back(&mut types, string::utf8(b"String"));

        vector::push_back(&mut properties, string::utf8(b"report_hash"));
        vector::push_back(&mut values, report_hash);
        vector::push_back(&mut types, string::utf8(b"String"));

        vector::push_back(&mut properties, string::utf8(b"created_at"));
        vector::push_back(&mut values, string::utf8(b""));
        vector::push_back(&mut types, string::utf8(b"String"));

        vector::push_back(&mut properties, string::utf8(b"app_version"));
        vector::push_back(&mut values, string::utf8(APP_VERSION));
        vector::push_back(&mut types, string::utf8(b"String"));

        property_map::init(&token_constructor_ref, properties, values, types);

        // Update global state
        state.total_readings = state.total_readings + 1;

        // Emit event
        event::emit(ReadingCreated {
            token_address,
            owner: owner_addr,
            session_hash,
            report_hash,
            created_at: current_time,
        });
    }

    /// Verify a reading proof by checking hashes
    /// This allows anyone to verify the integrity of a reading
    public entry fun verify_reading(
        verifier: &signer,
        token_address: address,
        expected_session_hash: String,
        expected_report_hash: String,
    ) acquires ReadingProof {
        let verifier_addr = signer::address_of(verifier);
        assert!(exists<ReadingProof>(token_address), E_READING_NOT_FOUND);

        let reading_proof = borrow_global<ReadingProof>(token_address);
        
        let verification_result = 
            reading_proof.session_hash == expected_session_hash &&
            reading_proof.report_hash == expected_report_hash;

        // Emit verification event
        event::emit(ReadingVerified {
            token_address,
            verifier: verifier_addr,
            verification_result,
            verified_at: timestamp::now_seconds(),
        });

        // Revert if verification failed to provide immediate feedback
        assert!(verification_result, E_VERIFICATION_FAILED);
    }

    /// Get reading proof data for a token
    #[view]
    public fun get_reading_proof(token_address: address): (String, String, u64, String, String, address) acquires ReadingProof {
        assert!(exists<ReadingProof>(token_address), E_READING_NOT_FOUND);
        let reading_proof = borrow_global<ReadingProof>(token_address);
        (
            reading_proof.session_hash,
            reading_proof.report_hash,
            reading_proof.created_at,
            reading_proof.encrypted_uri,
            reading_proof.app_version,
            reading_proof.owner
        )
    }

    /// Get total number of readings created
    #[view]
    public fun get_total_readings(): u64 acquires AstroProofState {
        let state = borrow_global<AstroProofState>(@astroproof);
        state.total_readings
    }

    /// Check if a reading proof exists
    #[view]
    public fun reading_exists(token_address: address): bool {
        exists<ReadingProof>(token_address)
    }

    /// Get collection information
    #[view]
    public fun get_collection_info(): (String, String, String) {
        (
            string::utf8(COLLECTION_NAME),
            string::utf8(COLLECTION_DESCRIPTION),
            string::utf8(COLLECTION_URI)
        )
    }

    /// Admin function to update collection URI
    public entry fun update_collection_uri(
        admin: &signer,
        new_uri: String,
    ) acquires AstroProofState {
        let admin_addr = signer::address_of(admin);
        let state = borrow_global<AstroProofState>(@astroproof);
        assert!(admin_addr == state.admin, E_NOT_AUTHORIZED);

        // This would require additional collection management functions
        // For now, we'll keep the URI immutable for security
    }

    #[test_only]
    use std::string;

    #[test_only]
    const ADMIN: address = @0x100;

    #[test(admin = @astroproof)]
    public fun test_initialize(admin: &signer) {
        // Test initialization
        initialize(admin);
        
        let state = borrow_global<AstroProofState>(signer::address_of(admin));
        assert!(state.total_readings == 0, 1);
        assert!(state.admin == signer::address_of(admin), 2);
    }

    #[test(admin = @astroproof, user = @0x123)]
    public fun test_create_reading_proof(admin: &signer, user: &signer) acquires AstroProofState {
        // Initialize first
        initialize(admin);

        // Create a reading proof
        let session_hash = string::utf8(b"1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef");
        let report_hash = string::utf8(b"fedcba0987654321fedcba0987654321fedcba0987654321fedcba0987654321");
        let encrypted_uri = string::utf8(b"https://storage.example.com/encrypted/reading123");
        let name = string::utf8(b"Test Reading Proof");
        let description = string::utf8(b"A test astrology reading proof");

        create_reading_proof(
            user,
            session_hash,
            report_hash,
            encrypted_uri,
            name,
            description
        );

        let state = borrow_global<AstroProofState>(signer::address_of(admin));
        assert!(state.total_readings == 1, 3);
    }
}
