// @ts-ignore: CSS imports do not have type declarations in this project setup
import './VendorQuotesPreview.css';
import { useEffect, useState } from 'react';
import { VendorQuote } from '../VendorQuotes';

const API_BASE = 'http://localhost:3000';

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

const VendorQuotesPreview = () => {
    const [quotes, setQuotes] = useState<VendorQuote[]>([]);
    const [error, setError] = useState(false);

    useEffect(() => {
        fetch(`${API_BASE}/quotes`)
            .then((r) => r.json())
            .then((data: QuoteWithItem[]) => {
                setQuotes(data.slice(0, 5).map((quote) => ({
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
    }, []);

    return (
        <div className="vqp-container">
            <div className="vqp-header">
                <h2 className="vqp-title">Vendor Quotes</h2>
                <a href="/vendor-quotes" className="vqp-view-all">View all →</a>
            </div>
            {error ? (
                <p className="vqp-error">Could not load vendor quotes.</p>
            ) : quotes.length === 0 ? (
                <p className="vqp-empty">No quotes yet.</p>
            ) : (
                <table className="vqp-table">
                    <thead>
                        <tr>
                            {['Vendor', 'Item', 'Amount', 'Quantity', 'Description', 'Submitted'].map((h) => (
                                <th key={h} className="vqp-th">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {quotes.map((quote) => (
                            <tr key={quote.id} className="vqp-row">
                                <td className="vqp-td">{quote.vendorName}</td>
                                <td className="vqp-td">{quote.itemName}</td>
                                <td className="vqp-td">{currencyFormatter.format(quote.quoteAmount)}</td>
                                <td className="vqp-td">{quote.itemQuantity}</td>
                                <td className="vqp-td">{quote.itemDescription || '—'}</td>
                                <td className="vqp-td">{new Date(quote.submittedAt).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default VendorQuotesPreview;