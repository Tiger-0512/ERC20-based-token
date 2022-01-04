# ERC20-based-token
Smart contracts to create ERC20 based tokens (With React Demo). <br>
You can try this smart contract by using localhost or test net (e.g., Ropsten test network)

## Dependencies
- Solidity(Solc-js) 0.6.2
- Truffle 5.4.22 (core: 5.4.22)
- Node.js 14.18.1
- npm 6.14.15
- Web3.js 1.5.3
- [Metamask](https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn)
- [Ganache](http://trufflesuite.com/ganache/) or [Ganache-CLI](https://github.com/trufflesuite/ganache-cli-archive)

## Usage: With the Local Server
#### 1. Create local block chain with Ganache <br>
Notice: Please check the port of Ganache is `8545` (It is the same port as the contracts use).

#### 2. Compile the contracts
```
$ truffle compile
```
Notice: If you use Ganache-CLI, create new terminal window first.

#### 3. Deploy contracts to the local block chain
```
$ truffle console --network develop
$ migrate
```

#### 4. Set up the local server
```
$ cd client
$ npm start
```
Notice: Set up the local server in another terminal window.

#### 5. Visit http://localhost:3000/ and enjoy the App!

## Test the Contracts in Local Network
```
$ ganache-cli
$ truffle console --network develop
$ test
```
