import React, { useState } from 'react';
import './WalletDialog.css';
import metamaskIcon from '../assets/wallets/metamask.svg';
import coinbaseIcon from '../assets/wallets/coinbase.svg';
import phantomIcon from '../assets/wallets/phantom.svg';

const WalletDialog = ({ isOpen, onClose, onSelectWallet }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [walletAddress, setWalletAddress] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  const connectWallet = async (walletId) => {
    console.log("connectWallet called with walletId:", walletId);
    setIsLoading(true);
    setErrorMessage(null);

    if (walletId === 'metamask') {
      if (typeof window.ethereum !== "undefined") {
        try {
          const accounts = await window.ethereum.request({
            method: "eth_requestAccounts"
          });
          setIsConnected(true);
          onSelectWallet(walletId, accounts[0]);
          onClose();
        } catch (error) {
          if (error.code === 4001) {
            setErrorMessage("You rejected the connection request");
          } else {
            setErrorMessage("Could not connect to MetaMask: " + error.message);
          }
          setIsConnected(false);
        }
      } else {
        setErrorMessage("MetaMask is not detected. Please install MetaMask.");
      }
    } else if (walletId === 'coinbase') {
      if (typeof window.ethereum !== "undefined") {
        try {
          const accounts = await window.ethereum.request({
            method: "eth_requestAccounts"
          });
          setIsConnected(true);
          onSelectWallet(walletId, accounts[0]);
          onClose();
        } catch (error) {
          if (error.code === 4001) {
            setErrorMessage("You rejected the connection request");
          } else {
            setErrorMessage("Could not connect to Coinbase: " + error.message);
          }
          setIsConnected(false);
        }
      } else {
        setErrorMessage("Coinbase is not detected. Please install Coinbase.");
      }
    } else if (walletId === 'phantom') {
      if (window.solana) {
        try {
            // Request connection to Phantom wallet
            const response = await window.solana.connect();
            // Store the wallet's public key
            setWalletAddress(response.publicKey.toString());
            // Update connection status
            setIsConnected(true);
        } catch (err) {
            // Handle any connection errors
            console.error("Error connecting to Phantom Wallet:", err);
        }
    } else {
        // Alert user if Phantom wallet is not installed
        alert("Phantom Wallet not found. Please install it.");
    }
    } else {
      setErrorMessage("Unsupported wallet type.");
    }

    setIsLoading(false);
  };

  if (!isOpen) return null;

  const wallets = [
    {
      id: 'metamask',
      name: 'MetaMask',
      icon: metamaskIcon,
      description: 'Connect to your MetaMask Wallet'
    },
    {
      id: 'coinbase',
      name: 'Coinbase Wallet',
      icon: coinbaseIcon,
      description: 'Connect to your Coinbase Wallet'
    },
    {
      id: 'phantom',
      name: 'Phantom',
      icon: phantomIcon,
      description: 'Connect to your Phantom Wallet'
    }
  ];

  return (
    <>
      <div className="wallet-dialog-overlay" onClick={onClose}></div>
      <div className="wallet-dialog">
        <div className="wallet-dialog-header">
          <h2>Connect Wallet</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <div className="wallet-list">
          {wallets.map((wallet) => (
            <button
              key={wallet.id}
              className="wallet-option"
              onClick={() => connectWallet(wallet.id)}
              disabled={isLoading}
            >
              <img src={wallet.icon} alt={wallet.name} className="wallet-icon" />
              <div className="wallet-info">
                <h3>{wallet.name}</h3>
                <p>{wallet.description}</p>
              </div>
            </button>
          ))}
        </div>
        {errorMessage && (
          <div className="error-message">
            {errorMessage}
          </div>
        )}
      </div>
    </>
  );
};

export default WalletDialog;
