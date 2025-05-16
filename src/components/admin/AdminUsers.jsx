import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../style/admin/AdminUsers.css';
import api from "../../api/api.js";

function AdminUsers() {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // 모달 상태 관리
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    // 폼 데이터 상태
    const [formData, setFormData] = useState({
        uName: '',
        uEmail: '',
        uPassword: '',
        uRole: 'USER'
    });

    // 검색 상태
    const [searchUid, setSearchUid] = useState('');
    const [searchName, setSearchName] = useState('');
    const [searchEmail, setSearchEmail] = useState('');

    const fetchUsers = async (page = 0, uid = searchUid, name = searchName, email = searchEmail) => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                throw new Error('로그인이 필요합니다.');
            }
            const params = new URLSearchParams();
            params.append('page', page);
            params.append('size', 10);
            if (uid) params.append('uId', uid);
            if (name) params.append('uName', name);
            if (email) params.append('uEmail', email);
            const res = await api.get(`/api/admin/users?${params.toString()}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(Array.isArray(res.data.users) ? res.data.users : []);
            setTotalPages(res.data.totalPages);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    };

    const handleError = (err) => {
        setUsers([]);
        if (err.response) {
            if (err.response.status === 401) {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                navigate('/login', { state: { message: '세션이 만료되었습니다. 다시 로그인해주세요.' } });
            } else {
                setError(`서버 오류: ${err.response.data.message || '알 수 없는 오류가 발생했습니다.'}`);
            }
        } else if (err.request) {
            setError('서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.');
        } else {
            setError(err.message || '사용자 목록을 불러오지 못했습니다.');
        }
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('accessToken');
            await api.post('/api/admin/users', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setShowCreateModal(false);
            setFormData({ uName: '', uEmail: '', uPassword: '', uRole: 'USER' });
            fetchUsers(page);
            alert('사용자가 성공적으로 생성되었습니다.');
        } catch (err) {
            handleError(err);
        }
    };

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('accessToken');
            await api.put(`/api/admin/users/${selectedUser.uId}`, {
                uName: formData.uName,
                uRole: formData.uRole
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setShowEditModal(false);
            setSelectedUser(null);
            setFormData({ uName: '', uEmail: '', uPassword: '', uRole: 'USER' });
            fetchUsers(page);
            alert('사용자 정보가 성공적으로 수정되었습니다.');
        } catch (err) {
            handleError(err);
        }
    };

    const handleDeleteUser = async (uId) => {
        if (!window.confirm('정말로 이 사용자를 삭제하시겠습니까?')) return;

        try {
            const token = localStorage.getItem('accessToken');
            await api.delete(`/api/admin/users/${uId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchUsers(page);
            alert('사용자가 성공적으로 삭제되었습니다.');
        } catch (err) {
            handleError(err);
        }
    };

    const openEditModal = (user) => {
        setSelectedUser(user);
        setFormData({
            uName: user.uName,
            uEmail: user.uEmail,
            uRole: user.uRole
        });
        setShowEditModal(true);
    };

    // 검색 핸들러
    const handleSearch = (e) => {
        e.preventDefault();
        setPage(0);
        fetchUsers(0, searchUid, searchName, searchEmail);
    };

    useEffect(() => {
        fetchUsers(page, searchUid, searchName, searchEmail);
    }, [page]);

    return (
        <div className="users-section">
            <h3>사용자 관리</h3>
            <form className="search-form" onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <input
                    type="number"
                    placeholder="UID"
                    value={searchUid}
                    onChange={e => setSearchUid(e.target.value)}
                    style={{ width: '100px' }}
                />
                <input
                    type="text"
                    placeholder="이름"
                    value={searchName}
                    onChange={e => setSearchName(e.target.value)}
                    style={{ width: '120px' }}
                />
                <input
                    type="text"
                    placeholder="이메일"
                    value={searchEmail}
                    onChange={e => setSearchEmail(e.target.value)}
                    style={{ width: '180px' }}
                />
                <button type="submit">검색</button>
                <button type="button" onClick={() => { setSearchUid(''); setSearchName(''); setSearchEmail(''); setPage(0); fetchUsers(0, '', '', ''); }}>초기화</button>
            </form>
            <button className="create-button" onClick={() => setShowCreateModal(true)}>
                새 사용자 추가
            </button>

            {loading ? (
                <p>로딩 중...</p>
            ) : error ? (
                <div className="error-message">
                    {error}
                </div>
            ) : (
                <>
                    <table className="user-table">
                        <thead>
                        <tr>
                            <th>UID</th>
                            <th>이름</th>
                            <th>이메일</th>
                            <th>권한</th>
                            <th>관리</th>
                        </tr>
                        </thead>
                        <tbody>
                        {users.map((user) => (
                            <tr key={user.uId}>
                                <td>{user.uId}</td>
                                <td>{user.uName}</td>
                                <td>{user.uEmail}</td>
                                <td>{user.uRole}</td>
                                <td>
                                    <button onClick={() => openEditModal(user)}>수정</button>
                                    <button onClick={() => handleDeleteUser(user.uId)}>삭제</button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    <div className="pagination">
                        <button onClick={() => setPage(page - 1)} disabled={page === 0}>이전</button>
                        <span>{page + 1} / {totalPages}</span>
                        <button onClick={() => setPage(page + 1)} disabled={page >= totalPages - 1}>다음</button>
                    </div>
                </>
            )}

            {/* 생성 모달 */}
            {showCreateModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>새 사용자 추가</h3>
                        <form onSubmit={handleCreateUser}>
                            <div>
                                <label>이름:</label>
                                <input
                                    type="text"
                                    value={formData.uName}
                                    onChange={(e) => setFormData({...formData, uName: e.target.value})}
                                    required
                                />
                            </div>
                            <div>
                                <label>이메일:</label>
                                <input
                                    type="email"
                                    value={formData.uEmail}
                                    onChange={(e) => setFormData({...formData, uEmail: e.target.value})}
                                    required
                                />
                            </div>
                            <div>
                                <label>비밀번호:</label>
                                <input
                                    type="password"
                                    value={formData.uPassword}
                                    onChange={(e) => setFormData({...formData, uPassword: e.target.value})}
                                    required
                                />
                            </div>
                            <div>
                                <label>권한:</label>
                                <select
                                    value={formData.uRole}
                                    onChange={(e) => setFormData({...formData, uRole: e.target.value})}
                                >
                                    <option value="USER">일반 사용자</option>
                                    <option value="ADMIN">관리자</option>
                                </select>
                            </div>
                            <div className="modal-buttons">
                                <button type="submit">생성</button>
                                <button type="button" onClick={() => setShowCreateModal(false)}>취소</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* 수정 모달 */}
            {showEditModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>사용자 정보 수정</h3>
                        <form onSubmit={handleUpdateUser}>
                            <div>
                                <label>이름:</label>
                                <input
                                    type="text"
                                    value={formData.uName}
                                    onChange={(e) => setFormData({...formData, uName: e.target.value})}
                                    required
                                />
                            </div>
                            <div>
                                <label>이메일:</label>
                                <input
                                    type="email"
                                    value={formData.uEmail}
                                    disabled
                                />
                            </div>
                            <div>
                                <label>권한:</label>
                                <select
                                    value={formData.uRole}
                                    onChange={(e) => setFormData({...formData, uRole: e.target.value})}
                                >
                                    <option value="USER">일반 사용자</option>
                                    <option value="ADMIN">관리자</option>
                                </select>
                            </div>
                            <div className="modal-buttons">
                                <button type="submit">수정</button>
                                <button type="button" onClick={() => setShowEditModal(false)}>취소</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminUsers; 