import { FormEvent, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
// @ts-ignore: allow CSS side-effect import without type declarations
import './Login.css';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = (location.state as { from?: { pathname: string } } | null)?.from?.pathname || '/dashboard';

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        setSubmitting(true);
        setError('');
        try {
            await login(email, password);
            navigate(from, { replace: true });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Login failed');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <main className="login-page">
            <form className="login-card" onSubmit={handleSubmit}>
                <h1>Log In</h1>
                <p className="subtitle">Sign in to edit the master fund and log expenses.</p>

                {error && <div className="login-error">{error}</div>}

                <label>
                    Email
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoFocus
                    />
                </label>

                <label>
                    Password
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </label>

                <button type="submit" className="btn btn-primary" disabled={submitting}>
                    {submitting ? 'Logging in…' : 'Log In'}
                </button>
            </form>
        </main>
    );
}

export default Login;
