export function authFetch(url: string, token: string, init: RequestInit = {}) {
    return fetch(url, {
        ...init,
        headers: {
            ...(init.headers || {}),
            Authorization: `Bearer ${token}`,
        },
    });
}
