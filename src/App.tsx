import { useState } from 'react';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';
import VendorQuotes, { VendorQuote } from './VendorQuotes';

type Page = 'dashboard' | 'vendorQuotes';

function App() {
  const [page, setPage] = useState<Page>('dashboard');
  const [quotes, setQuotes] = useState<VendorQuote[]>([]);

  const handleQuoteSubmitted = (quote: VendorQuote) => {
    setQuotes((currentQuotes) => [quote, ...currentQuotes]);
    setPage('vendorQuotes');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f3f4f6' }}>
      <Sidebar activeItem={page === 'dashboard' ? 'Dashboard' : 'VendorQuotes'} />
      {page === 'dashboard' ? (
        <Dashboard onQuoteSubmitted={handleQuoteSubmitted} />
      ) : (
        <VendorQuotes quotes={quotes} />
      )}
    </div>
  );
}

export default App;
