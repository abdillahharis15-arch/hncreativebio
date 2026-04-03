import React, { useState, useEffect } from 'react';
import { LogOut, Home, Link as LinkIcon, Image as ImageIcon, Settings, Plus, Trash2, Edit2, Loader2, Save, X, MoveUp, MoveDown, Upload } from 'lucide-react';
import { supabase } from '../lib/supabase';

function AdminDashboard({ session, onLogout }) {
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Profile State
  const [profile, setProfile] = useState({
    id: '', name: '', bio: '', photo_url: '', background_url: '', background_color: '#FAFAFA'
  });

  // Links State
  const [links, setLinks] = useState([]);
  const [editingLink, setEditingLink] = useState(null);
  const [linkForm, setLinkForm] = useState({ title: '', subtitle: '', url: '', icon_name: 'Globe', color: 'bg-blue-500 hover:bg-blue-600' });
  
  // Iframe key for forcing reload when data changes
  const [previewKey, setPreviewKey] = useState(0);

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
      setPreviewKey(prev => prev + 1); // Refresh iframe
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
        // Insert at the top (order_index 0, shift others if we wanted to, but simple tracking works)
        const highestOrder = links.length > 0 ? Math.max(...links.map(l => l.order_index || 0)) : 0;
        const { error } = await supabase.from('links').insert({
          title: linkForm.title, subtitle: linkForm.subtitle, url: linkForm.url, icon_name: linkForm.icon_name, color: linkForm.color, order_index: highestOrder + 1
        });
        if (error) throw error;
      }
      setEditingLink(null);
      setLinkForm({ title: '', subtitle: '', url: '', icon_name: 'Globe', color: 'bg-blue-500 hover:bg-blue-600' });
      await fetchData();
      setPreviewKey(prev => prev + 1);
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
      await fetchData();
      setPreviewKey(prev => prev + 1);
    } catch (error) {
      alert('Gagal menghapus link: ' + error.message);
    }
  };

  const moveLink = async (index, direction) => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === links.length - 1)) return;
    
    const newLinks = [...links];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Swap order_index
    const currentOrder = newLinks[index].order_index;
    const targetOrder = newLinks[targetIndex].order_index;
    
    newLinks[index].order_index = targetOrder;
    newLinks[targetIndex].order_index = currentOrder;

    // Optimistic update UI
    const temp = newLinks[index];
    newLinks[index] = newLinks[targetIndex];
    newLinks[targetIndex] = temp;
    setLinks([...newLinks]);

    // Background update
    await supabase.from('links').update({ order_index: targetOrder }).eq('id', newLinks[targetIndex].id);
    await supabase.from('links').update({ order_index: currentOrder }).eq('id', newLinks[index].id);
    setPreviewKey(prev => prev + 1);
  };

  const uploadPhoto = async (event) => {
    try {
      if (!event.target.files || event.target.files.length === 0) return;
      
      setUploadingImage(true);
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `profile-photos/${fileName}`;

      let { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      
      // Update local profile state
      setProfile({...profile, photo_url: data.publicUrl});
      alert('Foto berhasil diunggah! Jangan lupa klik "Simpan Profil".');

    } catch (error) {
      alert('Error mengunggah foto: ' + error.message + '\n\nPastikan bucket "avatars" sudah ada di Storage dan berstatus Public.');
    } finally {
      setUploadingImage(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-800"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row font-sans text-slate-900">
      
      {/* Sidebar - Lynk style (Greenish / Clean) */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200 flex flex-col shadow-sm z-10">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-2xl font-black text-emerald-500 flex items-center gap-2">
            LinkBio
          </h2>
        </div>
        <div className="p-4 flex-1 space-y-2">
          <button onClick={() => setActiveTab('profile')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'profile' ? 'bg-emerald-50 text-emerald-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}>
            <ImageIcon className="w-5 h-5" /> Appearance
          </button>
          <button onClick={() => setActiveTab('links')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'links' ? 'bg-emerald-50 text-emerald-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}>
            <LinkIcon className="w-5 h-5" /> My Links
          </button>
        </div>
        <div className="p-4 border-t border-slate-100 space-y-2">
           <button onClick={() => window.location.href = '/'} className="w-full flex items-center gap-3 px-4 py-2 text-slate-500 hover:text-slate-800 font-medium transition-colors">
            <Home className="w-5 h-5" /> Lihat Web
          </button>
          <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-4 py-2 text-red-500 hover:text-red-600 font-medium transition-colors">
            <LogOut className="w-5 h-5" /> Keluar
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        
        {/* Editor Area */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto">
          {activeTab === 'profile' && (
            <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500">
              <h1 className="text-2xl font-bold text-slate-800">Appearance</h1>
              
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 space-y-6">
                
                {/* Photo Upload Section */}
                <div className="flex flex-col sm:flex-row gap-6 items-center">
                  <div className="w-24 h-24 rounded-full bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden relative group shrink-0">
                    {profile.photo_url ? (
                      <img src={profile.photo_url} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-8 h-8 text-slate-400" />
                    )}
                    <div className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center transition-all cursor-pointer pointer-events-none">
                      <Upload className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Unggah Foto Profil</label>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={uploadPhoto}
                      disabled={uploadingImage}
                      className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 transition-colors cursor-pointer" 
                    />
                    {uploadingImage && <p className="text-sm text-emerald-600 mt-2 flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin"/> Mengunggah...</p>}
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Pilih Tema Background Solid</label>
                    <div className="flex items-center gap-3">
                      <input type="color" name="background_color" value={profile.background_color} onChange={handleProfileChange} className="h-12 w-12 rounded-xl cursor-pointer border-0 bg-transparent p-0 shadow-sm" />
                      <input type="text" name="background_color" value={profile.background_color} onChange={handleProfileChange} className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none text-slate-800 uppercase w-32 font-medium" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">URL Background Image (Opsional)</label>
                    <input type="text" name="background_url" value={profile.background_url || ''} onChange={handleProfileChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none text-slate-800" placeholder="https://unsplash.com/..." />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Nama / Judul Halaman</label>
                    <input type="text" name="name" value={profile.name} onChange={handleProfileChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none text-slate-800 font-medium" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Bio / Deskripsi</label>
                    <textarea name="bio" value={profile.bio} onChange={handleProfileChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none text-slate-800 h-28 resize-none" />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <button onClick={saveProfile} disabled={saving} className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white px-8 py-3 rounded-full font-bold flex items-center justify-center w-full gap-2 transition-transform transform active:scale-95 shadow-md shadow-emerald-500/20">
                    {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />} Simpan Perubahan Penampilan
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'links' && (
            <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-500">
              
              <div className="text-center mb-8">
                <button onClick={() => { setEditingLink(null); setLinkForm({ title: '', subtitle: '', url: '', icon_name: 'Globe', color: 'bg-emerald-500 hover:bg-emerald-600' }); document.getElementById('link-modal').showModal(); }} className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-4 rounded-full font-bold flex items-center justify-center w-full gap-2 transition-transform transform hover:scale-[1.02] shadow-lg shadow-emerald-500/20">
                  <Plus className="w-5 h-5" /> Add New Block
                </button>
              </div>

              <div className="space-y-4">
                {links.length === 0 ? (
                  <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center text-slate-400 font-medium shadow-sm">Belum ada blok link. Klik tombol hijau di atas untuk menambah.</div>
                ) : (
                  links.map((link, index) => (
                    <div key={link.id} className="bg-white p-4 rounded-3xl border border-slate-200 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow group">
                      {/* Drag / Move Handles */}
                      <div className="flex flex-col gap-1 items-center shrink-0 pr-2 border-r border-slate-100">
                        <button onClick={() => moveLink(index, 'up')} disabled={index === 0} className="p-1 text-slate-300 hover:text-emerald-500 hover:bg-emerald-50 rounded disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-300"><MoveUp className="w-4 h-4" /></button>
                        <button onClick={() => moveLink(index, 'down')} disabled={index === links.length - 1} className="p-1 text-slate-300 hover:text-emerald-500 hover:bg-emerald-50 rounded disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-300"><MoveDown className="w-4 h-4" /></button>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0 pl-1 py-1">
                        <h3 className="font-bold text-slate-800 truncate">{link.title}</h3>
                        <p className="text-xs text-slate-500 truncate mt-0.5">{link.url}</p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button onClick={() => { setEditingLink(link); setLinkForm({title: link.title, subtitle: link.subtitle || '', url: link.url, icon_name: link.icon_name || 'Globe', color: link.color || 'bg-blue-500 hover:bg-blue-600'}); document.getElementById('link-modal').showModal(); }} className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl text-slate-600 transition-colors"><Edit2 className="w-4 h-4" /></button>
                        <button onClick={() => deleteLink(link.id)} className="p-2.5 bg-red-50 hover:bg-red-100 rounded-xl text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Live Preview Sidebar */}
        <div className="hidden lg:flex w-[400px] border-l border-slate-200 bg-slate-50 items-center justify-center p-8">
          {/* Phone Frame Mockup */}
          <div className="relative w-[320px] h-[650px] bg-slate-900 rounded-[3rem] shadow-2xl border-[8px] border-slate-900 overflow-hidden flex shrink-0 ring-4 ring-slate-200">
            {/* Camera notch */}
            <div className="absolute top-0 inset-x-0 h-6 bg-slate-900 w-32 mx-auto rounded-b-2xl z-20 flex justify-center items-center">
               <div className="w-16 h-4 bg-black rounded-full shadow-inner"></div>
            </div>
            
            <iframe 
              key={previewKey}
              src="/" 
              title="Live Preview" 
              className="w-full h-full bg-white z-10"
              style={{ border: 'none' }}
            ></iframe>
          </div>
        </div>

      </main>

      {/* Link Modal */}
      <dialog id="link-modal" className="bg-transparent m-auto p-4 backdrop:bg-slate-900/50 backdrop:backdrop-blur-sm open:flex inset-0 fixed z-50 items-center justify-center w-full min-h-screen">
        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-black text-slate-800">{editingLink ? 'Edit Link' : 'Add Link'}</h3>
            <button type="button" onClick={() => document.getElementById('link-modal').close()} className="text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 p-2 rounded-full transition-colors"><X className="w-5 h-5"/></button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Title</label>
              <input type="text" value={linkForm.title} onChange={(e) => setLinkForm({...linkForm, title: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" placeholder="e.g. Profil TikTok" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Subtitle</label>
              <input type="text" value={linkForm.subtitle} onChange={(e) => setLinkForm({...linkForm, subtitle: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" placeholder="Satu baris deskripsi..." />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">URL (Destination)</label>
              <input type="text" value={linkForm.url} onChange={(e) => setLinkForm({...linkForm, url: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" placeholder="https://..." />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Background Color CSS (Tailwind)</label>
              <input type="text" value={linkForm.color} onChange={(e) => setLinkForm({...linkForm, color: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" placeholder="bg-blue-500 hover:bg-blue-600" />
            </div>
            <button onClick={() => { saveLink(); document.getElementById('link-modal').close(); }} disabled={!linkForm.title || saving} className="w-full mt-6 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white px-4 py-3.5 rounded-full font-bold flex justify-center items-center gap-2 transform active:scale-95 transition-all">
              {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Simpan Blok'}
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
}

export default AdminDashboard;
