import { useState, useEffect } from 'react';
import { Globe, X } from 'lucide-react';
import HomeView from './views/HomeView';
import CatalogView from './views/CatalogView';
import ShowcaseView from './views/ShowcaseView';
import AdminLogin from './views/AdminLogin';
import AdminDashboard from './views/AdminDashboard';
import { supabase } from './lib/supabase';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const currentHour = new Date().getHours();
    return currentHour >= 18 || currentHour < 6;
  });
  
  const [toastMessage, setToastMessage] = useState('');
  const [visitorCount, setVisitorCount] = useState(0);
  const [session, setSession] = useState(null);
  const [currentView, setCurrentView] = useState(() => {
    const path = window.location.pathname.replace(/^\/|\/$/g, '');
    if (path === 'catalog' || path === 'showcase' || path === 'admin') return path;

    const hash = window.location.hash.replace('#', '');
    if (hash === 'catalog' || hash === 'showcase' || hash === 'admin') return hash;

    const params = new URLSearchParams(window.location.search);
    const view = params.get('view');
    if (view === 'catalog' || view === 'showcase' || view === 'admin') return view;

    return 'home';
  });
  const [showBrowserPrompt, setShowBrowserPrompt] = useState(false);

  // Deteksi In-App Browser (IG/TikTok) saat web pertama kali dimuat
  useEffect(() => {
    const ua = navigator.userAgent || navigator.vendor || window.opera;
    const isIAB = /Instagram|TikTok|Bytedance|FBAN|FBAV|Line/i.test(ua);
    if (isIAB) {
      setShowBrowserPrompt(true);
    }

    // Cek session Supabase
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Sync currentView to URL untuk mempermudah sharing link dengan view yang spesifik
  useEffect(() => {
    const newPath = currentView === 'home' ? '/' : `/${currentView}`;
    if (window.location.pathname !== newPath) {
      window.history.pushState({}, '', newPath);
    }
  }, [currentView]);

  useEffect(() => {
    const targetCount = 100000;
    const duration = 2000;
    const startTime = performance.now();

    const updateCounter = (currentTime) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setVisitorCount(Math.floor(easeOutQuart * targetCount));

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    };

    requestAnimationFrame(updateCounter);
  }, []);

  const handleShare = async () => {
    const shareData = {
      title: 'Mas Haris - Solusi Digital Terbaik',
      text: 'Temukan produk digital premium, diskon eksklusif, dan layanan terbaik di Mas Haris!',
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('User membatalkan share atau terjadi error:', err);
      }
    } else {
      try {
        const el = document.createElement('textarea');
        el.value = shareData.url;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        showToast('Tautan berhasil disalin!');
      } catch (err) {
        showToast('Gagal menyalin tautan.');
      }
    }
  };

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Hapus efek isDarkMode untuk background body
  useEffect(() => {
    document.body.style.backgroundColor = '#0a0a0a';
  }, []);

  return (
    <div className="min-h-screen font-sans bg-[#0a0a0a] text-[#f0f0f0] relative overflow-x-hidden">
      
      {/* Banner Peringatan In-App Browser */}
      {showBrowserPrompt && (
        <div id="iab-banner" className="show">
          <span>🌐 Buka di <strong>Chrome/Safari</strong> untuk pengalaman terbaik! Klik ⋮ lalu "Buka di Browser".</span>
          <button id="iab-close" onClick={() => setShowBrowserPrompt(false)}>✕</button>
        </div>
      )}

      {currentView === 'home' && (
        <HomeView 
          setCurrentView={setCurrentView} 
          visitorCount={visitorCount} 
          handleShare={handleShare} 
        />
      )}

      {currentView === 'catalog' && (
        <CatalogView 
          setCurrentView={setCurrentView} 
          showToast={showToast} 
        />
      )}

      {currentView === 'showcase' && (
        <ShowcaseView 
          setCurrentView={setCurrentView} 
        />
      )}

      {currentView === 'admin' && (
        session ? (
          <AdminDashboard session={session} onLogout={() => setSession(null)} />
        ) : (
          <AdminLogin setSession={setSession} />
        )
      )}

      {toastMessage && (
        <div id="toast" className="show">
          {toastMessage}
        </div>
      )}
    </div>
  );
}

export default App;
