import axios from 'axios';

const TOKEN_KEY = 'sim_play_token';

export function getToken() {
    return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
    if (token) {
        localStorage.setItem(TOKEN_KEY, token);
    } else {
        localStorage.removeItem(TOKEN_KEY);
    }
}

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        Accept: 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            setToken(null);
            window.dispatchEvent(new Event('auth:unauthorized'));
        }
        return Promise.reject(error);
    },
);

export default api;

// Laravel returns 422 { message, errors: { field: [messages] } } for validation
// failures. Forms want { field: 'first message' } to display inline.
export function validationErrors(error) {
    const errors = error.response?.data?.errors;
    if (!errors) {
        return {};
    }
    return Object.fromEntries(
        Object.entries(errors).map(([field, messages]) => [field, messages[0]]),
    );
}

export function errorMessage(error, fallback = 'Something went wrong. Please try again.') {
    return error.response?.data?.message || fallback;
}

