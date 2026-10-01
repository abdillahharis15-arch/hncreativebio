import { useState } from 'react';
import { ArrowLeft, Tag, Smartphone, CheckCircle2, MessageCircle, FileText, AlertCircle } from 'lucide-react';

// ── DATA JASA ─────────────────────────────────────────────────────────────────
const jasaItems = [
  {
    id: 1,
    name: 'Edit Foto',
    desc: 'Editing foto profesional: retouching, background, produk, portofolio, dll.',
    price: null,
    unit: '/ foto',
    features: ['Revisi 2x', 'File JPG/PNG resolusi tinggi', 'Estimasi cepat 1 hari'],
    badge: '',
    color: '#3b82f6',
  },
  {
    id: 2,
    name: 'Edit Video',
    desc: 'Editing video Reels, TikTok, YouTube Shorts, cinematic, promosi, & lainnya.',
    price: null,
    unit: '/ video',
    features: ['Durasi s/d 60 detik', 'Musik & sound effect', 'Revisi 1x', 'Tanpa watermark'],
    badge: 'POPULER',
    color: '#ef4444',
  },
  {
    id: 3,
    name: 'Perapihan Format Skripsi',
    desc: 'Rapikan format skripsi/tugas akhir sesuai panduan kampus: margin, heading, daftar isi, dll.',
    price: null,
    unit: '/ dokumen',
    features: ['Sesuai format kampus', 'Daftar isi otomatis', 'Heading & penomoran rapi', 'Revisi 2x'],
    badge: '',
    color: '#a855f7',
  },
  {
    id: 4,
    name: 'Print & Jilid',
    desc: 'Cetak & jilid skripsi, laporan, proposal, makalah dengan kualitas terbaik.',
    price: null,
    unit: '',
    features: ['Cetak hitam putih & warna', 'Jilid softcover / hardcover', 'Pengiriman tersedia'],
    badge: '',
    color: '#f59e0b',
  },
  {
    id: 5,
    name: 'Upload Repository',
    desc: 'Bantu upload karya ilmiah/skripsi ke repository kampus sebagai syarat Yudisium & Wisuda.',
    price: null,
    unit: '',
    features: ['Pendampingan proses upload', 'Sesuai ketentuan kampus', 'Fast response', 'Sampai berhasil'],
    badge: 'BARU',
    color: '#22c55e',
  },
  {
    id: 6,
    name: 'Jasa Parafrase',
    desc: 'Parafrase manual aman dari AI detection & plagiarisme. Penurunan persentase Turnitin.',
    price: null,
    unit: '',
    features: ['Manual tanpa AI', 'Tetap menjaga makna', 'Harga per halaman'],
    badge: 'HOT',
    color: '#a855f7',
    isParafrase: true,
  },
];

// ── DATA PARAFRASE ─────────────────────────────────────────────────────────────
const parafraseData = [
  { range: '1–30 halaman', price: 5000 },
  { range: '31–50 halaman', price: 7000 },
  { range: '51–70 halaman', price: 8000 },
  { range: '71–80 halaman', price: 9000 },
  { range: '81–90 halaman', price: 11000 },
  { range: '91–100 halaman', price: 13000 },
  { range: '101–150 halaman', price: 15000 },
  { range: '151–200 halaman', price: 17000 },
];

const parafraseTerms = [
  'Pembayaran dilakukan setelah pengerjaan selesai. File hasil akan dikirim setelah pembayaran diterima.',
  'Estimasi pengerjaan 1 jam–2 hari, menyesuaikan panjang dokumen dan antrean pesanan.',
  'Pesanan dengan total biaya di bawah Rp50.000 belum termasuk biaya pengecekan Turnitin.',
  'Parafrase dikerjakan secara manual tanpa AI maupun trik manipulasi teks, dengan tetap menjaga makna dan sitasi dalam dokumen.',
];

// Sewa items removed

// ─────────────────────────────────────────────────────────────────────────────

const WA_LINK = 'https://wa.me/6285121358761';

