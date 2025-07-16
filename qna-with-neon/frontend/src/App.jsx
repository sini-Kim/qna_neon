// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Board from './components/Board';
import BoardDetail from './components/BoardDetail';
import BoardEdit from './components/BoardEdit';
import BoardCreate from './components/BoardCreate'; 
import MyPage from './components/MyPage';

function App() {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f2f5',
        padding: '20px',
        boxSizing: 'border-box',
      }}
    >
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/board" element={<Board />} />
		<Route path="/board/:id" element={<BoardDetail />} />
		<Route path="/board/:id/edit" element={<BoardEdit />} />
		<Route path="/write" element={<BoardCreate />} />
		<Route path="/members/memypage" element={<MyPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  );
}

export default App;
