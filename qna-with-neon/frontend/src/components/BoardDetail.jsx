import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../apiClient';
import Sidebar from './Sidebar';
import BoardAnswer from './BoardAnswer';

export default function BoardDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // 인증 상태 확인
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
	

  // 게시글 상세 데이터 로드
  useEffect(() => {
    if (!authChecked) return;
    setLoading(true);
    setError('');

    apiClient.get(`/questions/${id}`)
      .then(res => {
        setPost(res.data);
      })
      .catch(err => {
        setError(err.response?.data?.error || 'Failed to load the post.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [authChecked, id]);

  // 삭제 처리 함수
  const handleDelete = () => {
    if (!window.confirm('정말 이 글을 삭제하시겠습니까?')) return;

    apiClient.delete(`/questions/${id}`)
      .then(() => {
        alert('글이 삭제되었습니다.');
        navigate('/board'); // 삭제 후 이동 경로
      })
      .catch(() => {
        alert('삭제 중 오류가 발생했습니다.');
      });
  };

  // 좋아요 토글 함수
  const handleLikeToggle = () => {
    if (!user) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    if (!post) return;

    if (post.likedByUser) {
      // 좋아요 취소 API 호출
      apiClient.delete(`/questions/${id}/like`)
        .then(() => {
          setPost(prev => ({
            ...prev,
            likedByUser: false,
            likeCount: prev.likeCount - 1,
          }));
        })
        .catch(() => alert('좋아요 취소 실패'));
    } else {
      // 좋아요 API 호출
      apiClient.post(`/questions/${id}/like`)
        .then(() => {
          setPost(prev => ({
            ...prev,
            likedByUser: true,
            likeCount: prev.likeCount + 1,
          }));
        })
        .catch(() => alert('좋아요 실패'));
    }
  };

  if (!authChecked) {
    return (
      <div style={styles.pageContainer}>
        <p>Checking authentication...</p>
      </div>
    );
  }

  return (
    <div style={styles.fullscreenContainer}>
      <Sidebar nickname={user} />
      <main style={styles.mainContent}>
        {loading && <p>Loading post...</p>}
        {error && <p style={styles.error}>{error}</p>}

        {!loading && !error && post && (
          <div style={styles.postContainer}>
            <h1 style={styles.title}>{post.title}</h1>
            <div style={styles.meta}>
              <span>👤 {post.writerNickname}</span>
              <span>📅 {new Date(post.createdAt).toLocaleString()}</span>
              <span>👁️ {post.viewCount} views</span>
            </div>

            <p style={styles.content}>{post.content}</p>

            {/* 좋아요 버튼 */}
            <div style={styles.likeButtonContainer}>
              <button
                onClick={handleLikeToggle}
                style={{
                  backgroundColor: post.likedByUser ? '#dc3545' : '#6c757d',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '8px 16px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  userSelect: 'none',
                  transition: 'background-color 0.3s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.backgroundColor = post.likedByUser ? '#b02a37' : '#5a6268';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.backgroundColor = post.likedByUser ? '#dc3545' : '#6c757d';
                }}
              >
                {post.likedByUser ? '♥ 좋아요 취소' : '♡ 좋아요'} {post.likeCount}
              </button>
            </div>

            {/* 버튼 컨테이너 */}
            <div style={styles.buttonRow}>
              <button
                style={styles.backButton}
                onClick={() => navigate(-1)}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#0056b3'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = '#007bff'}
              >
                ← Back
              </button>

              {user && user.nickname === post.writerNickname && (
                <div style={styles.rightButtons}>
                  <button
                    style={styles.editButton}
                    onClick={() => navigate(`/board/${post.id}/edit`)}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#0056b3'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = '#007bff'}
                  >
                    ✏️ 글 수정하기
                  </button>

                  <button
                    style={styles.deleteButton}
                    onClick={handleDelete}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#adb5bd'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = '#ced4da'}
                  >
                    🗑️ 글 삭제하기
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
        <BoardAnswer questionId={id} user={user} />
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
    boxSizing: 'border-box',
  },
  pageContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f8f9fa',
  },
  mainContent: {
    flex: 1,
    padding: '40px 20px',
    boxSizing: 'border-box',
    width: '100%',
    maxWidth: 'none',
    minWidth: 0,
    overflowY: 'auto',
  },
  postContainer: {
    backgroundColor: '#fff',
    borderRadius: '10px',
    padding: '30px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
    width: '100%',
    maxWidth: '900px',
    margin: '0 auto',
  },
  title: {
    fontSize: '2rem',
    fontWeight: '700',
    margin: 0,
    color: '#222',
  },
  meta: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.95rem',
    color: '#555',
    flexWrap: 'wrap',
    gap: '6px',
  },
  content: {
    fontSize: '1.05rem',
    color: '#333',
    lineHeight: '1.7',
    whiteSpace: 'pre-wrap',
  },
  likeButtonContainer: {
    marginTop: '10px',
  },
  buttonRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '20px',
    width: '100%',
    maxWidth: '900px',
    alignItems: 'center',
  },
  rightButtons: {
    display: 'flex',
    gap: '12px',
  },
  backButton: {
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    padding: '10px 14px',
    cursor: 'pointer',
    fontSize: '0.95rem',
    transition: 'background-color 0.3s',
  },
  editButton: {
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    padding: '10px 14px',
    cursor: 'pointer',
    fontSize: '0.95rem',
    transition: 'background-color 0.3s',
  },
  deleteButton: {
    backgroundColor: '#ced4da',
    color: '#333',
    border: 'none',
    borderRadius: '6px',
    padding: '10px 14px',
    cursor: 'pointer',
    fontSize: '0.95rem',
    transition: 'background-color 0.3s',
  },
  error: {
    color: '#d93025',
    textAlign: 'center',
  },
};







