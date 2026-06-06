import { useState } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  // State untuk membuka/menutup menu di HP
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      
      {/* SIDEBAR (Desktop) */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col hidden md:flex">
        <div className="p-6 border-b border-slate-700">
          <h2 className="text-xl font-bold tracking-wider">SMAN 1 ADMIN</h2>
          <p className="text-slate-400 text-sm mt-1">Sistem Informasi</p>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2">
          <Link 
            to="/dashboard" 
            className={`block px-4 py-3 rounded-lg transition-colors ${location.pathname === '/dashboard' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-300 hover:bg-slate-800'}`}
          >
            Data Siswa
          </Link>
          <Link 
            to="/dashboard/guru" 
            className={`block px-4 py-3 rounded-lg transition-colors ${location.pathname === '/dashboard/guru' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-300 hover:bg-slate-800'}`}
          >
            Data Guru
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-700">
          <button 
            onClick={handleLogout}
            className="w-full px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500 hover:text-white transition-all font-medium"
          >
            Keluar Aplikasi
          </button>
        </div>
      </aside>

      {/* AREA KONTEN UTAMA */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        
        {/* Header Mobile (Hanya muncul di HP) */}
        <header className="bg-white border-b border-slate-200 px-4 py-4 flex items-center justify-between md:hidden shadow-sm z-20 relative">
          <div className="flex items-center gap-3">
            {/* Tombol Hamburger */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
              className="p-1 text-slate-600 hover:text-slate-900 focus:outline-none"
            >
              {isMobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
              )}
            </button>
            <h2 className="text-lg font-bold text-slate-800">SMAN 1</h2>
          </div>
          <button onClick={handleLogout} className="text-sm font-medium text-red-500">Logout</button>
        </header>

        {/* Menu Dropdown Mobile (Muncul kalau ikon diklik) */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-[65px] left-0 w-full bg-white border-b border-slate-200 shadow-lg z-30 animate-in slide-in-from-top-2">
            <nav className="flex flex-col p-4 space-y-2">
              <Link 
                to="/dashboard" 
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-lg transition-colors ${location.pathname === '/dashboard' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600'}`}
              >
                Data Siswa
              </Link>
              <Link 
                to="/dashboard/guru" 
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-lg transition-colors ${location.pathname === '/dashboard/guru' ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-slate-600'}`}
              >
                Data Guru
              </Link>
            </nav>
          </div>
        )}

        {/* Header Desktop (Selamat datang) */}
        <header className="bg-white border-b border-slate-200 px-8 py-5 hidden md:block shadow-sm z-10">
          <h1 className="text-2xl font-semibold text-slate-800">Panel Administrator</h1>
        </header>

        {/* Konten Halaman */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50 relative z-0">
          <Outlet /> 
        </div>
      </main>

    </div>
  );
}