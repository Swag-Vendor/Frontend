import { createContext, useContext, useState, ReactNode } from 'react';
import { API_BASE } from '../config';

const TOKEN_KEY = 'swagvendor_token';

interface AuthUser {
    userId: number;
    role: string;
}

interface AuthContextValue {
    token: string | null;
    user: AuthUser | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function decodeToken(token: string): AuthUser | null {
    try {
        const payload = token.split('.')[1];
        const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
        const data = JSON.parse(json);
        return { userId: data.userId, role: data.role };
    } catch {
        return null;
    }
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
    const [user, setUser] = useState<AuthUser | null>(() => {
        const stored = localStorage.getItem(TOKEN_KEY);
        return stored ? decodeToken(stored) : null;
    });

    const login = async (email: string, password: string) => {
        const res = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        if (!res.ok) {
            const body = await res.json().catch(() => ({}));
            throw new Error(body.error || 'Login failed');
        }
        const { token: newToken } = await res.json();
        localStorage.setItem(TOKEN_KEY, newToken);
        setToken(newToken);
        setUser(decodeToken(newToken));
    };

    const logout = () => {
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ token, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}
