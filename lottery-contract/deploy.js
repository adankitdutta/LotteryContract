const HDWalletProvider=require('truffle-hdwallet-provider');
const Web3=require('web3');
const {interface,bytecode}=require('./compile.js');
const dotenv = require('dotenv').config()

const provider=new HDWalletProvider(
    process.env.PHRASE,
    process.env.RINKEBYAPI
);

const web3= new Web3(provider);

const deploy= async () => {
    const accounts= await web3.eth.getAccounts();
    console.log('Attempting to deploy from accounts from ', accounts[0]);

    const result=await new web3.eth.Contract(JSON.parse(interface))
        .deploy({data:bytecode})
        .send({gas:'1000000', from : accounts[0]});

    console.log('Contract deployed to :', result.options.address);
};

deploy();

