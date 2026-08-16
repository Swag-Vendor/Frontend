import { useEffect, useState } from 'react';
import { API_BASE } from '../config';
import { useAuth } from '../auth/AuthContext';
import { authFetch } from '../auth/authFetch';

interface RequestItem {
    id: number;
    name: string;
    quantity: number;
}

interface PendingRequest {
    id: number;
    totalCost: number;
    createdAt: string;
    items: RequestItem[];
    user: { name: string; email: string };
}

const currencyFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

interface PendingRequestsProps {
    onChanged: () => void;
}

const PendingRequests = ({ onChanged }: PendingRequestsProps) => {
    const [requests, setRequests] = useState<PendingRequest[] | null>(null);
    const [error, setError] = useState(false);
    const [actingId, setActingId] = useState<number | null>(null);
    const [actionError, setActionError] = useState('');
    const { token, user, logout } = useAuth();
    const isDirector = user?.role === 'director';

    const loadRequests = () => {
        if (!token) return;
        authFetch(`${API_BASE}/requests`, token)
            .then(async (res) => {
                if (res.status === 401) {
                    logout();
                    return;
                }
                const data = await res.json();
                setRequests(Array.isArray(data) ? data : []);
                setError(false);
            })
            .catch(() => setError(true));
    };

    useEffect(() => {
        loadRequests();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    const handleDecision = async (id: number, decision: 'approve' | 'reject') => {
        if (!token) return;
        setActingId(id);
        setActionError('');
        try {
            const res = await authFetch(`${API_BASE}/requests/${id}/${decision}`, token, { method: 'POST' });
            if (res.status === 401) {
                logout();
                return;
            }
            if (!res.ok) {
                const body = await res.json().catch(() => ({}));
                throw new Error(body.error || `Failed to ${decision} request`);
            }
            loadRequests();
            onChanged();
        } catch (err) {
            setActionError(err instanceof Error ? err.message : `Failed to ${decision} request`);
        } finally {
            setActingId(null);
        }
    };

    return (
        <div style={{ marginTop: '24px', backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <p style={{ margin: 0, fontSize: '13px', fontWeight: 'bold', color: '#1e3a5f' }}>Pending Requests</p>
                {!isDirector && (
                    <span style={{ fontSize: '12px', color: '#9ca3af' }}>Requires director role to approve/reject</span>
                )}
            </div>

            {actionError && (
                <p style={{ color: '#b91c1c', fontSize: '13px', marginBottom: '12px' }}>{actionError}</p>
            )}

            {error && <p style={{ color: '#b91c1c', fontSize: '13px' }}>Could not load pending requests.</p>}

            {!error && requests === null && (
                <p style={{ color: '#6b7280', fontSize: '13px' }}>Loading pending requests…</p>
            )}

            {!error && requests !== null && requests.length === 0 && (
                <p style={{ color: '#6b7280', fontSize: '13px' }}>No pending requests.</p>
            )}

            {!error && requests !== null && requests.length > 0 && (
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ backgroundColor: '#f9fafb' }}>
                        <tr>
                            {['Requester', 'Items', 'Total', 'Submitted', 'Actions'].map((heading) => (
                                <th key={heading} style={{ padding: '12px', borderBottom: '1px solid #e5e7eb', fontSize: '12px' }}>{heading}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {requests.map((request) => (
                            <tr key={request.id}>
                                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>{request.user?.name ?? `User #${request.id}`}</td>
                                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>
                                    {request.items.map((item) => `${item.name} (x${item.quantity})`).join(', ') || '—'}
                                </td>
                                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>{currencyFormatter.format(request.totalCost)}</td>
                                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>{new Date(request.createdAt).toLocaleDateString()}</td>
                                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button
                                            type="button"
                                            disabled={!isDirector || actingId === request.id}
                                            onClick={() => handleDecision(request.id, 'approve')}
                                            style={{
                                                padding: '6px 12px',
                                                borderRadius: '6px',
                                                border: 'none',
                                                fontFamily: 'monospace',
                                                fontWeight: 'bold',
                                                fontSize: '12px',
                                                cursor: isDirector ? 'pointer' : 'not-allowed',
                                                backgroundColor: '#4A9EE8',
                                                color: 'white',
                                                opacity: !isDirector || actingId === request.id ? 0.5 : 1,
                                            }}
                                        >
                                            {actingId === request.id ? '…' : 'Approve'}
                                        </button>
                                        <button
                                            type="button"
                                            disabled={!isDirector || actingId === request.id}
                                            onClick={() => handleDecision(request.id, 'reject')}
                                            style={{
                                                padding: '6px 12px',
                                                borderRadius: '6px',
                                                border: '1px solid #b91c1c',
                                                fontFamily: 'monospace',
                                                fontWeight: 'bold',
                                                fontSize: '12px',
                                                cursor: isDirector ? 'pointer' : 'not-allowed',
                                                backgroundColor: 'white',
                                                color: '#b91c1c',
                                                opacity: !isDirector || actingId === request.id ? 0.5 : 1,
                                            }}
                                        >
                                            {actingId === request.id ? '…' : 'Reject'}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default PendingRequests;
