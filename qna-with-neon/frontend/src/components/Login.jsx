// frontend/src/components/Login.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, register } from '../auth'; // auth.js 경로 확인

export default function Login() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 로그인 상태
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // 회원가입 상태
  const [registerData, setRegisterData] = useState({
    email: '',
    nickname: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (mode === 'login') {
      setFormData(prev => ({ ...prev, [name]: value }));
    } else {
      setRegisterData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await login(formData.e, formData.password);
      console.log('로그인 응답:', result);

      if (result.token) {
        localStorage.setItem('token', result.token);
        alert('로그인 성공!');
        navigate('/board');
      } else {
        setError('로그인에 실패했습니다.');
      }
    } catch (err) {
      setError(err.response?.data?.message || '로그인 실패');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');


    try {
      const registrationData = {
        email: registerData.email,
        nickname: registerData.nickname,
        password: registerData.password,
      };

      await register(registrationData);
      alert('회원가입 성공! 로그인 페이지로 이동합니다.');
      setMode('login');
      setRegisterData({
        email: '',
        nickname: '',
        password: ''
      });
    } catch (err) {
      setError(err.response?.data?.message || '회원가입 실패');
    } finally {
      setLoading(false);
    }
  };

  // 스타일
  const styles = {
    outerContainer: {
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgb(240, 242, 245)',
      padding: '10px',
      boxSizing: 'border-box',
    },
    middleContainer: {
      minHeight: '100vh',
      backgroundColor: 'rgb(240, 242, 245)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '10px',
      boxSizing: 'border-box',
      width: '100%',
    },
    box: {
      backgroundColor: 'white',
      padding: '40px 30px',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      width: '100%',
      maxWidth: '400px',
      minWidth: '320px',
      boxSizing: 'border-box',
      minHeight: '480px', // 적절한 높이 설정
    },
    title: {
      marginBottom: '25px',
      textAlign: 'center',
      color: '#333',
      fontWeight: '700',
      fontSize: '1.8rem',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
    },
    input: {
      height: '44px',
      marginBottom: '15px',
      padding: '0 12px',
      fontSize: '1rem',
      borderRadius: '4px',
      border: '1px solid #ccc',
      outline: 'none',
      transition: 'border-color 0.2s',
    },
    button: {
      height: '44px',
      backgroundColor: '#007bff',
      color: 'white',
      fontWeight: '600',
      fontSize: '1rem',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      marginTop: '10px',
      transition: 'background-color 0.3s',
    },
    buttonHover: {
      backgroundColor: '#0056b3',
    },
    error: {
      color: '#d93025',
      marginBottom: '15px',
      fontSize: '0.9rem',
      backgroundColor: '#fdecea',
      padding: '10px',
      borderRadius: '4px',
    },
    switchText: {
      marginTop: '15px',
      fontSize: '0.9rem',
      color: '#555',
      textAlign: 'center',
    },
    switchButton: {
      background: 'none',
      border: 'none',
      color: '#007bff',
      cursor: 'pointer',
      fontWeight: '600',
      padding: 0,
      fontSize: '0.9rem',
    },
  };

  return (
    <div style={styles.outerContainer}>
      <div style={styles.middleContainer}>
        <div style={styles.box}>
          <h2 style={styles.title}>{mode === 'login' ? '로그인' : '회원가입'}</h2>

          {mode === 'login' ? (
            <form onSubmit={handleLoginSubmit} style={styles.form}>
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="이메일"
                required
                style={styles.input}
                autoComplete="email"
              />
              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="비밀번호"
                required
                style={styles.input}
                autoComplete="current-password"
              />
              {error && <div style={styles.error}>{error}</div>}
              <button type="submit" disabled={loading} style={styles.button}>
                {loading ? '로그인 중...' : '로그인'}
              </button>
              <p style={styles.switchText}>
                계정이 없으신가요?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setError('');
                  }}
                  style={styles.switchButton}
                >
                  회원가입
                </button>
              </p>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} style={styles.form}>
              <input
                name="email"
                type="email"
                value={registerData.email}
                onChange={handleChange}
                placeholder="이메일"
                required
                style={styles.input}
                autoComplete="email"
              />
              <input
                name="nickname"
                value={registerData.nickname}
                onChange={handleChange}
                placeholder="닉네임"
                required
                style={styles.input}
              />
              <input
                name="password"
                type="password"
                value={registerData.password}
                onChange={handleChange}
                placeholder="비밀번호"
                required
                style={styles.input}
                autoComplete="new-password"
              />
              {error && <div style={styles.error}>{error}</div>}
              <button type="submit" disabled={loading} style={styles.button}>
                {loading ? '회원가입 중...' : '회원가입'}
              </button>
              <p style={styles.switchText}>
                이미 계정이 있으신가요?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setError('');
                  }}
                  style={styles.switchButton}
                >
                  로그인
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
