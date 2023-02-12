// App.js
import React, { useEffect, useState } from "react";
import './App.css';
import { ethers } from "ethers";
import abi from "./utils/WavePortal.json";
const App = () => {
    
    const [currentAccount, setCurrentAccount] = useState("");
    console.log("currentAccount: ", currentAccount);

    // const contractAddress = "0xD87e786f3A1967f9ccA84efc42C4163aD6520859";
    const contractAddress = "0xe573b69a6593c867F5fA4d486Cc08143D0ceAf6e"; // section3
    const contractABI = abi.abi;
    
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

    const wave = async () => {
	try {
	    const { ethereum } = window;
	    if (ethereum) {
		const provider = new ethers.providers.Web3Provider(ethereum);
		const signer = provider.getSigner();
		const wavePortalContract = new ethers.Contract(
		    contractAddress,
		    contractABI,
		    signer
		);
		let count = await wavePortalContract.getTotalWaves();
		console.log("Retrived total wave count...", count.toNumber());
		
		// console.log("Signer:", signer);
		
		const waveTxn = await wavePortalContract.wave();
		console.log("Mining...", waveTxn.hash);
		await waveTxn.wait();
		console.log("Mined -- ", waveTxn.hash);
		count = await wavePortalContract.getTotalWaves();
		console.log("Retrived total wave count...", count.toNumber());
	    } else {
		console.log("Ethereum object dowsn't exist!");
	    }
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
		<button className="waveButton" onClick={wave}>
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
