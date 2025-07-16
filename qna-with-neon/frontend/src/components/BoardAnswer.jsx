import React, { useEffect, useState } from 'react';
import apiClient from '../apiClient';

export default function BoardAnswer({ questionId, user }) {  // user를 props로 받음
  const [answers, setAnswers] = useState([]);
  const [answerContent, setAnswerContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingAnswerId, setEditingAnswerId] = useState(null);
  const [editedContent, setEditedContent] = useState('');

  // 현재 로그인한 유저 닉네임은 user.nickname에서 직접 사용
  // localStorage에서 꺼낼 필요 없음
  const currentUserNickname = user?.nickname;

  const fetchAnswers = () => {
    if (!questionId) return;
    apiClient.get(`/questions/${questionId}/answers`)
      .then(res => setAnswers(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchAnswers();
  }, [questionId]);

  // 답변 제출
  const handleAnswerSubmit = () => {
    if (!answerContent.trim()) return alert('내용을 입력하세요.');

    const token = localStorage.getItem('token');
    if (!token) {
      alert('로그인이 필요합니다.');
      return;
    }

    setLoading(true);
    apiClient.post(`/questions/${questionId}/answers`,
      { content: answerContent },
      { headers: { Authorization: `Bearer ${token}` } }
    )
      .then(() => {
        setAnswerContent('');
        fetchAnswers();
      })
      .catch(() => alert('답변 작성 실패'))
      .finally(() => setLoading(false));
  };

  // 답변 수정 시작
  const startEditing = (answer) => {
    setEditingAnswerId(answer.id);
    setEditedContent(answer.content);
  };

  // 답변 수정 취소
  const cancelEditing = () => {
    setEditingAnswerId(null);
    setEditedContent('');
  };

  // 답변 수정 완료
  const handleUpdate = (answerId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('로그인이 필요합니다.');
      return;
    }

    if (!editedContent.trim()) {
      alert('내용을 입력하세요.');
      return;
    }

    setLoading(true);
    apiClient.put(`/questions/${questionId}/answers/${answerId}`,
      { content: editedContent },
      { headers: { Authorization: `Bearer ${token}` } }
    )
      .then(() => {
        setEditingAnswerId(null);
        setEditedContent('');
        fetchAnswers();
      })
      .catch(() => alert('답변 수정 실패'))
      .finally(() => setLoading(false));
  };

  // 답변 삭제
  const handleDelete = (answerId) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;

    const token = localStorage.getItem('token');
    if (!token) {
      alert('로그인이 필요합니다.');
      return;
    }

    setLoading(true);
    apiClient.delete(`questions/${questionId}/answers/${answerId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => fetchAnswers())
      .catch(() => alert('답변 삭제 실패'))
      .finally(() => setLoading(false));
  };
	
  // 답변 토글
  const toggleAnswerLike = (answerId) => {
	  const token = localStorage.getItem('token');
	  if(!token) {
		  alert('로그인이 필요합니다.');
		  return;
	  }
	  
	  apiClient.post(`/questions`, {}, {
		  headers: { Authorization: `Bearer ${token}` }
	  })
	    .then((res) => {
		  setAnswers(prev =>
			prev.map(answer =>
				answer.id === answerId
					 ? {
			  			...answer,
			  			likedByUser: !answer.likedByUser,
			  			likeCount: res.data.likeCount,
		  			}
				: answer
			)
		);
	  })
	  .catch(() => alert('좋아요 처리 실패'));
  };

  return (
    <div style={{ maxWidth: 900, margin: '40px auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* 답변 작성 박스 */}
      <div style={{
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 24,
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: '600', color: '#222' }}>답변 작성</h2>
        <textarea
          rows={4}
          value={answerContent}
          onChange={e => setAnswerContent(e.target.value)}
          placeholder="질문에 대한 답변을 작성하세요."
          style={{
            width: '100%',
            borderRadius: 6,
            border: '1px solid #ccc',
            padding: 12,
            fontSize: 16,
            fontFamily: 'inherit',
            resize: 'vertical',
            boxSizing: 'border-box',
          }}
        />
        <button
          onClick={handleAnswerSubmit}
          disabled={loading}
          style={{
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            padding: '10px 16px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: 16,
            fontWeight: '600',
            alignSelf: 'flex-start',
            transition: 'background-color 0.3s',
          }}
        >
          {loading ? '등록 중...' : '답변 등록'}
        </button>
      </div>

      {/* 답변 리스트 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {answers.length === 0 && <p style={{ color: '#666', textAlign: 'center' }}>아직 등록된 답변이 없습니다.</p>}

        {answers.map(answer => (
          <div
            key={answer.id}
            style={{
              backgroundColor: '#fff',
              borderRadius: 10,
              padding: 20,
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              maxWidth: '100%',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#555' }}>
              <span>👤 {answer.writer}</span>
              <span>📅 {new Date(answer.createdAt).toLocaleString()}</span>
            </div>

            {editingAnswerId === answer.id ? (
              <>
                <textarea
                  rows={3}
                  value={editedContent}
                  onChange={e => setEditedContent(e.target.value)}
                  style={{
                    width: '100%',
                    borderRadius: 6,
                    border: '1px solid #ccc',
                    padding: 12,
                    fontSize: 16,
                    fontFamily: 'inherit',
                    resize: 'vertical',
                    boxSizing: 'border-box',
                  }}
                />
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => handleUpdate(answer.id)} disabled={loading}
                    style={{
                      backgroundColor: '#007bff',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 6,
                      padding: '6px 12px',
                      cursor: 'pointer',
                      fontSize: 14,
                      fontWeight: '500',
                    }}>
                    저장
                  </button>
                  <button onClick={cancelEditing}
                    style={{
                      backgroundColor: '#6c757d',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 6,
                      padding: '6px 12px',
                      cursor: 'pointer',
                      fontSize: 14,
                      fontWeight: '500',
                    }}>
                    취소
                  </button>
                </div>
              </>
            ) : (
              <>
                <p style={{ margin: 0, whiteSpace: 'pre-wrap', color: '#333', fontSize: 16, lineHeight: 1.5 }}>
                  {answer.content}
                </p>
                {answer.writer === currentUserNickname && (
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => startEditing(answer)}
                      style={{
                        backgroundColor: '#007bff',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 6,
                        padding: '6px 12px',
                        cursor: 'pointer',
                        fontSize: 14,
                        fontWeight: '500',
                      }}>
                      수정
                    </button>
                    <button onClick={() => handleDelete(answer.id)}
                      style={{
                        backgroundColor: '#ced4da',
                        color: '#333',
                        border: 'none',
                        borderRadius: 6,
                        padding: '6px 12px',
                        cursor: 'pointer',
                        fontSize: 14,
                        fontWeight: '500',
                      }}>
                      삭제
                    </button>
                  </div>
                )}
			  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
				  <button
					onClick={() => toggleAnswerLike(answer.id)}
					style={{
					  backgroundColor: answer.likedByUser ? '#e03131' : '#f1f3f5',
					  color: answer.likedByUser ? '#fff' : '#333',
					  border: 'none',
					  borderRadius: 6,
					  padding: '6px 12px',
					  cursor: 'pointer',
					  fontSize: 14,
					  fontWeight: '500',
					  alignSelf: 'flex-end',
					}}
				  >
					❤️ {answer.likeCount}
				  </button>
				</div>
			  </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}





