import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Navbar from './components/Sidebar';
import Dashboard from './Dashboard';
import VendorQuotes from './VendorQuotes';
import Budget from './pages/Budget';
import Login from './pages/Login';
import { AuthProvider } from './auth/AuthContext';
import { RequireAuth } from './auth/RequireAuth';

function App() {
  return (
    <div>
      <BrowserRouter>
        <AuthProvider>
          <Navbar />
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
            <Route path="/VendorQuotes" element={<RequireAuth><VendorQuotes /></RequireAuth>} />
            <Route path="/Budget" element={<RequireAuth><Budget /></RequireAuth>} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
