import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logoSekolah from './assets/Logo.png';

export default function Login() {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pesan, setPesan] = useState('');
  
  const navigate = useNavigate();

  // Jika sudah login, langsung lempar ke dashboard
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) navigate('/dashboard');
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPesan('Memproses...');

    const endpoint = isLoginMode ? '/api/auth/login' : '/api/auth/register';
    const url = `https://backend-sman1-production.up.railway.app${endpoint}`;
    const dataYangDikirim = isLoginMode ? { email, password } : { nama, email, password };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataYangDikirim),
      });

      const data = await response.json();

      if (response.ok) {
        if (isLoginMode) {
          setPesan("Login Berhasil! Mengalihkan...");
          localStorage.setItem('token', data.token);
          setTimeout(() => navigate('/dashboard'), 1000); // Pindah halaman tanpa reload
        } else {
          setPesan("Registrasi Berhasil. Silakan Login.");
          setTimeout(() => {
            setIsLoginMode(true);
            setPesan('');
          }, 2000);
        }
      } else {
        setPesan(data.pesan || data.error || "Terjadi kesalahan");
      }
    } catch (error) {
      setPesan("Gagal terhubung ke server");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="p-8 text-center border-b border-slate-100">
           <img src={logoSekolah} alt="Logo" className="w-20 mx-auto mb-4" />
           <h2 className="text-2xl font-bold text-slate-800">{isLoginMode ? 'Sistem Informasi' : 'Registrasi Admin'}</h2>
           <p className="text-slate-500">SMA Negeri 1</p>
        </div>
        
        <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
            {!isLoginMode && (
                <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nama Lengkap</label>
                <input type="text" value={nama} onChange={(e) => setNama(e.target.value)} required className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div>
            )}
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
            
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-md transition-colors mt-6">
                {isLoginMode ? 'Masuk ke Dashboard' : 'Daftar Akun'}
            </button>
            </form>

            {pesan && <div className={`mt-4 p-3 rounded-lg text-sm text-center ${pesan.includes('Berhasil') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>{pesan}</div>}

            <div className="mt-6 text-center text-sm">
                <span className="text-slate-500">{isLoginMode ? 'Belum punya akses? ' : 'Sudah terdaftar? '}</span>
                <button onClick={() => setIsLoginMode(!isLoginMode)} className="text-blue-600 font-semibold hover:underline">
                    {isLoginMode ? 'Daftar di sini' : 'Kembali ke Login'}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}