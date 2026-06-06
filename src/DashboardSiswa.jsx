import { useState, useEffect } from 'react';

export default function DashboardSiswa() {
  const [siswa, setSiswa] = useState([]);
  const [formData, setFormData] = useState({ namaLengkap: '', nisn: '', kelas: '', jurusan: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  
  // Tampilan Form (Show/Hide)
  const [showForm, setShowForm] = useState(false);

  const token = localStorage.getItem('token'); 
  const baseURL = 'https://backend-sman1-production.up.railway.app/api/siswa';

  const fetchSiswa = async () => {
    try {
      const response = await fetch(baseURL, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setSiswa(data);
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    }
  };

  useEffect(() => {
    if (token) fetchSiswa();
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

      // Menangkap balasan dari backend agar sama rapinya dengan DashboardGuru
      const data = await response.json();

      if (response.ok) {
        setFormData({ namaLengkap: '', nisn: '', kelas: '', jurusan: '' });
        setIsEditing(false);
        setEditId(null);
        setShowForm(false); 
        fetchSiswa(); 
        alert(isEditing ? "Data siswa berhasil diubah!" : "Data siswa berhasil ditambahkan!");
      } else {
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
      nisn: data.nisn,
      kelas: data.kelas,
      jurusan: data.jurusan
    });
    setIsEditing(true);
    setEditId(data._id);
    setShowForm(true); 
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus data siswa ini?")) return;
    try {
      const response = await fetch(`${baseURL}/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        fetchSiswa();
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
          <h2 className="text-2xl font-bold text-slate-800">Data Siswa Aktif</h2>
          <p className="text-slate-500 text-sm mt-1">Kelola data akademik siswa SMAN 1</p>
        </div>
        <button 
          onClick={() => { setShowForm(!showForm); setIsEditing(false); setFormData({ namaLengkap: '', nisn: '', kelas: '', jurusan: '' }); }}
          className="mt-4 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-5 rounded-lg shadow-md transition-all flex items-center gap-2"
        >
          {showForm ? 'Tutup Form' : '+ Tambah Siswa Baru'}
        </button>
      </div>

      {/* FORM INPUT */}
      {showForm && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200 animate-in fade-in slide-in-from-top-4 duration-300">
          <h3 className="text-lg font-semibold text-slate-800 mb-5 border-b border-slate-100 pb-3">
            {isEditing ? 'Edit Data Siswa' : 'Formulir Pendaftaran Siswa'}
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nama Lengkap</label>
                <input type="text" name="namaLengkap" placeholder="Masukkan Nama Lengkap" value={formData.namaLengkap} onChange={handleChange} required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">NISN Nasional</label>
                <input type="text" name="nisn" placeholder="Masukkan NISN Nasional" value={formData.nisn} onChange={handleChange} required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Kelas Tingkat</label>
                <input type="text" name="kelas" placeholder="Masukkan Tingkat Kelas" value={formData.kelas} onChange={handleChange} required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Program Jurusan</label>
                <input type="text" name="jurusan" placeholder="Masukkan Program Jurusan" value={formData.jurusan} onChange={handleChange} required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors" />
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
                <th className="py-4 px-6 font-semibold text-sm">NISN</th>
                <th className="py-4 px-6 font-semibold text-sm">Kelas</th>
                <th className="py-4 px-6 font-semibold text-sm">Jurusan</th>
                <th className="py-4 px-6 font-semibold text-sm text-center w-32">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {siswa.length > 0 ? (
                siswa.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-6 text-slate-800 font-medium">{item.namaLengkap}</td>
                    <td className="py-4 px-6 text-slate-500">{item.nisn}</td>
                    <td className="py-4 px-6 text-slate-600">
                      <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md text-xs font-semibold">{item.kelas}</span>
                    </td>
                    <td className="py-4 px-6 text-slate-600">{item.jurusan}</td>
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
                  <td colSpan="5" className="py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center">
                      <span className="text-4xl mb-3">📭</span>
                      <p>Belum ada data siswa terdaftar.</p>
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