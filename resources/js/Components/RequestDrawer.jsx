import { Link } from '@inertiajs/react';
import { useEffect } from 'react';
import { X } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { closeRequest, removeRequestItem, setRequestQty, useRequestCart } from '@/requestCart';

export default function RequestDrawer() {
    const t = useTranslation();
    const { items, open } = useRequestCart();
    const text = (key, fallback) => t(`catalog.${key}`, fallback);

    useEffect(() => {
        if (!open) {
            return undefined;
        }

        const onKey = (event) => {
            if (event.key === 'Escape') {
                closeRequest();
            }
        };

        document.addEventListener('keydown', onKey);
        document.body.classList.add('bt-locked');

        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.classList.remove('bt-locked');
        };
    }, [open]);

    if (!open) {
        return null;
    }

    return (
        <div className="bt-req-wrap" onClick={(event) => { if (event.target === event.currentTarget) closeRequest(); }}>
            <aside className="bt-req" role="dialog" aria-modal="true" aria-labelledby="request-title">
                <div className="bt-req-head">
                    <h2 id="request-title">
                        {text('request_title', 'Your request')}
                        {items.length > 0 && <span className="bt-req-count">{items.length}</span>}
                    </h2>
                    <button type="button" className="bt-req-x" onClick={closeRequest} aria-label={text('close', 'Close')}>
                        <X size={18} />
                    </button>
                </div>
                <div className="bt-req-body">
                    {items.length === 0 ? (
                        <div className="bt-req-empty">
                            <p>{text('request_empty', 'Your request is empty. Open any product in the catalog and choose Add to request.')}</p>
                            <Link href={route('catalogue')} className="bt-btn bt-btn-solid" onClick={closeRequest}>
                                {text('browse', 'Browse the catalog')}
                            </Link>
                        </div>
                    ) : (
                        <>
                            <ul className="bt-req-list">
                                {items.map((item, index) => (
                                    <li className="bt-req-item" key={`${item.sku}-${index}`}>
                                        <span className="bt-req-img">
                                            {item.image ? <img src={item.image} alt="" /> : <span>{text('soon', 'Photo coming soon')}</span>}
                                        </span>
                                        <span className="bt-req-copy">
                                            <span className="bt-req-name">{item.name}</span>
                                            <span className="bt-req-meta">{[item.variant, item.sku].filter(Boolean).join(' · ')}</span>
                                        </span>
                                        <label className="bt-req-qty">
                                            <span>{text('qty', 'Qty')}</span>
                                            <input
                                                type="number"
                                                min="1"
                                                inputMode="numeric"
                                                value={item.qty}
                                                placeholder="–"
                                                aria-label={`${text('qty', 'Qty')} ${item.name}`}
                                                onChange={(event) => setRequestQty(index, event.target.value)}
                                            />
                                        </label>
                                        <button
                                            type="button"
                                            className="bt-req-remove"
                                            aria-label={`${text('remove', 'Remove')}: ${item.name}`}
                                            onClick={() => removeRequestItem(index)}
                                        >
                                            <X size={16} />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                            <p className="bt-req-note">{text('qty_note', 'Quantities are optional. An estimate helps us quote accurately.')}</p>
                        </>
                    )}
                </div>
                {items.length > 0 && (
                    <div className="bt-req-foot">
                        <Link href={route('contact.request')} className="bt-btn bt-btn-solid" onClick={closeRequest}>
                            {text('continue', 'Continue to request')}
                        </Link>
                    </div>
                )}
            </aside>
        </div>
    );
}
