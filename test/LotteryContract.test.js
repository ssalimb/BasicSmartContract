//@dev: In order to avoid memory leak problem add this code at top... cause of lot of eventListeners..lol
require('events').EventEmitter.defaultMaxListeners = 15;
//require path
const path = require("path");
//requiring chai assertion library here -- just making use of assert 
const assert = require("chai").assert;
//requiring ganache inorder to deal with the local n/w -- Replace with infura/geth/local ip 
//to test production usage
const ganache = require("ganache-cli");
//inorder to interact with the ethereum network
const Web3 = require("web3");
//setting ganache as provider -- Replace infura/geth/local ip 
//to test production usage
const web3 = new Web3(ganache.provider());
//getting the compiled data
const compiled_data = require(path.resolve(__dirname, "../process/compile", "Lottery.compile.js"));
//Get bytecode and abi
const bytecode = compiled_data.evm.bytecode.object;
const abi = compiled_data.abi;

/*#########################
###	Testing code here	###
#########################*/

let account;
let deployed_contract;

describe("check whether the contract has been deployed", async() => {

	//Getting info once is enough here
	before( async() => {
		//Get the accounts
		accounts = await web3.eth.getAccounts();
		//Deploy the contract here
		try {
			//Deploy the contract once
			deployed_contract = await new web3.eth.Contract(abi)
							.deploy({
								data: bytecode
							})
							.send({
								from: accounts[0],
								gas: "1000000"
							});
		} catch(err) {
			throw(err);
		}
	});

	//checking deployed contract here
	it("contract deployed?--------------------------", async()=> {
		//If contract has been deployed successfully it returns address
		//we check for address here
		assert.ok(deployed_contract.options.address);
	});

	describe("enter players -- players pushed?--------------------", async()=> {
		it("check players exists", async()=> {
			//insert players here
			await deployed_contract.methods.enter_players().send({
				from: accounts[0],
				value: web3.utils.toWei("0.2", 'ether')
			});
			await deployed_contract.methods.enter_players().send({
				from: accounts[1],
				value: web3.utils.toWei("0.2", 'ether')
			});

			const players = await deployed_contract.methods.getplayers().call();
			assert.equal(accounts[0], players[0]);
			assert.equal(accounts[1], players[1]);
			assert.equal(2, players.length);
		});
	});

	describe("pick winner function------------------------", async()=> {
		it("pickwinner called by acc[1] fails", async()=> {
			try {
				const notmanager = await deployed_contract.methods.pickwinner().send({
					from: accounts[1]
				});
				assert(false);
			} catch(err) {
				assert(err);
			}
		});

		it("pickwinner called by acc[0]", async()=> {
			try {
				const initialbalance = await web3.eth.getBalance(accounts[0]);
				await deployed_contract.methods.pickwinner().send({
					from: accounts[0]
				});
				const finalbalance = await web3.eth.getBalance(accounts[0]);
				const difference = finalbalance - initialbalance;
				if(difference > web3.utils.toWei("1.8", "ether")) {
					assert(true);
				} else {
					assert(false);
				}
				
			} catch(err) {
				assert(err);
			}
		});
	});
});




