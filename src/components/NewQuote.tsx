import { useState, FormEvent } from 'react';
// @ts-ignore: allow CSS side-effect import without type declarations
import './NewQuote.css';

const API_BASE = 'http://localhost:3000';

interface NewQuoteProps {
    onClose: () => void;
    onSubmitted: () => void;
}

const NewQuote = ({ onClose, onSubmitted }: NewQuoteProps) => {
    const [vendorName, setVendorName] = useState('');
    const [itemName, setItemName] = useState('');
    const [quoteAmount, setQuoteAmount] = useState('');
    const [itemQuantity, setItemQuantity] = useState('');
    const [itemDescription, setItemDescription] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError(false);

        try {
            // TODO: backend not implemented yet — this endpoint doesn't exist
            const res = await fetch(`${API_BASE}/vendor-quotes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    vendorName,
                    itemName,
                    quoteAmount: Number(quoteAmount),
                    itemQuantity: Number(itemQuantity),
                    itemDescription,
                }),
            });

            if (!res.ok) throw new Error('Failed to submit quote');

            onSubmitted();
        } catch {
            setError(true);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="new-quote-overlay" onClick={onClose}>
            <div className="new-quote-modal" onClick={(e) => e.stopPropagation()}>
                <div className="new-quote-header">
                    <h2>New Vendor Quote</h2>
                    <button type="button" className="new-quote-close" onClick={onClose} aria-label="Close">
                        &times;
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="new-quote-form">
                    <label>
                        Vendor Name
                        <input
                            type="text"
                            value={vendorName}
                            onChange={(e) => setVendorName(e.target.value)}
                            required
                        />
                    </label>

                    <label>
                        Item Name
                        <input
                            type="text"
                            value={itemName}
                            onChange={(e) => setItemName(e.target.value)}
                            required
                        />
                    </label>

                    <div className="new-quote-row">
                        <label>
                            Quote Amount
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={quoteAmount}
                                onChange={(e) => setQuoteAmount(e.target.value)}
                                required
                            />
                        </label>

                        <label>
                            Quantity
                            <input
                                type="number"
                                min="1"
                                step="1"
                                value={itemQuantity}
                                onChange={(e) => setItemQuantity(e.target.value)}
                                required
                            />
                        </label>
                    </div>

                    <label>
                        Item Description
                        <textarea
                            value={itemDescription}
                            onChange={(e) => setItemDescription(e.target.value)}
                            rows={3}
                        />
                    </label>

                    {error && (
                        <p className="new-quote-error">
                            Could not reach backend — is it running on {API_BASE}?
                        </p>
                    )}

                    <div className="new-quote-actions">
                        <button type="button" className="btn btn-outline" onClick={onClose} disabled={submitting}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={submitting}>
                            {submitting ? 'Submitting…' : 'Submit Vendor Quote'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NewQuote;
