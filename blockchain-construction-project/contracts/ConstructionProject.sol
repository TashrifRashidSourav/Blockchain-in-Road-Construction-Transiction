// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ConstructionProject {
    address public government;
    address public contractor;
    address public auditor;

    uint public totalBudget;
    uint public releasedFunds = 0;
    mapping(uint => bool) public milestonesVerified;

    event MilestoneVerified(uint milestoneId);
    event FundsReleased(uint milestoneId, uint amount);

    constructor(address _contractor, address _auditor, uint _totalBudget) {
        government = msg.sender;
        contractor = _contractor;
        auditor = _auditor;
        totalBudget = _totalBudget;
    }

    function verifyMilestone(uint milestoneId) public {
        require(msg.sender == auditor, "Only auditor can verify milestones");
        milestonesVerified[milestoneId] = true;
        emit MilestoneVerified(milestoneId);
    }

    function releaseFunds(uint milestoneId, uint amount) public {
        require(msg.sender == government, "Only government can release funds");
        require(milestonesVerified[milestoneId], "Milestone not verified");
        require(releasedFunds + amount <= totalBudget, "Exceeds budget");

        releasedFunds += amount;
        payable(contractor).transfer(amount);
        emit FundsReleased(milestoneId, amount);
    }

    receive() external payable {}
}