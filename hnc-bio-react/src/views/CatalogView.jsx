import React, { useState } from 'react';
import { Hexagon, Lock, Star, ChevronDown, Instagram, Twitter, Youtube } from 'lucide-react';
import Header from '../components/Header';
import { catalogItems } from '../data/constants';

export default function CatalogView({ isDarkMode, setIsDarkMode, currentView, setCurrentView, showToast }) {
  const [revealedItems, setRevealedItems] = useState([]);

  return (
    <div className="relative z-10 w-full flex flex-col items-center bg-transparent min-h-screen">
      <div 
        className={`absolute inset-0 z-0 opacity-20 pointer-events-none transition-colors duration-500`}
        style={{ 
          backgroundImage: `linear-gradient(${isDarkMode ? '#334155' : '#cbd5e1'} 1px, transparent 1px), linear-gradient(90deg, ${isDarkMode ? '#334155' : '#cbd5e1'} 1px, transparent 1px)`, 
          backgroundSize: '40px 40px' 
        }}
      ></div>
      
      <Header isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} currentView={currentView} setCurrentView={setCurrentView} />

      <main className="w-full flex flex-col items-center text-center px-4 pt-10 md:pt-20 pb-16 z-20">
        <div className={`flex items-center gap-3 px-4 py-2 rounded-full text-xs font-bold mb-8 shadow-sm border transition-colors ${isDarkMode ? 'bg-slate-800/80 border-slate-700 text-slate-300' : 'bg-white border-slate-200 text-slate-600'}`}>
          <div className="flex -space-x-2">
            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=64&h=64&q=80" alt="User" className="w-7 h-7 rounded-full border-2 border-white object-cover shadow-sm" />
            <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=64&h=64&q=80" alt="User" className="w-7 h-7 rounded-full border-2 border-white object-cover shadow-sm" />
            <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=64&h=64&q=80" alt="User" className="w-7 h-7 rounded-full border-2 border-white object-cover shadow-sm" />
            <div className="w-7 h-7 rounded-full border-2 border-white bg-blue-500 text-white flex items-center justify-center text-[10px] shadow-sm">+</div>
          </div>
          <span className="ml-1">Dipercaya 10.000+ Pelanggan Setia</span>
        </div>
        <h1 className="text-5xl md:text-[5.5rem] font-black tracking-tight leading-[1.05] max-w-4xl drop-shadow-sm">
          Upgrade Akses <br className="hidden md:block" />
          <span className="text-blue-600 relative inline-block">
            Digital Premium
            <svg className="absolute w-full h-4 -bottom-1 md:-bottom-2 left-0 text-rose-500 opacity-60" viewBox="0 0 100 20" preserveAspectRatio="none"><path d="M0,10 Q50,20 100,10" stroke="currentColor" strokeWidth="4" fill="transparent"/></svg>
          </span>
        </h1>
        <p className={`mt-8 text-lg md:text-xl font-medium max-w-2xl leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          Nikmati layanan berlangganan favorit Anda dengan harga jauh lebih hemat. Proses cepat, garansi penuh, dan 100% aman untuk penggunaan jangka panjang.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 w-full sm:w-auto px-4 justify-center">
          <button onClick={() => window.scrollTo({ top: 800, behavior: 'smooth' })} className={`flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold text-sm shadow-xl transition-all hover:-translate-y-1 ${isDarkMode ? 'bg-blue-600 text-white hover:bg-blue-500' : 'bg-black text-white hover:bg-gray-800'}`}>
            Lihat Koleksi Produk <ChevronDown className="w-4 h-4" />
          </button>
          <a href="https://wa.me/6285121358761" target="_blank" rel="noopener noreferrer" className={`flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold text-sm transition-all hover:-translate-y-1 border-2 ${isDarkMode ? 'border-slate-700 text-white hover:bg-slate-800' : 'border-slate-200 text-slate-800 hover:bg-slate-50'}`}>
            Hubungi Admin
          </a>
        </div>
      </main>

      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 pb-24 pt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 lg:gap-x-10 lg:gap-y-16 items-stretch">
          {catalogItems.map((item) => {
            const isRevealed = item.price && revealedItems.includes(item.id);
            return (
              <div key={item.id} className="relative mt-24 rounded-[2.5rem] p-8 md:p-10 text-white shadow-2xl transition-all duration-500 hover:-translate-y-4 border border-white/20 backdrop-blur-sm group flex flex-col" style={{backgroundColor: item.bgColor}}>
                <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 w-[60%] aspect-[4/3] transition-transform duration-500 group-hover:scale-105 group-hover:-translate-y-2">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover rounded-[1.5rem] shadow-2xl border-4 border-white/90 backdrop-blur-md" />
                  <div className="absolute -bottom-5 -left-5 bg-white backdrop-blur-md p-3 rounded-2xl shadow-xl border-2 border-slate-100 z-30 transform -rotate-6 transition-transform group-hover:rotate-0">
                    <img src={item.logo} alt={`Logo ${item.prefix}`} className="w-10 h-10 object-contain drop-shadow-sm" />
                  </div>
                </div>
                <div className="absolute top-8 right-6 bg-white/90 backdrop-blur-md text-gray-900 rounded-2xl w-20 h-20 flex flex-col items-center justify-center shadow-lg border-2 border-white/50 z-20 transition-all duration-300 transform group-hover:scale-105">
                  {!isRevealed ? (
                    <React.Fragment>
                      <Lock className="w-5 h-5 text-gray-700 mb-1" />
                      <span className="text-[10px] font-bold text-gray-800 uppercase text-center leading-tight">Cek<br/>Harga</span>
                    </React.Fragment>
                  ) : (
                    <div className="animate-pulse">
                      <span className="text-[9px] text-gray-500 uppercase font-bold tracking-wider block text-center">Price</span>
                      <span className="text-xl font-extrabold leading-none text-gray-800 block text-center">Rp{item.price.replace('K','')}k</span>
                      <span className="text-[10px] text-gray-400 line-through font-semibold mt-0.5 block text-center">Rp {item.oldPrice}</span>
                    </div>
                  )}
                </div>
                <div className="pt-24 flex flex-col flex-grow">
                  <h3 className="text-2xl italic font-serif opacity-90 mb-1">{item.prefix}</h3>
                  <h2 className="text-4xl font-black mb-5 tracking-tight">{item.title}</h2>
                  <div className="flex items-center gap-2 mb-6 bg-black/20 w-max px-4 py-2 rounded-full backdrop-blur-md border border-white/10 shadow-inner">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < Math.floor(item.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-white/30 fill-white/30'}`} />
                      ))}
                    </div>
                    <span className="text-sm font-bold">{item.rating}</span>
                    <span className="text-white/40 text-xs mx-1">|</span>
                    <span className="text-xs font-bold text-emerald-300 drop-shadow-sm">{item.sold}</span>
                  </div>
                  <p className="text-sm text-white/90 mb-8 leading-relaxed font-medium">{item.description}</p>
                  <div className="mt-auto">
                    {!isRevealed ? (
                      <button onClick={() => setRevealedItems([...revealedItems, item.id])} className="bg-white text-slate-900 hover:bg-slate-100 px-6 py-4 rounded-full font-black text-xs tracking-widest transition-all shadow-xl border border-white/50 w-full hover:scale-[1.02]">
                        BONGKAR HARGA
                      </button>
                    ) : (
                      item.checkoutUrl ? (
                        <a href={item.checkoutUrl} target="_blank" rel="noopener noreferrer" className="bg-emerald-500 text-white hover:bg-emerald-400 px-6 py-4 rounded-full font-black text-xs tracking-widest transition-all shadow-xl border border-white/50 w-full animate-bounce inline-block text-center hover:scale-[1.02]">
                          LANJUT CHECKOUT
                        </a>
                      ) : (
                        <button onClick={() => showToast(`Link checkout untuk ${item.prefix} akan segera hadir!`)} className="bg-emerald-500 text-white hover:bg-emerald-400 px-6 py-4 rounded-full font-black text-xs tracking-widest transition-all shadow-xl border border-white/50 w-full animate-bounce hover:scale-[1.02]">
                          LANJUT CHECKOUT
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      
      <footer className={`w-full py-10 text-center border-t mt-auto z-20 ${isDarkMode ? 'border-slate-800 text-slate-500 bg-slate-950/80' : 'border-slate-200 text-slate-400 bg-white/80'} backdrop-blur-md`}>
        <div className="flex justify-center gap-6 mb-4">
          <a href="#" className="hover:text-blue-500 transition-colors"><Instagram className="w-5 h-5" /></a>
          <a href="#" className="hover:text-blue-500 transition-colors"><Twitter className="w-5 h-5" /></a>
          <a href="#" className="hover:text-blue-500 transition-colors"><Youtube className="w-5 h-5" /></a>
        </div>
        <p className="text-xs font-semibold">© {new Date().getFullYear()} HN Creative. All rights reserved.</p>
      </footer>
    </div>
  );
}
