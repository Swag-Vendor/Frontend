import React from 'react';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';

function App() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f3f4f6' }}>
      <Sidebar />
      <Dashboard />
    </div>
  );
}

export default App;
