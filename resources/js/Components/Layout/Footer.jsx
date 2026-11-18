import { Link, usePage } from '@inertiajs/react';

export default function Footer() {
    const year = new Date().getFullYear();
    const { translations } = usePage().props;
    const common = translations?.common ?? {};
    const nav = translations?.nav ?? {};

    return (
        <footer className="bt-footer">
            <div className="bt-wrap">
                <div className="bt-footer-panel">
                    <div className="bt-footer-grid">
                        <div className="bt-footer-brand-col">
                            <img
                                src="/images/static/bison-logo.png"
                                alt=""
                                className="bt-footer-mark"
                            />
                            <p className="bt-footer-tagline">
                                {common.footer_blurb ?? 'We source, place, and manage manufacturing relationships in person, across any category, between Mexico, the US, and Canada.'}
                            </p>
                        </div>

                        <div className="bt-footer-col">
                            <h4>{common.solutions ?? 'Solutions'}</h4>
                            <Link href={route('brands')}>{common.for_brands ?? 'For Brands'}</Link>
                            <Link href={route('retailers')}>{common.for_retailers ?? 'For Retailers'}</Link>
                            <Link href={route('manufacturers')}>{common.for_manufacturers ?? 'For Manufacturers'}</Link>
                        </div>

                        <div className="bt-footer-col">
                            <h4>{common.company_heading ?? 'Company'}</h4>
                            <Link href={route('about')}>{nav.about ?? 'About'}</Link>
                            <Link href={route('contact')}>{nav.contact ?? 'Contact'}</Link>
                        </div>

                        <div className="bt-footer-col">
                            <h4>{nav.contact ?? 'Contact'}</h4>
                            <a href="mailto:contact@bisontradeworks.com">contact@bisontradeworks.com</a>
                            <a href={`tel:${common.phone_tel ?? '+12144204152'}`}>{common.phone ?? '214-420-4152'}</a>
                            <span>{common.office_value ?? 'Texas, US · Guanajuato, MX'}</span>
                        </div>
                    </div>

                    <div className="bt-footer-bottom">
                        <span>© {year} Bison TradeWorks · Copper Bison Holdings</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
