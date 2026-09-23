// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IERC721Owner {
    function ownerOf(uint256 tokenId) external view returns (address);
}

interface IERC20Transfer {
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
}

contract LicenseRegistry {
    struct Record {
        address owner;
        bytes32 docHash;
        uint64 time;
    }

    IERC721Owner public immutable rally;
    IERC20Transfer public immutable barc;
    address public immutable treasury;
    uint256 public immutable fee;
    mapping(uint256 => Record) private records;

    error NotTokenOwner();
    error FeeTransferFailed();

    event Registered(uint256 indexed tokenId, address indexed owner, bytes32 docHash, uint256 time);

    constructor(address rally_, address barc_, address treasury_, uint256 fee_) {
        rally = IERC721Owner(rally_);
        barc = IERC20Transfer(barc_);
        treasury = treasury_;
        fee = fee_;
    }

    function register(uint256 tokenId, bytes32 docHash) external {
        if (rally.ownerOf(tokenId) != msg.sender) revert NotTokenOwner();
        if (fee != 0 && !barc.transferFrom(msg.sender, treasury, fee)) revert FeeTransferFailed();
        records[tokenId] = Record(msg.sender, docHash, uint64(block.timestamp));
        emit Registered(tokenId, msg.sender, docHash, block.timestamp);
    }

    function latest(uint256 tokenId) external view returns (address owner, bytes32 docHash, uint256 time) {
        Record memory record = records[tokenId];
        return (record.owner, record.docHash, record.time);
    }
}