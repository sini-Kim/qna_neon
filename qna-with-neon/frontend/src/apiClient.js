import axios from 'axios';

const API_BASE_URL = 'https://qna-neondb-algza.dev-k8s.arkain.io/api';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
});

// 요청 시 자동으로 Authorization 헤더에 토큰 추가 (토큰이 있으면)
apiClient.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default apiClient;