function PriceCard({ item, onViewParafrase }) {
  return (
    <div
      className="price-card"
      style={{ '--card-accent': item.color }}
    >
      {item.badge && (
        <span className="price-badge" style={{ background: item.color }}>
          {item.badge}
        </span>
      )}

      <div className="price-card-top">
        <div>
          <div className="price-card-name">{item.name}</div>
          <div className="price-card-desc">{item.desc}</div>
        </div>
      </div>

      <div className="price-card-amount">
        {item.price !== null ? (
          <>
            <span className="price-currency">Rp</span>
            <span className="price-number">
              {Number(item.price).toLocaleString('id-ID')}
            </span>
            {item.unit && <span className="price-unit">{item.unit}</span>}
          </>
        ) : (
          <span className="price-tba">
            {item.isParafrase ? 'Lihat Detail Harga' : 'Hubungi Admin'}
          </span>
        )}
      </div>

      <ul className="price-features">
        {item.features.map((f, i) => (
          <li key={i}>
            <CheckCircle2 size={13} style={{ color: item.color, flexShrink: 0, marginTop: 1 }} />
            <span>{f}</span>
          </li>
        ))}
      </ul>

      {item.isParafrase ? (
        <button
          onClick={onViewParafrase}
          className="price-order-btn"
          style={{ '--btn-color': item.color }}
        >
          <FileText size={14} />
          <span>Lihat Daftar Harga</span>
        </button>
      ) : (
        <a
          href={`${WA_LINK}?text=Halo%2C%20saya%20mau%20tanya%20harga%20${encodeURIComponent(item.name)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="price-order-btn"
          style={{ '--btn-color': item.color }}
        >
          <MessageCircle size={14} />
          <span>Order / Tanya Harga</span>
        </a>
      )}
    </div>
  );
}

function ParafraseSection() {
  return (
    <div className="parafrase-section">
      {/* Header Card */}
      <div className="parafrase-hero-card">
        <div className="parafrase-hero-icon">📝</div>
        <h2 className="parafrase-hero-title">Daftar Harga Parafrase</h2>
        <p className="parafrase-hero-subtitle">HN Creative</p>
      </div>

      {/* Pricing Table */}
      <div className="parafrase-table-wrap">
        <div className="parafrase-table-header">
          <span>Jumlah Halaman</span>
          <span>Harga per Turun 1%</span>
        </div>
        {parafraseData.map((item, i) => (
          <div key={i} className={`parafrase-table-row${i % 2 === 0 ? ' even' : ''}`}>
            <span className="parafrase-range">
              <FileText size={13} style={{ color: '#a855f7', flexShrink: 0 }} />
              {item.range}
            </span>
            <span className="parafrase-price">
              Rp{item.price.toLocaleString('id-ID')}
            </span>
          </div>
        ))}
      </div>

      {/* CTA WhatsApp */}
      <a
        href={`${WA_LINK}?text=Halo%2C%20saya%20mau%20tanya%20tentang%20jasa%20parafrase`}
        target="_blank"
        rel="noopener noreferrer"
        className="parafrase-wa-btn"
      >
        <MessageCircle size={16} />
        <span>Konsultasi & Order via WhatsApp</span>
      </a>
      <p className="parafrase-wa-number">WhatsApp: 085121358761</p>

      {/* Syarat & Ketentuan */}
      <div className="parafrase-terms">
        <div className="parafrase-terms-title">
          <AlertCircle size={14} />
          <span>Syarat & Ketentuan</span>
        </div>
        <p className="parafrase-terms-intro">
          Mohon dibaca sebelum melakukan pemesanan, ya 😊
        </p>
        <ul className="parafrase-terms-list">
          {parafraseTerms.map((t, i) => (
            <li key={i}>
              <CheckCircle2 size={13} style={{ color: '#a855f7', flexShrink: 0, marginTop: 2 }} />
              <span>{t}</span>
            </li>
          ))}
        </ul>
        <p className="parafrase-terms-footer">
          Silakan hubungi kami untuk konsultasi dan konfirmasi biaya sebelum pemesanan. Terima kasih atas kepercayaannya! 🙏
        </p>
      </div>
    </div>
  );
}

export default function PriceListView({ setCurrentView }) {
  const [viewState, setViewState] = useState('list'); // 'list' | 'parafrase'

  if (viewState === 'parafrase') {
    return (
      <div className="price-view">
        <header className="price-header">
          <button
            className="price-back-btn"
            onClick={() => { setViewState('list'); window.scrollTo(0, 0); }}
          >
            <ArrowLeft size={16} />
            <span>Kembali ke Jasa</span>
          </button>
          <div className="price-header-title">
            <span>📝</span>
            <span>Detail Parafrase</span>
          </div>
          <div style={{ width: 80 }} />
        </header>

        <ParafraseSection />

        <footer className="bio-footer mt-8 text-center text-[11px] text-[#333] tracking-[0.04em]">
          {new Date().getFullYear()} Mas Haris · HN Creative
        </footer>
      </div>
    );
  }

  return (
    <div className="price-view">
      {/* Header */}
      <header className="price-header">
        <button
          className="price-back-btn"
          onClick={() => { setCurrentView('home'); window.scrollTo(0, 0); }}
        >
          <ArrowLeft size={16} />
          <span>Kembali</span>
        </button>
        <div className="price-header-title">
          <span>💰</span>
          <span>Daftar Harga Jasa</span>
        </div>
        <div style={{ width: 80 }} />
      </header>

      {/* Tab Description */}
      <div className="price-tab-desc" style={{ marginBottom: '24px' }}>
        Layanan kreatif digital — desain, konten, website, video & akademik.
      </div>

      {/* Cards */}
      <div className="price-grid">
        {jasaItems.map(item => (
          <PriceCard 
            key={item.id} 
            item={item} 
            onViewParafrase={() => { setViewState('parafrase'); window.scrollTo(0, 0); }} 
          />
        ))}
      </div>

      {/* CTA Footer */}
      <div className="price-cta-footer">
        <p>Harga belum tertera? Langsung hubungi admin kami 👇</p>
        <a
          href={WA_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="price-cta-wa"
        >
          <MessageCircle size={16} />
          <span>Chat WhatsApp Admin</span>
        </a>
      </div>

      <footer className="bio-footer mt-8 text-center text-[11px] text-[#333] tracking-[0.04em]">
        {new Date().getFullYear()} Mas Haris · HN Creative
      </footer>
    </div>
  );
}
