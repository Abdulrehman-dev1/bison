import { Link, router, usePage } from '@inertiajs/react';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

const NAV_ROUTES = [
    { route: 'brands', key: 'brands' },
    { route: 'retailers', key: 'retailers' },
    { route: 'manufacturers', key: 'manufacturers' },
    { route: 'about', key: 'about' },
    { route: 'contact', key: 'contact' },
];

function LocaleToggle() {
    const { locale, availableLocales } = usePage().props;

    const switchLocale = (nextLocale) => {
        if (nextLocale === locale) {
            return;
        }

        router.post(route('locale.update'), { locale: nextLocale }, { preserveScroll: true });
    };

    return (
        <div className="bt-locale-toggle" aria-label="Language">
            {availableLocales.map((item, index) => {
                const code = typeof item === 'string' ? item : item.code;
                const label = typeof item === 'string' ? item.toUpperCase() : (item.native_name ?? item.code).slice(0, 2).toUpperCase();

                return (
                    <span key={code} style={{ display: 'contents' }}>
                        {index > 0 && <span className="bt-locale-sep">|</span>}
                        <button
                            type="button"
                            className={`bt-locale-btn ${locale === code ? 'is-active' : ''}`}
                            onClick={() => switchLocale(code)}
                        >
                            {label}
                        </button>
                    </span>
                );
            })}
        </div>
    );
}

export default function Header() {
    const { translations } = usePage().props;
    const nav = translations?.nav ?? {};
    const [open, setOpen] = useState(false);

    const isActive = (routeName) => route().current(routeName);

    return (
        <header className="bt-header">
            <div className="bt-wrap bt-header-inner">
                <Link href={route('home')} className="bt-brand" onClick={() => setOpen(false)}>
                    <img
                        src="/images/static/bison-logo.png"
                        alt="Bison TradeWorks"
                        className="bt-logo-img"
                    />
                </Link>

                <div className="bt-nav-cluster">
                    <nav className="bt-nav" aria-label="Primary">
                        {NAV_ROUTES.map(({ route: routeName, key }) => (
                            <Link
                                key={key}
                                href={route(routeName)}
                                className={`bt-nav-link ${isActive(routeName) ? 'is-active' : ''}`}
                            >
                                {nav[key] ?? key}
                            </Link>
                        ))}
                    </nav>

                    <div className="bt-nav-cta">
                        <LocaleToggle />
                        <Link href={route('contact.request')} className="bt-btn bt-btn-solid">
                            {nav.start_request ?? 'Start a Request'}
                        </Link>
                    </div>
                </div>

                <div className="bt-mobile-actions">
                    <button
                        type="button"
                        className="bt-menu-toggle"
                        onClick={() => setOpen((value) => !value)}
                        aria-label="Toggle menu"
                        aria-expanded={open}
                    >
                        {open ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>
            </div>

            {open && (
                <div className="bt-nav-mobile">
                    {NAV_ROUTES.map(({ route: routeName, key }) => (
                        <Link
                            key={key}
                            href={route(routeName)}
                            className={`bt-nav-mobile-link ${isActive(routeName) ? 'is-active' : ''}`}
                            onClick={() => setOpen(false)}
                        >
                            {nav[key] ?? key}
                        </Link>
                    ))}
                    <LocaleToggle />
                    <Link
                        href={route('contact.request')}
                        className="bt-btn bt-btn-solid"
                        onClick={() => setOpen(false)}
                    >
                        {nav.start_request ?? 'Start a Request'}
                    </Link>
                </div>
            )}
        </header>
    );
}
