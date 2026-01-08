// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title PharmaChain
 * @dev Smart contract for pharmaceutical supply chain tracking
 * @notice Implements immutable drug registration, transfer, and IoT data recording
 */
contract PharmaChain {
    // Structs
    struct Drug {
        string id;
        string name;
        string batchNumber;
        address currentOwner;
        int256 temperature; // Celsius * 10 (to support decimals)
        string location;
        uint256 registeredAt;
        address registeredBy;
    }

    struct DrugHistory {
        string drugId;
        uint256 timestamp;
        EventType eventType;
        address fromAddress;
        address toAddress;
        int256 temperature;
        string location;
        bytes32 transactionHash;
    }

    enum EventType {
        REGISTERED,
        TRANSFERRED,
        TEMPERATURE_UPDATED,
        LOCATION_UPDATED
    }

    // State variables
    mapping(string => Drug) public drugs;
    mapping(string => DrugHistory[]) public drugHistory;
    mapping(address => bool) public authorizedManufacturers;
    
    address public owner;
    uint256 public constant TEMP_MIN = 20; // 2.0°C * 10
    uint256 public constant TEMP_MAX = 80; // 8.0°C * 10

    // Events
    event DrugRegistered(
        string indexed drugId,
        address indexed manufacturer,
        string name,
        bytes32 transactionHash
    );

    event DrugTransferred(
        string indexed drugId,
        address indexed from,
        address indexed to,
        bytes32 transactionHash
    );

    event TemperatureUpdated(
        string indexed drugId,
        int256 temperature,
        address updatedBy,
        bytes32 transactionHash
    );

    event LocationUpdated(
        string indexed drugId,
        string location,
        address updatedBy,
        bytes32 transactionHash
    );

    // Modifiers
    modifier onlyManufacturer() {
        require(
            authorizedManufacturers[msg.sender],
            "Only authorized manufacturer can perform this action"
        );
        _;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only contract owner");
        _;
    }

    modifier drugExists(string memory drugId) {
        require(
            bytes(drugs[drugId].id).length > 0,
            "Drug does not exist"
        );
        _;
    }

    // Constructor
    constructor() {
        owner = msg.sender;
        // Deployer is initial manufacturer
        authorizedManufacturers[msg.sender] = true;
    }

    /**
     * @dev Register a new drug (only authorized manufacturers)
     * @param id Unique drug identifier
     * @param name Drug name
     * @param batchNumber Batch number
     * @param initialTemperature Initial temperature (scaled by 10)
     * @param initialLocation Initial location
     * @return transactionHash Transaction hash
     */
    function registerDrug(
        string memory id,
        string memory name,
        string memory batchNumber,
        int256 initialTemperature,
        string memory initialLocation
    ) public onlyManufacturer returns (bytes32) {
        require(bytes(drugs[id].id).length == 0, "Drug already exists");
        require(bytes(id).length > 0, "Invalid drug ID");
        require(bytes(name).length > 0, "Invalid drug name");

        Drug memory newDrug = Drug({
            id: id,
            name: name,
            batchNumber: batchNumber,
            currentOwner: msg.sender,
            temperature: initialTemperature,
            location: initialLocation,
            registeredAt: block.timestamp,
            registeredBy: msg.sender
        });

        drugs[id] = newDrug;

        bytes32 txHash = keccak256(
            abi.encodePacked(
                id,
                name,
                block.timestamp,
                msg.sender,
                block.number
            )
        );

        DrugHistory memory history = DrugHistory({
            drugId: id,
            timestamp: block.timestamp,
            eventType: EventType.REGISTERED,
            fromAddress: address(0),
            toAddress: msg.sender,
            temperature: initialTemperature,
            location: initialLocation,
            transactionHash: txHash
        });

        drugHistory[id].push(history);

        emit DrugRegistered(id, msg.sender, name, txHash);
        return txHash;
    }

    /**
     * @dev Transfer drug ownership
     * @param drugId Drug identifier
     * @param to Recipient address
     * @return transactionHash Transaction hash
     */
    function transferDrug(
        string memory drugId,
        address to
    ) public drugExists(drugId) returns (bytes32) {
        Drug storage drug = drugs[drugId];
        require(
            drug.currentOwner == msg.sender,
            "You are not the current owner"
        );
        require(to != address(0), "Invalid recipient address");
        require(to != msg.sender, "Cannot transfer to yourself");

        address previousOwner = drug.currentOwner;
        drug.currentOwner = to;
        drug.location = string(abi.encodePacked("In Transit to ", _addressToString(to)));

        bytes32 txHash = keccak256(
            abi.encodePacked(
                drugId,
                previousOwner,
                to,
                block.timestamp,
                block.number
            )
        );

        DrugHistory memory history = DrugHistory({
            drugId: drugId,
            timestamp: block.timestamp,
            eventType: EventType.TRANSFERRED,
            fromAddress: previousOwner,
            toAddress: to,
            temperature: drug.temperature,
            location: drug.location,
            transactionHash: txHash
        });

        drugHistory[drugId].push(history);

        emit DrugTransferred(drugId, previousOwner, to, txHash);
        return txHash;
    }

    /**
     * @dev Update drug temperature (IoT sensor data)
     * @param drugId Drug identifier
     * @param temperature Temperature value (scaled by 10)
     * @return transactionHash Transaction hash
     */
    function updateTemperature(
        string memory drugId,
        int256 temperature
    ) public drugExists(drugId) returns (bytes32) {
        Drug storage drug = drugs[drugId];
        drug.temperature = temperature;

        bytes32 txHash = keccak256(
            abi.encodePacked(
                drugId,
                temperature,
                block.timestamp,
                msg.sender,
                block.number
            )
        );

        DrugHistory memory history = DrugHistory({
            drugId: drugId,
            timestamp: block.timestamp,
            eventType: EventType.TEMPERATURE_UPDATED,
            fromAddress: address(0),
            toAddress: address(0),
            temperature: temperature,
            location: drug.location,
            transactionHash: txHash
        });

        drugHistory[drugId].push(history);

        emit TemperatureUpdated(drugId, temperature, msg.sender, txHash);
        return txHash;
    }

    /**
     * @dev Update drug location
     * @param drugId Drug identifier
     * @param location New location
     * @return transactionHash Transaction hash
     */
    function updateLocation(
        string memory drugId,
        string memory location
    ) public drugExists(drugId) returns (bytes32) {
        Drug storage drug = drugs[drugId];
        drug.location = location;

        bytes32 txHash = keccak256(
            abi.encodePacked(
                drugId,
                location,
                block.timestamp,
                msg.sender,
                block.number
            )
        );

        DrugHistory memory history = DrugHistory({
            drugId: drugId,
            timestamp: block.timestamp,
            eventType: EventType.LOCATION_UPDATED,
            fromAddress: address(0),
            toAddress: address(0),
            temperature: drug.temperature,
            location: location,
            transactionHash: txHash
        });

        drugHistory[drugId].push(history);

        emit LocationUpdated(drugId, location, msg.sender, txHash);
        return txHash;
    }

    // View functions
    /**
     * @dev Get drug information
     * @param drugId Drug identifier
     * @return Drug struct
     */
    function getDrug(string memory drugId) public view returns (Drug memory) {
        require(bytes(drugs[drugId].id).length > 0, "Drug does not exist");
        return drugs[drugId];
    }

    /**
     * @dev Get drug history count
     * @param drugId Drug identifier
     * @return History count
     */
    function getDrugHistoryCount(string memory drugId) public view returns (uint256) {
        return drugHistory[drugId].length;
    }

    /**
     * @dev Get single history entry
     * @param drugId Drug identifier
     * @param index History index
     * @return DrugHistory struct
     */
    function getDrugHistory(
        string memory drugId,
        uint256 index
    ) public view returns (DrugHistory memory) {
        require(index < drugHistory[drugId].length, "Index out of bounds");
        return drugHistory[drugId][index];
    }

    /**
     * @dev Get all drug history
     * @param drugId Drug identifier
     * @return Array of DrugHistory structs
     */
    function getAllDrugHistory(string memory drugId) public view returns (DrugHistory[] memory) {
        return drugHistory[drugId];
    }

    // Admin functions
    /**
     * @dev Authorize a manufacturer
     * @param manufacturer Manufacturer address
     */
    function authorizeManufacturer(address manufacturer) public onlyOwner {
        authorizedManufacturers[manufacturer] = true;
    }

    /**
     * @dev Revoke manufacturer authorization
     * @param manufacturer Manufacturer address
     */
    function revokeManufacturer(address manufacturer) public onlyOwner {
        authorizedManufacturers[manufacturer] = false;
    }

    // Helper function
    /**
     * @dev Convert address to string
     * @param addr Address to convert
     * @return String representation
     */
    function _addressToString(address addr) private pure returns (string memory) {
        bytes32 value = bytes32(uint256(uint160(addr)));
        bytes memory alphabet = "0123456789abcdef";
        bytes memory str = new bytes(42);
        str[0] = '0';
        str[1] = 'x';
        for (uint256 i = 0; i < 20; i++) {
            str[2 + i * 2] = alphabet[uint8(value[i + 12] >> 4)];
            str[3 + i * 2] = alphabet[uint8(value[i + 12] & 0x0f)];
        }
        return string(str);
    }
}
