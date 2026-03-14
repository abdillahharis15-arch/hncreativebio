import { Sun, Moon, ArrowLeft, Hexagon } from 'lucide-react';

export default function Header({ isDarkMode, setIsDarkMode, currentView, setCurrentView }) {
  return (
    <header className="w-full max-w-6xl mx-auto px-6 py-6 flex justify-between items-center z-50">
      <div className="flex items-center gap-2 text-xl font-black tracking-tighter text-blue-600 drop-shadow-sm">
        <Hexagon className="w-7 h-7 fill-current" />
        <span className="hidden sm:inline">MAS HARIS</span>
      </div>
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setIsDarkMode(!isDarkMode)} 
          className={`p-2.5 rounded-full transition-all shadow-sm ${
            isDarkMode ? 'bg-slate-800 text-yellow-400 hover:bg-slate-700' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
        {currentView !== 'home' && (
          <button 
            onClick={() => setCurrentView('home')} 
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold transition-transform hover:scale-105 shadow-md ${
              isDarkMode ? 'bg-white text-black' : 'bg-black text-white'
            }`}
          >
            <ArrowLeft className="w-4 h-4" /> Back to Bio
          </button>
        )}
      </div>
    </header>
  );
}
