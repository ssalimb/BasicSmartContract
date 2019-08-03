//built-in js function to get the absolute path!!
const path = require("path");
//built-in function to handle files -- read!!
const fs = require("fs");
//solidity compiler -- npm package
const solc = require("solc");
//path of contract
const contractpath = path.resolve(__dirname, "../../contracts", "LotteryContract.sol");
//Read the contract source
const contractsource = fs.readFileSync(contractpath, "utf8");

//Refer solidity docs for more details
//Recent version adoption
var input = {
    language: 'Solidity',
    sources: {
        'LotteryContract.sol' : {
            content: contractsource
        }
    },
    settings: {
        outputSelection: {
            '*': {
                '*': [ '*' ]
            }
        }
    }
};

//compiling and exporting the abi + bytecode to test file!!
var output = JSON.parse(solc.compile(JSON.stringify(input))).contracts["LotteryContract.sol"]["Lottery"];
// console.log(output);
// return
module.exports = output;

