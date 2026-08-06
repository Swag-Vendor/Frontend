import { useEffect, useState } from 'react';
// @ts-ignore: allow CSS side-effect import without type declarations
import './DeleteQuote.css';

const API_BASE = 'http://localhost:3000';

interface Quote {
    id: number;
    vendorName: string;
    unitPrice: number;
    swagItem?: { name: string };
}

interface DeleteQuoteProps {
    onClose: () => void;
    onDeleted: () => void;
}

const DeleteQuote = ({ onClose, onDeleted }: DeleteQuoteProps) => {
    const [quotes, setQuotes] = useState<Quote[]>([]);
    const [selectedQuoteId, setSelectedQuoteId] = useState('');
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadQuotes = async () => {
            try {
                const response = await fetch(`${API_BASE}/quotes`);
                if (!response.ok) throw new Error('Failed to load quotes');
                setQuotes(await response.json());
            } catch {
                setError('Could not load vendor quotes. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        loadQuotes();
    }, []);

    const handleDelete = async () => {
        if (!selectedQuoteId) {
            setError('Select a quote to delete.');
            return;
        }

        setDeleting(true);
        setError('');

        try {
            const response = await fetch(`${API_BASE}/quotes/${selectedQuoteId}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Failed to delete quote');
            onDeleted();
        } catch {
            setError('The quote could not be deleted. Please try again.');
            setDeleting(false);
        }
    };

    return (
        <div className="delete-quote-overlay" onClick={onClose} role="presentation">
            <section className="delete-quote-modal" onClick={(event) => event.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="delete-quote-title">
                <div className="delete-quote-header">
                    <h2 id="delete-quote-title">Delete Vendor Quote</h2>
                    <button type="button" className="delete-quote-close" onClick={onClose} disabled={deleting} aria-label="Close">&times;</button>
                </div>

                <p className="delete-quote-warning">This action cannot be undone.</p>

                <label className="delete-quote-label" htmlFor="quote-to-delete">
                    Quote to delete
                    <select id="quote-to-delete" value={selectedQuoteId} onChange={(event) => setSelectedQuoteId(event.target.value)} disabled={loading || deleting || quotes.length === 0}>
                        <option value="">{loading ? 'Loading quotes...' : 'Select a quote'}</option>
                        {quotes.map((quote) => (
                            <option key={quote.id} value={quote.id}>
                                {quote.vendorName} — {quote.swagItem?.name ?? 'Unnamed item'} (${Number(quote.unitPrice).toFixed(2)})
                            </option>
                        ))}
                    </select>
                </label>

                {!loading && quotes.length === 0 && !error && <p className="delete-quote-empty">There are no quotes to delete.</p>}
                {error && <p className="delete-quote-error" role="alert">{error}</p>}

                <div className="delete-quote-actions">
                    <button type="button" className="delete-quote-cancel" onClick={onClose} disabled={deleting}>Cancel</button>
                    <button type="button" className="delete-quote-confirm" onClick={handleDelete} disabled={loading || deleting || quotes.length === 0}>
                        {deleting ? 'Deleting...' : 'Delete Quote'}
                    </button>
                </div>
            </section>
        </div>
    );
};

export default DeleteQuote;
