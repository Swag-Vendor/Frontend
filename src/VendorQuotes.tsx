import { useEffect, useState } from 'react';
import { API_BASE } from './config';
import { useAuth } from './auth/AuthContext';
import { authFetch } from './auth/authFetch';

export interface VendorQuote {
    id: string;
    vendorName: string;
    itemName: string;
    quoteAmount: number;
    itemQuantity: number;
    itemDescription: string;
    submittedAt: string;
}

interface QuoteWithItem {
    id: number;
    vendorName: string;
    unitPrice: number;
    createdAt: string;
    swagItem: {
        name: string;
        quantity: number;
        description: string | null;
    };
}

const currencyFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

const VendorQuotes = () => {
    const [quotes, setQuotes] = useState<VendorQuote[]>([]);
    const [error, setError] = useState(false);
    const { token, logout } = useAuth();

    useEffect(() => {
        if (!token) return;
        authFetch(`${API_BASE}/quotes`, token)
            .then(async (res) => {
                if (res.status === 401) {
                    logout();
                    return;
                }
                const data: QuoteWithItem[] = await res.json();
                setQuotes(data.map((quote) => ({
                    id: String(quote.id),
                    vendorName: quote.vendorName,
                    itemName: quote.swagItem.name,
                    quoteAmount: quote.unitPrice,
                    itemQuantity: quote.swagItem.quantity,
                    itemDescription: quote.swagItem.description ?? '',
                    submittedAt: quote.createdAt,
                })));
            })
            .catch(() => setError(true));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    return (
        <main style={{ flex: 1, padding: '24px', fontFamily: 'monospace' }}>
            <h1 style={{ margin: 0, fontSize: '22px' }}>Vendor Quotes</h1>
            <p style={{ margin: '4px 0 0', color: '#6b7280', fontSize: '13px' }}>Review submitted vendor quotes.</p>

            {error ? (
                <p style={{ marginTop: '24px', color: '#b91c1c' }}>Could not load vendor quotes.</p>
            ) : quotes.length === 0 ? (
                <p style={{ marginTop: '24px', color: '#6b7280' }}>No vendor quotes have been submitted yet.</p>
            ) : (
                <div style={{ marginTop: '24px', overflowX: 'auto', backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead style={{ backgroundColor: '#f9fafb' }}><tr>
                            {['Vendor', 'Item', 'Amount', 'Quantity', 'Description', 'Submitted'].map((heading) => (
                                <th key={heading} style={{ padding: '12px', borderBottom: '1px solid #e5e7eb', fontSize: '12px' }}>{heading}</th>
                            ))}
                        </tr></thead>
                        <tbody>{quotes.map((quote) => (
                            <tr key={quote.id}>
                                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>{quote.vendorName}</td>
                                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>{quote.itemName}</td>
                                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>{currencyFormatter.format(quote.quoteAmount)}</td>
                                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>{quote.itemQuantity}</td>
                                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>{quote.itemDescription || '—'}</td>
                                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>{new Date(quote.submittedAt).toLocaleDateString()}</td>
                            </tr>
                        ))}</tbody>
                    </table>
                </div>
            )}
        </main>
    );
};

export default VendorQuotes;
