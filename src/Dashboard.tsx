import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DeleteQuote from './components/DeleteQuote';
import NewQuote from './components/NewQuote';
import { API_BASE } from './config';
import { useAuth } from './auth/AuthContext';
import { authFetch } from './auth/authFetch';

interface Summary {
    fundTotal: number;
    approvedTotal: number;
    pendingTotal: number;
    remaining: number;
    usedPct: number;
}

function formatCurrency(value: number) {
    return `$${value.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
}

const Dashboard = () => {
    const [showNewQuote, setShowNewQuote] = useState(false);
    const [showDeleteQuote, setShowDeleteQuote] = useState(false);
    const [summary, setSummary] = useState<Summary | null>(null);
    const [pendingCount, setPendingCount] = useState<number | null>(null);
    const [error, setError] = useState(false);
    const navigate = useNavigate();
    const { token, logout } = useAuth();

    const loadData = () => {
        if (!token) return;
        Promise.all([
            authFetch(`${API_BASE}/master-fund/summary`, token),
            authFetch(`${API_BASE}/requests`, token),
        ])
            .then(async ([summaryRes, requestsRes]) => {
                if (summaryRes.status === 401 || requestsRes.status === 401) {
                    logout();
                    return;
                }
                const [s, requests] = await Promise.all([summaryRes.json(), requestsRes.json()]);
                setSummary(s);
                setPendingCount(Array.isArray(requests) ? requests.length : 0);
                setError(false);
            })
            .catch(() => setError(true));
    };

    useEffect(() => {
        loadData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    const cards = summary
        ? [
              { label: 'MASTERFUND', value: formatCurrency(summary.fundTotal), subtext: 'Fixed budget', bg: '#EFF6FF', border: '#BFDBFE', color: '#1e3a5f' },
              { label: 'APPROVED SPEND', value: formatCurrency(summary.approvedTotal), subtext: `${summary.usedPct}% used`, bg: '#F0FDF4', border: '#BBF7D0', color: '#14532d' },
              { label: 'REMAINING', value: formatCurrency(summary.remaining), subtext: 'after pending', bg: '#FEFCE8', border: '#FDE68A', color: '#713f12' },
              { label: 'PENDING QUOTES', value: String(pendingCount ?? 0), subtext: 'need approval', bg: '#FFF1F2', border: '#FECDD3', color: '#881337' },
          ]
        : [];

    return (
        <main style={{ flex: 1, padding: '24px', fontFamily: 'monospace'}}>
            {/* Header */}
            <div style = {{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: '22px'}}>Budget Dashboard</h1>
                    <p style={{ margin: '4px 0 0', color: '#6b7280', fontSize: '13px'}}>Track vendor quotes and swag spending</p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                        onClick={() => setShowNewQuote(true)}
                        style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', fontFamily: 'monospace', fontWeight: 'bold', cursor: 'pointer', backgroundColor: '#4A9EE8', color: 'white' }}
                    >
                        New Quote
                    </button>
                    <button
                        onClick={() => setShowDeleteQuote(true)}
                        style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #b91c1c', fontFamily: 'monospace', fontWeight: 'bold', cursor: 'pointer', backgroundColor: 'white', color: '#b91c1c' }}
                    >
                        Delete Quote
                    </button>
                </div>
            </div>

            {/* Stat Cards */}
            {error && (
                <p style={{ color: '#b91c1c', fontSize: '13px', marginBottom: '16px' }}>
                    Could not reach backend — is it running on {API_BASE}?
                </p>
            )}

            {!error && !summary && (
                <p style={{ color: '#6b7280', fontSize: '13px', marginBottom: '16px' }}>Loading budget data…</p>
            )}

            {summary && (
                <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                    {cards.map((card) => (
                        <div key={card.label} style={{ flex: 1, padding: '16px', borderRadius: '8px', backgroundColor: card.bg, border: `2px solid ${card.border}`, color: card.color }}>
                            <p style={{ margin: '0 0 4px',fontSize: '11px', letterSpacing: '0.1em', fontWeight: 'bold' }}>{card.label}</p>
                            <p style={{ margin: '0 0 4px', fontSize: '28px', fontWeight: 'bold' }}>{card.value}</p>
                            <p style={{ margin: 0, fontSize: '11px', opacity: 0.6 }}>{card.subtext}</p>
                        </div>
                    ))}
                </div>
            )}

            {showNewQuote && (
                <NewQuote
                    onClose={() => setShowNewQuote(false)}
                    onSubmitted={() => {
                        setShowNewQuote(false);
                        loadData();
                        navigate('/VendorQuotes');
                    }}
                />
            )}

            {showDeleteQuote && (
                <DeleteQuote
                    onClose={() => setShowDeleteQuote(false)}
                    onDeleted={() => {
                        setShowDeleteQuote(false);
                        loadData();
                        navigate('/VendorQuotes');
                    }}
                />
            )}
        </main>
    );
};

export default Dashboard;
