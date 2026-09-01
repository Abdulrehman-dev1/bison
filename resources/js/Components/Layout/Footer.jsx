import { Link } from '@inertiajs/react';

export default function Footer() {
    const year = new Date().getFullYear();

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
                                We source, place, and manage manufacturing relationships
                                in person, across any category, between Mexico, the US,
                                and Canada.
                            </p>
                        </div>

                        <div className="bt-footer-col">
                            <h4>Solutions</h4>
                            <Link href={route('brands')}>For Brands</Link>
                            <Link href={route('retailers')}>For Retailers</Link>
                            <Link href={route('manufacturers')}>For Manufacturers</Link>
                        </div>

                        <div className="bt-footer-col">
                            <h4>Company</h4>
                            <Link href={route('about')}>About</Link>
                            <Link href={route('contact')}>Contact</Link>
                        </div>

                        <div className="bt-footer-col">
                            <h4>Contact</h4>
                            <a href="mailto:contact@bisontradeworks.com">contact@bisontradeworks.com</a>
                            <a href="tel:+19787602805">(978) 760-2805</a>
                            <span>Texas, US · Guanajuato, MX</span>
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
