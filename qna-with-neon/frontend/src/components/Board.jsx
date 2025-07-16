import React, { useEffect, useState } from 'react';
import apiClient from '../apiClient';
import Sidebar from './Sidebar'; // 경로 확인 필요
import { useNavigate } from 'react-router-dom';

export default function Board() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [authChecked, setAuthChecked] = useState(false);
  const navigate = useNavigate();

  // 인증 상태 확인 및 토큰 유효성 검사
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

  // 인증 확인 후 사용자 정보 로드
  useEffect(() => {
    if (!authChecked) return;

    apiClient.get('/auth/me')
      .then(res => setUser(res.data))
      .catch(() => setUser(null));
  }, [authChecked]);

  // 인증 확인 후 게시글 데이터 로드
  useEffect(() => {
    if (!authChecked) return;

    setLoading(true);
    setError('');
    apiClient.get('/questions')
      .then(res => {
        const data = Array.isArray(res.data) ? res.data : (res.data.content || []);
        setPosts(data);
        setFilteredPosts(data);
      })
      .catch(err => {
        setError(err.response?.data?.message || 'An error occurred while loading posts.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [authChecked]);

  // 검색어 변경 시 필터링
  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    const filtered = posts.filter(post =>
      (post.title && post.title.toLowerCase().includes(query.toLowerCase())) ||
      (post.content && post.content.toLowerCase().includes(query.toLowerCase()))
    );
    setFilteredPosts(filtered);
  };

  if (!authChecked) {
    return (
      <div style={styles.pageContainer}>
        <p style={{ textAlign: 'center', marginTop: '40px' }}>Checking authentication...</p>
      </div>
    );
  }

  return (
    <div style={styles.fullscreenContainer}>
      <Sidebar user={user} />
      <main style={styles.mainContent}>
        <header style={styles.headerContainer}>
          <h1 style={styles.title}>Board</h1>
          <button
            style={styles.writeButton}
            onClick={() => navigate('/write')}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#0056b3'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#007bff'}
            aria-label="Write a post"
          >
            ✏️ Write a Post
          </button>
        </header>

        <div style={styles.searchContainer}>
          <input
            type="text"
            placeholder="🔍 Enter search keywords..."
            value={searchQuery}
            onChange={handleSearch}
            style={styles.searchInput}
            aria-label="Search posts"
          />
        </div>

        <section style={{ minHeight: '300px' }}>
          {loading && <p style={{ textAlign: 'center' }}>Loading...</p>}
          {error && <p style={styles.error}>{error}</p>}

          {!loading && !error && (
            <ul style={styles.list} aria-live="polite" aria-relevant="additions removals">
              {filteredPosts.length === 0 && <li>No posts available.</li>}
				{filteredPosts.map(post => (
				  <li
					key={post.id}
					style={styles.listItem}
					tabIndex={0}
					aria-label={`Post title: ${post.title}`}
					onClick={() => navigate(`/pos/${post.id}`)}
				  >
					<h3 style={styles.postTitle}>{post.title}</h3>
					<p style={styles.postContent}>{post.content}</p>
				  </li>
				))}

            </ul>
          )}
        </section>
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
  pageContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingTop: '40px',
    paddingBottom: '40px',
    paddingLeft: '20px',
    paddingRight: '20px',
    backgroundColor: '#f8f9fa',
    minHeight: '100vh',
    boxSizing: 'border-box',
  },
  mainContent: {
    flex: 1,
    padding: '40px 10px',
    boxSizing: 'border-box',
    maxWidth: '100%',
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
  searchContainer: {
    marginBottom: '20px',
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
  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    maxHeight: 'calc(100vh - 220px)',
    overflowY: 'auto',
  },
  listItem: {
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    padding: '15px',
    marginBottom: '15px',
    backgroundColor: '#fafafa',
    transition: 'background-color 0.2s',
  },
  postTitle: {
    margin: '0 0 8px 0',
    fontSize: '1.2rem',
    color: '#007bff',
  },
  postContent: {
    margin: 0,
    color: '#555',
    fontSize: '0.95rem',
  },
};
