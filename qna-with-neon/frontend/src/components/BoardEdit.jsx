import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../apiClient';
import Sidebar from './Sidebar';

export default function BoardEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState({ title: '', content: '' });
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 인증 확인
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.exp * 1000 < Date.now()) {
        navigate('/login');
      } else {
        setAuthChecked(true);
      }
    } catch {
      navigate('/login');
    }
  }, [navigate]);

  // 사용자 정보 로드
  useEffect(() => {
    if (!authChecked) return;
    apiClient.get('/auth/me')
      .then(res => setUser(res.data))
      .catch(() => setUser(null));
  }, [authChecked]);

  // 게시글 데이터 로드
  useEffect(() => {
    if (!authChecked) return;
    setLoading(true);
    apiClient.get(`/questions/${id}`)
      .then(res => setPost({ title: res.data.title, content: res.data.content }))
      .catch(err => setError(err.response?.data?.error || 'Failed to load the post.'))
      .finally(() => setLoading(false));
  }, [authChecked, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPost(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    apiClient.put(`/questions/${id}`, post)
      .then(() => {
        alert('글이 수정되었습니다.');
        navigate(`/board/${id}`);
      })
      .catch(() => setError('수정 중 오류가 발생했습니다.'));
  };

  if (!authChecked) {
    return (
      <div style={styles.pageContainer}>
        <p>Checking authentication...</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={styles.pageContainer}>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div style={styles.fullscreenContainer}>
      <Sidebar user={user} />
      <main style={styles.mainContent}>
        <header style={styles.headerContainer}>
          <h1 style={styles.title}>게시글 수정하기</h1>
          <button
            style={styles.writeButton}
            onClick={() => navigate(-1)}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#0056b3'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#007bff'}
          >
            ← 돌아가기
          </button>
        </header>

        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            placeholder="제목을 입력하세요"
            value={post.title}
            onChange={handleChange}
            style={styles.searchInput}
            required
          />
          <textarea
            name="content"
            placeholder="내용을 입력하세요"
            value={post.content}
            onChange={handleChange}
            rows={12}
            style={{ ...styles.searchInput, resize: 'vertical', marginTop: '16px', minHeight: '200px' }}
            required
          />
          <button
            type="submit"
            style={{ ...styles.writeButton, marginTop: '20px' }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#0056b3'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#007bff'}
          >
            수정 완료
          </button>
        </form>
      </main>
    </div>
  );
}

const styles = {
  fullscreenContainer: {
    display: 'flex',
    minHeight: '100vh',
    width: '100vw',
    backgroundColor: '#f8f9fa',
    margin: 0,
    padding: 0,
    boxSizing: 'border-box',
    overflowX: 'hidden',
  },
  mainContent: {
    flex: 1,
    padding: '40px 40px',
    boxSizing: 'border-box',
    width: '100%',
    maxWidth: '100%',
    minWidth: 0,
  },
  headerContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    paddingBottom: '10px',
    borderBottom: '2px solid #007bff',
  },
  title: {
    fontSize: '1.8rem',
    fontWeight: '700',
    color: '#333',
    margin: 0,
  },
  writeButton: {
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    padding: '10px 16px',
    fontSize: '0.95rem',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  searchInput: {
    width: '100%',
    padding: '14px 20px 14px 18px',
    fontSize: '1rem',
    border: '2px solid #007bff',
    borderRadius: '8px',
    outline: 'none',
    boxSizing: 'border-box',
    display: 'block',
    maxWidth: '100%',
  },
  error: {
    color: '#d93025',
    textAlign: 'center',
    marginBottom: '20px',
  },
  pageContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    boxSizing: 'border-box',
    padding: '20px',
  },
};




