import React, { useState } from 'react';
import { catalogItems } from '../data/constants';

export default function CatalogView({ currentView, setCurrentView, showToast }) {
  const [revealedItems, setRevealedItems] = useState([]);

  const isRevealed = (id) => revealedItems.includes(id);
  const revealPrice = (id) => setRevealedItems([...revealedItems, id]);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className="star text-[#f59e0b] text-[12px]">{i < Math.floor(rating) ? '★' : '☆'}</span>
    ));
  };

  return (
    <div id="page-catalog" className="active">
      
      {/* Page Header */}
      <header className="page-header">
        <div className="page-header-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f0f0f0' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--muted)' }}>
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <path d="M16 10a4 4 0 0 1-8 0"></path>
          </svg>
          Katalog Produk
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
          <span className="catalog-hero-bold">Upgrade</span> <span className="catalog-hero-serif highlight">Akses Digital</span> <span className="catalog-hero-bold">Kamu</span>
        </h1>
        <p className="text-[14px] text-neutral-500 mt-2">
          Produk berlangganan premium, harga jauh lebih hemat. Proses cepat, garansi penuh, 100% aman.
        </p>
      </div>

      {/* Catalog Grid */}
      <div className="catalog-grid">
        {catalogItems.map((item) => {
          const revealed = isRevealed(item.id);
          return (
            <div key={item.id} className="product-card">
              <div className="overflow-hidden flex-shrink-0">
                <img src={item.image} alt={item.title} className="product-card-img" />
              </div>
              <div className="product-card-body">
                <div className="product-brand">
                  <img src={item.logo} alt={item.prefix} className="product-logo" />
                  <span className="product-prefix">{item.prefix}</span>
                </div>
                <div className="product-name">{item.title}</div>
                <div className="stars">{renderStars(item.rating)}</div>
                <div className="sold-badge">{item.sold}</div>
                <div className="product-desc">{item.description}</div>
                
                <div className="product-footer">
                  {!revealed ? (
                    <button className="price-reveal-btn" onClick={() => revealPrice(item.id)}>
                      Lihat Harga
                    </button>
                  ) : (
                    <React.Fragment>
                      <div className="flex flex-col">
                        <div className="price-actual">Rp {item.price}</div>
                        <div className="price-old">Rp {item.oldPrice}</div>
                      </div>
                      {item.checkoutUrl ? (
                        <a href={item.checkoutUrl} target="_blank" rel="noopener noreferrer" className="checkout-btn">
                          Checkout →
                        </a>
                      ) : (
                        <button className="checkout-btn" onClick={() => showToast(`Link ${item.prefix} segera hadir!`)}>
                          Segera Hadir
                        </button>
                      )}
                    </React.Fragment>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
