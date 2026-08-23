import React from 'react';
import { showcaseItems } from '../data/constants';

export default function ShowcaseView({ setCurrentView }) {
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className="star text-[#f59e0b] text-[12px]">{i < Math.floor(rating) ? '★' : '☆'}</span>
    ));
  };

  return (
    <div id="page-showcase" className="active">
      
      {/* Page Header */}
      <header className="page-header">
        <div className="page-header-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f0f0f0' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--muted)' }}>
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
          Official Store
        </div>
        <button className="back-btn" onClick={() => { setCurrentView('home'); window.scrollTo(0,0); }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
            <path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>
          </svg>
          Kembali
        </button>
      </header>

      {/* Hero Section */}
      <div className="page-hero">
        <h1>
          <span className="showcase-hero-word">Official</span> <span className="showcase-hero-serif">Showcase</span>
        </h1>
        <p className="text-[14px] text-neutral-500 mt-2">
          Produk rekomendasi dengan diskon &amp; gratis ongkir. Belanja langsung di platform resmi.
        </p>
      </div>

      {/* Showcase Grid */}
      <div className="showcase-grid">
        {showcaseItems.map((item) => (
          <a key={item.id} className="showcase-card" href={item.url} target="_blank" rel="noopener noreferrer">
            <img src={item.image} alt={item.title} className="showcase-card-img" />
            <div className="showcase-card-body">
              <div>
                <div className="showcase-platform">
                  <img src={item.logo} alt={item.title} />
                  <span>{item.title}</span>
                </div>
                <p className="showcase-desc">{item.description}</p>
                <div className="stars">{renderStars(item.rating)}</div>
                <div className="sold-badge" style={{ marginTop: '3px' }}>{item.sold}</div>
              </div>
              <span className="showcase-btn text-center" style={{ backgroundColor: item.bgColor }}>
                {item.btnText} →
              </span>
            </div>
          </a>
        ))}
      </div>

    </div>
  );
}
