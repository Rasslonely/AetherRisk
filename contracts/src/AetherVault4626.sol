// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

interface IERC20 {
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
}

interface ICreditRegistry {
    function getCreditProfile(address borrower) external view returns (
        uint16 score,
        uint256 maxCreditLine,
        uint16 apyBps,
        uint256 lastUpdated,
        bytes32 lastProofHash
    );
    function getScore(address borrower) external view returns (uint16 score, uint256 maxCreditLine, uint16 apyBps);
}

/// @title AetherVault4626
/// @notice Institutional ERC-4626 Dynamic Rate Lending Vault on Creditcoin CC3
/// @dev Yield rates and borrowing costs dynamically scale based on borrower credit score from CreditRegistry
contract AetherVault4626 is IERC20 {
    string public name = "AetherRisk Vault Share";
    string public symbol = "avUSD";
    uint8 public constant decimals = 18;

    IERC20 public immutable asset;
    ICreditRegistry public creditRegistry;
    address public owner;

    uint256 public override totalSupply;
    mapping(address => uint256) public override balanceOf;
    mapping(address => mapping(address => uint256)) public override allowance;

    uint256 public totalBorrowed;
    uint256 public lastAccrualTime;

    struct Loan {
        uint256 principal;
        uint256 interestAccrued;
        uint16 apyBps;
        uint256 lastAccrual;
    }

    mapping(address => Loan) public loans;

    event Deposit(address indexed sender, address indexed owner, uint256 assets, uint256 shares);
    event Withdraw(
        address indexed sender,
        address indexed receiver,
        address indexed owner,
        uint256 assets,
        uint256 shares
    );
    event LoanOriginated(address indexed borrower, uint256 amount, uint16 apyBps);
    event LoanRepaid(address indexed borrower, uint256 principalPaid, uint256 interestPaid);
    event CreditRegistryUpdated(address indexed newRegistry);

    modifier onlyOwner() {
        require(msg.sender == owner, "UNAUTHORIZED");
        _;
    }

    constructor(address _asset, address _creditRegistry) {
        require(_asset != address(0), "INVALID_ASSET");
        asset = IERC20(_asset);
        creditRegistry = ICreditRegistry(_creditRegistry);
        owner = msg.sender;
        lastAccrualTime = block.timestamp;
    }

    function setCreditRegistry(address _creditRegistry) external onlyOwner {
        creditRegistry = ICreditRegistry(_creditRegistry);
        emit CreditRegistryUpdated(_creditRegistry);
    }

    // --- ERC-20 Implementation ---

    function transfer(address recipient, uint256 amount) external override returns (bool) {
        _transfer(msg.sender, recipient, amount);
        return true;
    }

    function approve(address spender, uint256 amount) external override returns (bool) {
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function transferFrom(address sender, address recipient, uint256 amount) external override returns (bool) {
        uint256 currentAllowance = allowance[sender][msg.sender];
        if (currentAllowance != type(uint256).max) {
            require(currentAllowance >= amount, "ERC20: insufficient allowance");
            allowance[sender][msg.sender] = currentAllowance - amount;
        }
        _transfer(sender, recipient, amount);
        return true;
    }

    function _transfer(address sender, address recipient, uint256 amount) internal {
        require(balanceOf[sender] >= amount, "ERC20: transfer amount exceeds balance");
        balanceOf[sender] -= amount;
        balanceOf[recipient] += amount;
        emit Transfer(sender, recipient, amount);
    }

    function _mint(address account, uint256 amount) internal {
        totalSupply += amount;
        balanceOf[account] += amount;
        emit Transfer(address(0), account, amount);
    }

    function _burn(address account, uint256 amount) internal {
        require(balanceOf[account] >= amount, "ERC20: burn amount exceeds balance");
        balanceOf[account] -= amount;
        totalSupply -= amount;
        emit Transfer(account, address(0), amount);
    }

    // --- ERC-4626 Core Accounting ---

    function totalAssets() public view returns (uint256) {
        return asset.balanceOf(address(this)) + totalBorrowed;
    }

    function convertToShares(uint256 assets) public view returns (uint256) {
        uint256 supply = totalSupply;
        uint256 total = totalAssets();
        return (supply == 0 || total == 0) ? assets : (assets * supply) / total;
    }

    function convertToAssets(uint256 shares) public view returns (uint256) {
        uint256 supply = totalSupply;
        uint256 total = totalAssets();
        return (supply == 0) ? shares : (shares * total) / supply;
    }

    function previewDeposit(uint256 assets) public view returns (uint256) {
        return convertToShares(assets);
    }

    function previewWithdraw(uint256 assets) public view returns (uint256) {
        return convertToShares(assets);
    }

    function deposit(uint256 assets, address receiver) public returns (uint256 shares) {
        shares = previewDeposit(assets);
        require(shares > 0, "ZERO_SHARES");

        require(asset.transferFrom(msg.sender, address(this), assets), "TRANSFER_FROM_FAILED");
        _mint(receiver, shares);

        emit Deposit(msg.sender, receiver, assets, shares);
    }

    function withdraw(uint256 assets, address receiver, address vaultOwner) public returns (uint256 shares) {
        shares = previewWithdraw(assets);
        if (msg.sender != vaultOwner) {
            uint256 currentAllowance = allowance[vaultOwner][msg.sender];
            if (currentAllowance != type(uint256).max) {
                require(currentAllowance >= shares, "ERC20: insufficient allowance");
                allowance[vaultOwner][msg.sender] = currentAllowance - shares;
            }
        }

        _burn(vaultOwner, shares);
        require(asset.transfer(receiver, assets), "TRANSFER_FAILED");

        emit Withdraw(msg.sender, receiver, vaultOwner, assets, shares);
    }

    // --- Dynamic Lending & Credit Logic ---

    function getDynamicApy(address borrower) public view returns (uint16 apyBps) {
        if (address(creditRegistry) == address(0)) {
            return 650; // default 6.50%
        }
        (uint16 score,, uint16 registryApy) = creditRegistry.getScore(borrower);
        if (registryApy > 0) {
            return registryApy;
        }
        if (score >= 800) {
            return 410; // 4.10% Prime
        } else if (score >= 700) {
            return 650; // 6.50% Growth
        } else {
            return 920; // 9.20% Stressed / Subprime
        }
    }

    function borrow(uint256 amount) external returns (bool) {
        require(amount > 0, "INVALID_BORROW_AMOUNT");
        require(asset.balanceOf(address(this)) >= amount, "INSUFFICIENT_VAULT_LIQUIDITY");

        if (address(creditRegistry) != address(0)) {
            (, uint256 maxCreditLine,) = creditRegistry.getScore(msg.sender);
            require(loans[msg.sender].principal + amount <= maxCreditLine, "EXCEEDS_CREDIT_LINE");
        }

        uint16 apyBps = getDynamicApy(msg.sender);

        Loan storage loan = loans[msg.sender];
        if (loan.principal > 0) {
            // Accrue interest on existing balance
            uint256 timeElapsed = block.timestamp - loan.lastAccrual;
            loan.interestAccrued += (loan.principal * loan.apyBps * timeElapsed) / (10000 * 365 days);
        }

        loan.principal += amount;
        loan.apyBps = apyBps;
        loan.lastAccrual = block.timestamp;

        totalBorrowed += amount;

        require(asset.transfer(msg.sender, amount), "BORROW_TRANSFER_FAILED");
        emit LoanOriginated(msg.sender, amount, apyBps);

        return true;
    }

    function repay(uint256 amount) external returns (bool) {
        Loan storage loan = loans[msg.sender];
        require(loan.principal > 0, "NO_ACTIVE_LOAN");

        uint256 timeElapsed = block.timestamp - loan.lastAccrual;
        uint256 interest = loan.interestAccrued + ((loan.principal * loan.apyBps * timeElapsed) / (10000 * 365 days));

        uint256 totalDue = loan.principal + interest;
        uint256 payAmount = amount > totalDue ? totalDue : amount;

        require(asset.transferFrom(msg.sender, address(this), payAmount), "REPAY_TRANSFER_FAILED");

        if (payAmount <= interest) {
            loan.interestAccrued = interest - payAmount;
        } else {
            uint256 principalPaid = payAmount - interest;
            loan.interestAccrued = 0;
            loan.principal -= principalPaid;
            totalBorrowed -= principalPaid;
        }

        loan.lastAccrual = block.timestamp;
        emit LoanRepaid(msg.sender, payAmount, interest);

        return true;
    }
}
