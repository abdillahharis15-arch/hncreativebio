import React from 'react';
import Header from '../components/Header';
import { Star } from 'lucide-react';
import { showcaseItems } from '../data/constants';

export default function ShowcaseView({ isDarkMode, setIsDarkMode, currentView, setCurrentView, visitorCount }) {
  return (
    <div className="relative z-10 w-full flex flex-col items-center bg-transparent min-h-screen">
      <Header isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} currentView={currentView} setCurrentView={setCurrentView} />
      
      <main className="w-full flex flex-col items-center text-center px-4 pt-10 md:pt-16 pb-0 z-20">
        <div className={`flex items-center gap-3 px-4 py-1.5 rounded-full text-xs font-bold mb-8 shadow-sm border transition-colors ${isDarkMode ? 'bg-slate-800/80 border-slate-700 text-slate-300' : 'bg-white border-slate-200 text-slate-600'}`}>
          <div className="flex -space-x-2">
            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=64&h=64&q=80" alt="User" className="w-6 h-6 rounded-full border-2 border-white object-cover" />
            <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=64&h=64&q=80" alt="User" className="w-6 h-6 rounded-full border-2 border-white object-cover" />
            <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=64&h=64&q=80" alt="User" className="w-6 h-6 rounded-full border-2 border-white object-cover" />
          </div>
          <span>Trusted by {visitorCount.toLocaleString('id-ID')}+ Users Worldwide</span>
        </div>
        <h1 className="text-5xl md:text-[5rem] font-black tracking-tight leading-[1.05] max-w-4xl drop-shadow-sm">
          Official <br className="hidden md:block" />
          <span className="text-blue-600">Showcase</span>
        </h1>
        <p className={`mt-6 text-lg md:text-xl font-medium max-w-2xl leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          Produk rekomendasi yang pasti diskon dan gratis ongkir ada di sini.
        </p>
      </main>

      <div className="relative w-full max-w-5xl mx-auto h-[350px] md:h-[450px] mt-8 md:mt-12 z-10 overflow-hidden md:rounded-[2.5rem]">
        <div className={`absolute inset-x-0 top-0 h-32 bg-gradient-to-b ${isDarkMode ? 'from-slate-950' : 'from-[#FAFAFA]'} to-transparent z-10`}></div>
        <div className={`absolute inset-y-0 left-0 w-24 bg-gradient-to-r ${isDarkMode ? 'from-slate-950' : 'from-[#FAFAFA]'} to-transparent z-10 hidden md:block`}></div>
        <div className={`absolute inset-y-0 right-0 w-24 bg-gradient-to-l ${isDarkMode ? 'from-slate-950' : 'from-[#FAFAFA]'} to-transparent z-10 hidden md:block`}></div>
        <img src="https://mansajululum.ponpes.id/wp-content/uploads/2023/09/WhatsApp-Image-2023-09-01-at-19.36.25.jpeg" alt="Showcase Background" className="w-full h-full object-cover object-center blur-md scale-105" />
      </div>

      <section className="w-full max-w-5xl mx-auto px-4 pb-12 md:pb-16 relative z-20 -mt-32 md:-mt-40">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {showcaseItems.map((item) => (
            <a key={item.id} href={item.url} target="_blank" rel="noopener noreferrer" className={`group flex flex-col md:flex-row items-center p-2 rounded-[2rem] transition-all duration-300 hover:-translate-y-2 border shadow-xl hover:shadow-2xl ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
              <div className="w-full md:w-48 h-48 rounded-[1.5rem] overflow-hidden shrink-0 relative">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              <div className="p-6 md:p-8 flex-1 text-left w-full">
                <div className="flex items-center gap-3 mb-2">
                  <img src={item.logo} alt="Logo" className="w-8 h-8 drop-shadow-sm" />
                  <h3 className="text-2xl font-black">{item.title}</h3>
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <div className={`flex items-center gap-1 px-2 py-0.5 rounded-md ${isDarkMode ? 'bg-yellow-500/10' : 'bg-yellow-500/20'}`}>
                    <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                    <span className={`text-xs font-bold ${isDarkMode ? 'text-yellow-500' : 'text-yellow-700'}`}>{item.rating}</span>
                  </div>
                  <span className={`text-xs font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>• {item.sold}</span>
                </div>
                <p className={`text-sm font-medium leading-relaxed mb-6 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{item.description}</p>
                <span className="inline-flex items-center justify-center px-6 py-2.5 rounded-full text-xs font-extrabold text-white tracking-wider transition-transform group-hover:scale-105" style={{ backgroundColor: item.bgColor }}>
                  {item.btnText}
                </span>
              </div>
            </a>
          ))}
        </div>
      </section>

      <footer className={`w-full py-8 text-center border-t mt-auto ${isDarkMode ? 'border-slate-800 text-slate-500' : 'border-slate-200 text-slate-400'}`}>
        <p className="text-xs font-semibold">© {new Date().getFullYear()} HN Creative. All rights reserved.</p>
      </footer>
    </div>
  );
}
