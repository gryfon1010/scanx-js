import React, { useState } from 'react';
import './App.css';
import LandingPage from './LandingPage';
import MetaMask from "./metamask.jsx";
import Phantom from "./phantom.jsx";

const WalletModal = ({ onClose }) => {
  return (
    <>
      <div className="modal-overlay" onClick={onClose} />
      <div className="wallet-modal">
        <button className="close-button" onClick={onClose}>×</button>
        <MetaMask />
        <Phantom />
      </div>
    </>
  );
};

const WalletConnect = () => {
  const [showWalletModal, setShowWalletModal] = useState(false);

  const handleConnectWallet = () => {
    setShowWalletModal(true);
  };

  return (
    <div className="App">
      <LandingPage onConnectWallet={handleConnectWallet} />
      {showWalletModal && (
        <WalletModal onClose={() => setShowWalletModal(false)} />
      )}
    </div>
  );
};

export default WalletConnect;
