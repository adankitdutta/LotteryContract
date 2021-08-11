import Web3 from 'web3';

// async function web3func() {
//     //await window.ethereum.send('eth_requestAccounts');
//     window.web3 = new Web3(window.ethereum);
//     return window.web3;
//   }
window.ethereum.enable();
const web3=new Web3(window.ethereum);

export default web3;
