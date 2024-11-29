import React, { useState, useEffect } from 'react';
import './LandingPage.css';
import coinpediaLogo from './assets/coinpedia.png';
import cryptoNewsLogo from './assets/crypto-news.png';
import coinMarketCapLogo from './assets/coinmarketcap.png';
import cryptoDailyLogo from './assets/crypto-daily.png';

const Navbar = ({ onConnectWallet }) => {
  return (
    <nav className="navbar">
      <div className="logo">
        <h1>ScanX</h1>
        <span>NETWORK</span>
      </div>
      <div className="nav-links">
        <a href="#home">HOME</a>
        <a href="#how">How To Buy</a>
        <a href="#claim">Claim</a>
        <a href="#calculator">Calculator</a>
      </div>
      <button className="connect-wallet" onClick={onConnectWallet}>Connect Wallet</button>
    </nav>
  );
};

const Countdown = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: '00',
    hours: '00',
    minutes: '00',
    seconds: '00'
  });

  useEffect(() => {
    const targetDate = new Date('2024-12-29T23:59:59').getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({
          days: days.toString().padStart(2, '0'),
          hours: hours.toString().padStart(2, '0'),
          minutes: minutes.toString().padStart(2, '0'),
          seconds: seconds.toString().padStart(2, '0')
        });
      }
    };

    // Update immediately
    updateCountdown();
    
    // Update every second
    const timer = setInterval(updateCountdown, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="countdown">
      <div className="time-block">
        <span className="number">{timeLeft.days}</span>
        <span className="label">Days</span>
      </div>
      <div className="time-block">
        <span className="number">{timeLeft.hours}</span>
        <span className="label">Hours</span>
      </div>
      <div className="time-block">
        <span className="number">{timeLeft.minutes}</span>
        <span className="label">Mins</span>
      </div>
      <div className="time-block">
        <span className="number">{timeLeft.seconds}</span>
        <span className="label">Seconds</span>
      </div>
    </div>
  );
};

const LandingPage = ({ onConnectWallet }) => {
  return (
    <div className="landing-container">
      <Navbar onConnectWallet={onConnectWallet} />
      <div style={{ height: '5rem' }} />
      <div className="content-wrapper">
        <div className="left-section">
          <h1 className="title">
            Enabling Effortless
            <br />
            Cross-Chain
            <br />
            <span className="highlight">
              Transactions with
              <br />
              Fluid Liquidity
            </span>
          </h1>
          <p className="description">
            ScanX is disrupting the DeFi world with our interconnected ecosystem. We
            aim to provide users with effortless Cross-Chain Asset Transfers -
            Fast,Secure,and Non- Custodial
          </p>
          <button className="join-button">
            Join Presale
          </button>
        </div>
        <div className="right-section">
          <div className="calculator-card">
            <div className="token-price">
              <span>1 SCANX = $ 0.0011</span>
            </div>
            
            <Countdown />

            <div className="progress-container">
              <div className="progress-bar">
                <div className="progress"></div>
              </div>
              <div className="progress-labels">
                <span>USDT Raised: $0</span>
                <span>$500,000</span>
              </div>
            </div>

            <div className="input-fields">
              <input type="text" placeholder="USDT (min)" />
              <input type="text" placeholder="Max Extra" />
              <input type="text" placeholder="Your Ethereum Address" />
              <div className="amount-row">
                <input type="text" placeholder="Amount ($)" />
                <input type="text" placeholder="Pay with ETH" />
              </div>
              <input type="text" placeholder="Your Referral (Optional)" />
              <button className="buy-button">Buy Extra Now</button>
            </div>
          </div>
        </div>
      </div>
      <div className="media-section">
        <h2>AS SEEN IN THE MEDIA</h2>
        <div className="media-logos">
          <img src={coinpediaLogo} alt="Coinpedia" />
          <img src={cryptoNewsLogo} alt="Crypto News" />
          <img src={coinMarketCapLogo} alt="CoinMarketCap" />
          <img src={cryptoDailyLogo} alt="Crypto Daily" />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;