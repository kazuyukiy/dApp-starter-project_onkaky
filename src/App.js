// App.js
import React, { useEffect, useState } from "react";
import './App.css';
const App = () => {
    
    const [currentAccount, setCurrentAccount] = useState("");
    console.log("currentAccount: ", currentAccount);
    
    const checkIfWalletIsConnected = async () => {

	try {
	    const { ethereum } = window;
	    if(!ethereum) {
		console.log("Make sure you have MeataMask!");
		return;
	    } else {
		console.log("We have the ethereum object", ethereum);
	    }

	    // if can access to your's wallet
	    const accounts = await ethereum.request({ method: "eth_accounts" });
	    if (accounts.length !== 0) {
		const account = accounts[0];
		console.log("Found an authorized account:", account);
		setCurrentAccount(account);
	    } else {
		console.log("No authorized account found");
	    }
	} catch (error) {
	    console.log(error);
	}
    };

    const connectWallet = async () => {
	try {
	    const { ethereum } = window;
	    if (!ethereum) {
		alert("Get MetaMask!");
		return;
	    }
	    const accounts = await ethereum.request({
		method: "eth_requestAccounts"
	    });
	    console.log("Connected: ", accounts[0]);
	    setCurrentAccount(accounts[0]);
	} catch (error) {
	    console.log(error);
	}
    };

    // following will be done on page loading
    useEffect(() => {
	checkIfWalletIsConnected();
    }, []);
    return (
	<div className="mainContainer">
	    <div className="dataContainer">
		<div className="header">
		    <span role="img" aria-label="hand-wave">
			👋
		    </span>{" "}
		    WELCOME!
		</div>
		<div className="bio">
		    イーサリアムウォレットを接続して、「
		    <span role="img" aria-label="hand-wave">
			👋
		    </span>
		    (wave)」を送ってください
		    <span role="img" aria-label="shine">
			✨
		    </span>
		</div>
		<button className="waveButton" onClick={null}>
		    Wave at Me
		</button>
		{!currentAccount && (
		    <button className="waveButton" onClick={connectWallet}>
			Connect Wallet
		    </button>
		)}
		{currentAccount && (
		    <button className="waveButton" onClick={connectWallet}>
			Wallet Connected
		    </button>
		)}
	    </div>
	</div>
    );
};
export default App;
