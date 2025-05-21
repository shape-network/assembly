// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import {Base64} from "@openzeppelin/contracts/utils/Base64.sol";

import {IOtomItemsCore, Item, ComponentType, BlueprintComponent, Trait, TraitType, ItemType, ActualBlueprintComponent} from "../interfaces/IOtomItemsCore.sol";
import {IOtomsDatabase, Molecule} from "../interfaces/IOtomsDatabase.sol";
import {IOtomItemsRenderer} from "../interfaces/IOtomItemsRenderer.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";
import {LibString} from "solady/src/utils/LibString.sol";

contract OtomItemsRenderer is IOtomItemsRenderer {
    using Strings for uint256;
    using Strings for address;

    IOtomsDatabase public otomsDatabase;
    IOtomItemsCore public core;

    constructor(address _otomsDatabase, address _core) {
        otomsDatabase = IOtomsDatabase(_otomsDatabase);
        core = IOtomItemsCore(_core);
    }

    function getMetadata(uint256 tokenId) external view returns (string memory) {
        Item memory item = core.getItemByItemId(core.getItemIdForToken(tokenId));
        Trait[] memory traits = core.getTokenTraits(tokenId);
        uint256 tier = core.nonFungibleTokenToTier(tokenId);

        uint256 additionalTraits = 3 + (tier > 0 ? 1 : 0);
        uint256 totalTraits = traits.length + additionalTraits;

        Trait[] memory allTraits = new Trait[](totalTraits);

        allTraits[0] = Trait({
            typeName: "Item ID",
            valueString: item.id.toString(),
            valueNumber: 0,
            traitType: TraitType.STRING
        });

        allTraits[1] = Trait({
            typeName: "Creator",
            valueString: item.creator.toHexString(),
            valueNumber: 0,
            traitType: TraitType.STRING
        });

        allTraits[2] = Trait({
            typeName: "Stackable",
            valueString: item.itemType == ItemType.FUNGIBLE ? "Yes" : "No",
            valueNumber: 0,
            traitType: TraitType.STRING
        });

        if (item.itemType == ItemType.NON_FUNGIBLE && tier > 0) {
            allTraits[3] = Trait({
                typeName: "Tier",
                valueString: tier.toString(),
                valueNumber: tier,
                traitType: TraitType.NUMBER
            });
        }

        for (uint256 i = 0; i < traits.length; i++) {
            uint256 index = i + additionalTraits;
            allTraits[index] = traits[i];
        }

        string memory nameDisplay = _getNameDisplay(item, tier);

        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name": "',
                        nameDisplay,
                        '", "description": "',
                        item.description,
                        '", "image": "',
                        _render(item, tier, core.nonFungibleTokenToActualBlueprint(tokenId)),
                        '", "defaultImageUri": "',
                        core.getTokenDefaultImageUri(tokenId),
                        '", "attributes": [',
                        _convertTraitsToJsonString(allTraits),
                        "]}"
                    )
                )
            )
        );

        return string(abi.encodePacked("data:application/json;base64,", json));
    }

    function _render(
        Item memory _item,
        uint256 _tier,
        ActualBlueprintComponent[] memory _actualBlueprintComponents
    ) internal view returns (string memory) {
        string memory formula = _getFormula(_item, _actualBlueprintComponents);

        string memory nameDisplay = string(
            abi.encodePacked("(T", _tier.toString(), ") ", _item.name)
        );

        uint256 startRowName = 100;
        uint256 gapName = 30;

        (string memory nameRowsDisplay, uint256 rows) = _sliceBytesIntoCenteredSVGRows(
            bytes(nameDisplay),
            "name",
            10,
            20,
            startRowName,
            gapName
        );

        (string memory formulaRowsDisplay, ) = _sliceBytesIntoCenteredSVGRows(
            bytes(formula),
            "formula",
            3,
            37,
            startRowName + (rows * gapName),
            20
        );

        string memory svg = string(
            abi.encodePacked(
                '<svg width="500" height="500" xmlns="http://www.w3.org/2000/svg">',
                "<style>",
                ".name { font: bold 32px monospace; fill: #000; text-anchor: middle; }",
                ".formula { font: 16px monospace; fill: #000; text-anchor: middle; }",
                ".border { fill: white; stroke: #000; stroke-width: 2; }",
                "</style>",
                '<rect x="10" y="10" width="480" height="480" class="border"/>',
                nameRowsDisplay,
                formulaRowsDisplay,
                "</svg>"
            )
        );

        return string(abi.encodePacked("data:image/svg+xml;base64,", Base64.encode(bytes(svg))));
    }

    function _sliceBytes(
        bytes memory _bytes,
        uint256 _start,
        uint256 _end
    ) internal pure returns (string memory) {
        if (_start >= _bytes.length) {
            return "";
        }
        if (_end > _bytes.length) {
            _end = _bytes.length;
        }

        while (_start < _end && _start > 0 && _isUTF8ContinuationByte(_bytes[_start])) {
            _start++;
        }

        while (_end > _start && _end < _bytes.length && _isUTF8ContinuationByte(_bytes[_end])) {
            _end--;
        }

        bytes memory result = new bytes(_end - _start);
        for (uint256 i = _start; i < _end; i++) {
            result[i - _start] = _bytes[i];
        }

        if (!_isValidUTF8(result)) {
            return _sanitizeUTF8(result);
        }

        return string(result);
    }

    function _isUTF8ContinuationByte(bytes1 b) internal pure returns (bool) {
        return (uint8(b) & 0xC0) == 0x80;
    }

    function _isValidUTF8(bytes memory data) internal pure returns (bool) {
        uint256 i = 0;
        while (i < data.length) {
            if (uint8(data[i]) <= 0x7F) {
                i += 1;
            } else if (uint8(data[i]) >= 0xC2 && uint8(data[i]) <= 0xDF && i + 1 < data.length) {
                if ((uint8(data[i + 1]) & 0xC0) != 0x80) {
                    return false;
                }
                i += 2;
            } else if (uint8(data[i]) >= 0xE0 && uint8(data[i]) <= 0xEF && i + 2 < data.length) {
                if ((uint8(data[i + 1]) & 0xC0) != 0x80 || (uint8(data[i + 2]) & 0xC0) != 0x80) {
                    return false;
                }
                i += 3;
            } else if (uint8(data[i]) >= 0xF0 && uint8(data[i]) <= 0xF7 && i + 3 < data.length) {
                if (
                    (uint8(data[i + 1]) & 0xC0) != 0x80 ||
                    (uint8(data[i + 2]) & 0xC0) != 0x80 ||
                    (uint8(data[i + 3]) & 0xC0) != 0x80
                ) {
                    return false;
                }
                i += 4;
            } else {
                return false;
            }
        }
        return true;
    }

    function _sanitizeUTF8(bytes memory data) internal pure returns (string memory) {
        bytes memory sanitized = new bytes(data.length);
        uint256 sanitizedLength = 0;
        uint256 i = 0;

        while (i < data.length) {
            uint8 firstByte = uint8(data[i]);

            if (firstByte <= 0x7F) {
                sanitized[sanitizedLength++] = data[i];
                i += 1;
            } else if (
                firstByte >= 0xC2 &&
                firstByte <= 0xDF &&
                i + 1 < data.length &&
                (uint8(data[i + 1]) & 0xC0) == 0x80
            ) {
                sanitized[sanitizedLength++] = data[i];
                sanitized[sanitizedLength++] = data[i + 1];
                i += 2;
            } else if (
                firstByte >= 0xE0 &&
                firstByte <= 0xEF &&
                i + 2 < data.length &&
                (uint8(data[i + 1]) & 0xC0) == 0x80 &&
                (uint8(data[i + 2]) & 0xC0) == 0x80
            ) {
                sanitized[sanitizedLength++] = data[i];
                sanitized[sanitizedLength++] = data[i + 1];
                sanitized[sanitizedLength++] = data[i + 2];
                i += 3;
            } else if (
                firstByte >= 0xF0 &&
                firstByte <= 0xF7 &&
                i + 3 < data.length &&
                (uint8(data[i + 1]) & 0xC0) == 0x80 &&
                (uint8(data[i + 2]) & 0xC0) == 0x80 &&
                (uint8(data[i + 3]) & 0xC0) == 0x80
            ) {
                sanitized[sanitizedLength++] = data[i];
                sanitized[sanitizedLength++] = data[i + 1];
                sanitized[sanitizedLength++] = data[i + 2];
                sanitized[sanitizedLength++] = data[i + 3];
                i += 4;
            } else {
                i += 1;
            }
        }

        bytes memory result = new bytes(sanitizedLength);
        for (i = 0; i < sanitizedLength; i++) {
            result[i] = sanitized[i];
        }

        return string(result);
    }

    function _getBlueprintComponentLabel(
        ActualBlueprintComponent memory _component
    ) internal view returns (string memory) {
        if (
            _component.componentType == ComponentType.OTOM ||
            _component.componentType == ComponentType.VARIABLE_OTOM
        ) {
            Molecule memory molecule = otomsDatabase.getMoleculeByTokenId(
                _component.itemIdOrOtomTokenId
            );
            return string(abi.encodePacked(_component.amount.toString(), " ", molecule.name));
        } else if (
            _component.componentType == ComponentType.FUNGIBLE_ITEM ||
            _component.componentType == ComponentType.NON_FUNGIBLE_ITEM
        ) {
            Item memory item = core.getItemByItemId(_component.itemIdOrOtomTokenId);
            return string(abi.encodePacked(_component.amount.toString(), " ", item.name));
        } else {
            return "";
        }
    }

    function _getBlueprintComponentLabel(
        BlueprintComponent memory _component
    ) internal view returns (string memory) {
        if (_component.componentType == ComponentType.OTOM) {
            Molecule memory molecule = otomsDatabase.getMoleculeByTokenId(
                _component.itemIdOrOtomTokenId
            );
            return string(abi.encodePacked(_component.amount.toString(), " ", molecule.name));
        } else if (
            _component.componentType == ComponentType.FUNGIBLE_ITEM ||
            _component.componentType == ComponentType.NON_FUNGIBLE_ITEM
        ) {
            Item memory item = core.getItemByItemId(_component.itemIdOrOtomTokenId);
            return string(abi.encodePacked(_component.amount.toString(), " ", item.name));
        } else {
            return "";
        }
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
            if (bytes(trait.valueString).length == 0) {
                return
                    string(
                        abi.encodePacked(
                            '{"trait_type": "',
                            trait.typeName,
                            '", "value": ',
                            trait.valueNumber.toString(),
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
                            '", "value": ',
                            trait.valueString,
                            "}",
                            lastItem ? "" : ","
                        )
                    );
            }
        } else if (trait.traitType == TraitType.STRING) {
            return
                string(
                    abi.encodePacked(
                        '{"trait_type": "',
                        trait.typeName,
                        '", "value": "',
                        trait.valueString,
                        '"}',
                        lastItem ? "" : ","
                    )
                );
        } else {
            revert InvalidTraitType();
        }
    }

    function _getNameDisplay(
        Item memory _item,
        uint256 _tier
    ) internal pure returns (string memory) {
        if (bytes(_item.name).length > 42) {
            return
                string(
                    abi.encodePacked(
                        "(T",
                        _tier.toString(),
                        ") ",
                        LibString.slice(_item.name, 0, 42),
                        "..."
                    )
                );
        }

        return string(abi.encodePacked("(T", _tier.toString(), ") ", _item.name));
    }

    function _getFormula(
        Item memory _item,
        ActualBlueprintComponent[] memory _actualBlueprintComponents
    ) internal view returns (string memory) {
        string memory formula = "";

        if (_actualBlueprintComponents.length > 0) {
            for (uint256 i = 0; i < _actualBlueprintComponents.length; i++) {
                if (i > 0) {
                    formula = string(abi.encodePacked(formula, " + "));
                }
                formula = string(
                    abi.encodePacked(
                        formula,
                        _getBlueprintComponentLabel(_actualBlueprintComponents[i])
                    )
                );
            }
        } else {
            for (uint256 i = 0; i < _item.blueprint.length; i++) {
                if (i > 0) {
                    formula = string(abi.encodePacked(formula, " + "));
                }
                formula = string(
                    abi.encodePacked(formula, _getBlueprintComponentLabel(_item.blueprint[i]))
                );
            }
        }

        return formula;
    }

    function _sliceBytesIntoCenteredSVGRows(
        bytes memory bytesToSlice,
        string memory className,
        uint256 maxRows,
        uint256 charsPerRow,
        uint256 startRow,
        uint256 gap
    ) internal pure returns (string memory, uint256) {
        if (bytesToSlice.length <= charsPerRow) {
            return (
                string.concat(
                    '<text x="250" y="',
                    startRow.toString(),
                    '" class="',
                    className,
                    '">',
                    string(bytesToSlice),
                    "</text>"
                ),
                1
            );
        }

        uint256 bytesLength = bytesToSlice.length;

        uint256 rows = (bytesLength + charsPerRow - 1) / charsPerRow;

        if (rows > maxRows) {
            rows = maxRows;
        }

        string memory stringInRows = "";
        for (uint256 i = 0; i < rows; i++) {
            uint256 startIdx = i * charsPerRow;
            uint256 endIdx = startIdx + charsPerRow;

            if (endIdx > bytesLength) {
                endIdx = bytesLength;
            }

            if (i == rows - 1 && bytesLength > maxRows * charsPerRow) {
                if (endIdx - startIdx > 3) {
                    endIdx -= 3;
                    stringInRows = string(
                        abi.encodePacked(
                            stringInRows,
                            '<text x="250" y="',
                            (startRow + i * gap).toString(),
                            '" class="',
                            className,
                            '">',
                            _sliceBytes(bytesToSlice, startIdx, endIdx),
                            "...",
                            "</text>"
                        )
                    );
                } else {
                    stringInRows = string(
                        abi.encodePacked(
                            stringInRows,
                            '<text x="250" y="',
                            (startRow + i * gap).toString(),
                            '" class="',
                            className,
                            '">',
                            "...",
                            "</text>"
                        )
                    );
                }
            } else {
                stringInRows = string(
                    abi.encodePacked(
                        stringInRows,
                        '<text x="250" y="',
                        (startRow + i * gap).toString(),
                        '" class="',
                        className,
                        '">',
                        _sliceBytes(bytesToSlice, startIdx, endIdx),
                        "</text>"
                    )
                );
            }
        }

        return (stringInRows, rows);
    }
}
