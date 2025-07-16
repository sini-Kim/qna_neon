import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Sidebar({ user }) {
  const navigate = useNavigate();

  return (
    <aside style={styles.sidebar}>
      <div style={styles.userInfo}>
        <h2 style={styles.userName}>{user?.ㅜ || 'User'}</h2>
        <p style={styles.userEmail}>{user?.email || 'None'}</p>
      </div>

      <nav style={styles.navMenu}>
        <button style={styles.navButton} onClick={() => navigate('/mypage')}>
          🧑 My page
        </button>
        <button style={styles.navButton} onClick={() => navigate('/logout')}>
          🚪 Logout
        </button>
      </nav>

      <footer style={styles.footer}>
        <small>© 2025 QnA Neon</small>
      </footer>
    </aside>
  );
}

const styles = {
  sidebar: {
    width: '220px',
    backgroundColor: '#007bff',
    color: 'white',
    padding: '30px 20px',
    boxSizing: 'border-box',
    borderRadius: '12px',
    display: 'flex',
    flexDirection: 'column',
    // justifyContent: 'space-between', // 기존에 공간 분배용으로 사용했음
    minHeight: '100vh',
  },
  userInfo: {
    textAlign: 'center',
    marginBottom: '30px',
  },
  userName: {
    margin: '0 0 8px 0',
    fontSize: '1.6rem',
    fontWeight: '700',
  },
  userEmail: {
    margin: 0,
    fontSize: '1rem',
    opacity: 0.85,
  },
  navMenu: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    marginTop: 0,       // 기본값으로 당김
    paddingTop: 0,      // 패딩 제거
  },
  navButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '12px 16px',
    fontSize: '1rem',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'background-color 0.3s',
  },
  footer: {
    marginTop: 'auto',  // 푸터를 아래로 밀기 위해 추가
    textAlign: 'center',
    fontSize: '0.8rem',
    opacity: 0.6,
  },
};