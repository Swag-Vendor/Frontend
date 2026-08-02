import { useState } from 'react';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';
import VendorQuotes from './VendorQuotes';

type Page = 'dashboard' | 'vendorQuotes';

function App() {
  const [page, setPage] = useState<Page>('dashboard');

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f3f4f6' }}>
      <Sidebar />
      {page === 'dashboard' ? (
        <Dashboard onQuoteSubmitted={() => setPage('vendorQuotes')} />
      ) : (
        <VendorQuotes />
      )}
    </div>
  );
}

export default App;
