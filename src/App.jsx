import React, { useState } from 'react';
import './App.css';
import LandingPage from './LandingPage';
import MetaMask from "./metamask.jsx";
import Phantom from "./phantom.jsx";
import WalletDialog from './components/WalletDialog';

const WalletConnect = () => {
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [connectedWallet, setConnectedWallet] = useState(null);

  const handleConnectWallet = () => {
    setShowWalletModal(true);
  };

  const handleSelectWallet = (walletType, walletAddress) => {
    setConnectedWallet({
      type: walletType,
      address: walletAddress
    });
    setShowWalletModal(false);
  };

  const handleCloseWalletDialog = () => {
    setShowWalletModal(false);
  };

  return (
    <div className="App">
      <LandingPage 
        onConnectWallet={handleConnectWallet} 
        connectedWallet={connectedWallet?.address} 
      />
      {showWalletModal && (
        <WalletDialog 
          isOpen={showWalletModal} 
          onClose={handleCloseWalletDialog}
          onSelectWallet={handleSelectWallet}
        />
      )}
      <Phantom />
    </div>
  );
};

export default WalletConnect;
