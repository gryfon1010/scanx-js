import React, { useState } from 'react';
import '../styles/UnlimitedPotential.css';

const SecurityIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="benefit-icon">
    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 2.18l7 3.12v4.7c0 4.67-3.13 8.95-7 10.18-3.87-1.23-7-5.51-7-10.18V6.3l7-3.12z" 
      fill="currentColor"/>
    <path d="M12 12l3 3m0-6l-3 3-3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const RewardIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="benefit-icon">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" 
      fill="currentColor"/>
    <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const FeesIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="benefit-icon">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM12 20c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" 
      fill="currentColor"/>
    <path d="M11.5 7v2.25m0 1.5v6.25m0 0h1c1.5 0 3-1 3-2.5s-1.5-2.5-3-2.5h-1m0 5h1c1.5 0 3-1 3-2.5" 
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const GovernanceIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="benefit-icon">
    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" 
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const benefits = [
  {
    icon: <SecurityIcon />,
    label: "TECHNOLOGY",
    title: "Secure",
    description: "Each transaction is 100% secure and executed through smart contracts which are transparent and immutable."
  },
  {
    icon: <RewardIcon />,
    label: "ECOSYSTEM",
    title: "Reward Program",
    description: "Earn cash back rewards on every transaction, plus passive income rewards for staking your ScanX tokens."
  },
  {
    icon: <FeesIcon />,
    label: "AVAILABILITY",
    title: "Lower Fees",
    description: "Trade thousands of cryptocurrencies with tight spreads, zero slippage and the fastest execution."
  },
  {
    icon: <GovernanceIcon />,
    label: "HONESTY",
    title: "Governance",
    description: "Use ScanX tokens as governance tokens and vote on key project decisions. More tokens, more voting power."
  }
];

const UnlimitedPotential = () => {
  const [focusedCard, setFocusedCard] = useState(0);
  const [visibleCards, setVisibleCards] = useState(4);
  const totalCards = benefits.length;
  const totalPages = Math.ceil(totalCards / visibleCards);
  const currentPage = Math.floor(focusedCard / visibleCards);

  const nextCard = () => {
    setFocusedCard((prev) => (prev === benefits.length - 1 ? 0 : prev + 1));
  };

  const prevCard = () => {
    setFocusedCard((prev) => (prev === 0 ? benefits.length - 1 : prev - 1));
  };

  const jumpToCard = (index) => {
    setFocusedCard(index);
  };

  // Calculate visible range of cards
  const startIndex = currentPage * visibleCards;
  const endIndex = Math.min(startIndex + visibleCards, totalCards);
  const visibleRange = benefits.slice(startIndex, endIndex);

  return (
    <section className="unlimited-potential">
      <div className="unlimited-header">
        <h3>Benefits</h3>
        <h1>Unlimited Potential</h1>
      </div>

      <div className="benefits-slider">
        {visibleRange.map((benefit, index) => {
          const actualIndex = startIndex + index;
          return (
            <div 
              key={actualIndex}
              className={`benefit-slide ${actualIndex === focusedCard ? 'active' : ''}`}
              onClick={() => jumpToCard(actualIndex)}
            >
              <div className="benefit-icon-wrapper">
                {benefit.icon}
              </div>
              <div className="benefit-info">
                <span className="benefit-label">{benefit.label}</span>
                <h2 className="benefit-title">{benefit.title}</h2>
                <p className="benefit-description">{benefit.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="slider-footer">
        <div className="slider-controls">
          <button 
            className={`control-button prev ${focusedCard === 0 ? 'active' : ''}`} 
            onClick={prevCard}
            aria-label="Previous benefit"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M15 18l-6-6 6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <div className="card-counter">
            <span className="current">{focusedCard + 1}</span>
            <span className="separator">/</span>
            <span className="total">{totalCards}</span>
          </div>
          <button 
            className={`control-button next ${focusedCard === benefits.length - 1 ? 'active' : ''}`}
            onClick={nextCard}
            aria-label="Next benefit"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M9 18l6-6-6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <div className="pagination-dots">
          {Array.from({ length: totalCards }).map((_, index) => (
            <button
              key={index}
              className={`pagination-dot ${index === focusedCard ? 'active' : ''}`}
              onClick={() => jumpToCard(index)}
              aria-label={`Go to benefit ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default UnlimitedPotential;
