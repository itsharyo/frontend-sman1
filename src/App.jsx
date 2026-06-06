import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login'; 
import Layout from './Layout';
import DashboardSiswa from './DashboardSiswa';
import DashboardGuru from './DashboardGuru'; // <--- Import Komponen Guru

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        <Route path="/login" element={<Login />} />

        <Route path="/dashboard" element={<Layout />}>
          <Route index element={<DashboardSiswa />} />
          
          {/* Rute ini sekarang mengarah ke DashboardGuru yang baru dibuat */}
          <Route path="guru" element={<DashboardGuru />} /> 
        </Route>
      </Routes>
    </BrowserRouter>
  );
}