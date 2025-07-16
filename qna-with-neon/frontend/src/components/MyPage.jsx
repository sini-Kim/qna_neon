import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import apiClient from '../apiClient';

const MyPage = () => {
  const [authChecked, setAuthChecked] = useState(false);
  const [nickname, setNickname] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [myQuestions, setMyQuestions] = useState([]);
  const [likedQuestions, setLikedQuestions] = useState([]);
  const navigate = useNavigate();

  // 인증 체크
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

  // 유저 정보, 작성한 글, 좋아요 글 로드
  useEffect(() => {
    if (!authChecked) return;
    setLoading(true);
    setError('');

    Promise.all([
      apiClient.get('/auth/me'),
      apiClient.get('/mypage/questions'),
    ])
      .then(([userRes, myQuestionsRes, likedQuestionsRes]) => {
        setUser(userRes.data);
        setMyQuestions(myQuestionsRes.data);
        setError('');
      })
      .catch(err => {
        console.error(err);
        setError('마이페이지 데이터를 불러오는 데 실패했습니다.');
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [authChecked]);

  const updateNickname = async () => {
    try {
      await apiClient.put('/mypage/nickname', { nickname });
      setMessage('닉네임이 성공적으로 변경되었습니다.');
      setError('');
    } catch (e) {
      console.error(e.response);
      setError(e.response?.data?.error || '닉네임 변경 실패');
      setMessage('');
    }
  };

  const updatePassword = async () => {
    try {
      await apiClient.put('/mypage/password', { oldPassword, newPassword });
      setMessage('비밀번호가 성공적으로 변경되었습니다.');
      setError('');
      setOldPassword('');
      setNewPassword('');
    } catch (e) {
      console.error(e.response);
      setError(e.response?.data?.error || '비밀번호 변경 실패');
      setMessage('');
    }
  };

  if (loading) return <p>로딩 중...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div style={styles.container}>
      <Sidebar user={user} />
      <main style={styles.mainContent}>
        <div style={styles.formContainer}>
          <h2 style={styles.title}>마이페이지</h2>

          <label style={styles.label}>닉네임 수정</label>
          <input
            type="text"
            value={nickname}
            onChange={e => setNickname(e.target.value)}
            style={styles.input}
          />
          <button onClick={updateNickname} style={styles.button}>
            닉네임 변경
          </button>

          <div style={{ marginTop: 30 }}>
            <label style={styles.label}>비밀번호 변경</label>
            <input
              type="password"
              placeholder="현재 비밀번호"
              value={oldPassword}
              onChange={e => setOldPassword(e.target.value)}
              style={styles.input}
            />
            <input
              type="password"
              placeholder="새 비밀번호"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              style={styles.input}
            />
            <button onClick={updatePassword} style={styles.button}>
              비밀번호 변경
            </button>
          </div>

          {message && <p style={styles.messageSuccess}>{message}</p>}
          {error && <p style={styles.messageError}>{error}</p>}

          <div style={{ marginTop: 40 }}>
            <h3 style={styles.subTitle}>내가 작성한 글</h3>
            {myQuestions.length === 0 ? (
              <p>작성한 글이 없습니다.</p>
            ) : (
              <ul>
                {myQuestions.map(q => (
                  <li key={q.id} style={styles.listItem}>
                    <strong>{q.title}</strong> - {new Date(q.createdAt).toLocaleString()}
                  </li>
                ))}
              </ul>
            )}
          </div>

        </div>
      </main>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    width: '100vw',
    backgroundColor: '#f8f9fa',
  },
  mainContent: {
    flex: 1,
    padding: '40px 20px',
    boxSizing: 'border-box',
    overflowY: 'auto',
  },
  formContainer: {
    width: '90%',
    maxWidth: 700,
    margin: '20px auto',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
  },
  title: {
    fontSize: '2rem',
    fontWeight: '700',
    marginBottom: 20,
    color: '#222',
  },
  subTitle: {
    fontSize: '1.4rem',
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  label: {
    display: 'block',
    fontWeight: '600',
    marginBottom: 6,
  },
  input: {
    width: '90%',
    padding: 8,
    marginTop: 4,
    marginBottom: 10,
    borderRadius: 6,
    border: '1px solid #ccc',
    fontSize: '1rem',
  },
  button: {
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: 6,
    padding: '10px 14px',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'background-color 0.3s',
  },
  messageSuccess: {
    color: 'green',
    marginTop: 10,
  },
  messageError: {
    color: '#d93025',
    marginTop: 10,
  },
  listItem: {
    padding: '6px 0',
    borderBottom: '1px solid #eee',
  },
};

export default MyPage;



