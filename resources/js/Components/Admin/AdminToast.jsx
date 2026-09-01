import { useEffect, useState } from 'react';
import { usePage } from '@inertiajs/react';
import { CheckCircle2, X, XCircle } from 'lucide-react';

export default function AdminToast() {
    const { flash, errors } = usePage().props;
    const [toasts, setToasts] = useState([]);

    useEffect(() => {
        const newToasts = [];

        if (flash?.success) {
            newToasts.push({
                id: Date.now(),
                type: 'success',
                title: 'Success',
                message: typeof flash.success === 'string' ? flash.success : 'Operation completed successfully.',
            });
        }

        if (flash?.error) {
            newToasts.push({
                id: Date.now() + 1,
                type: 'error',
                title: 'Error',
                message: flash.error,
            });
        }

        const errorMessages = errors ? Object.values(errors).flat() : [];
        if (errorMessages.length > 0) {
            newToasts.push({
                id: Date.now() + 2,
                type: 'error',
                title: 'Validation Error',
                message: errorMessages[0],
            });
        }

        if (newToasts.length > 0) {
            setToasts((prev) => [...prev, ...newToasts]);
        }
    }, [flash?.success, flash?.error, errors]);

    useEffect(() => {
        if (toasts.length === 0) return;

        const timer = setTimeout(() => {
            setToasts((prev) => prev.slice(1));
        }, 5000);

        return () => clearTimeout(timer);
    }, [toasts]);

    const dismiss = (id) => setToasts((prev) => prev.filter((t) => t.id !== id));

    if (toasts.length === 0) return null;

    return (
        <div className="adm-toast-container" aria-live="polite">
            {toasts.map((toast) => (
                <div key={toast.id} className={`adm-toast adm-toast-${toast.type}`}>
                    <span className="adm-toast-icon">
                        {toast.type === 'success' ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
                    </span>
                    <div className="adm-toast-body">
                        <p className="adm-toast-title">{toast.title}</p>
                        <p className="adm-toast-msg">{toast.message}</p>
                    </div>
                    <button type="button" className="adm-toast-close" onClick={() => dismiss(toast.id)} aria-label="Dismiss">
                        <X size={16} />
                    </button>
                </div>
            ))}
        </div>
    );
}
