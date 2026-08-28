# Critical Pitfalls & Mitigations: AetherRisk

## 4 Fatal Traps & Engineered Countermeasures

### 1. The AI-Wrapper Mirage Trap
- **Risk**: Generic LLM prompt that calls OpenAI to rate creditworthiness; scored as an insecure toy.
- **Mitigation**: Deterministic Bayesian risk mathematical model executed inside AMD SEV-SNP confidential computing enclave, producing cryptographically attested EIP-712 signatures.

### 2. The 15-Minute Testnet Friction Trap
- **Risk**: Live block attestation on CC3/Sepolia taking minutes, causing judges to drop out.
- **Mitigation**: Triple-Layer Proof Resilience engine with pre-cached real cryptographic proofs in Supabase for sub-second, verified time-travel demonstration.

### 3. The Disconnected Backend Trap
- **Risk**: Separate Python/Docker microservices failing on Vercel serverless deployment resulting in empty dashboards.
- **Mitigation**: Full-stack Next.js 15 App Router monolith with serverless connection pooling and 18 pre-seeded operational records.

### 4. TEE Enclave Attestation Scrutiny
- **Risk**: Complex remote quote verification failing or looking half-baked on CC3 testnet.
- **Mitigation**: TEE-Lite pattern with registered `authorizedEnclaveSigners` and `ecrecover` on-chain + downloadable inspection report modal.
