// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import {ERC20Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

import {Ownable2StepUpgradeable} from "@openzeppelin/contracts-upgradeable/access/Ownable2StepUpgradeable.sol";

import {ReentrancyGuardUpgradeable} from "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";

import {IEnergy} from "./interfaces/IEnergy.sol";

contract Energy is
    Initializable,
    ERC20Upgradeable,
    Ownable2StepUpgradeable,
    ReentrancyGuardUpgradeable,
    IEnergy
{
    mapping(address => bool) public operators;

    /**
     * @notice This empty reserved space is put in place to allow future versions to add new
     * variables without shifting down storage in the inheritance chain.
     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
     */
    uint256[1_000] private __gap;

    modifier onlyOperator() {
        if (!operators[msg.sender]) revert NotAuthorized();
        _;
    }

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize() public initializer {
        __ERC20_init("Energy", "NRG");
        __Ownable_init(msg.sender);
        __Ownable2Step_init();
        __ReentrancyGuard_init();
    }

    function decimals() public pure override(ERC20Upgradeable, IEnergy) returns (uint8) {
        return 18;
    }

    ////////////////////////////////// TRANSFORMATION ////////////////////////////////

    function transform(address to, uint256 amount) external nonReentrant onlyOperator {
        _mint(to, amount);
    }

    ////////////////////////////////// UTILIZATION ////////////////////////////////

    function consume(address from, uint256 amount) external nonReentrant onlyOperator {
        _burn(from, amount);
    }

    ////////////////////////////////// ADMIN ////////////////////////////////

    function toggleOperator(address _operator) external onlyOwner {
        operators[_operator] = !operators[_operator];
    }
}
