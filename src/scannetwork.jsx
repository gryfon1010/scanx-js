import React from 'react';
import './styles/ScanNetwork.css';
import scanxnetwork from './assets/scanxnetwork.png';

const ScanNetwork = () => {
    return (
        <section className="earn-crypto-section">
          <div className="earn-crypto-wrapper">
            <div className='earn-crypto-container'>
              <div className="earn-crypto-content">
                <h2>Earn Crypto<br/><span className="earn-highlight">While Holding</span></h2>
                <p>
                  ScanX is a Web3 multi-chain bridge network leveraging a non-custodial protocol for 
                  instant cross-chain transactions. By accessing deep liquidity and enabling seamless 
                  asset transfers across different blockchains, ScanX offers a cost-efficient, scalable 
                  alternative to traditional CEXs for DeFi traders and liquidity providers
                </p>
                <div className="earn-button-container">
                  <button className="earn-presale-btn">Join Presale</button>
                </div>
              </div>
              <div className="earn-preview">
                <img src={scanxnetwork} alt="Exchange Interface Preview" />
              </div>
            </div>
          </div>
        </section>
    );
};

export default ScanNetwork;