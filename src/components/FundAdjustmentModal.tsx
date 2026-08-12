import { FormEvent, useState } from 'react';
// @ts-ignore: allow CSS side-effect import without type declarations
import './FundAdjustmentModal.css';
import { API_BASE } from '../config';

interface FundAdjustmentModalProps {
    mode: 'deposit' | 'expense';
    token: string;
    onClose: () => void;
    onSaved: () => void;
    onUnauthorized: () => void;
}

const COPY = {
    deposit: {
        title: 'Edit Master Fund',
        amountLabel: 'Amount to Add',
        notePlaceholder: 'e.g. Sponsor payment received',
        submitLabel: 'Add Funds',
    },
    expense: {
        title: 'Log Expense',
        amountLabel: 'Expense Amount',
        notePlaceholder: 'e.g. Venue deposit paid by card',
        submitLabel: 'Log Expense',
    },
};

const FundAdjustmentModal = ({ mode, token, onClose, onSaved, onUnauthorized }: FundAdjustmentModalProps) => {
    const [amount, setAmount] = useState('');
    const [note, setNote] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const copy = COPY[mode];

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        setSubmitting(true);
        setError('');

        const parsed = Number(amount);
        const signedAmount = mode === 'expense' ? -Math.abs(parsed) : Math.abs(parsed);

        try {
            const res = await fetch(`${API_BASE}/master-fund`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ amount: signedAmount, note: note.trim() || undefined }),
            });

            if (res.status === 401) {
                onUnauthorized();
                return;
            }
            if (!res.ok) {
                const body = await res.json().catch(() => ({}));
                throw new Error(body.error || 'Failed to save');
            }

            onSaved();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fund-modal-overlay" onClick={onClose}>
            <div className="fund-modal" onClick={(event) => event.stopPropagation()}>
                <div className="fund-modal-header">
                    <h2>{copy.title}</h2>
                    <button type="button" className="fund-modal-close" onClick={onClose} aria-label="Close">&times;</button>
                </div>

                <form onSubmit={handleSubmit} className="fund-modal-form">
                    <label>
                        {copy.amountLabel}
                        <input
                            type="number"
                            min="0.01"
                            step="0.01"
                            value={amount}
                            onChange={(event) => setAmount(event.target.value)}
                            required
                            autoFocus
                        />
                    </label>
                    <label>
                        Note
                        <input
                            type="text"
                            value={note}
                            onChange={(event) => setNote(event.target.value)}
                            placeholder={copy.notePlaceholder}
                        />
                    </label>
                    {error && <p className="fund-modal-error">{error}</p>}
                    <div className="fund-modal-actions">
                        <button type="button" className="btn btn-outline" onClick={onClose} disabled={submitting}>Cancel</button>
                        <button type="submit" className="btn btn-primary" disabled={submitting}>
                            {submitting ? 'Saving…' : copy.submitLabel}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FundAdjustmentModal;
