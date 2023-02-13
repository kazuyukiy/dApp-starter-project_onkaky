// App.js
import React, { useEffect, useState } from "react";
import './App.css';
import { ethers } from "ethers";
import abi from "./utils/WavePortal.json";

const App = () => {
    
    const [currentAccount, setCurrentAccount] = useState("");
    const [messageValue, setMessageValue] = useState("");
    const [allWaves, setAllWaves] = useState([]);

    console.log("currentAccount: ", currentAccount);

    // const contractAddress = "0xD87e786f3A1967f9ccA84efc42C4163aD6520859";
    // const contractAddress = "0xe573b69a6593c867F5fA4d486Cc08143D0ceAf6e"; // section3 lesson1
    // const contractAddress = "0xc9b847708Ee05425831B2CC235029c2904875A35"; // section3 lesson2
    const contractAddress = "0x8Fa4c50A741BAA5E5e2527b1E1Da9F5726653609"; // section3 lesson2 part2


    
    const contractABI = abi.abi;

    const getAllWaves = async () => {
	const { ethereum } = window;

	try {
	    if (ethereum) {
		const provider = new ethers.providers.Web3Provider(ethereum);
		const signer = provider.getSigner();
		const wavePortalContract = new ethers.Contract(
		    contractAddress,
		    contractABI,
		    signer
		);

		console.log("App.js getAllWaves cp1");
		
		const waves = await wavePortalContract.getAllWaves();

		console.log("App.js getAllWaves cp2");
		
		const wavesCleaned = waves.map((wave) => {
		    return {
			address: wave.waver,
			timestamp: new Date(wave.timestamp * 1000),
			message: wave.message,
		    };
		});
		setAllWaves(wavesCleaned);
	    } else {
		console.log("Ethereum object doesn't exists!");
	    }
	} catch (error) {
	    console.log(error);
	}
    };

    useEffect(() => {
	let wavePortalContract;

	const onNewWave = (from, timestamp, message) => {
	    console.log("NewWave", from, timestamp, message);
	    setAllWaves((prevState) => [
		...prevState,
		{
		    address: from,
		    timestamp: new Date(timestamp * 1000),
		    message: message,
		},
	    ]);
	};

	if (window.ethereum) {
	    const provider = new ethers.providers.Web3Provider(window.ethereum);
	    const signer = provider.getSigner();
	    wavePortalContract = new ethers.Contract(
		contractAddress,
		contractABI,
		signer,
	    );
	    wavePortalContract.on("NewWave", onNewWave);
	}
	return () => {
	    if (wavePortalContract) {
		wavePortalContract.off("NewWave", onNewWave);
	    }
	};
	
    }, []);
    
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
		getAllWaves();
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
		
		const waveTxn = await wavePortalContract.wave(messageValue, {
		    gasLimit: 300000,
		});
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
		    イーサリアムウォレットを接続して、メッセージを作成したら、
		    <span role="img" aria-label="hand-wave">
			👋
		    </span>
		    を送ってください
		    <span role="img" aria-label="shine">
			✨
		    </span>
		</div>
		<br />
		{!currentAccount && (
		    <button className="waveButton" onClick={connectWallet}>
			Connect Wallet
		    </button>
		)}
		{currentAccount && (
		    <button className="waveButton">Wallet Connected</button>
		)}
		{currentAccount && (
		    <button className="waveButton" onClick={wave}>
			Wave at Me
		    </button>
		)}
		{currentAccount && (
		    <textarea
			name="messageArea"
			placeholder="メッセージはこちら"
			type="text"
			id="message"
			value={messageValue}
			onChange={(e) => setMessageValue(e.target.value)}
		    />
		)}

		{currentAccount && allWaves
		 .slice(0)
		 .reverse()
		 .map((wave, index) => {
		     return(
			 <div
			     key={index}
			     style={{
				 backgroundColoe: "#F8F8FF",
				 marginTop: "16px",
				 padding: "8px",
			     }}
			 >
			     <div>Address: {wave.address}</div>
			     <div>Time: {wave.timestamp.toString()}</div>
			     <div>Message: {wave.message}</div>
			 </div>
		     );
		 })}

	    </div>
	</div>
    );
};
export default App;
