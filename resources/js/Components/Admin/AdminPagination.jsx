import { Link } from '@inertiajs/react';

export default function AdminPagination({ paginator, className = '' }) {
    if (! paginator?.links || paginator.links.length <= 3) {
        return null;
    }

    return (
        <div className={`adm-pagination ${className}`.trim()}>
            {paginator.links.map((link, index) => (
                <Link
                    key={`${link.label}-${index}`}
                    href={link.url ?? '#'}
                    className={`adm-page-link ${link.active ? 'is-active' : ''} ${!link.url ? 'is-disabled' : ''}`}
                    preserveState
                    preserveScroll
                    dangerouslySetInnerHTML={{ __html: link.label }}
                />
            ))}
        </div>
    );
}
