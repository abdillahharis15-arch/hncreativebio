import { useState, useEffect } from 'react';
import { Share2, Users } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { links as defaultLinks } from '../data/constants';

export default function HomeView({ isDarkMode, setIsDarkMode, setCurrentView, visitorCount, handleShare }) {
  const [profile, setProfile] = useState(null);
  const [linksData, setLinksData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [igCount, setIgCount] = useState('...');
  const [ttCount, setTtCount] = useState('...');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: profileData } = await supabase.from('profile').select('*').single();
        if (profileData) setProfile(profileData);

        const { data: linksResult } = await supabase.from('links').select('*').order('order_index', { ascending: true });
        if (linksResult && linksResult.length > 0) {
          setLinksData(linksResult);
        } else {
          setLinksData(defaultLinks);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setLinksData(defaultLinks);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // ── REAL-TIME SOCIAL FETCH ─────────────────
  useEffect(() => {
    const IG_FALLBACK = 6065;
    const IG_USERNAME = 'mharisabdillah_';
    const TT_FALLBACK = 987;
    const TT_USERNAME = 'hn_creative';

    const fetchIG = async () => {
      // Local cache fallback
      try {
        const cached = localStorage.getItem('ig_followers');
        if (cached) setIgCount(cached.split('|')[0] + '+');
      } catch(e) {}

      const proxies = [
        `https://api.allorigins.win/get?url=${encodeURIComponent('https://www.instagram.com/' + IG_USERNAME + '/?__a=1&__d=dis')}`,
        `https://api.allorigins.win/get?url=${encodeURIComponent('https://www.instagram.com/' + IG_USERNAME + '/')}`,
        `https://corsproxy.io/?${encodeURIComponent('https://www.instagram.com/' + IG_USERNAME + '/')}`
      ];

      for (const proxyUrl of proxies) {
        try {
          const res = await fetch(proxyUrl, { signal: AbortSignal.timeout(8000) });
          if (!res.ok) continue;
          let html = '';
          try { const j = await res.json(); html = j.contents || ''; }
          catch { html = await res.text(); }

          const patterns = [
            /"edge_followed_by":\{"count":(\d+)\}/,
            /\"followers\":(\d+)/,
            /"follower_count":(\d+)/,
            /(\d[\d,]+)\s*[Ff]ollower/,
          ];
          for (const pat of patterns) {
            const m = html.match(pat);
            if (m) {
              const count = parseInt(m[1].replace(/,/g,''), 10);
              if (count > 0) {
                setIgCount(count.toLocaleString('id-ID') + '+');
                try { localStorage.setItem('ig_followers', count + '|' + Date.now()); } catch(e) {}
                return;
              }
            }
          }
        } catch(e) {}
      }
      setIgCount(IG_FALLBACK.toLocaleString('id-ID') + '+');
    };

    const fetchTikTok = async () => {
      try {
        const cached = localStorage.getItem('tt_followers');
        if (cached) setTtCount(cached.split('|')[0] + '+');
      } catch(e) {}

      const proxies = [
        `https://api.allorigins.win/get?url=${encodeURIComponent('https://www.tiktok.com/@' + TT_USERNAME)}`,
        `https://corsproxy.io/?${encodeURIComponent('https://www.tiktok.com/@' + TT_USERNAME)}`
      ];

      for (const proxyUrl of proxies) {
        try {
          const res = await fetch(proxyUrl, { signal: AbortSignal.timeout(8000) });
          if (!res.ok) continue;
          let html = '';
          try { const j = await res.json(); html = j.contents || ''; }
          catch { html = await res.text(); }

          const patterns = [
            /"followerCount":(\d+)/,
            /"fans":(\d+)/,
            /followerCount&quot;:(\d+)/,
            /"fans_count":(\d+)/,
          ];
          for (const pat of patterns) {
            const m = html.match(pat);
            if (m) {
              const count = parseInt(m[1], 10);
              if (count >= 0) {
                setTtCount(count.toLocaleString('id-ID') + '+');
                try { localStorage.setItem('tt_followers', count + '|' + Date.now()); } catch(e) {}
                return;
              }
            }
          }
        } catch(e) {}
      }
      setTtCount(TT_FALLBACK.toLocaleString('id-ID') + '+');
    };

    fetchIG();
    fetchTikTok();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="w-8 h-8 animate-spin border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // Dynamic helper to find link URLs from Supabase links table
  const getLinkByTitle = (keyword) => linksData.find(l => l.title?.toLowerCase().includes(keyword.toLowerCase()));
  const waLink = getLinkByTitle('whatsapp') || getLinkByTitle('admin') || getLinkByTitle('chat') || { url: 'https://wa.me/6285121358761' };
  const lpLink = getLinkByTitle('landing') || getLinkByTitle('resmi') || { url: 'https://hncreativeedu.vercel.app/' };
  const catalogLink = getLinkByTitle('katalog');
  const showcaseLink = getLinkByTitle('showcase') || getLinkByTitle('store');

  return (
    <div className="relative z-10 flex flex-col items-center max-w-lg mx-auto px-4 py-8 min-h-screen">
      
      {/* HEADER */}
      <header className="w-full flex justify-between items-center mb-8" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '14px' }}>
        <div className="font-extrabold text-[18px] tracking-tight bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
          HN Creative
        </div>
        <button onClick={handleShare} className="p-2.5 rounded-full border border-white/5 bg-[#141414] hover:bg-[#1c1c1c] text-slate-400 hover:text-white transition-all shadow-sm">
          <Share2 className="w-[15px] h-[15px]" />
        </button>
      </header>

      {/* PROFILE SECTION */}
      <section className="flex flex-col items-center mb-8 w-full text-center">
        <div className="relative mb-4 w-[88px] h-[88px]">
          <img src={profile?.photo_url || "https://i.ibb.co.com/fVMTm44r/b3f64d34-5b1b-4539-a0cc-b108a0600cff.jpg"} alt="Profile" className="w-full h-full object-cover rounded-full border-2 border-white/10" />
          <div className="absolute bottom-[2px] right-[2px] w-[22px] h-[22px] bg-blue-500 rounded-full flex items-center justify-center border-2 border-[#0a0a0a]">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
              <polyline points="20 6 9 17 4 12" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </svg>
          </div>
        </div>
        <h1 className="text-[22px] font-black mb-1.5 leading-tight tracking-tight text-[#f0f0f0]">
          {profile?.name || 'Mas Haris'}
        </h1>
        <p className="bio-tagline">
          {profile?.tagline || 'HELPING YOU FULFILL YOUR SOCIAL & DIGITAL NEEDS'}
        </p>
      </section>

      {/* SOCIAL ICONS GROUP */}
      <div className="bio-socials">
        {/* Instagram */}
        <div className="social-wrap">
          <a href="https://www.instagram.com/mharisabdillah_/" target="_blank" rel="noopener noreferrer" className="bio-social-btn" title="Instagram">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/>
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
            </svg>
          </a>
          <div className="social-tooltip">
            <span className="social-tooltip-platform">Instagram</span>
            <span className="social-tooltip-count">{igCount} Followers</span>
          </div>
        </div>

        {/* TikTok */}
        <div className="social-wrap">
          <a href="https://www.tiktok.com/@hn_creative" target="_blank" rel="noopener noreferrer" className="bio-social-btn" title="TikTok">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V9.35a8.16 8.16 0 004.77 1.52V7.43a4.85 4.85 0 01-1-.74z"/>
            </svg>
          </a>
          <div className="social-tooltip">
            <span className="social-tooltip-platform">TikTok</span>
            <span className="social-tooltip-count">{ttCount} Followers</span>
          </div>
        </div>

        {/* YouTube */}
        <div className="social-wrap">
          <a href="https://youtube.com/" target="_blank" rel="noopener noreferrer" className="bio-social-btn" title="YouTube">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2.5 17a24.12 24.12 0 010-10 2 2 0 011.4-1.4 49.56 49.56 0 0116.2 0A2 2 0 0121.5 7a24.12 24.12 0 010 10 2 2 0 01-1.4 1.4 49.55 49.55 0 01-16.2 0A2 2 0 012.5 17"/>
              <polygon points="10 15 15 12 10 9 10 15" fill="currentColor" stroke="none"/>
            </svg>
          </a>
          <div className="social-tooltip">
            <span class="social-tooltip-platform">YouTube</span>
            <span class="social-tooltip-count">890 Subscribers</span>
          </div>
        </div>

        {/* WhatsApp */}
        <div className="social-wrap">
          <a href={waLink.url} target="_blank" rel="noopener noreferrer" className="bio-social-btn" title="WhatsApp">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </a>
          <div className="social-tooltip">
            <span className="social-tooltip-platform">WhatsApp</span>
            <span className="social-tooltip-count"><em>Fast</em> Response</span>
          </div>
        </div>
      </div>

      {/* BENTO GRID */}
      <div className="bento-grid w-full">
        
        {/* Katalog (full width) */}
        <div className="bento-card card-catalog col-span-2" onClick={() => { setCurrentView('catalog'); window.scrollTo(0,0); }}>
          <span className="card-arrow">↗</span>
          <div className="card-icon-wrap" style={{ background: 'rgba(59,130,246,0.12)', color: '#60a5fa' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
          </div>
          <div className="card-title">{catalogLink?.title || 'Katalog Produk Digital'}</div>
          <div className="card-subtitle">{catalogLink?.subtitle || 'Canva · Netflix · Spotify · CapCut &amp; lainnya'}</div>
        </div>

        {/* About */}
        <div className="bento-card card-about" style={{ cursor: 'default' }}>
          <div className="card-icon-wrap" style={{ background: 'rgba(255,255,255,0.06)', width: '38px', height: '38px', borderRadius: '12px', display: 'flex', alignItems: 'center', justify-content: 'center', marginBottom: '14px', color: '#a3a3a3' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
          </div>
          <div className="card-title" style={{ fontSize: '14px', marginBottom: '8px' }}>Tentang Kami</div>
          <p className="text-[12px] text-neutral-500 leading-relaxed">{profile?.bio || 'Platform produk digital premium terpercaya. Fast response & garansi penuh.'}</p>
        </div>

        {/* Visitor */}
        <div className="bento-card card-visitors" style={{ cursor: 'default' }}>
          <div className="card-label"><span className="ping-dot"></span>Live</div>
          <div style={{ marginTop: 'auto' }}>
            <div className="card-stat-num">{visitorCount.toLocaleString('id-ID')}<span>+</span></div>
            <div className="card-subtitle">Total Pengunjung</div>
          </div>
        </div>

        {/* Showcase */}
        <div className="bento-card card-showcase" onClick={() => { setCurrentView('showcase'); window.scrollTo(0,0); }}>
          <span className="card-arrow">↗</span>
          <div className="card-icon-wrap" style={{ background: 'rgba(249,115,22,0.12)', color: '#fb923c' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
          </div>
          <div className="card-title">{showcaseLink?.title || 'Official Store'}</div>
          <div className="card-subtitle">{showcaseLink?.subtitle || 'Shopee &amp; TikTok Shop'}</div>
        </div>

        {/* WhatsApp */}
        <a href={waLink.url} target="_blank" rel="noopener noreferrer" className="bento-card card-cta">
          <div className="card-label">Fast Response</div>
          <div className="card-icon-wrap" style={{ background: 'rgba(34,197,94,0.12)', color: '#4ade80' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
          </div>
          <div className="card-title">{waLink?.title || 'Chat Admin'}</div>
          <div className="card-subtitle">{waLink?.subtitle || 'WA · 08.00 – 17.00'}</div>
        </a>

        {/* Landing Page (full width) */}
        <a href={lpLink.url} target="_blank" rel="noopener noreferrer" className="bento-card col-span-2" style={{ flexDirection: 'row', alignItems: 'center', gap: '14px' }}>
          <div className="card-icon-wrap" style={{ background: 'rgba(59,130,246,0.12)', width: '44px', height: '44px', borderRadius: '14px', margin: 0 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/><path d="M2 12h20"/>
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            <div className="card-title" style={{ fontSize: '15px' }}>{lpLink?.title || 'Landing Page Resmi'}</div>
            <div className="card-subtitle">{lpLink?.subtitle || 'Panduan lengkap &amp; cara order aman'}</div>
          </div>
          <span style={{ color: 'var(--muted)', fontSize: '20px' }}>→</span>
        </a>

        {/* Product preview 1 */}
        <div className="bento-card" style={{ padding: 0, overflow: 'hidden', minHeight: '160px', cursor: 'default' }}>
          <img src="https://gizmologi.id/wp-content/uploads/2024/05/New-Canva-UI-860x484.jpg" alt="Canva" className="w-full h-[100px] object-cover" />
          <div className="p-3">
            <div className="card-label" style={{ marginBottom: '2px' }}>Canva</div>
            <div className="card-title" style={{ fontSize: '14px' }}>Pro Access</div>
          </div>
        </div>

        {/* Product preview 2 */}
        <div className="bento-card" style={{ padding: 0, overflow: 'hidden', minHeight: '160px', cursor: 'default' }}>
          <img src="https://gadget.jagatreview.com/wp-content/uploads/2025/11/Spotify-Premium-Platinum-features-1920x1080.webp" alt="Spotify" className="w-full h-[100px] object-cover" />
          <div className="p-3">
            <div className="card-label" style={{ marginBottom: '2px' }}>Spotify</div>
            <div className="card-title" style={{ fontSize: '14px' }}>Premium</div>
          </div>
        </div>

      </div>

      <footer className="bio-footer mt-8 text-center text-[11px] text-[#333] tracking-[0.04em]">
        © {new Date().getFullYear()} Mas Haris · HN Creative
      </footer>
    </div>
  );
}
