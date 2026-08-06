import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Navbar from './components/Sidebar';
import Dashboard from './Dashboard';
import VendorQuotes from './VendorQuotes';
import Budget from './pages/Budget';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/VendorQuotes" element={<VendorQuotes />} />
          <Route path="/Budget" element={<Budget />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
