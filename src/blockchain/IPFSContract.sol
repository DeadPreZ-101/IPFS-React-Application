//SPDX-License-Identifier: MIT
pragma solidity >=0.5.0 <0.7.0;

contract IPFStest {
    
    // Mapping the account address with the hash of the uploaded image
    mapping(address => string) hash;

    constructor() public {}

    function storeHash (string memory _hash) public {
        hash[msg.sender] = _hash;
    }

    function retrieveAddr (address _to) public view returns (string memory) {
        string memory _hash = hash[_to];
        require(bytes(_hash).length != 0, "There is no hash");
        return hash[_to];
    }
}
