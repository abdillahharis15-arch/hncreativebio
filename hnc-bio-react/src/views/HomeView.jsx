import { useState, useEffect } from 'react';
import { Share2, Sun, Moon, CheckCircle2, Users, Globe, Store, ShoppingBag, MessageCircle, Instagram, Twitter, Youtube, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function HomeView({ isDarkMode, setIsDarkMode, setCurrentView, visitorCount, handleShare }) {
  const [profile, setProfile] = useState(null);
  const [linksData, setLinksData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: profileData } = await supabase.from('profile').select('*').single();
        if (profileData) setProfile(profileData);

        const { data: linksResult } = await supabase.from('links').select('*').order('order_index', { ascending: true });
        if (linksResult) setLinksData(linksResult);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  const renderIcon = (iconName, className) => {
    switch(iconName) {
      case 'Globe': return <Globe className={className} />;
      case 'Store': return <Store className={className} />;
      case 'ShoppingBag': return <ShoppingBag className={className} />;
      case 'MessageCircle': return <MessageCircle className={className} />;
      default: return <Globe className={className} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className={`w-8 h-8 animate-spin ${isDarkMode ? 'text-white' : 'text-slate-900'}`} />
      </div>
    );
  }

  const bgColor = profile?.background_color || (isDarkMode ? '#020617' : '#FAFAFA');

  return (
    <>
      <div className="fixed inset-0 z-0" style={{ backgroundColor: bgColor }}>
        {profile?.background_url ? (
          <img src={profile.background_url} alt="Background" className="w-full h-full object-cover opacity-50" />
        ) : (
          <img src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1920&q=80" alt="Nature Background" className="w-full h-full object-cover opacity-30" />
        )}
        <div className={`absolute inset-0 backdrop-blur-md transition-colors duration-500 ${isDarkMode ? 'bg-slate-950/80' : 'bg-white/60'}`}></div>
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
            <img src={profile?.photo_url || "https://i.ibb.co.com/fVMTm44r/b3f64d34-5b1b-4539-a0cc-b108a0600cff.jpg"} alt="Profile" className="absolute inset-0 w-full h-full object-cover rounded-full z-10 transition-transform duration-300 group-hover:scale-105" />
            <img src="https://i.ibb.co.com/jkDhFmS1/Pngtree-instagram-bule-tick-insta-blue-9074860.png" alt="Verified" className="absolute -bottom-1 -right-1 w-8 h-8 z-20 drop-shadow-md" />
          </div>
          <h1 className="text-2xl font-black mb-1 drop-shadow-sm flex items-center justify-center gap-1.5">
            {profile?.name || 'Mas Haris'} <img src="https://i.ibb.co.com/jkDhFmS1/Pngtree-instagram-bule-tick-insta-blue-9074860.png" alt="Verified" className="w-5 h-5" />
          </h1>
          <p className={`text-sm font-medium px-4 leading-relaxed whitespace-pre-line ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
            {profile?.bio || 'Halo guys! 👋 Terima kasih sudah klik link bio ini. Sekarang aku udah siap bantu penuhi kebutuhan digital premium kamu dengan harga sahabat.\nYuk, cek layanannya di bawah 👇'}
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
          {linksData.map((link) => {
            const isCatalogInfo = link.title?.toLowerCase().includes('katalog');
            const isShowcaseInfo = link.title?.toLowerCase().includes('showcase');
            const isInternal = isCatalogInfo || isShowcaseInfo || link.url === '#';
            
            return (
              <div key={link.id} className="w-full flex flex-col gap-2">
                <a 
                  href={isInternal ? '#' : link.url} 
                  target={!isInternal ? '_blank' : undefined} 
                  rel={!isInternal ? 'noopener noreferrer' : undefined} 
                  onClick={(e) => {
                    if (isCatalogInfo) { 
                      e.preventDefault(); 
                      setCurrentView('catalog'); 
                      window.scrollTo(0,0); 
                    } else if (isShowcaseInfo) { 
                      e.preventDefault(); 
                      setCurrentView('showcase'); 
                      window.scrollTo(0,0); 
                    }
                  }}
                  className={`group flex items-center p-4 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] shadow-sm hover:shadow-md cursor-pointer backdrop-blur-md border ${isDarkMode ? 'bg-black/40 border-white/10 hover:bg-black/50' : 'bg-white/40 border-white/50 hover:bg-white/60'}`}
                >
                  <div className={`${link.color || 'bg-blue-500 hover:bg-blue-600'} text-white p-3 rounded-xl mr-4 transition-transform group-hover:rotate-6 shadow-sm flex items-center justify-center`}>
                    {renderIcon(link.icon_name, "w-5 h-5")}
                  </div>
                  <div className="flex-1 text-left">
                    <h2 className="font-semibold text-base drop-shadow-sm">{link.title}</h2>
                    {link.subtitle && <p className={`text-xs mt-0.5 font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{link.subtitle}</p>}
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
          © {new Date().getFullYear()} Mas Haris. All rights reserved.
        </p>
      </div>
    </>
  );
}
