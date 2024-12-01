import React from 'react';
import './styles/ScanNetwork.css';
import scanxnetwork from './assets/scanxnetwork.png';
import ExchangeSwap from './assets/exchangeAndSwap.png';
import Crypto from './assets/cryptocard.png';
import visa from './assets/visa.png';

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
          
          <div style={{paddingTop: '10px'}}>

          </div>
          <ExchangeAndSwap />
          <NonCustodial />
          <Portfolio />
          <CryptoCard />
        </section>  
    );
};
const ExchangeAndSwap = () => {
  return (
    <section className="exchange-swap-section">
      <div className="exchange-swap-wrapper">
        <div className='exchange-swap-container'>
          <div className="exchange-swap-content">
            <div className="exchange-preview">
              <img src={ExchangeSwap} alt="Exchange Swap Preview" />
            </div>

            <div className="exchange-text-content">
              <div className="exchange-header">
                <p className="exchange-subtitle">BRINGING WEB3 TO THE MASSES WITH UNLIMITED POTENTIAL</p>
                <h2>Exchange and<br/>swap</h2>
              </div>
              
              <p className="exchange-description">
                A limitless multi-chain decentralised exchange supporting over 50,000 currency 
                pairs. It's simple, fast, no third-party wallet connection required, and it's custody-free. 
                The key appeal of ScanX lies in its decentralised nature, where orders and trades are 
                automatically executed via smart contracts.
              </p>

              <div className="exchange-features">
                <p>1. Swap cryptocurrencies cross-chain instantly and cheaply.</p>
                <p>2. Order execution through smart contracts with 0% slippage.</p>
                <p>3. Fastest transaction speeds with institutional liquidity.</p>
              </div>

              <div className="exchange-button-container">
                <button className="earn-presale-btn">Join Presale</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
};

const NonCustodial = () => {
  return (
      <section className="earn-crypto-section">
        <div className="earn-crypto-wrapper">
          <div className='earn-crypto-container'>
            <div className="earn-crypto-content">
              <h2>ScanX Non-Custodial<br/>Crypto Wallet</h2>
              <p>
                Manage your crypto with complete peace of mind. Store, buy, swap, and stake crypto
                from your mobile or desktop app. All private and secure
              </p>
              <div className="features-list">
                <p>1. No personal information is required or collected.</p>
                <p>2. Your funds are stored on your device. Your keys, Your crypto.</p>
                <p>3. 40+ Blockchains and thousands of crypto tokens supported</p>
              </div>
              <div className="earn-button-container">
                <button className="earn-presale-btn">Join Presale</button>
              </div>
            </div>
            <div className="earn-preview">
              <img src={ExchangeSwap} alt="Non-Custodial Wallet Preview" />
            </div>
          </div>
        </div>
      </section>  
  );
};

const Portfolio = () => {
  return (
    <section className="exchange-swap-section">
      <div className="exchange-swap-wrapper">
        <div className='exchange-swap-container'>
          <div className="exchange-swap-content">
            <div className="exchange-preview">
              <img src={ExchangeSwap} alt="Portfolio Tracker Preview" />
            </div>

            <div className="exchange-text-content">
              <div className="exchange-header">
                <h2>The ScanX<br/>Portfolio Tracker</h2>
              </div>
              
              <p className="exchange-description">
                Get wealthier and achieve your investment goals with our dynamic portfolio tracker
                all from one app
              </p>

              <div className="exchange-features">
                <p>1. Track your wallets, exchange accounts and other assets such as stocks.</p>
                <p>2. Analyse your performance and improve your results by staying up to date with market conditions with easily digestible charts and statistics.</p>
              </div>

              <div className="exchange-button-container">
                <button className="earn-presale-btn">Join Presale</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
};

const CryptoCard = () => {
  return (
      <section className="earn-crypto-section">
        <div className="earn-crypto-wrapper">
          <div className='earn-crypto-container'>
            <div className="earn-crypto-content">
              <h2>The ScanX<br/>Crypto Card</h2>
              <p>
                Experience seamless crypto-to-fiat transactions with the ScanX crypto card.
                The ScanX Red card will be exclusive for VIP tier presale holders and will have a
                maximum of 100 holders. Users can effortlessly manage their digital assets
                and daily expenses anytime, anywhere
              </p>
              <div className="earn-button-container">
                <button className="earn-presale-btn">Join Presale</button>
              </div>
              <div className="cross-chain">
          <div className="chain-icons">
           <img src={visa} alt="Visa" />
          </div>
          </div>
            </div>
            <div className="earn-preview">
              <img src={Crypto} alt="Crypto Card Preview" />
            </div>
          </div>
        </div>
      </section>  
  );
};


export default ScanNetwork;