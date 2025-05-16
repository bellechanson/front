import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    getManagedGroups,
    getJoinedGroups,
    getApplicantsByStudy,
    acceptMember
} from '../../api/GroupServiceApi'; // ✅ 그룹 서비스 API 모듈

const StudyGroupSection = () => {
    const [managedGroups, setManagedGroups] = useState([]);
    const [joinedGroups, setJoinedGroups] = useState([]);
    const [applicantsMap, setApplicantsMap] = useState({});
    const [error, setError] = useState('');
    const navigate = useNavigate(); // ✅ 네비게이션 훅 추가

    useEffect(() => {
        fetchGroups();
    }, []);

    const fetchGroups = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            const userState = JSON.parse(localStorage.getItem('userState'));
            const email = typeof userState?.user === 'string'
                ? JSON.parse(userState.user)?.email
                : userState?.user?.email;

            if (!email) {
                setError('이메일 정보를 찾을 수 없습니다.');
                return;
            }

            const [managedRes, joinedRes] = await Promise.all([
                getManagedGroups(email, 0, 10),
                getJoinedGroups(email, 0, 10)
            ]);

            setManagedGroups(managedRes.data.content);
            setJoinedGroups(joinedRes.data.content);

            // ✅ 신청자 목록 조회
            const applicantPromises = managedRes.data.content.map(group =>
                getApplicantsByStudy(group.id, 0, 10).then(res => ({
                    groupId: group.id,
                    applicants: res.data.content
                }))
            );

            const applicantResults = await Promise.all(applicantPromises);

            const map = {};
            applicantResults.forEach(({ groupId, applicants }) => {
                map[groupId] = applicants;
            });

            setApplicantsMap(map);
        } catch (err) {
            console.error('스터디 그룹 조회 실패:', err);
            setError('스터디 그룹 정보를 불러오지 못했습니다.');
        }
    };

    const handleAccept = async (memberId) => {
        try {
            const userState = JSON.parse(localStorage.getItem("userState"));
            const requesterEmail = typeof userState?.user === "string"
                ? JSON.parse(userState.user)?.email
                : userState?.user?.email;

            if (!requesterEmail) {
                alert("로그인 정보가 없습니다.");
                return;
            }

            await acceptMember(memberId, requesterEmail);
            alert("수락 완료");
            fetchGroups();
        } catch (err) {
            console.error("수락 실패:", err);
            alert("수락에 실패했습니다.");
        }
    };

    return (
        <div className="study-groups-section">
            <h3>내가 관리하는 스터디 그룹</h3>
            <div className="group-list">
                {managedGroups.length === 0 ? (
                    <p>관리 중인 스터디가 없습니다.</p>
                ) : (
                    managedGroups.map(group => (
                        <div
                            className="group-card"
                            key={group.id}
                            onClick={() => navigate(`/group/${group.id}`)} // ✅ 클릭 시 이동
                            style={{ cursor: 'pointer' }} // ✅ 마우스 커서
                        >
                            <h4>{group.title}</h4>
                            <p>상태: {group.status}</p>
                            <p>인원: {group.currentMember} / {group.maxMember}</p>
                            <p>시작일: {group.startDate}</p>

                            {/* ✅ 신청자 목록 */}
                            <div onClick={e => e.stopPropagation()}> {/* ✅ 내부 버튼 클릭 시 카드 클릭 막기 */}
                                <strong>신청자 목록</strong>
                                <div className="applicants">
                                    {applicantsMap[group.id]?.length > 0 ? (
                                        applicantsMap[group.id].map(applicant => (
                                            <div key={applicant.id} className="applicant-row">
                                                <span>{applicant.userName || applicant.userId}</span>
                                                <button
                                                    className="accept-btn"
                                                    onClick={(e) => {
                                                        e.stopPropagation(); // ✅ 버튼 클릭 시 부모 클릭 방지
                                                        handleAccept(applicant.id);
                                                    }}
                                                >
                                                    수락
                                                </button>
                                            </div>
                                        ))
                                    ) : (
                                        <p>신청자가 없습니다.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <h3>내가 소속된 스터디 그룹</h3>
            <div className="group-list">
                {joinedGroups.length === 0 ? (
                    <p>소속된 스터디가 없습니다.</p>
                ) : (
                    joinedGroups.map(group => (
                        <div
                            className="group-card"
                            key={group.id}
                            onClick={() => navigate(`/study/${group.id}`)} // ✅ 이동
                            style={{ cursor: 'pointer' }}
                        >
                            <h4>{group.title}</h4>
                            <p>상태: {group.status}</p>
                            <p>인원: {group.currentMember} / {group.maxMember}</p>
                            <p>시작일: {group.startDate}</p>
                        </div>
                    ))
                )}
            </div>

            {error && <div className="error-message">{error}</div>}
        </div>
    );
};

export default StudyGroupSection;
