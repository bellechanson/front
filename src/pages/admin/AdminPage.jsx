import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AdminUsers from '../../components/admin/AdminUsers';
import '../../style/admin/AdminPage.css';
import BoardManagement from "../board/BoardManagement.jsx";
import StudyGroupManagement from "./StudyGroupManagement.jsx";

function AdminPage() {
    const navigate = useNavigate();
    const user = useSelector(state => state.auth.user);
    const [selectedMenu, setSelectedMenu] = useState('dashboard');

    useEffect(() => {
        if (user?.role !== "ADMIN") {
            navigate("/");
        }
    }, [user, navigate]);

    return (
        <div className="admin-page">
            <nav className="admin-sidebar">
                <h2>관리자 페이지</h2>
                <ul>
                    <li 
                        className={selectedMenu === 'dashboard' ? 'active' : ''} 
                        onClick={() => setSelectedMenu('dashboard')}
                    >
                        대시보드
                    </li>
                    <li 
                        className={selectedMenu === 'users' ? 'active' : ''} 
                        onClick={() => setSelectedMenu('users')}
                    >
                        사용자 관리
                    </li>
                    <li 
                        className={selectedMenu === 'boards' ? 'active' : ''} 
                        onClick={() => setSelectedMenu('boards')}
                    >
                        게시판 관리
                    </li>
                    <li 
                        className={selectedMenu === 'studies' ? 'active' : ''} 
                        onClick={() => setSelectedMenu('studies')}
                    >
                        스터디 관리
                    </li>
                </ul>
            </nav>
            <main className="admin-content">
                {selectedMenu === 'dashboard' && (
                    <div className="dashboard-section">
                        <h3>대시보드</h3>
                        <div className="dashboard-stats">
                            <div className="stat-card">
                                <h4>전체 사용자</h4>
                                <p>0명</p>
                            </div>
                            <div className="stat-card">
                                <h4>전체 게시글</h4>
                                <p>0개</p>
                            </div>
                            <div className="stat-card">
                                <h4>전체 스터디</h4>
                                <p>0개</p>
                            </div>
                        </div>
                    </div>
                )}
                {selectedMenu === 'users' && <AdminUsers />}
                {selectedMenu === 'boards' && <BoardManagement />}
                {selectedMenu === 'studies' && <StudyGroupManagement/> }
            </main>
        </div>
    );
}

export default AdminPage; 