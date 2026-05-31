import { useState } from 'react';
import './App.css'; 
import logoSekolah from './assets/Logo.png';

function App() {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pesan, setPesan] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPesan('Memproses...');

    const endpoint = isLoginMode ? '/api/auth/login' : '/api/auth/register';
    const url = `https://backend-sman1-production.up.railway.app${endpoint}`;
    const dataYangDikirim = isLoginMode ? { email, password } : { nama, email, password };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataYangDikirim),
      });

      const data = await response.json();

      if (response.ok) {
        if (isLoginMode) {
          setPesan("Login Berhasil");
          localStorage.setItem('token', data.token);
        } else {
          setPesan("Registrasi Berhasil. Mengalihkan...");
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

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setPesan('');
    setNama('');
    setPassword('');
  };

  const messageClass = pesan.includes('Berhasil') ? 'alert-success' : 'alert-error';

  return (
    <div className="page-container">
      <div className="auth-card">
        
        {/* --- LOGO SEKOLAH RESMI --- */}
        <div className="logo-container">
          <img 
            src={logoSekolah}
            alt="Logo SMAN 1" 
            className="school-logo"
          />
        </div>

        <h2 className="header-title">
          {isLoginMode ? 'Sistem Informasi Akademik' : 'Registrasi Admin'}
        </h2>
        <p className="header-subtitle">SMA Negeri 1</p>
        
        <form onSubmit={handleSubmit} className="auth-form">
          
          {!isLoginMode && (
            <div className="form-group">
              <label>Nama Lengkap</label>
              <input 
                type="text" 
                value={nama} 
                onChange={(e) => setNama(e.target.value)} 
                required={!isLoginMode} 
              />
            </div>
          )}
          
          <div className="form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          
          <button type="submit" className={`btn-primary ${isLoginMode ? 'btn-login' : 'btn-register'}`}>
            {isLoginMode ? 'Masuk' : 'Daftar'}
          </button>
        </form>

        {pesan && (
          <div className={`alert-message ${pesan === 'Memproses...' ? 'alert-info' : messageClass}`}>
            {pesan}
          </div>
        )}

        <hr className="divider" />

        <div className="switch-container">
          <p>
            {isLoginMode ? 'Belum memiliki akses?' : 'Sudah terdaftar?'}
          </p>
          <button onClick={toggleMode} className="btn-switch">
            {isLoginMode ? 'Daftar Akun Baru' : 'Kembali ke Login'}
          </button>
        </div>

      </div>
    </div>
  );
}

export default App;