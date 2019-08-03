//@dev: In order to avoid memory leak problem add this code at top... cause of lot of eventListeners..lol
require('events').EventEmitter.defaultMaxListeners = 15;
const HDWalletProvider = require("truffle-hdwallet-provider");
// const ganache = require("ganache-cli");
const Web3 = require("web3");
const compiled_data = require("./compile.js");
//Get bytecode and abi
const bytecode = compiled_data.evm.bytecode.object;
const abi = compiled_data.abi;

const provider = new HDWalletProvider("address arctic choice flower fly wave risk culture unusual beef about decrease"
									,"HTTPS://rinkeby.infura.io/v3/e653b13a8c9f428d918550e8f6f0ab9d");
const web3 = new Web3(provider);

// const web3 = new Web3(ganache.provider());

//Deploying
const deploy = async() => {
	try {

		//Getting accounts list
		const accounts = await web3.eth.getAccounts();
		console.log("Gonna deploy in account ", accounts[0]);
		try {

			//deploying area -- while deploying in other networls other than
			//local network use data: "0x" +bytecode  -->else doesn't work
			const deployed_contract = await new web3.eth.Contract(abi)
									    .deploy({
									      data: "0x" +bytecode, arguments: ['Hello World!']
									    })
									    .send({ from: accounts[0], gas: "1000000" });
			console.log("contract deployed at address", deployed_contract.options.address);
			// let balance = await web3.eth.getBalance(accounts[0]);
			// console.log(balance);

		}catch(err){
			assert(err);
		}

	}catch(err){
		assert(err);
	}
};

deploy();