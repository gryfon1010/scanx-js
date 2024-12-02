import React, { useState } from 'react';
import './WalletDialog.css';
import metamaskIcon from '../assets/wallets/metamask.svg';
import coinbaseIcon from '../assets/wallets/coinbase.svg';
import phantomIcon from '../assets/wallets/phantom.svg';

const WalletDialog = ({ isOpen, onClose, onSelectWallet }) => {
  const [loadingWallet, setLoadingWallet] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [walletAddress, setWalletAddress] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  const connectWallet = async (walletId) => {
    console.log("connectWallet called with walletId:", walletId);
    setLoadingWallet(walletId);
    setErrorMessage(null);

    try {
      if (walletId === 'metamask') {
        if (typeof window.ethereum !== "undefined") {
          try {
            const accounts = await window.ethereum.request({
              method: "eth_requestAccounts"
            });
            const address = accounts[0];
            setWalletAddress(address);
            setIsConnected(true);
            onSelectWallet(walletId, address);
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
            const address = accounts[0];
            setWalletAddress(address);
            setIsConnected(true);
            onSelectWallet(walletId, address);
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
            const response = await window.solana.connect();
            const address = response.publicKey.toString();
            setWalletAddress(address);
            setIsConnected(true);
            onSelectWallet(walletId, address);
            onClose();
          } catch (err) {
            console.error("Error connecting to Phantom Wallet:", err);
            setErrorMessage("Failed to connect to Phantom: " + err.message);
            setIsConnected(false);
          }
        } else {
          setErrorMessage("Phantom Wallet not found. Please install it.");
        }
      } else {
        setErrorMessage("Unsupported wallet type.");
      }
    } finally {
      setLoadingWallet(null);
    }
  };

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    // Prevent closing if a wallet is loading or dialog content is clicked
    if (loadingWallet !== null || e.target === e.currentTarget) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
  };

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
      <div 
        className="wallet-dialog-overlay" 
        onClick={handleOverlayClick}
      >
        <div 
          className="wallet-dialog" 
          onClick={(e) => e.stopPropagation()}
        >
          <div className="wallet-dialog-header">
            <h2>Connect Wallet</h2>
            <button 
              className="close-button" 
              onClick={onClose}
              disabled={loadingWallet !== null}
            >×</button>
          </div>
          <div className="wallet-list">
            {wallets.map((wallet) => (
              <button
                key={wallet.id}
                className={`wallet-option ${loadingWallet === wallet.id ? 'loading' : ''}`}
                onClick={() => connectWallet(wallet.id)}
                disabled={loadingWallet !== null}
              >
                <img src={wallet.icon} alt={wallet.name} className="wallet-icon" />
                <div className="wallet-info">
                  <h3>{wallet.name}</h3>
                  <p>{wallet.description}</p>
                </div>
                {loadingWallet === wallet.id && (
                  <div className="loading-spinner"></div>
                )}
              </button>
            ))}
          </div>
          {errorMessage && (
            <div className="error-message">
              {errorMessage}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default WalletDialog;
