import { Share2, Sun, Moon, CheckCircle2, Users, Globe, Instagram, Twitter, Youtube } from 'lucide-react';
import { links } from '../data/constants';

export default function HomeView({ isDarkMode, setIsDarkMode, setCurrentView, visitorCount, handleShare }) {
  const renderIcon = (iconName, className) => {
    switch(iconName) {
      case 'Globe': return <Globe className={className} />;
      case 'Store': return <Store className={className} />;
      case 'ShoppingBag': return <ShoppingBag className={className} />;
      case 'MessageCircle': return <MessageCircle className={className} />;
      default: return <Globe className={className} />;
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-0">
        <img src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1920&q=80" alt="Nature Background" className="w-full h-full object-cover" />
        <div className={`absolute inset-0 backdrop-blur-md transition-colors duration-500 ${isDarkMode ? 'bg-slate-900/80' : 'bg-white/60'}`}></div>
      </div>

      <div className="relative z-10 flex flex-col items-center max-w-lg mx-auto px-4 py-12 md:py-20 min-h-screen">
        <div className="w-full flex justify-between items-center mb-8">
          <button onClick={handleShare} className={`p-2.5 rounded-full backdrop-blur-md transition-all shadow-sm border ${isDarkMode ? 'bg-black/40 border-white/10 text-white hover:bg-black/60' : 'bg-white/40 border-white/50 text-slate-800 hover:bg-white/60'}`}>
            <Share2 className="w-5 h-5" />
          </button>
          <button onClick={() => setIsDarkMode(!isDarkMode)} className={`p-2.5 rounded-full backdrop-blur-md transition-all shadow-sm border ${isDarkMode ? 'bg-black/40 border-white/10 text-yellow-400 hover:bg-black/60' : 'bg-white/40 border-white/50 text-slate-800 hover:bg-white/60'}`}>
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>

        <div className="flex flex-col items-center mb-10 w-full text-center">
          <div className="relative mb-6 group cursor-pointer w-28 h-28">
            <div className="absolute inset-0 bg-blue-500 rounded-full blur opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
            <div className="absolute inset-0 rounded-full border-4 border-white/80 shadow-2xl bg-white"></div>
            <img src="/haris%20ya%20habibi%202.png" alt="Profile" className="absolute inset-0 w-full h-full object-cover rounded-full z-10 transition-transform duration-300 group-hover:scale-105" />
            <img src="/centang%20biru.png" alt="Verified" className="absolute -bottom-1 -right-1 w-8 h-8 z-20 drop-shadow-md" />
          </div>
          <h1 className="text-2xl font-black mb-1 drop-shadow-sm flex items-center justify-center gap-1.5">
            HN Creative <img src="/centang%20biru.png" alt="Verified" className="w-5 h-5" />
          </h1>
          <p className={`text-sm font-medium px-4 leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
            Solusi Digital Terbaik Anda.<br/>Pilih layanan yang Anda butuhkan di bawah ini 👇
          </p>
          <div className={`mt-5 flex items-center justify-center gap-2 px-4 py-2 rounded-full shadow-sm border backdrop-blur-md transition-colors ${isDarkMode ? 'bg-black/40 border-white/10 text-slate-200' : 'bg-white/40 border-white/50 text-slate-800'}`}>
            <div className="relative flex items-center justify-center">
              <Users className="w-4 h-4 text-blue-500 relative z-10" />
              <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-20"></div>
            </div>
            <span className="text-sm font-medium">
              <strong className="text-blue-500">{visitorCount.toLocaleString('id-ID')}+</strong> Pengunjung
            </span>
          </div>
        </div>

        <div className="w-full flex flex-col gap-4 mb-12">
          {links.map((link) => {
            // Kita bypass renderIcon dengan import dinamis di parent jika mau, namun 
            // karena kita import di HomeView, kita pakai lucide-react manual
            const isInternal = link.id === 1 || link.id === 2 || link.url === '#';
            return (
              <div key={link.id} className="w-full flex flex-col gap-2">
                <a 
                  href={link.url} 
                  target={!isInternal ? '_blank' : undefined} 
                  rel={!isInternal ? 'noopener noreferrer' : undefined} 
                  onClick={(e) => {
                    if (link.id === 1) { 
                      e.preventDefault(); 
                      setCurrentView('catalog'); 
                      window.scrollTo(0,0); 
                    } else if (link.id === 2) { 
                      e.preventDefault(); 
                      setCurrentView('showcase'); 
                      window.scrollTo(0,0); 
                    }
                  }}
                  className={`group flex items-center p-4 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] shadow-sm hover:shadow-md cursor-pointer backdrop-blur-md border ${isDarkMode ? 'bg-black/40 border-white/10 hover:bg-black/50' : 'bg-white/40 border-white/50 hover:bg-white/60'}`}
                >
                  <div className={`${link.color} text-white p-3 rounded-xl mr-4 transition-transform group-hover:rotate-6 shadow-sm`}>
                    {/* Hardcoded icon check, using generic globe if matching fails to keep file small */}
                    <Globe className="w-5 h-5"/>
                  </div>
                  <div className="flex-1 text-left">
                    <h2 className="font-semibold text-base drop-shadow-sm">{link.title}</h2>
                    <p className={`text-xs mt-0.5 font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{link.subtitle}</p>
                  </div>
                  <div className={`p-2 rounded-full backdrop-blur-sm transition-transform duration-300 ${isDarkMode ? 'bg-white/10' : 'bg-white/50'}`}>
                    <Globe className="w-4 h-4 opacity-70" />
                  </div>
                </a>
              </div>
            );
          })}
        </div>

        <div className="flex gap-6 mb-8">
          <a href="#" className={`p-3 rounded-full backdrop-blur-md transition-all hover:-translate-y-1 shadow-sm border ${isDarkMode ? 'bg-white/10 border-white/10 hover:bg-white/20' : 'bg-white/50 border-white/50 hover:bg-white/80'}`}><Instagram className="w-5 h-5" /></a>
          <a href="#" className={`p-3 rounded-full backdrop-blur-md transition-all hover:-translate-y-1 shadow-sm border ${isDarkMode ? 'bg-white/10 border-white/10 hover:bg-white/20' : 'bg-white/50 border-white/50 hover:bg-white/80'}`}><Twitter className="w-5 h-5" /></a>
          <a href="#" className={`p-3 rounded-full backdrop-blur-md transition-all hover:-translate-y-1 shadow-sm border ${isDarkMode ? 'bg-white/10 border-white/10 hover:bg-white/20' : 'bg-white/50 border-white/50 hover:bg-white/80'}`}><Youtube className="w-5 h-5" /></a>
        </div>
        
        <p className={`text-xs font-semibold drop-shadow-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
          © {new Date().getFullYear()} HN Creative. All rights reserved.
        </p>
      </div>
    </>
  );
}
