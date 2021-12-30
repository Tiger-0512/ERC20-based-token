// SPDX-License-Identifier: MIT
// Current solc ver.: 0.6.2
pragma solidity >=0.4.21 <0.7.0;

import "./ERC20.sol";


contract Dex {
    event buy(address account, address _tokenAddr, uint _cost, uint _amount);
    event sell(address account, address _tokenAddr, uint _cost, uint _amount);

    mapping(address => bool) public supportedTokenAddr;

    modifier supportsToken(address _tokenAddr) {
        require(supportedTokenAddr[_tokenAddr] == true, "This token is not supported");
        _;
    }

    constructor(address[] memory _tokenAddr) public {
        for(uint i = 0; i < _tokenAddr.length; i++) {
            supportedTokenAddr[_tokenAddr[i]] = true;
        }
    }

    function buyToken(address _tokenAddr, uint256 _cost, uint256 _amount) external payable supportsToken(_tokenAddr) {
        ERC20 token = ERC20(_tokenAddr);
        require(msg.value == _cost, "The fund is insufficient");
        require(token.balanceOf(address(this)) >= _amount, "The token is sold out");

        token.transfer(msg.sender, _amount);
        emit buy(msg.sender, _tokenAddr, _cost, _amount);
    }

    function sellToken(address _tokenAddr, uint256 _cost, uint256 _amount) external supportsToken(_tokenAddr) {
        ERC20 token = ERC20(_tokenAddr);
        require(token.balanceOf(msg.sender) >= _cost, "The token is insufficient");
        require(address(this).balance >= _amount, "The contract does not have enough funds");

        token.transferFrom(msg.sender, address(this), _cost);
        (bool success, ) = payable(msg.sender).call{value: _amount}("");
        require(success, "ETH transfer failed");
        emit sell(msg.sender, _tokenAddr, _cost, _amount);
    }
}
