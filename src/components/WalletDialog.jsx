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
  const [isPendingConnection, setIsPendingConnection] = useState(false);

  const handleWalletConnection = async (accounts, walletId) => {
    const address = walletId === 'phantom' 
      ? accounts.toString() 
      : accounts[0];
    
    setWalletAddress(address);
    setIsConnected(true);
    setIsPendingConnection(false);
    onSelectWallet(walletId, address);
    onClose();
  };

  const handleError = (error, walletName) => {
    const errorMessage = error.code === 4001
      ? "You rejected the connection request"
      : `Could not connect to ${walletName}: ${error.message}`;
    
    setErrorMessage(errorMessage);
    setIsConnected(false);
    setIsPendingConnection(false);
  };

  const connectWallet = async (walletId) => {
    console.log("connectWallet called with walletId:", walletId);
    setLoadingWallet(walletId);
    setErrorMessage(null);

    try {
      switch (walletId) {
        case 'metamask':
        case 'coinbase':
          if (typeof window.ethereum === "undefined") {
            throw new Error(`${walletId === 'metamask' ? 'MetaMask' : 'Coinbase'} is not detected. Please install it.`);
          }

          // Check if already pending connection
          if (isPendingConnection) {
            const accounts = await window.ethereum.request({
              method: "eth_accounts"
            });
            if (accounts.length > 0) {
              await handleWalletConnection(accounts, walletId);
            } else {
              throw new Error("Please complete the connection in your wallet");
            }
          } else {
            setIsPendingConnection(true);
            const accounts = await window.ethereum.request({
              method: "eth_requestAccounts"
            });
            await handleWalletConnection(accounts, walletId);
          }
          break;

        case 'phantom':
          if (!window.solana) {
            throw new Error("Phantom Wallet not found. Please install it.");
          }
          
          if (isPendingConnection) {
            const connection = await window.solana.connect({ onlyIfTrusted: true });
            await handleWalletConnection(connection.publicKey, walletId);
          } else {
            setIsPendingConnection(true);
            const response = await window.solana.connect();
            await handleWalletConnection(response.publicKey, walletId);
          }
          break;

        default:
          throw new Error("Unsupported wallet type.");
      }
    } catch (error) {
      const walletNames = {
        metamask: 'MetaMask',
        coinbase: 'Coinbase',
        phantom: 'Phantom'
      };
      handleError(error, walletNames[walletId]);
    } finally {
      setLoadingWallet(null);
    }
  };

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (loadingWallet === null && e.target === e.currentTarget && !isPendingConnection) {
      onClose();
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

  const getButtonText = (wallet) => {
    if (loadingWallet === wallet.id) return 'Connecting...';
    if (isPendingConnection && !isConnected) return 'Confirm in Wallet';
    return `Connect ${wallet.name}`;
  };

  return (
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
            disabled={loadingWallet !== null || isPendingConnection}
          >×</button>
        </div>
        <div className="wallet-list">
          {wallets.map((wallet) => (
            <button
              key={wallet.id}
              className={`wallet-option ${loadingWallet === wallet.id ? 'loading' : ''} ${isPendingConnection ? 'pending' : ''}`}
              onClick={() => connectWallet(wallet.id)}
              disabled={loadingWallet !== null && loadingWallet !== wallet.id}
            >
              <img src={wallet.icon} alt={wallet.name} className="wallet-icon" />
              <div className="wallet-info">
                <h3>{wallet.name}</h3>
                <p>{getButtonText(wallet)}</p>
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
  );
};

export default WalletDialog;