// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { FHE, euint32, euint64, ebool } from "@fhevm/solidity/lib/FHE.sol";
import { SepoliaConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

contract ConfidentialPropertyValuation is SepoliaConfig {

    address public owner;
    uint256 public nextPropertyId;
    uint256 public nextValuationId;

    struct Property {
        euint32 area;          // Encrypted area in square meters
        euint32 bedrooms;      // Encrypted number of bedrooms
        euint32 bathrooms;     // Encrypted number of bathrooms
        euint32 yearBuilt;     // Encrypted year built
        euint32 floorLevel;    // Encrypted floor level
        euint32 locationScore; // Encrypted location score (1-100)
        bool isActive;
        address owner;
        uint256 timestamp;
    }

    struct Valuation {
        uint256 propertyId;
        euint64 estimatedValue;    // Encrypted estimated value
        euint32 confidenceScore;   // Encrypted confidence score (1-100)
        address valuator;
        uint256 timestamp;
        bool isRevealed;
        uint64 revealedValue;      // Only set after revelation
        uint32 revealedConfidence;
    }

    mapping(uint256 => Property) public properties;
    mapping(uint256 => Valuation) public valuations;
    mapping(address => bool) public authorizedValuators;
    mapping(address => uint256[]) public ownerProperties;
    mapping(uint256 => uint256[]) public propertyValuations;

    event PropertyRegistered(uint256 indexed propertyId, address indexed owner);
    event ValuationSubmitted(uint256 indexed valuationId, uint256 indexed propertyId, address indexed valuator);
    event ValuationRevealed(uint256 indexed valuationId, uint64 value, uint32 confidence);
    event ValuatorAuthorized(address indexed valuator);
    event ValuatorRevoked(address indexed valuator);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    modifier onlyAuthorizedValuator() {
        require(authorizedValuators[msg.sender], "Not authorized valuator");
        _;
    }

    modifier onlyPropertyOwner(uint256 propertyId) {
        require(properties[propertyId].owner == msg.sender, "Not property owner");
        _;
    }

    constructor() {
        owner = msg.sender;
        nextPropertyId = 1;
        nextValuationId = 1;
    }

    function authorizeValuator(address valuator) external onlyOwner {
        authorizedValuators[valuator] = true;
        emit ValuatorAuthorized(valuator);
    }

    function revokeValuator(address valuator) external onlyOwner {
        authorizedValuators[valuator] = false;
        emit ValuatorRevoked(valuator);
    }

    function registerProperty(
        uint32 _area,
        uint32 _bedrooms,
        uint32 _bathrooms,
        uint32 _yearBuilt,
        uint32 _floorLevel,
        uint32 _locationScore
    ) external returns (uint256) {
        require(_locationScore <= 100, "Location score must be 0-100");
        require(_area > 0, "Area must be greater than 0");
        require(_yearBuilt > 1800, "Year built must be realistic");

        // Encrypt all property data
        euint32 encryptedArea = FHE.asEuint32(_area);
        euint32 encryptedBedrooms = FHE.asEuint32(_bedrooms);
        euint32 encryptedBathrooms = FHE.asEuint32(_bathrooms);
        euint32 encryptedYearBuilt = FHE.asEuint32(_yearBuilt);
        euint32 encryptedFloorLevel = FHE.asEuint32(_floorLevel);
        euint32 encryptedLocationScore = FHE.asEuint32(_locationScore);

        uint256 propertyId = nextPropertyId++;

        properties[propertyId] = Property({
            area: encryptedArea,
            bedrooms: encryptedBedrooms,
            bathrooms: encryptedBathrooms,
            yearBuilt: encryptedYearBuilt,
            floorLevel: encryptedFloorLevel,
            locationScore: encryptedLocationScore,
            isActive: true,
            owner: msg.sender,
            timestamp: block.timestamp
        });

        ownerProperties[msg.sender].push(propertyId);

        // Grant access permissions
        FHE.allowThis(encryptedArea);
        FHE.allowThis(encryptedBedrooms);
        FHE.allowThis(encryptedBathrooms);
        FHE.allowThis(encryptedYearBuilt);
        FHE.allowThis(encryptedFloorLevel);
        FHE.allowThis(encryptedLocationScore);

        // Allow property owner to access their own data
        FHE.allow(encryptedArea, msg.sender);
        FHE.allow(encryptedBedrooms, msg.sender);
        FHE.allow(encryptedBathrooms, msg.sender);
        FHE.allow(encryptedYearBuilt, msg.sender);
        FHE.allow(encryptedFloorLevel, msg.sender);
        FHE.allow(encryptedLocationScore, msg.sender);

        emit PropertyRegistered(propertyId, msg.sender);
        return propertyId;
    }

    function submitValuation(
        uint256 propertyId,
        uint64 _estimatedValue,
        uint32 _confidenceScore
    ) external onlyAuthorizedValuator returns (uint256) {
        require(properties[propertyId].isActive, "Property not active");
        require(_confidenceScore <= 100, "Confidence score must be 0-100");
        require(_estimatedValue > 0, "Valuation must be positive");

        // Encrypt valuation data
        euint64 encryptedValue = FHE.asEuint64(_estimatedValue);
        euint32 encryptedConfidence = FHE.asEuint32(_confidenceScore);

        uint256 valuationId = nextValuationId++;

        valuations[valuationId] = Valuation({
            propertyId: propertyId,
            estimatedValue: encryptedValue,
            confidenceScore: encryptedConfidence,
            valuator: msg.sender,
            timestamp: block.timestamp,
            isRevealed: false,
            revealedValue: 0,
            revealedConfidence: 0
        });

        propertyValuations[propertyId].push(valuationId);

        // Grant access permissions
        FHE.allowThis(encryptedValue);
        FHE.allowThis(encryptedConfidence);

        // Allow valuator and property owner to access valuation
        FHE.allow(encryptedValue, msg.sender);
        FHE.allow(encryptedConfidence, msg.sender);
        FHE.allow(encryptedValue, properties[propertyId].owner);
        FHE.allow(encryptedConfidence, properties[propertyId].owner);

        emit ValuationSubmitted(valuationId, propertyId, msg.sender);
        return valuationId;
    }

    function requestValuationReveal(uint256 valuationId) external {
        Valuation storage valuation = valuations[valuationId];
        require(valuation.timestamp > 0, "Valuation not found");
        require(!valuation.isRevealed, "Already revealed");

        // Only property owner or valuator can request reveal
        require(
            msg.sender == valuation.valuator ||
            msg.sender == properties[valuation.propertyId].owner,
            "Not authorized to reveal"
        );

        // Request decryption for both value and confidence
        bytes32[] memory cts = new bytes32[](2);
        cts[0] = FHE.toBytes32(valuation.estimatedValue);
        cts[1] = FHE.toBytes32(valuation.confidenceScore);

        FHE.requestDecryption(cts, this.processValuationReveal.selector, valuationId);
    }

    function processValuationReveal(
        uint256 requestId,
        uint64 revealedValue,
        uint32 revealedConfidence,
        bytes memory signatures
    ) external {
        // Extract valuationId from requestId (assuming it's passed as requestId)
        uint256 valuationId = requestId;

        // Verify signatures
        bytes memory signedData = abi.encodePacked(requestId, revealedValue, revealedConfidence);
        FHE.checkSignatures(requestId, signatures, signedData);

        Valuation storage valuation = valuations[valuationId];
        require(!valuation.isRevealed, "Already revealed");

        valuation.isRevealed = true;
        valuation.revealedValue = revealedValue;
        valuation.revealedConfidence = revealedConfidence;

        emit ValuationRevealed(valuationId, revealedValue, revealedConfidence);
    }

    function calculateAverageValuation(uint256 propertyId) external view returns (
        bool hasRevealed,
        uint64 averageValue,
        uint32 averageConfidence,
        uint256 valuationCount
    ) {
        require(properties[propertyId].isActive, "Property not active");
        require(
            msg.sender == properties[propertyId].owner ||
            msg.sender == owner,
            "Not authorized"
        );

        uint256[] memory valuationIds = propertyValuations[propertyId];

        if (valuationIds.length == 0) {
            return (false, 0, 0, 0);
        }

        uint256 totalValue = 0;
        uint256 totalConfidence = 0;
        uint256 revealedCount = 0;

        for (uint256 i = 0; i < valuationIds.length; i++) {
            Valuation storage valuation = valuations[valuationIds[i]];
            if (valuation.isRevealed) {
                totalValue += valuation.revealedValue;
                totalConfidence += valuation.revealedConfidence;
                revealedCount++;
            }
        }

        if (revealedCount == 0) {
            return (false, 0, 0, valuationIds.length);
        }

        return (
            true,
            uint64(totalValue / revealedCount),
            uint32(totalConfidence / revealedCount),
            revealedCount
        );
    }

    function getPropertyInfo(uint256 propertyId) external view onlyPropertyOwner(propertyId) returns (
        bool isActive,
        uint256 timestamp,
        uint256 valuationCount
    ) {
        Property storage prop = properties[propertyId];
        return (
            prop.isActive,
            prop.timestamp,
            propertyValuations[propertyId].length
        );
    }

    function getValuationInfo(uint256 valuationId) external view returns (
        uint256 propertyId,
        address valuator,
        uint256 timestamp,
        bool isRevealed,
        uint64 revealedValue,
        uint32 revealedConfidence
    ) {
        Valuation storage valuation = valuations[valuationId];
        require(valuation.timestamp > 0, "Valuation not found");

        // Only allow access to property owner, valuator, or contract owner
        require(
            msg.sender == valuation.valuator ||
            msg.sender == properties[valuation.propertyId].owner ||
            msg.sender == owner,
            "Not authorized"
        );

        return (
            valuation.propertyId,
            valuation.valuator,
            valuation.timestamp,
            valuation.isRevealed,
            valuation.revealedValue,
            valuation.revealedConfidence
        );
    }

    function getOwnerProperties(address propertyOwner) external view returns (uint256[] memory) {
        require(msg.sender == propertyOwner || msg.sender == owner, "Not authorized");
        return ownerProperties[propertyOwner];
    }

    function getPropertyValuations(uint256 propertyId) external view returns (uint256[] memory) {
        require(
            msg.sender == properties[propertyId].owner ||
            msg.sender == owner,
            "Not authorized"
        );
        return propertyValuations[propertyId];
    }

    function deactivateProperty(uint256 propertyId) external onlyPropertyOwner(propertyId) {
        properties[propertyId].isActive = false;
    }

    function reactivateProperty(uint256 propertyId) external onlyPropertyOwner(propertyId) {
        properties[propertyId].isActive = true;
    }
}