import { FormEvent, useState } from 'react';
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
    const [error, setError] = useState('');

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        setSubmitting(true);
        setError('');

        try {
            const itemRes = await fetch(`${API_BASE}/swag-items`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: itemName.trim(),
                    description: itemDescription.trim(),
                    quantity: Number(itemQuantity),
                }),
            });
            if (!itemRes.ok) throw new Error('Failed to create item');
            const item = await itemRes.json();

            const quoteRes = await fetch(`${API_BASE}/quotes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    vendorName: vendorName.trim(),
                    unitPrice: Number(quoteAmount),
                    swagItemId: item.id,
                }),
            });
            if (!quoteRes.ok) throw new Error('Failed to create quote');

            onSubmitted();
        } catch (err) {
            setError('Something went wrong submitting the quote. Please try again.');
            setSubmitting(false);
        }
    };

    return (
        <div className="new-quote-overlay" onClick={onClose}>
            <div className="new-quote-modal" onClick={(event) => event.stopPropagation()}>
                <div className="new-quote-header">
                    <h2>New Vendor Quote</h2>
                    <button type="button" className="new-quote-close" onClick={onClose} aria-label="Close">&times;</button>
                </div>

                <form onSubmit={handleSubmit} className="new-quote-form">
                    <label>Vendor Name<input type="text" value={vendorName} onChange={(event) => setVendorName(event.target.value)} required /></label>
                    <label>Item Name<input type="text" value={itemName} onChange={(event) => setItemName(event.target.value)} required /></label>
                    <div className="new-quote-row">
                        <label>Quote Amount<input type="number" min="0" step="0.01" value={quoteAmount} onChange={(event) => setQuoteAmount(event.target.value)} required /></label>
                        <label>Quantity<input type="number" min="1" step="1" value={itemQuantity} onChange={(event) => setItemQuantity(event.target.value)} required /></label>
                    </div>
                    <label>Item Description<textarea value={itemDescription} onChange={(event) => setItemDescription(event.target.value)} rows={3} /></label>
                    {error && <p className="new-quote-error">{error}</p>}
                    <div className="new-quote-actions">
                        <button type="button" className="btn btn-outline" onClick={onClose} disabled={submitting}>Cancel</button>
                        <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting ? 'Submitting...' : 'Submit Vendor Quote'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NewQuote;
