// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

/// @title CreditRegistry
/// @notice On-chain Credit Score Registry and TEE-Lite Trust Boundary on Creditcoin CC3
/// @dev Verifies EIP-712 typed data signatures from authorized AMD SEV-SNP TEE enclaves
contract CreditRegistry {
    string public constant NAME = "AetherRisk CreditRegistry";
    string public constant VERSION = "1";

    bytes32 public constant DOMAIN_TYPEHASH = keccak256(
        "EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"
    );

    bytes32 public constant RISK_MUTATION_TYPEHASH = keccak256(
        "RiskMutation(address borrower,uint16 oldScore,uint16 newScore,uint256 maxCreditLine,uint16 apyBps,bytes32 attestcoinProofHash,uint256 nonce,uint256 deadline)"
    );

    address public owner;
    bytes32 public immutable DOMAIN_SEPARATOR;

    mapping(address => bool) public authorizedEnclaveSigners;
    mapping(bytes32 => bool) public processedMutations;
    mapping(address => uint256) public enclaveNonces;

    struct CreditProfile {
        uint16 score;              // 300 - 850
        uint256 maxCreditLineUsd;  // 18 decimals
        uint16 apyBps;             // Basis points (e.g. 410 = 4.10%)
        uint256 lastUpdated;
        bytes32 lastProofHash;
    }

    mapping(address => CreditProfile) public profiles;

    event EnclaveSignerRegistered(address indexed signer, bytes32 hardwareId);
    event EnclaveSignerRemoved(address indexed signer);
    event EnclaveSignerUsed(address indexed signer, bytes32 indexed mutationHash);
    event CreditScoreUpdated(
        address indexed borrower,
        uint16 oldScore,
        uint16 newScore,
        uint256 maxCreditLine,
        uint16 apyBps,
        bytes32 attestcoinProofHash
    );
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    modifier onlyOwner() {
        require(msg.sender == owner, "UNAUTHORIZED");
        _;
    }

    constructor(address initialEnclaveSigner, bytes32 hardwareId) {
        owner = msg.sender;
        DOMAIN_SEPARATOR = keccak256(
            abi.encode(
                DOMAIN_TYPEHASH,
                keccak256(bytes(NAME)),
                keccak256(bytes(VERSION)),
                block.chainid,
                address(this)
            )
        );

        if (initialEnclaveSigner != address(0)) {
            authorizedEnclaveSigners[initialEnclaveSigner] = true;
            emit EnclaveSignerRegistered(initialEnclaveSigner, hardwareId);
        }
    }

    function registerEnclaveSigner(address signer, bytes32 hardwareId) external onlyOwner {
        require(signer != address(0), "INVALID_SIGNER");
        authorizedEnclaveSigners[signer] = true;
        emit EnclaveSignerRegistered(signer, hardwareId);
    }

    function removeEnclaveSigner(address signer) external onlyOwner {
        require(authorizedEnclaveSigners[signer], "SIGNER_NOT_REGISTERED");
        authorizedEnclaveSigners[signer] = false;
        emit EnclaveSignerRemoved(signer);
    }

    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "INVALID_OWNER");
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }

    function getCreditProfile(address borrower) external view returns (
        uint16 score,
        uint256 maxCreditLine,
        uint16 apyBps,
        uint256 lastUpdated,
        bytes32 lastProofHash
    ) {
        CreditProfile memory profile = profiles[borrower];
        if (profile.score == 0) {
            // Default profile for uninitialized borrower: 620 score, $1M line, 9.20% APY
            return (620, 1000000e18, 920, 0, bytes32(0));
        }
        return (
            profile.score,
            profile.maxCreditLineUsd,
            profile.apyBps,
            profile.lastUpdated,
            profile.lastProofHash
        );
    }

    function getScore(address borrower) external view returns (uint16 score, uint256 maxCreditLine, uint16 apyBps) {
        CreditProfile memory profile = profiles[borrower];
        if (profile.score == 0) {
            return (620, 1000000e18, 920);
        }
        return (profile.score, profile.maxCreditLineUsd, profile.apyBps);
    }

    function updateCreditScore(
        address borrower,
        uint16 oldScore,
        uint16 newScore,
        uint256 maxCreditLine,
        uint16 apyBps,
        bytes32 attestcoinProofHash,
        uint256 nonce,
        uint256 deadline,
        bytes calldata signature
    ) external returns (bool) {
        require(block.timestamp <= deadline, "SIGNATURE_EXPIRED");
        require(newScore >= 300 && newScore <= 850, "SCORE_OUT_OF_BOUNDS");

        bytes32 structHash = keccak256(
            abi.encode(
                RISK_MUTATION_TYPEHASH,
                borrower,
                oldScore,
                newScore,
                maxCreditLine,
                apyBps,
                attestcoinProofHash,
                nonce,
                deadline
            )
        );

        bytes32 digest = keccak256(
            abi.encodePacked("\x19\x01", DOMAIN_SEPARATOR, structHash)
        );

        require(!processedMutations[digest], "DUPLICATE_MUTATION");

        address recovered = _recoverSigner(digest, signature);
        require(authorizedEnclaveSigners[recovered], "INVALID_ENCLAVE_SIG");

        processedMutations[digest] = true;
        enclaveNonces[recovered] = nonce + 1;

        profiles[borrower] = CreditProfile({
            score: newScore,
            maxCreditLineUsd: maxCreditLine,
            apyBps: apyBps,
            lastUpdated: block.timestamp,
            lastProofHash: attestcoinProofHash
        });

        emit EnclaveSignerUsed(recovered, digest);
        emit CreditScoreUpdated(
            borrower,
            oldScore,
            newScore,
            maxCreditLine,
            apyBps,
            attestcoinProofHash
        );

        return true;
    }

    function _recoverSigner(bytes32 digest, bytes memory signature) internal pure returns (address) {
        require(signature.length == 65, "INVALID_SIG_LENGTH");
        bytes32 r;
        bytes32 s;
        uint8 v;

        assembly {
            r := mload(add(signature, 32))
            s := mload(add(signature, 64))
            v := byte(0, mload(add(signature, 96)))
        }

        if (v < 27) {
            v += 27;
        }

        require(v == 27 || v == 28, "INVALID_SIG_V");
        address signer = ecrecover(digest, v, r, s);
        require(signer != address(0), "INVALID_SIGNER_RECOVERY");
        return signer;
    }
}
