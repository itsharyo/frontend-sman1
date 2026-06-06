import { useState, useEffect } from 'react';

export default function DashboardGuru() {
  const [guru, setGuru] = useState([]);
  const [formData, setFormData] = useState({ namaLengkap: '', nip: '', mataPelajaran: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  
  // Tampilan Form (Show/Hide)
  const [showForm, setShowForm] = useState(false);

  const token = localStorage.getItem('token'); 
  const baseURL = 'https://backend-sman1-production.up.railway.app/api/guru';

  const fetchGuru = async () => {
    try {
      const response = await fetch(baseURL, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setGuru(data);
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    }
  };

  useEffect(() => {
    if (token) fetchGuru();
  }, [token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = isEditing ? `${baseURL}/${editId}` : baseURL;
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      // Menangkap balasan dari backend
      const data = await response.json(); 

      if (response.ok) {
        setFormData({ namaLengkap: '', nip: '', mataPelajaran: '' });
        setIsEditing(false);
        setEditId(null);
        setShowForm(false);
        fetchGuru(); 
        alert(isEditing ? "Data guru berhasil diubah!" : "Data guru berhasil ditambahkan!");
      } else {
        // Tampilkan pesan error dari backend ke layar
        alert(`Gagal menyimpan: ${data.pesan || 'Terjadi kesalahan'}`);
      }
    } catch (error) {
      alert("Gagal terhubung. Pastikan Backend di Railway sudah aktif!");
      console.error("Gagal menyimpan data:", error);
    }
  };

  const handleEdit = (data) => {
    setFormData({
      namaLengkap: data.namaLengkap,
      nip: data.nip,
      mataPelajaran: data.mataPelajaran
    });
    setIsEditing(true);
    setEditId(data._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus data guru ini?")) return;
    try {
      const response = await fetch(`${baseURL}/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        fetchGuru();
      }
    } catch (error) {
      console.error("Gagal menghapus data:", error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* Header Halaman & Tombol Tambah */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Data Tenaga Pengajar</h2>
          <p className="text-slate-500 text-sm mt-1">Kelola data guru dan mata pelajaran SMAN 1</p>
        </div>
        <button 
          onClick={() => { setShowForm(!showForm); setIsEditing(false); setFormData({ namaLengkap: '', nip: '', mataPelajaran: '' }); }}
          className="mt-4 sm:mt-0 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 px-5 rounded-lg shadow-md transition-all flex items-center gap-2"
        >
          {showForm ? 'Tutup Form' : '+ Tambah Guru Baru'}
        </button>
      </div>

      {/* FORM INPUT */}
      {showForm && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200 animate-in fade-in slide-in-from-top-4 duration-300">
          <h3 className="text-lg font-semibold text-slate-800 mb-5 border-b border-slate-100 pb-3">
            {isEditing ? 'Edit Data Guru' : 'Formulir Pendaftaran Guru'}
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nama Lengkap & Gelar</label>
                <input type="text" name="namaLengkap" placeholder="Cth: Budi Santoso, S.Pd." value={formData.namaLengkap} onChange={handleChange} required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">NIP</label>
                <input type="text" name="nip" placeholder="Nomor Induk Pegawai" value={formData.nip} onChange={handleChange} required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Mata Pelajaran</label>
                <input type="text" name="mataPelajaran" placeholder="Cth: Matematika" value={formData.mataPelajaran} onChange={handleChange} required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-colors" />
              </div>
            </div>
            <div className="flex gap-3 justify-end pt-4 border-t border-slate-100">
              <button type="submit" className="bg-slate-800 hover:bg-slate-900 text-white font-medium py-2 px-6 rounded-lg transition-colors">
                {isEditing ? 'Simpan Perubahan' : 'Simpan Data'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TABEL DATA */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
              <tr>
                <th className="py-4 px-6 font-semibold text-sm">Nama Lengkap</th>
                <th className="py-4 px-6 font-semibold text-sm">NIP</th>
                <th className="py-4 px-6 font-semibold text-sm">Mata Pelajaran</th>
                <th className="py-4 px-6 font-semibold text-sm text-center w-32">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {guru.length > 0 ? (
                guru.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-6 text-slate-800 font-medium">{item.namaLengkap}</td>
                    <td className="py-4 px-6 text-slate-500">{item.nip}</td>
                    <td className="py-4 px-6 text-slate-600">
                      <span className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-md text-xs font-semibold">{item.mataPelajaran}</span>
                    </td>
                    <td className="py-4 px-6 flex justify-center gap-2">
                      <button onClick={() => handleEdit(item)} className="text-amber-500 hover:bg-amber-50 px-3 py-1.5 rounded-md text-sm font-medium transition-colors border border-transparent hover:border-amber-200">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(item._id)} className="text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-md text-sm font-medium transition-colors border border-transparent hover:border-red-200">
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center">
                      <span className="text-4xl mb-3">👨‍🏫</span>
                      <p>Belum ada data guru terdaftar.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}