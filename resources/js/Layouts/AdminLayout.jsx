import { Link, usePage } from '@inertiajs/react';
import {
    ChevronUp,
    ClipboardList,
    ExternalLink,
    Globe,
    Languages,
    LayoutDashboard,
    LogOut,
    Menu,
    Package,
    ScrollText,
    Shield,
    User,
    Users,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import AdminToast from '@/Components/Admin/AdminToast';

const NAV_ITEMS = [
    { route: 'admin.dashboard', label: 'Dashboard', permission: 'dashboard.view', icon: LayoutDashboard },
    { route: 'admin.submissions.index', label: 'Submissions', permission: 'submissions.view', icon: ClipboardList },
    { route: 'admin.products.index', label: 'Products', permission: 'products.view', icon: Package },
    { route: 'admin.translations.index', label: 'Translations', permission: 'translations.view', icon: Languages },
    { route: 'admin.languages.index', label: 'Languages', permission: 'languages.view', icon: Globe },
    { route: 'admin.users.index', label: 'Users', permission: 'users.manage', icon: Users },
    { route: 'admin.roles.index', label: 'Roles', permission: 'roles.manage', icon: Shield },
    { route: 'admin.audit.index', label: 'Audit Log', permission: 'audit.view', icon: ScrollText },
];

function canAccess(permissions, permission) {
    return permissions?.includes(permission);
}

function isActive(routeName) {
    return route().current(routeName) || route().current(`${routeName}.*`);
}

function formatRole(role) {
    if (!role) {
        return 'Admin';
    }

    return role
        .split('-')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');
}

export default function AdminLayout({ title, children, actions }) {
    const { auth } = usePage().props;
    const permissions = auth?.user?.permissions ?? [];
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const profileRef = useRef(null);

    const userInitial = auth?.user?.name?.charAt(0)?.toUpperCase() ?? 'A';
    const userRole = formatRole(auth?.user?.roles?.[0]);

    const visibleNav = NAV_ITEMS.filter((item) => canAccess(permissions, item.permission));

    useEffect(() => {
        if (!profileOpen) {
            return undefined;
        }

        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setProfileOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [profileOpen]);

    return (
        <div className="adm-root">
            <AdminToast />

            {sidebarOpen && (
                <div className="adm-sidebar-overlay" onClick={() => setSidebarOpen(false)} />
            )}

            <aside className={`adm-sidebar ${sidebarOpen ? 'is-open' : ''}`}>
                <div className="adm-sidebar-brand">
                    <img src="/images/static/bison-logo.png" alt="Bison TradeWorks" />
                </div>

                <nav className="adm-nav">
                    {visibleNav.map(({ route: routeName, label, icon: Icon }) => (
                        <Link
                            key={routeName}
                            href={route(routeName)}
                            className={`adm-nav-link ${isActive(routeName) ? 'is-active' : ''}`}
                            onClick={() => setSidebarOpen(false)}
                        >
                            <Icon size={18} />
                            {label}
                        </Link>
                    ))}
                </nav>

                <div className="adm-sidebar-footer">
                    <div className={`adm-user-menu ${profileOpen ? 'is-open' : ''}`} ref={profileRef}>
                        <button
                            type="button"
                            className="adm-user-trigger"
                            onClick={() => setProfileOpen((open) => !open)}
                            aria-expanded={profileOpen}
                            aria-haspopup="true"
                        >
                            <div className="adm-user-avatar">{userInitial}</div>
                            <div className="adm-user-info">
                                <div className="adm-user-name">{auth?.user?.name}</div>
                                <div className="adm-user-role">{userRole}</div>
                            </div>
                            <ChevronUp size={16} className="adm-user-chevron" />
                        </button>

                        {profileOpen && (
                            <div className="adm-user-dropdown">
                                <Link
                                    href={route('profile.edit')}
                                    className="adm-user-dropdown-item"
                                    onClick={() => {
                                        setProfileOpen(false);
                                        setSidebarOpen(false);
                                    }}
                                >
                                    <User size={16} />
                                    Profile settings
                                </Link>
                                <Link
                                    href={route('logout')}
                                    method="post"
                                    as="button"
                                    className="adm-user-dropdown-item adm-user-dropdown-logout"
                                    onClick={() => setProfileOpen(false)}
                                >
                                    <LogOut size={16} />
                                    Log out
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </aside>

            <div className="adm-main">
                <header className="adm-topbar">
                    <div className="adm-topbar-start">
                        <button type="button" className="adm-mobile-toggle" onClick={() => setSidebarOpen(true)}>
                            <Menu size={22} />
                        </button>
                        {title && <h1 className="adm-topbar-title">{title}</h1>}
                    </div>
                    <div className="adm-topbar-actions">
                        {actions}
                        <Link href={route('home')} className="adm-btn adm-btn-ghost adm-btn-sm" target="_blank">
                            <ExternalLink size={14} />
                            View site
                        </Link>
                    </div>
                </header>

                <main className="adm-content">{children}</main>
            </div>
        </div>
    );
}
