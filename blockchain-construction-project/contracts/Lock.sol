// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Lock {
    address public owner;
    uint256 public unlockTime;
    uint256 public lockedAmount;

    event Withdraw(address indexed to, uint256 amount);
    
    constructor(uint256 _unlockTime) payable {
        require(_unlockTime > block.timestamp, "Unlock time should be in the future");
        owner = msg.sender;
        unlockTime = _unlockTime;
        lockedAmount = msg.value;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action");
        _;
    }

    modifier hasPassedUnlockTime() {
        require(block.timestamp >= unlockTime, "Unlock time has not yet passed");
        _;
    }

    modifier notYetUnlocked() {
        require(block.timestamp < unlockTime, "Unlock time has already passed");
        _;
    }

    function withdraw() external onlyOwner hasPassedUnlockTime {
        uint256 amount = lockedAmount;
        lockedAmount = 0;
        payable(owner).transfer(amount);
        emit Withdraw(owner, amount);
    }

    function extendLockTime(uint256 _newUnlockTime) external onlyOwner notYetUnlocked {
        require(_newUnlockTime > unlockTime, "New unlock time must be later than the current unlock time");
        unlockTime = _newUnlockTime;
    }

    receive() external payable {
        lockedAmount += msg.value;
    }
}
