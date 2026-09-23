// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IERC20 {
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function transfer(address to, uint256 amount) external returns (bool);
}

contract DenMeter {
    uint256 public constant COOLDOWN = 7 days;
    uint256 public constant PACK_THRESHOLD = 1_000 ether;
    uint256 public constant WOLF_THRESHOLD = 100_000 ether;

    IERC20 public immutable barc;
    address public owner;
    bool public paused;
    uint256 public totalStaked;

    mapping(address => uint256) public stakedOf;
    mapping(address => uint256) public pendingOf;
    mapping(address => uint256) public unlockAt;

    error NotOwner();
    error Paused();
    error ZeroAmount();
    error InsufficientStake();
    error PendingWithdrawal();
    error CooldownActive();
    error TransferFailed();

    event Staked(address indexed user, uint256 amount);
    event UnstakeRequested(address indexed user, uint256 amount, uint256 unlockAt);
    event Withdrawn(address indexed user, uint256 amount);
    event PausedSet(bool paused);
    event OwnerSet(address indexed owner);

    constructor(address barc_) {
        if (barc_ == address(0)) revert ZeroAmount();
        barc = IERC20(barc_);
        owner = msg.sender;
        emit OwnerSet(msg.sender);
    }

    modifier onlyOwner() {
        if (msg.sender != owner) revert NotOwner();
        _;
    }

    modifier whenActive() {
        if (paused) revert Paused();
        _;
    }

    function stake(uint256 amount) external whenActive {
        if (amount == 0) revert ZeroAmount();
        if (!barc.transferFrom(msg.sender, address(this), amount)) revert TransferFailed();
        stakedOf[msg.sender] += amount;
        totalStaked += amount;
        emit Staked(msg.sender, amount);
    }

    function requestUnstake(uint256 amount) external whenActive {
        if (amount == 0) revert ZeroAmount();
        if (pendingOf[msg.sender] != 0) revert PendingWithdrawal();
        if (amount > stakedOf[msg.sender]) revert InsufficientStake();
        stakedOf[msg.sender] -= amount;
        totalStaked -= amount;
        pendingOf[msg.sender] = amount;
        uint256 availableAt = block.timestamp + COOLDOWN;
        unlockAt[msg.sender] = availableAt;
        emit UnstakeRequested(msg.sender, amount, availableAt);
    }

    function withdraw() external {
        uint256 amount = pendingOf[msg.sender];
        if (amount == 0) revert ZeroAmount();
        if (block.timestamp < unlockAt[msg.sender]) revert CooldownActive();
        pendingOf[msg.sender] = 0;
        unlockAt[msg.sender] = 0;
        if (!barc.transfer(msg.sender, amount)) revert TransferFailed();
        emit Withdrawn(msg.sender, amount);
    }

    function quotaTier(address user) external view returns (uint8 tier, uint256 dailyCalls) {
        uint256 amount = stakedOf[user];
        if (amount >= WOLF_THRESHOLD) return (2, 500);
        if (amount >= PACK_THRESHOLD) return (1, 50);
        return (0, 5);
    }

    function setPaused(bool value) external onlyOwner {
        paused = value;
        emit PausedSet(value);
    }

    function setOwner(address nextOwner) external onlyOwner {
        if (nextOwner == address(0)) revert ZeroAmount();
        owner = nextOwner;
        emit OwnerSet(nextOwner);
    }
}
