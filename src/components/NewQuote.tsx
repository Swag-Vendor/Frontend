import { FormEvent, useState } from 'react';
import { VendorQuote } from '../VendorQuotes';
// @ts-ignore: allow CSS side-effect import without type declarations
import './NewQuote.css';

interface NewQuoteProps {
    onClose: () => void;
    onSubmitted: (quote: VendorQuote) => void;
}

const NewQuote = ({ onClose, onSubmitted }: NewQuoteProps) => {
    const [vendorName, setVendorName] = useState('');
    const [itemName, setItemName] = useState('');
    const [quoteAmount, setQuoteAmount] = useState('');
    const [itemQuantity, setItemQuantity] = useState('');
    const [itemDescription, setItemDescription] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        setSubmitting(true);

        onSubmitted({
            id: crypto.randomUUID(),
            vendorName: vendorName.trim(),
            itemName: itemName.trim(),
            quoteAmount: Number(quoteAmount),
            itemQuantity: Number(itemQuantity),
            itemDescription: itemDescription.trim(),
            submittedAt: new Date().toISOString(),
        });
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
