import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CustomCalendar from '../../components/group/Calendar.jsx';
import TodoList from '../../components/group/TodoList';
import { getTodos } from '../../todoApi'; // 기존 투두 API 유지
import ChatRoom from '../../components/group/ChatRoom';

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
        <div>
            <h1>{study.title}</h1>
            <div>
                <span>{study.category}</span> | <span>{study.location}</span> | <span>{study.currentMember}/{study.maxMember}명</span>
            </div>

            <h2>스터디 소개</h2>
            <p>{study.description}</p>

            <h2>모임 일정</h2>
            <p>방식: {study.meetingType === 'online' ? '온라인' : '오프라인'}</p>
            <p>요일: {Array.isArray(study.meetingDay) ? study.meetingDay.join(', ') : ''}</p>
            <p>시간: {study.meetingTime}</p>
            <p>기간: {study.startDate} ~ {study.endDate}</p>

            <h2>커리큘럼</h2>
            {curriculum.map((week, idx) => (
                <div key={idx}>
                    <h3>{week.week}주차: {week.title}</h3>
                    <ul>
                        {Array.isArray(week.topics) && week.topics.map((topic, i) => (
                            <li key={i}>{topic}</li>
                        ))}
                    </ul>
                </div>
            ))}

            <h2>참여 조건</h2>
            <ul>
                {Array.isArray(detail.requirements) && detail.requirements.map((req, idx) => (
                    <li key={idx}>{req}</li>
                ))}
            </ul>

            <h2>사용 도구</h2>
            <ul>
                {Array.isArray(detail.tools) && detail.tools.map((tool, idx) => (
                    <li key={idx}>{tool}</li>
                ))}
            </ul>

            <h2>스터디 혜택</h2>
            <ul>
                {Array.isArray(detail.benefits) && detail.benefits.map((b, idx) => (
                    <li key={idx}>{b}</li>
                ))}
            </ul>

            <h2>스터디장</h2>
            <p>작성자 ID: {study.ownerId}</p>

            {!isJoined &&
                study.currentMember < study.maxMember &&
                user?.email !== study.ownerId && (
                    <button onClick={handleJoinClick}>
                        참여하기
                    </button>
                )}

            {showJoinModal && (
                <div>
                    <h2>스터디 참여 신청</h2>
                    <form onSubmit={handleJoinSubmit}>
                        <textarea
                            value={joinMessage}
                            onChange={(e) => setJoinMessage(e.target.value)}
                            placeholder="참여 동기를 작성해주세요"
                            required
                        />
                        <div>
                            <button type="button" onClick={() => setShowJoinModal(false)}>취소</button>
                            <button type="submit">신청하기</button>
                        </div>
                    </form>
                </div>
            )}
            <CustomCalendar onDateChange={setSelectedDate} todos={todos} />
            <TodoList selectedDate={selectedDate} todos={todos} />
            {study && userEmail && userName && (
                <ChatRoom groupId={id} userEmail={userEmail} userName={userName} />
            )}
        </div>
    );
}

export default GroupMember;
