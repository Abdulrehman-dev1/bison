import { Link } from '@inertiajs/react';
import { Eye, Pencil, Trash2 } from 'lucide-react';

export function IconAction({ href, onClick, variant = 'view', label, method, as }) {
    const icons = { view: Eye, edit: Pencil, delete: Trash2 };
    const Icon = icons[variant] ?? Eye;

    const className = `adm-icon-btn ${variant}`;

    if (href) {
        return (
            <Link href={href} className={className} title={label} aria-label={label}>
                <Icon size={16} />
            </Link>
        );
    }

    return (
        <button type="button" className={className} onClick={onClick} title={label} aria-label={label}>
            <Icon size={16} />
        </button>
    );
}

export function IconActions({ children }) {
    return <div className="adm-table-actions">{children}</div>;
}
