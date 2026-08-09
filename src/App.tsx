import { useState } from 'react';

import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';

import Sidebar from './Sidebar';

import Dashboard from './Dashboard';

import VendorQuotes, { VendorQuote } from './VendorQuotes';

import Budget from './pages/Budget';



function MainLayout() {

  const [quotes, setQuotes] = useState<VendorQuote[]>([]);

  const location = useLocation();

  const navigate = useNavigate();



  const handleQuoteSubmitted = (quote: VendorQuote) => {

    setQuotes((currentQuotes) => [quote, ...currentQuotes]);

    navigate('/vendor-quotes');

  };



  const getActiveItem = () => {

    if (location.pathname === '/vendor-quotes') return 'VendorQuotes';

    if (location.pathname === '/budget') return 'Budget';

    return 'Dashboard';

  };



  return (

    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f3f4f6'}}>

      <Sidebar activeItem={getActiveItem()} />

      <div style={{ flex: 1 }}>

        <Routes>

          <Route path="/" element={<Dashboard onQuoteSubmitted={handleQuoteSubmitted} />} />

          <Route path="/vendor-quotes" element={<VendorQuotes quotes={quotes} />} />

          <Route path="/budget" element={<Budget />} />

        </Routes>

      </div>

    </div>

  );

}



function App() {

  return (

    <BrowserRouter>

      <MainLayout />

    </BrowserRouter>

  );

}



export default App;