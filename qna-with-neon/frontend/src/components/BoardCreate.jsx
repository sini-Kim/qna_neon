import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../apiClient';
import Sidebar from './Sidebar';
import useAuth from '../hooks/useAuth';

export default function BoardCreate() {
  const { user, loading: authLoading, authChecked } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 인증 체크 중이거나 인증 안 됐으면 로딩 또는 빈 화면 처리
  if (authLoading) {
    return (
      <div style={styles.pageContainer}>
        <p>Loading...</p>
      </div>
    );
  }
  if (!authChecked) {
    // useAuth 훅에서 로그인 리다이렉트 처리하므로 여기선 null 반환
    return null;
  }

const handleSubmit = async () => {
  if (title.trim().length < 5) {
    setError('Title must be at least 5 characters long.');
    return;
  }

  if (!title.trim() || !content.trim()) {
    setError('Title and content are required.');
    return;
  }

  setLoading(true);
  setError('');
  try {
    await apiClient.post('/questions', { title, content });
    navigate('/board');
  } catch (err) {
    console.error(err);
    setError(err.response?.data?.message || 'Failed to create post.');
  } finally {
    setLoading(false);
  }
};

  return (
    <div style={styles.fullscreenContainer}>
      <Sidebar user={user} />
      <main style={styles.mainContent}>
        <div style={styles.headerContainer}>
          <h1 style={styles.title}>Create a New Post</h1>
        </div>

        {error && <p style={styles.error}>{error}</p>}

        <div style={{ marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="Post Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={styles.searchInput}
            disabled={loading}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <textarea
            placeholder="Write your post content here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={12}
            style={{
              ...styles.searchInput,
              resize: 'vertical',
              padding: '14px 20px',
              fontFamily: 'inherit',
            }}
            disabled={loading}
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={styles.writeButton}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = '#0056b3'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = '#007bff'}
          aria-label="Submit new post"
        >
          {loading ? 'Posting...' : 'Post'}
        </button>
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
