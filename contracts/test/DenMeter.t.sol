// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import {DenMeter} from "../src/DenMeter.sol";

contract MockBarc {
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    function mint(address to, uint256 amount) external { balanceOf[to] += amount; }
    function approve(address spender, uint256 amount) external returns (bool) { allowance[msg.sender][spender] = amount; return true; }
    function transferFrom(address from, address to, uint256 amount) external returns (bool) {
        require(balanceOf[from] >= amount && allowance[from][msg.sender] >= amount);
        balanceOf[from] -= amount;
        allowance[from][msg.sender] -= amount;
        balanceOf[to] += amount;
        return true;
    }
    function transfer(address to, uint256 amount) external returns (bool) {
        require(balanceOf[msg.sender] >= amount);
        balanceOf[msg.sender] -= amount;
        balanceOf[to] += amount;
        return true;
    }
}

contract DenMeterTest is Test {
    MockBarc internal barc;
    DenMeter internal meter;
    address internal alice = address(0xA11CE);

    function setUp() public {
        barc = new MockBarc();
        meter = new DenMeter(address(barc));
        barc.mint(alice, 200_000 ether);
        vm.prank(alice);
        barc.approve(address(meter), type(uint256).max);
    }

    function testStakePullsBarc() public {
        vm.prank(alice);
        meter.stake(10 ether);
        assertEq(meter.stakedOf(alice), 10 ether);
        assertEq(barc.balanceOf(address(meter)), 10 ether);
    }

    function testZeroAmountReverts() public {
        vm.prank(alice);
        vm.expectRevert(DenMeter.ZeroAmount.selector);
        meter.stake(0);
    }

    function testCooldownMinusOneSecondReverts() public {
        vm.startPrank(alice);
        meter.stake(10 ether);
        meter.requestUnstake(10 ether);
        vm.warp(block.timestamp + 7 days - 1);
        vm.expectRevert(DenMeter.CooldownActive.selector);
        meter.withdraw();
        vm.stopPrank();
    }

    function testSecondRequestWhilePendingReverts() public {
        vm.startPrank(alice);
        meter.stake(20 ether);
        meter.requestUnstake(10 ether);
        vm.expectRevert(DenMeter.PendingWithdrawal.selector);
        meter.requestUnstake(1 ether);
        vm.stopPrank();
    }

    function testMaturePendingMustWithdrawFirst() public {
        vm.startPrank(alice);
        meter.stake(20 ether);
        meter.requestUnstake(10 ether);
        vm.warp(block.timestamp + 7 days);
        vm.expectRevert(DenMeter.PendingWithdrawal.selector);
        meter.requestUnstake(1 ether);
        meter.withdraw();
        meter.requestUnstake(1 ether);
        vm.stopPrank();
    }

    function testTierBoundaries() public {
        vm.startPrank(alice);
        (uint8 tier, uint256 calls) = meter.quotaTier(alice);
        assertEq(tier, 0); assertEq(calls, 5);
        meter.stake(1_000 ether);
        (tier, calls) = meter.quotaTier(alice);
        assertEq(tier, 1); assertEq(calls, 50);
        meter.stake(99_000 ether);
        (tier, calls) = meter.quotaTier(alice);
        assertEq(tier, 2); assertEq(calls, 500);
        vm.stopPrank();
    }

    function testQuotaUsesStakeNotWallet() public {
        vm.startPrank(alice);
        meter.stake(999 ether);
        (uint8 tier, uint256 calls) = meter.quotaTier(alice);
        assertEq(tier, 0); assertEq(calls, 5);
        vm.stopPrank();
    }

    function testPauseBlocksStakeAndRequestButNotWithdraw() public {
        vm.startPrank(alice);
        meter.stake(10 ether);
        vm.stopPrank();
        meter.setPaused(true);
        vm.startPrank(alice);
        vm.expectRevert(DenMeter.Paused.selector); meter.stake(1 ether);
        vm.expectRevert(DenMeter.Paused.selector); meter.requestUnstake(1 ether);
        vm.stopPrank();
        meter.setPaused(false);
        vm.prank(alice); meter.requestUnstake(10 ether);
        vm.warp(block.timestamp + 7 days);
        meter.setPaused(true);
        vm.prank(alice); meter.withdraw();
    }

    function testOwner() public {
        address next = address(0xB0B);
        meter.setOwner(next);
        assertEq(meter.owner(), next);
        vm.prank(alice);
        vm.expectRevert(DenMeter.NotOwner.selector);
        meter.setPaused(true);
    }

    function testFuzzRoundTrip(uint96 rawAmount) public {
        uint256 amount = bound(uint256(rawAmount), 1, 100_000 ether);
        vm.startPrank(alice);
        meter.stake(amount);
        meter.requestUnstake(amount);
        vm.warp(block.timestamp + 7 days);
        meter.withdraw();
        vm.stopPrank();
        assertEq(meter.stakedOf(alice), 0);
        assertEq(meter.pendingOf(alice), 0);
        assertEq(barc.balanceOf(alice), 200_000 ether);
    }
}
