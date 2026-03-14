import { useState, useEffect } from 'react';
import HomeView from './views/HomeView';
import CatalogView from './views/CatalogView';
import ShowcaseView from './views/ShowcaseView';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const currentHour = new Date().getHours();
    return currentHour >= 18 || currentHour < 6;
  });
  
  const [toastMessage, setToastMessage] = useState('');
  const [visitorCount, setVisitorCount] = useState(0);
  const [currentView, setCurrentView] = useState('home');

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
      title: 'HN Creative - Solusi Digital Terbaik',
      text: 'Temukan produk digital premium, diskon eksklusif, dan layanan terbaik di HN Creative!',
      url: 'https://hncreativebio.vercel.app/'
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

  useEffect(() => {
    if (isDarkMode) {
      document.body.style.backgroundColor = '#020617'; 
    } else {
      document.body.style.backgroundColor = '#FAFAFA';
    }
  }, [isDarkMode]);

  return (
    <div className={`min-h-screen transition-colors duration-500 font-sans relative overflow-x-hidden ${isDarkMode ? 'bg-slate-950 text-white' : 'bg-[#FAFAFA] text-slate-900'}`}>
      {currentView === 'home' && (
        <HomeView 
          isDarkMode={isDarkMode} 
          setIsDarkMode={setIsDarkMode} 
          setCurrentView={setCurrentView} 
          visitorCount={visitorCount} 
          handleShare={handleShare} 
        />
      )}

      {currentView === 'catalog' && (
        <CatalogView 
          isDarkMode={isDarkMode} 
          setIsDarkMode={setIsDarkMode} 
          currentView={currentView} 
          setCurrentView={setCurrentView} 
          showToast={showToast} 
        />
      )}

      {currentView === 'showcase' && (
        <ShowcaseView 
          isDarkMode={isDarkMode} 
          setIsDarkMode={setIsDarkMode} 
          currentView={currentView} 
          setCurrentView={setCurrentView} 
          visitorCount={visitorCount} 
        />
      )}

      {toastMessage && (
        <div className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 z-50 animate-bounce backdrop-blur-md border ${isDarkMode ? 'bg-slate-800/80 border-white/10 text-white' : 'bg-white/90 border-white/50 text-slate-800'}`}>
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

export default App;
