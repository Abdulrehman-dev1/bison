import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useEffect, useRef } from 'react';

export default function Login({ status, canResetPassword }) {
    const emailRef = useRef(null);
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        emailRef.current?.focus();
    }, []);

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout
            title="Sign in"
            subtitle="Enter your credentials to access the admin panel."
        >
            <Head title="Log in" />

            {status && <div className="auth-status">{status}</div>}

            <form onSubmit={submit} className="auth-form">
                <div className="adm-form-group">
                    <label htmlFor="email" className="adm-label">
                        Email
                    </label>
                    <input
                        ref={emailRef}
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="adm-input"
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                    />
                    {errors.email && (
                        <p className="adm-error-text">{errors.email}</p>
                    )}
                </div>

                <div className="adm-form-group">
                    <label htmlFor="password" className="adm-label">
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="adm-input"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                    />
                    {errors.password && (
                        <p className="adm-error-text">{errors.password}</p>
                    )}
                </div>

                <div className="auth-form-row">
                    <label className="auth-checkbox">
                        <input
                            type="checkbox"
                            name="remember"
                            checked={data.remember}
                            onChange={(e) =>
                                setData('remember', e.target.checked)
                            }
                        />
                        <span>Remember me</span>
                    </label>

                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="auth-link"
                        >
                            Forgot password?
                        </Link>
                    )}
                </div>

                <button
                    type="submit"
                    className="adm-btn adm-btn-copper auth-submit"
                    disabled={processing}
                >
                    {processing ? 'Signing in…' : 'Sign in'}
                </button>
            </form>
        </GuestLayout>
    );
}
