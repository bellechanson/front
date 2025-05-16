import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { updateUserInfo, logout } from '../../store/authSlice';
import "../../style/user/MyPage.css";
import "../../style/user/modal.css";
import "../../style/user/deleteAccount.css";
import MyInfoSection from './MyInfoSection';
import DeleteAccountSection from './DeleteAccountSection';
import StudyGroupSection from '../group/StudyGroupSection';
import MyPostsSection from '../board/MyPostsSection';
import { getManagedGroups, getJoinedGroups } from '../../api/GroupServiceApi';
import api from "../../api/api.js"; // ✅ 추가

const MyPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [user, setUser] = useState(null);
    const [selectedMenu, setSelectedMenu] = useState('info');
    const [error, setError] = useState('');
    const [managedGroups, setManagedGroups] = useState([]);
    const [joinedGroups, setJoinedGroups] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            alert("로그인이 필요합니다.");
            navigate("/login");
            return;
        }

        api.get('/api/users/me', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => {
                dispatch(updateUserInfo({
                    Name: res.data.uName,
                    Email: res.data.uEmail,
                    Role: res.data.uRole
                }));

                setUser({
                    name: res.data.uName,
                    email: res.data.uEmail,
                    role: res.data.uRole,
                    deletedAt: res.data.deletedAt ? new Date(res.data.deletedAt).toLocaleString() : null
                });
            })
            .catch(error => {
                console.error('사용자 정보 조회 실패:', error);
                if (error.response?.status === 401) {
                    alert("로그인이 만료되었습니다. 다시 로그인해주세요.");
                    navigate("/login");
                }
            });

        fetchStudyGroups();
    }, [navigate]);

    const fetchStudyGroups = async () => {
        try {
            const userState = JSON.parse(localStorage.getItem('userState'));
            const email = typeof userState?.user === 'string'
                ? JSON.parse(userState.user)?.email
                : userState?.user?.email;

            if (!email) {
                console.error('이메일이 없습니다.');
                return;
            }

            const [managedRes, joinedRes] = await Promise.all([
                getManagedGroups(email, 0, 10),
                getJoinedGroups(email, 0, 10)
            ]);

            setManagedGroups(managedRes.data.content);
            setJoinedGroups(joinedRes.data.content);
        } catch (error) {
            console.error('스터디 그룹 요청 실패:', error);
            setError('스터디 그룹 정보를 불러오는데 실패했습니다.');
        }
    };

    if (!user) return <div>로딩 중...</div>;

    return (
        <div className="mypage-wrapper">
            <nav className="sidebar">
                <h2>마이페이지</h2>
                <ul>
                    <li className={selectedMenu === 'info' ? 'active' : ''} onClick={() => setSelectedMenu('info')}>내 정보</li>
                    <li className={selectedMenu === 'study' ? 'active' : ''} onClick={() => setSelectedMenu('study')}>스터디 그룹</li>
                    <li className={selectedMenu === 'post' ? 'active' : ''} onClick={() => setSelectedMenu('post')}>내 게시글</li>
                    <li className={selectedMenu === 'delete' ? 'active' : ''} onClick={() => setSelectedMenu('delete')}>회원 탈퇴</li>
                </ul>
            </nav>
            <main className="main-content">
                {selectedMenu === 'info' && <MyInfoSection />}
                {selectedMenu === 'study' && (
                    <StudyGroupSection
                        managedGroups={managedGroups}
                        joinedGroups={joinedGroups}
                    />
                )}
                {selectedMenu === 'post' && <MyPostsSection email={user.email} />}
                {selectedMenu === 'delete' && <DeleteAccountSection />}
            </main>
        </div>
    );
};

export default MyPage;
