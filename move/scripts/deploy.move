/// Deployment script for AstroProof Move contracts
/// This script initializes all the necessary contracts in the correct order
script {
    use astroproof::astroproof;
    use astroproof::access_pass;
    use astroproof::treasury;

    /// Deploy and initialize all AstroProof contracts
    /// This should be called by the contract deployer/admin account
    fun deploy_astroproof(
        admin: &signer,
        treasury_address: address,
    ) {
        // 1. Initialize Treasury first (needed by AccessPass)
        treasury::initialize(admin, treasury_address);

        // 2. Initialize AccessPass (depends on treasury)
        access_pass::initialize(admin, treasury_address);

        // 3. Initialize AstroProof reading verification
        astroproof::initialize(admin);
    }

    /// Alternative script for testing deployment on testnet
    fun deploy_testnet(admin: &signer) {
        // Use admin address as treasury for testing
        let admin_addr = std::signer::address_of(admin);
        deploy_astroproof(admin, admin_addr);
    }
}
