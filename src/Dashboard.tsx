import React from 'react';

const Dashboard = () => {
    return (
        <main style={{ flex: 1, padding: '24px', fontFamily: 'monospace'}}>
            {/* Header */}
            <div style = {{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: '22px'}}>Budget Dashboard</h1>
                    <p style={{ margin: '4px 0 0', color: '#6b7280', fontSize: '13px'}}>Track vendor quotes and swag spending</p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button style={{ padding: '8px 16px', borderRadius: '6px', border: '2px solid #d1d5db', fontFamily: 'monospace', fontWeight: 'bold', cursor: 'pointer', backgroundColor: 'white' }}>Export Quote</button>
                    <button style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', fontFamily: 'monospace', fontWeight: 'bold', cursor: 'pointer', backgroundColor: '#4A9EE8', color: 'white' }}>New Quote</button>
                </div>
            </div>

            {/* Stat Cards */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                {[
                    { label: 'MASTERFUND', value: '$25,000', subtext: 'Fixed budget', bg: '#EFF6FF', border: '#BFDBFE', color: '#1e3a5f' },
                    { label: 'APPROVED SPEND', value: '$0', subtext: '57% used', bg: '#F0FDF4', border: '#BBF7D0', color: '#14532d' },
                    { label: 'REMAINING', value: '$25,000', subtext: 'after pending', bg: '#FEFCE8', border: '#FDE68A', color: '#713f12' },
                    { label: 'PENDING QUOTES', value: '5', subtext: 'need approval', bg: '#FFF1F2', border: '#FECDD3', color: '#881337' },
                ].map((card) => (
                    <div key={card.label} style={{ flex: 1, padding: '16px', borderRadius: '8px', backgroundColor: card.bg, border: `2px solid ${card.border}`, color: card.color }}>
                        <p style={{ margin: '0 0 4px',fontSize: '11px', letterSpacing: '0.1em', fontWeight: 'bold' }}>{card.label}</p>
                        <p style={{ margin: '0 0 4px', fontSize: '28px', fontWeight: 'bold' }}>{card.value}</p>
                        <p style={{ margin: 0, fontSize: '11px', opacity: 0.6 }}>{card.subtext}</p>
                    </div>
                ))}
            </div>
        </main>
    );
};

export default Dashboard;