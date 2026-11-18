import { useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import RequestDrawer from '@/Components/RequestDrawer';
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
            <RequestDrawer />
        </div>
    );
}
