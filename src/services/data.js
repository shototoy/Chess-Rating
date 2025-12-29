
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
    };
};

const handleResponse = async (response) => {
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error || 'API request failed');
    }
    return data.data;
};

const mapPlayer = (p) => ({
    id: p.id,
    firstName: p.first_name,
    lastName: p.last_name,
    title: p.title,
    rapid: p.rapid_rating,
    bYear: p.birth_year
});

const mapPlayerPayload = (p) => ({
    id: p.id,
    firstName: p.firstName,
    lastName: p.lastName,
    title: p.title,
    rapidRating: p.rapid,
    bYear: p.bYear
});


export const getPlayers = async ({ page = 1, limit = 50, sortBy = 'rapid_rating', order = 'desc' } = {}) => {
    try {
        const params = new URLSearchParams({
            page,
            limit,
            sortBy,
            order
        });
        const response = await fetch(`${API_URL}/players?${params}`, { headers: getHeaders() });
        const list = await handleResponse(response);
        return list.map(mapPlayer);
    } catch (error) {
        console.error('getPlayers error:', error);
        return [];
    }
};

export const searchPlayers = async (query, page = 1, limit = 50, sortBy = 'rapid_rating', order = 'desc') => {
    try {
        const params = new URLSearchParams({
            q: query,
            page,
            limit,
            sortBy,
            order
        });
        const response = await fetch(`${API_URL}/players/search?${params}`, { headers: getHeaders() });
        const list = await handleResponse(response);
        return list.map(mapPlayer);
    } catch (error) {
        console.error('searchPlayers error:', error);
        return [];
    }
};

export const addPlayer = async (player) => {
    const response = await fetch(`${API_URL}/players`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(mapPlayerPayload(player))
    });
    await handleResponse(response);
    return getPlayers();
};

export const updatePlayer = async (player) => {
    const response = await fetch(`${API_URL}/players/${player.id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(mapPlayerPayload(player))
    });
    await handleResponse(response);
    return getPlayers();
};

export const deletePlayer = async (id) => {
    const response = await fetch(`${API_URL}/players/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
    });
    await handleResponse(response);
    return getPlayers();
};


const mapNews = (n) => ({
    id: n.id,
    title: n.title,
    subtitle: n.subtitle,
    category: n.category,
    body: n.body,
    date: new Date(n.created_at).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
    })
});


export const getNews = async () => {
    try {
        const response = await fetch(`${API_URL}/news`, { headers: getHeaders() });
        const list = await handleResponse(response);
        return list.map(mapNews);
    } catch (error) {
        console.error('getNews error:', error);
        return [];
    }
};

export const addNews = async (newsItem) => {
    const response = await fetch(`${API_URL}/news`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(newsItem)
    });
    await handleResponse(response);
    return getNews();
};

export const deleteNews = async (id) => {
    const response = await fetch(`${API_URL}/news/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
    });
    await handleResponse(response);
    return getNews();
};

export const getLogs = async () => {
    try {
        const response = await fetch(`${API_URL}/logs`, { headers: getHeaders() });
        return handleResponse(response);
    } catch (error) {
        console.error('getLogs error:', error);
        return [];
    }
};

export const loginUser = async (password) => {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error || 'Login failed');
    }
    return data;
};
