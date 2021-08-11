const assert=require('assert');
const ganache=require('ganache-cli');
const Web3=require('web3');
const web3=new Web3(ganache.provider());

const {interface, bytecode} =require('../compile.js');

let lottery;
let accounts;

beforeEach( async ()=> {
    accounts=await web3.eth.getAccounts();

    lottery=await new web3.eth.Contract(JSON.parse(interface))
        .deploy({data:bytecode})
        .send({from:accounts[0] , gas:'1000000'});
});

describe('Lottery Contract',()=>{

    it('deploys a contract',()=>{
        assert.ok(lottery.options.address);
    });

    it('allows one account to enter', async ()=>{
        await lottery.methods.enter().send({
            from : accounts[0],
            value: web3.utils.toWei('0.02','ether')
        });

        const players= await lottery.methods.getPlayers().call({
            from: accounts[0],
        });

        assert.strictEqual(accounts[0],players[0]);
        assert.strictEqual(1,players.length);
    });

    it('allows multiple account to enter', async ()=>{
        await lottery.methods.enter().send({
            from : accounts[0],
            value: web3.utils.toWei('0.02','ether')
        });
        await lottery.methods.enter().send({
            from : accounts[1],
            value: web3.utils.toWei('0.02','ether')
        });
        await lottery.methods.enter().send({
            from : accounts[2],
            value: web3.utils.toWei('0.02','ether')
        });

        const players= await lottery.methods.getPlayers().call({
            from: accounts[0],
        });

        assert.strictEqual(accounts[0],players[0]);
        assert.strictEqual(accounts[1],players[1]);
        assert.strictEqual(accounts[2],players[2]);
        assert.strictEqual(3,players.length);
    });

    it('requires minimum amount of ther to enter', async ()=>{
        try{
            await lottery.methods.enter().send({
                from:accounts[0],
                value:10,
            });

            assert(false);
        }
        catch(err)
        {
            assert(err)
        }
    });

    it('only manager can call pickWinner',async ()=>{
        try{
            await lottery.methods.pickWinner().send({
                from:accounts[1],
            });
            assert(false);
        }
        catch(err){
            assert(err);
        }
    })

    it('send money to the winner and resets players', async ()=>{
        
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('2','ether')
        });

        let contractBalance=await web3.eth.getBalance(lottery.options.address);
        console.log('Total prize pool for the lottery:',contractBalance);
        
        const initialAccountBalance= await web3.eth.getBalance(accounts[0]);
        await lottery.methods.pickWinner().send({from:accounts[0],});
        const finalAccountBalance= await web3.eth.getBalance(accounts[0]);
        const difference= finalAccountBalance-initialAccountBalance;
        
        assert(difference>web3.utils.toWei('1.8','ether'));
        
        const players =await lottery.methods.getPlayers().call({
            from:accounts[0],
        });
        assert(players.length==0);

        let remainingContractBalance=await web3.eth.getBalance(lottery.options.address);
        console.log('Remaining balance in the contract :',remainingContractBalance);
        assert(remainingContractBalance==0);
    });

});