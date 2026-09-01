import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';

export default function CtaBand({ heading, copy, primary, secondary }) {
    return (
        <section>
            <div className="bt-wrap">
                <div className="bt-cta-band">
                    <h2>{heading}</h2>
                    <p>{copy}</p>
                    <div className="bt-hero-ctas bt-cta-band-ctas">
                        <Link
                            href={primary.href}
                            className="bt-btn bt-btn-copper"
                        >
                            {primary.label} <ArrowRight size={16} />
                        </Link>
                        {secondary && (
                            <Link
                                href={secondary.href}
                                className="bt-btn bt-btn-line bt-btn-line-dark"
                            >
                                {secondary.label}
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
