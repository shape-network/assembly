// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import {ERC721EnumerableUpgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";
import {ERC721Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import {ReentrancyGuardUpgradeable} from "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";
import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {Ownable2StepUpgradeable} from "@openzeppelin/contracts-upgradeable/access/Ownable2StepUpgradeable.sol";

import {Base64} from "@openzeppelin/contracts/utils/Base64.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";

import {IOtoms, Molecule} from "./interfaces/IOtoms.sol";
import {IOtomsDatabase} from "./interfaces/IOtomsDatabase.sol";
import {ReactionOutputData, IReactionOutputs, Trait, TraitType} from "./interfaces/IReactionOutputs.sol";

contract OtomsReactionOutputs is
    Initializable,
    ERC721EnumerableUpgradeable,
    Ownable2StepUpgradeable,
    ReentrancyGuardUpgradeable,
    IReactionOutputs
{
    using Strings for uint256;

    uint256 public nextTokenId;

    string public imageURI;

    IOtomsDatabase public database;

    mapping(address => bool) public reactors;

    mapping(uint256 => ReactionOutputData) public outputData;

    modifier onlyReactor() {
        if (!reactors[msg.sender]) revert NotReactor();
        _;
    }

    function initialize(address _database, string memory _imageURI) external initializer {
        __ERC721_init("Otoms Reaction Outputs", "OTOMRO");
        __Ownable_init(msg.sender);
        __ReentrancyGuard_init();
        database = IOtomsDatabase(_database);
        imageURI = _imageURI;
    }

    ////////////////////////////////// PUBLIC CORE ////////////////////////////////

    function mint(
        address _to,
        ReactionOutputData memory data
    ) external onlyReactor returns (uint256) {
        uint256 outputId = nextTokenId++;

        outputData[outputId] = data;

        _safeMint(_to, outputId);

        return outputId;
    }

    function burn(uint256 _tokenId) external {
        _update(address(0), _tokenId, _msgSender());
    }

    function consume(uint256 _tokenId) external onlyReactor {
        _burn(_tokenId);
    }

    ////////////////////////////////// PUBLIC UTILITY ////////////////////////////////

    function tokenURI(
        uint256 _tokenId
    ) public view override(ERC721Upgradeable, IReactionOutputs) returns (string memory) {
        uint256[] memory atomIds = outputData[_tokenId].atomIds;

        string[] memory atomNames = new string[](atomIds.length);
        for (uint256 i = 0; i < atomIds.length; i++) {
            atomNames[i] = database.getMoleculeByTokenId(atomIds[i]).name;
        }

        Trait[] memory traits = new Trait[](1);
        traits[0] = Trait({
            typeName: "Atoms reacted",
            valueName: atomIds.length.toString(),
            traitType: TraitType.NUMBER
        });

        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name": "',
                        _getName(atomNames),
                        '", "description": "An unanalysed output from a reaction in the Otoms multiverse.", ',
                        '"image": "',
                        imageURI,
                        '", "attributes": [',
                        _convertTraitsToJsonString(traits),
                        "]}"
                    )
                )
            )
        );

        return string(abi.encodePacked("data:application/json;base64,", json));
    }

    function getReactionOutputData(
        uint256 tokenId
    ) external view returns (ReactionOutputData memory) {
        return outputData[tokenId];
    }

    ////////////////////////////////// ADMIN ////////////////////////////////

    function setImageURI(string memory _imageURI) external onlyOwner {
        imageURI = _imageURI;
    }

    function setReactor(address _reactor, bool _isReactor) external onlyOwner {
        reactors[_reactor] = _isReactor;
    }

    function setDatabase(address _database) external onlyOwner {
        database = IOtomsDatabase(_database);
    }

    ////////////////////////////////// INTERNAL UTILITY ////////////////////////////////

    /// @inheritdoc ERC721EnumerableUpgradeable
    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal override returns (address) {
        address previousOwner = super._update(to, tokenId, auth);

        if (previousOwner != address(0) && to != address(0)) revert CannotTransferReactionOutput();

        return previousOwner;
    }

    function _getName(string[] memory atomNames) internal pure returns (string memory) {
        if (atomNames.length == 0) return "";

        string memory atomName = atomNames[0];
        for (uint256 i = 1; i < atomNames.length; i++) {
            atomName = string(abi.encodePacked(atomName, " + ", atomNames[i]));
        }
        return atomName;
    }

    function _convertTraitsToJsonString(
        Trait[] memory traits
    ) internal pure returns (string memory) {
        string memory attributes;
        uint256 i;
        uint256 length = traits.length;
        unchecked {
            do {
                attributes = string(
                    abi.encodePacked(attributes, _getJSONTraitItem(traits[i], i == length - 1))
                );
            } while (++i < length);
        }
        return attributes;
    }

    function _getJSONTraitItem(
        Trait memory trait,
        bool lastItem
    ) internal pure returns (string memory) {
        if (trait.traitType == TraitType.NUMBER) {
            return
                string(
                    abi.encodePacked(
                        '{"trait_type": "',
                        trait.typeName,
                        '", "value": ',
                        trait.valueName,
                        "}",
                        lastItem ? "" : ","
                    )
                );
        } else {
            return
                string(
                    abi.encodePacked(
                        '{"trait_type": "',
                        trait.typeName,
                        '", "value": "',
                        trait.valueName,
                        '"}',
                        lastItem ? "" : ","
                    )
                );
        }
    }
}
