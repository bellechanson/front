import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CustomCalendar from '../../components/group/Calendar.jsx';
import TodoList from '../../components/group/TodoList';
import { getTodos } from '../../todoApi'; // 기존 투두 API 유지
import ChatRoom from '../../components/group/Chatroom.jsx';

import "../../style/group/GroupMember.css"

import {
    getStudyGroupById,
    getStudyDetail,
    getCurriculumsByStudy,
    applyToStudy
} from '../../api/GroupServiceApi'; // ✅ 그룹 서비스 API 호출



function GroupMember() {
    const { id } = useParams();
    const [study, setStudy] = useState(null);
    const [detail, setDetail] = useState(null);
    const [curriculum, setCurriculum] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isJoined, setIsJoined] = useState(false);
    const [showJoinModal, setShowJoinModal] = useState(false);
    const [joinMessage, setJoinMessage] = useState('');
    const [todos, setTodos] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());

    const [userEmail, setUserEmail] = useState('');
    const [userName, setUserName] = useState('');

    const userState = JSON.parse(localStorage.getItem('userState'));
    const user = typeof userState?.user === 'string'
        ? JSON.parse(userState.user)
        : userState?.user;

    useEffect(() => {
        const fetchStudyData = async () => {
            setIsLoading(true);
            try {
                const [groupRes, detailRes, curriculumRes] = await Promise.all([
                    getStudyGroupById(id),
                    getStudyDetail(id),
                    getCurriculumsByStudy(id, 0, 50)
                ]);

                setStudy(groupRes.data);
                setDetail(detailRes.data);
                setCurriculum(curriculumRes.data.content || []);
                setUserEmail(user.email);
                setUserName(user.name);
            } catch (err) {
                console.error('스터디 상세 정보 로딩 실패:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTodos();
        fetchStudyData();
    }, [id]);

    const fetchTodos = async () => {
        const response = await getTodos();
        setTodos(response.data);
    };

    const handleJoinClick = () => setShowJoinModal(true);

    const handleJoinSubmit = async (e) => {
        e.preventDefault();
        try {
            if (!user || !user.email) {
                alert('로그인이 필요합니다.');
                return;
            }

            await applyToStudy(id, user.email);

            setIsJoined(true);
            setShowJoinModal(false);
            alert('스터디 참여 신청이 완료되었습니다.');
        } catch (error) {
            console.error('참여 신청 실패:', error.response?.data || error.message);
            alert(error.response?.data?.message || '참여 신청 중 오류가 발생했습니다.');
        }
    };

    if (isLoading) return <div>로딩 중...</div>;
    if (!study || !detail) return <div>스터디를 찾을 수 없습니다.</div>;

    return (
        <div className="study-page">
            <h1 className="study-title">{study.title}</h1>

            <div className="study-info">
                <div className="study-category-location">
                    <span className="study-category">{study.category}</span> |
                    <span className="study-location">{study.location}</span>
                </div>
                <span className="study-members">{study.currentMember}/{study.maxMember}명</span>
            </div>

            <div className="study-sections">
                <div className="section">
                    <h2 className="section-title">스터디 소개</h2>
                    <p className="study-description">{study.description}</p>
                </div>

                <div className="section">
                    <h2 className="section-title">스터디장</h2>
                    <p className="study-owner">작성자 ID: {study.ownerId}</p>
                </div>
            </div>

            <div className="study-schedule">
                <h2 className="section-title">모임 일정</h2>
                <div className="schedule-details">
                    <p className="meeting-type">방식: {study.meetingType === 'online' ? '온라인' : '오프라인'}</p>
                    <p className="meeting-day">요일: {Array.isArray(study.meetingDay) ? study.meetingDay.join(', ') : ''}</p>
                    <p className="meeting-time">시간: {study.meetingTime}</p>
                    <p className="study-duration">기간: {study.startDate} ~ {study.endDate}</p>
                </div>
            </div>

            <div className="study-features">
                <div className="tools">
                    <h2 className="section-title">사용 도구</h2>
                    <ul className="tools-list">
                        {Array.isArray(detail.tools) && detail.tools.map((tool, idx) => (
                            <li key={idx} className="tool-item">{tool}</li>
                        ))}
                    </ul>
                </div>

                <div className="benefits">
                    <h2 className="section-title">스터디 혜택</h2>
                    <ul className="benefits-list">
                        {Array.isArray(detail.benefits) && detail.benefits.map((b, idx) => (
                            <li key={idx} className="benefit-item">{b}</li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className='todo-cont'>
                <CustomCalendar onDateChange={setSelectedDate} todos={todos} />
                <TodoList selectedDate={selectedDate} todos={todos} />
            </div>

            {study && userEmail && userName && (
                <ChatRoom groupId={id} userEmail={userEmail} userName={userName} />
            )}
        </div>
    );
}

export default GroupMember;
