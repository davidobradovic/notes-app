const API_URL = 'https://triplexphoenix.davidtesla.online/api';

export async function login(username, password) {
    const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    });
    return res.json();
}

export async function fetchNotes(token) {
    const res = await fetch(`${API_URL}/notes`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
}

export async function createNote(token, title, content) {
    const res = await fetch(`${API_URL}/notes`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content }),
    });
    return res.json();
}

export async function updateNote(token, id, title, content) {
    const res = await fetch(`${API_URL}/notes/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content }),
    });
    return res.json();
}

export async function deleteNote(token, id) {
    await fetch(`${API_URL}/notes/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
    });
}