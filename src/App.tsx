import { useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Navbar from './components/Sidebar';
import Dashboard from './Dashboard';
import VendorQuotes, { VendorQuote } from './VendorQuotes';
import Budget from './pages/Budget';

function App() {
  const [quotes, setQuotes] = useState<VendorQuote[]>([]);

  const handleQuoteSubmitted = (quote: VendorQuote) => {
    setQuotes((currentQuotes) => [quote, ...currentQuotes]);
  };

  return (
    <div>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<Dashboard onQuoteSubmitted={handleQuoteSubmitted} />} />
          <Route path="/VendorQuotes" element={<VendorQuotes quotes={quotes} />} />
          <Route path="/Budget" element={<Budget />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
