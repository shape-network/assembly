// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import {ERC1155SupplyUpgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC1155/extensions/ERC1155SupplyUpgradeable.sol";
import {ERC1155Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";
import {ReentrancyGuardUpgradeable} from "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";
import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {Ownable2StepUpgradeable} from "@openzeppelin/contracts-upgradeable/access/Ownable2StepUpgradeable.sol";
import {IERC165} from "@openzeppelin/contracts/utils/introspection/IERC165.sol";

import {IOtomItemsCore} from "../interfaces/IOtomItemsCore.sol";
import {IOtomItems} from "../interfaces/IOtomItems.sol";
import {IOtomItemsTracking} from "../interfaces/IOtomItemsTracking.sol";

/**
 * @title OtomItems
 * @dev ERC1155 contract for items that can be minted using blueprints of Otoms tokens and other items
 */
contract OtomItems is Initializable, ERC1155SupplyUpgradeable, Ownable2StepUpgradeable {
    string public constant name = "OTOM Items";

    IOtomItemsCore public core;
    IOtomItemsTracking public tracking;

    error NotCore();
    event MetadataUpdate(uint256 id);

    /**
     * @notice This empty reserved space is put in place to allow future versions to add new
     * variables without shifting down storage in the inheritance chain.
     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
     */
    uint256[1_000] private __gap;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    /**
     * @dev Initializes the contract with the Otoms contract address
     * @param _coreAddress Address of the Otoms contract
     * @param _trackingAddress Address of the Otoms tracking contract
     */
    function initialize(address _coreAddress, address _trackingAddress) public initializer {
        __ERC1155_init("");
        __ERC1155Supply_init();
        __Ownable_init(msg.sender);
        __Ownable2Step_init();

        core = IOtomItemsCore(_coreAddress);
        tracking = IOtomItemsTracking(_trackingAddress);
    }

    modifier onlyCore() {
        if (msg.sender != address(core)) revert NotCore();
        _;
    }

    function uri(uint256 id) public view override returns (string memory) {
        return core.getTokenUri(id);
    }

    function mint(address to, uint256 id, uint256 amount, bytes memory data) public onlyCore {
        _mint(to, id, amount, data);
    }

    function burn(address from, uint256 id, uint256 amount) public onlyCore {
        _burn(from, id, amount);
    }

    function emitMetadataUpdate(uint256 id) public onlyCore {
        emit MetadataUpdate(id);
    }

    function burnBatch(
        address from,
        uint256[] memory ids,
        uint256[] memory amounts
    ) public onlyCore {
        _burnBatch(from, ids, amounts);
    }

    function _update(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory values
    ) internal override {
        super._update(from, to, ids, values);
        core.onUpdate(from, to, ids, values);
        tracking.onUpdate(from, to, ids, values);
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view virtual override(ERC1155Upgradeable) returns (bool) {
        return interfaceId == type(IOtomItems).interfaceId || super.supportsInterface(interfaceId);
    }
}
