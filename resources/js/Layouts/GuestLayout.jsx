import { Link } from '@inertiajs/react';

export default function GuestLayout({ children, title, subtitle }) {
    return (
        <div className="auth-root">
            <aside className="auth-aside" aria-hidden="true">
                <div className="auth-aside-inner">
                    <img
                        src="/images/static/bison-logo.png"
                        alt=""
                        className="auth-aside-logo"
                    />
                    <p className="auth-aside-tagline">
                        Admin access for Bison TradeWorks
                    </p>
                </div>
            </aside>

            <main className="auth-main">
                <div className="auth-main-inner">
                    <Link href="/" className="auth-brand">
                        <img
                            src="/images/static/bison-logo.png"
                            alt="Bison TradeWorks"
                        />
                    </Link>

                    <div className="auth-panel">
                        {(title || subtitle) && (
                            <header className="auth-header">
                                {title && <h1 className="auth-title">{title}</h1>}
                                {subtitle && (
                                    <p className="auth-subtitle">{subtitle}</p>
                                )}
                            </header>
                        )}

                        {children}
                    </div>

                    <Link href="/" className="auth-back-link">
                        ← Back to website
                    </Link>
                </div>
            </main>
        </div>
    );
}
