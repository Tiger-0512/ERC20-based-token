// SPDX-License-Identifier: MIT
// Current solc ver.: 0.6.2
pragma solidity >=0.4.21 <0.7.0;

import "./ERC20.sol";

contract Dai is ERC20 {
    constructor(string memory _name, string memory _symbol, uint256 _totalSupply) ERC20(_name, _symbol, _totalSupply) public {

    }
}

contract Link is ERC20 {
    constructor(string memory _name, string memory _symbol, uint256 _totalSupply) ERC20(_name, _symbol, _totalSupply) public {

    }
}
