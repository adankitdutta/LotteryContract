import './App.css';
import React, {useEffect,useState} from 'react';
import web3 from './web3';

function App() { 
  
  console.log(web3.version);

  web3.eth.getAccounts().then(console.log);
  

  return (
    <div className="App">
      Hello
    </div>
  );
}

export default App;
