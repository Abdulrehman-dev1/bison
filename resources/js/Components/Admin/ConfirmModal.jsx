import { AlertTriangle } from 'lucide-react';

export default function ConfirmModal({ open, title, message, confirmLabel = 'Delete', onConfirm, onCancel, loading = false }) {
    if (!open) return null;

    return (
        <div className="adm-modal-overlay" onClick={onCancel}>
            <div className="adm-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
                <div className="adm-modal-icon">
                    <AlertTriangle size={22} />
                </div>
                <h3 className="adm-modal-title">{title}</h3>
                <p className="adm-modal-text">{message}</p>
                <div className="adm-modal-actions">
                    <button type="button" className="adm-btn adm-btn-ghost" onClick={onCancel} disabled={loading}>
                        Cancel
                    </button>
                    <button type="button" className="adm-btn adm-btn-primary" style={{ background: '#991b1b' }} onClick={onConfirm} disabled={loading}>
                        {loading ? 'Processing…' : confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}
