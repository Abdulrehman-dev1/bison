import { useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import Footer from './Footer';
import Header from './Header';

export default function AppLayout({ children }) {
    const { url } = usePage();

    useEffect(() => {
        window.scrollTo({ top: 0 });
    }, [url]);

    return (
        <div className="bt-root">
            <Header />
            <main>{children}</main>
            <Footer />
        </div>
    );
}
