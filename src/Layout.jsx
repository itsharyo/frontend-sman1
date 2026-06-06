import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();

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
            className={`block px-4 py-3 rounded-lg transition-colors ${location.pathname === '/dashboard/guru' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-300 hover:bg-slate-800'}`}
          >
            Data Guru (Segera)
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
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header Mobile (Hanya muncul di HP) */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between md:hidden shadow-sm">
           <h2 className="text-lg font-bold text-slate-800">SMAN 1</h2>
           <button onClick={handleLogout} className="text-sm font-medium text-red-500">Logout</button>
        </header>

        {/* Header Desktop (Selamat datang) */}
        <header className="bg-white border-b border-slate-200 px-8 py-5 hidden md:block shadow-sm z-10">
           <h1 className="text-2xl font-semibold text-slate-800">Panel Administrator</h1>
        </header>

        {/* Konten Halaman yang akan berganti-ganti di sini */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50">
          <Outlet /> 
        </div>
      </main>

    </div>
  );
}