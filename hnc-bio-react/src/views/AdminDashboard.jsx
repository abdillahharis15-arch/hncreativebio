import React, { useState, useEffect } from 'react';
import { LogOut, Home, Link as LinkIcon, Image as ImageIcon, Settings, Plus, Trash2, Edit2, Loader2, Save } from 'lucide-react';
import { supabase } from '../lib/supabase';

function AdminDashboard({ session, onLogout }) {
  const [activeTab, setActiveTab] = useState('profile');

  // This is a placeholder for actual Supabase data fetching once configured
  const [loading, setLoading] = useState(false);
  
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    if (onLogout) onLogout();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Settings className="w-6 h-6 text-blue-500" />
            Admin Panel
          </h2>
        </div>
        <div className="p-4 flex-1 space-y-2">
          <button 
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'profile' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <UserIcon className="w-5 h-5" />
            Profil & Tampilan
          </button>
          <button 
            onClick={() => setActiveTab('links')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'links' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <LinkIcon className="w-5 h-5" />
            Atur Links
          </button>
        </div>
        <div className="p-4 border-t border-slate-800 space-y-2">
           <button onClick={() => window.location.href = '/'} className="w-full flex items-center gap-3 px-4 py-2 text-slate-400 hover:text-white transition-colors">
            <Home className="w-5 h-5" />
            Lihat Web
          </button>
          <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-4 py-2 text-red-400 hover:text-red-300 transition-colors">
            <LogOut className="w-5 h-5" />
            Keluar
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        {activeTab === 'profile' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold mb-6">Pengaturan Profil & Tampilan</h1>
            
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
               <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                 <ImageIcon className="w-5 h-5 text-blue-400" /> Detail Profil
               </h3>
               {/* Form placeholders */}
               <div className="space-y-4">
                 <div>
                   <label className="block text-sm font-medium text-slate-400 mb-1">Nama / Title</label>
                   <input type="text" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 focus:border-blue-500 focus:outline-none text-white" placeholder="Mas Haris" />
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-slate-400 mb-1">Bio / Deskripsi</label>
                   <textarea className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 focus:border-blue-500 focus:outline-none text-white h-24" placeholder="Deskripsi singkat..." />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">URL Foto Profil</label>
                    <input type="text" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 focus:border-blue-500 focus:outline-none text-white" placeholder="https://..." />
                 </div>
                 <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2">
                   <Save className="w-4 h-4" /> Simpan Profil
                 </button>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'links' && (
           <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold">Kelola Links</h1>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2">
                 <Plus className="w-4 h-4" /> Tambah Link
               </button>
            </div>

            <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 text-center text-slate-500">
               Tabel link akan dimuat setelah Supabase dikonfigurasi.
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// Dummy icon to appease compiler
const UserIcon = ({className}) => <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;

export default AdminDashboard;
