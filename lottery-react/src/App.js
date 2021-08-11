import "./App.css";
import React, { useEffect, useState } from "react";
import web3 from "./web3";
import lottery from "./lottery";

function App() {
  const [manager, setManager] = useState("");
  const [numberOfPlayers, setNumberOfPlayers] = useState(0);
  const [prize, setPrize] = useState("0");
  const [value, setValue] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const getContractDetails = async () => {
      setManager(await lottery.methods.manager().call());
      const players = await lottery.methods.getPlayers().call();
      setNumberOfPlayers(players.length);
      const balance = await web3.eth.getBalance(lottery.options.address);
      setPrize(web3.utils.fromWei(balance, "ether"));
    };
    getContractDetails();
  }, [numberOfPlayers, prize]);

  async function handleSubmit(event) {
    event.preventDefault();

    const accounts = await web3.eth.getAccounts();

    setMessage("Waiting on transaction success...");

    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(value, "ether"),
    });
    const players = await lottery.methods.getPlayers().call();
    setNumberOfPlayers(players.length);
    const balance = await web3.eth.getBalance(lottery.options.address);
    setPrize(web3.utils.fromWei(balance, "ether"));
    setMessage("You have been entered!");
  }

  const buttonClick = async () => {
    const accounts = await web3.eth.getAccounts();

    setMessage("Winner picking in progress! Please wait....");

    await lottery.methods.pickWinner().send({
      from: accounts[0],
    });

    const players = await lottery.methods.getPlayers().call();
    setNumberOfPlayers(players.length);
    const balance = await web3.eth.getBalance(lottery.options.address);
    setPrize(web3.utils.fromWei(balance, "ether"));
    setMessage("A winner has been picked!");
  };

  return (
    <div>
      <h2>Lottery Contract</h2>
      <p>
        This contract is managed by {manager} . There are currently{" "}
        {numberOfPlayers} peoples entered, competing for {prize} ethers !
      </p>

      <hr />

      <form onSubmit={handleSubmit}>
        <h4>Want to try your luck?</h4>
        <div>
          <label>
            Amount of ether to enter (should be atleast 0.011 to enter the
            competetion)
          </label>
          <input
            required
            value={value}
            onChange={(event) => setValue(event.target.value)}
          />
        </div>
        <button>Enter</button>
      </form>
      <hr />
      <h4>Ready to pick a winner?</h4>
      <button onClick={buttonClick}>Pick a winner!</button>
      <hr />
      <h1>{message} </h1>
    </div>
  );
}

export default App;
