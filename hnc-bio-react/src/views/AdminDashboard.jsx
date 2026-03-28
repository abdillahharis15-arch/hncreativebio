import React, { useState, useEffect } from 'react';
import { LogOut, Home, Link as LinkIcon, Image as ImageIcon, Settings, Plus, Trash2, Edit2, Loader2, Save, X } from 'lucide-react';
import { supabase } from '../lib/supabase';

function AdminDashboard({ session, onLogout }) {
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Profile State
  const [profile, setProfile] = useState({
    id: '', name: '', bio: '', photo_url: '', background_url: '', background_color: '#FAFAFA'
  });

  // Links State
  const [links, setLinks] = useState([]);
  const [editingLink, setEditingLink] = useState(null);
  const [linkForm, setLinkForm] = useState({ title: '', subtitle: '', url: '', icon_name: 'Globe', color: 'bg-blue-500 hover:bg-blue-600' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: profileData } = await supabase.from('profile').select('*').single();
      if (profileData) setProfile(profileData);

      const { data: linksData } = await supabase.from('links').select('*').order('order_index', { ascending: true });
      if (linksData) setLinks(linksData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    if (onLogout) onLogout();
  };

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      const { error } = await supabase.from('profile').upsert({
        id: profile.id || '00000000-0000-0000-0000-000000000000',
        name: profile.name,
        bio: profile.bio,
        photo_url: profile.photo_url,
        background_url: profile.background_url,
        background_color: profile.background_color,
      });
      if (error) throw error;
      alert('Profil berhasil disimpan!');
    } catch (error) {
      console.error(error);
      alert('Gagal menyimpan profil: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const saveLink = async () => {
    setSaving(true);
    try {
      if (editingLink) {
        // Update
        const { error } = await supabase.from('links').update({
          title: linkForm.title, subtitle: linkForm.subtitle, url: linkForm.url, icon_name: linkForm.icon_name, color: linkForm.color
        }).eq('id', editingLink.id);
        if (error) throw error;
      } else {
        // Insert
        const { error } = await supabase.from('links').insert({
          title: linkForm.title, subtitle: linkForm.subtitle, url: linkForm.url, icon_name: linkForm.icon_name, color: linkForm.color, order_index: links.length + 1
        });
        if (error) throw error;
      }
      setEditingLink(null);
      setLinkForm({ title: '', subtitle: '', url: '', icon_name: 'Globe', color: 'bg-blue-500 hover:bg-blue-600' });
      fetchData();
    } catch (error) {
      console.error(error);
      alert('Gagal menyimpan link: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const deleteLink = async (id) => {
    if (!window.confirm('Hapus link ini?')) return;
    try {
      const { error } = await supabase.from('links').delete().eq('id', id);
      if (error) throw error;
      fetchData();
    } catch (error) {
      alert('Gagal menghapus link: ' + error.message);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Settings className="w-6 h-6 text-blue-500" /> Admin Panel
          </h2>
        </div>
        <div className="p-4 flex-1 space-y-2">
          <button onClick={() => setActiveTab('profile')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'profile' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}>
            <ImageIcon className="w-5 h-5" /> Profil & Tampilan
          </button>
          <button onClick={() => setActiveTab('links')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'links' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}>
            <LinkIcon className="w-5 h-5" /> Atur Links
          </button>
        </div>
        <div className="p-4 border-t border-slate-800 space-y-2">
           <button onClick={() => window.location.href = '/'} className="w-full flex items-center gap-3 px-4 py-2 text-slate-400 hover:text-white transition-colors">
            <Home className="w-5 h-5" /> Lihat Web
          </button>
          <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-4 py-2 text-red-400 hover:text-red-300 transition-colors">
            <LogOut className="w-5 h-5" /> Keluar
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        {activeTab === 'profile' && (
          <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="text-2xl font-bold mb-6">Pengaturan Profil & Tampilan</h1>
            
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Nama / Title</label>
                  <input type="text" name="name" value={profile.name} onChange={handleProfileChange} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 focus:border-blue-500 focus:outline-none text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Bio / Deskripsi Singkat</label>
                  <textarea name="bio" value={profile.bio} onChange={handleProfileChange} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 focus:border-blue-500 focus:outline-none text-white h-24" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">URL Foto Profil</label>
                  <input type="text" name="photo_url" value={profile.photo_url || ''} onChange={handleProfileChange} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 focus:border-blue-500 focus:outline-none text-white" placeholder="https://..." />
                  <p className="text-xs text-slate-500 mt-1">Gunakan link gambar eksternal (contoh: imgur, ibb.co).</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">URL Background (Opsional)</label>
                  <input type="text" name="background_url" value={profile.background_url || ''} onChange={handleProfileChange} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 focus:border-blue-500 focus:outline-none text-white" placeholder="https://..." />
                  <p className="text-xs text-slate-500 mt-1">Kosongkan jika ingin pakai warna solid/default.</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Warna Background Solid</label>
                  <div className="flex items-center gap-3">
                    <input type="color" name="background_color" value={profile.background_color} onChange={handleProfileChange} className="h-10 w-10 rounded cursor-pointer border-0 bg-transparent p-0" />
                    <input type="text" name="background_color" value={profile.background_color} onChange={handleProfileChange} className="bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 focus:border-blue-500 focus:outline-none text-white uppercase w-28" />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800">
                <button onClick={saveProfile} disabled={saving} className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Simpan Profil
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'links' && (
          <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-2xl font-bold">Kelola Links</h1>
              <button onClick={() => { setEditingLink(null); setLinkForm({ title: '', subtitle: '', url: '', icon_name: 'Globe', color: 'bg-blue-500 hover:bg-blue-600' }); document.getElementById('link-modal').showModal(); }} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2">
                 <Plus className="w-4 h-4" /> Tambah Link
               </button>
            </div>

            <div className="space-y-3">
              {links.length === 0 ? (
                <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 text-center text-slate-500">Belum ada link.</div>
              ) : (
                links.map((link) => (
                  <div key={link.id} className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex items-center gap-4">
                    <div className={`${link.color} w-12 h-12 rounded-lg flex items-center justify-center shrink-0`}>
                      <Globe className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white truncate">{link.title}</h3>
                      <p className="text-sm text-slate-400 truncate">{link.subtitle || link.url}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button onClick={() => { setEditingLink(link); setLinkForm({title: link.title, subtitle: link.subtitle || '', url: link.url, icon_name: link.icon_name || 'Globe', color: link.color || 'bg-blue-500 hover:bg-blue-600'}); document.getElementById('link-modal').showModal(); }} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => deleteLink(link.id)} className="p-2 hover:bg-red-500/10 rounded-lg text-slate-400 hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>

      {/* Link Modal */}
      <dialog id="link-modal" className="bg-transparent m-auto p-4 backdrop:bg-slate-950/80 backdrop:backdrop-blur-sm open:flex inset-0 fixed z-50 items-center justify-center w-full min-h-screen">
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-white">{editingLink ? 'Edit Link' : 'Tambah Link'}</h3>
            <button onClick={() => document.getElementById('link-modal').close()} className="text-slate-400 hover:text-white"><X className="w-5 h-5"/></button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Title</label>
              <input type="text" value={linkForm.title} onChange={(e) => setLinkForm({...linkForm, title: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500" placeholder="Misal: Instagram, Katalog..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Subtitle</label>
              <input type="text" value={linkForm.subtitle} onChange={(e) => setLinkForm({...linkForm, subtitle: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500" placeholder="Deskripsi pendek..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">URL Destination</label>
              <input type="text" value={linkForm.url} onChange={(e) => setLinkForm({...linkForm, url: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500" placeholder="https://..." />
              <p className="text-[11px] text-slate-500 mt-1">Kosongkan jika untuk Katalog/Showcase asalkan titlenya mengandung kata 'Katalog' atau 'Showcase'.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">CSS Background Color (Tailwind)</label>
              <input type="text" value={linkForm.color} onChange={(e) => setLinkForm({...linkForm, color: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500" placeholder="bg-blue-500 hover:bg-blue-600" />
            </div>
            <button onClick={() => { saveLink(); document.getElementById('link-modal').close(); }} disabled={!linkForm.title || saving} className="w-full mt-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2.5 rounded-lg font-medium flex justify-center items-center">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Simpan Link'}
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
}

export default AdminDashboard;
