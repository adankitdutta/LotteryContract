import "./App.css";
import React, { useEffect, useState } from "react";
import web3 from "./web3";
import lottery from "./lottery";

function App() {
  // console.log(web3.version);
  // web3.eth.getAccounts().then(console.log);

  const [manager, setManager] = useState("");

  useEffect(() => {
    const getManager = async () => {
      setManager(await lottery.methods.manager().call());
    };
    getManager();
  }, []);

  return (
    <div>
      <h2>Lottery Contract</h2>
      <p>This contract is managed by {manager}</p>
    </div>
  );
}

export default App;
