import apiClient from './apiClient';

export async function login(email, password) {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
}

export async function register(userData) {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
}

export async function getCurrentUser() {
    const response = await apiClient.get('/auth/me');
    return response.data;
}