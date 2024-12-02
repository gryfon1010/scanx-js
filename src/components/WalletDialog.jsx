import React from 'react';
import './WalletDialog.css';
import metamaskIcon from '../assets/wallets/metamask.svg';
import coinbaseIcon from '../assets/wallets/coinbase.svg';
import phantomIcon from '../assets/wallets/phantom.svg';

const WalletDialog = ({ isOpen, onClose, onSelectWallet }) => {
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
              onClick={() => onSelectWallet(wallet.id)}
            >
              <img src={wallet.icon} alt={wallet.name} className="wallet-icon" />
              <div className="wallet-info">
                <h3>{wallet.name}</h3>
                <p>{wallet.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default WalletDialog;
