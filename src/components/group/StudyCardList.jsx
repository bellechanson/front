// src/components/group/StudyCardList.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllStudyGroupsPaged } from "../../api/GroupServiceApi";
import '../../style/group/NewStudyCard.css';

function StudyCardList() {
    const navigate = useNavigate();
    const [studies, setStudies] = useState([]);

    const categories = [
        { id: 'all', name: '전체' },
        { id: 'programming', name: '프로그래밍' },
        { id: 'language', name: '어학' },
        { id: 'certificate', name: '자격증' },
        { id: 'exam', name: '시험' }
    ];

    const locations = [
        { id: 'all', name: '전체' },
        { id: 'online', name: '온라인' },
        { id: 'seoul', name: '서울' },
        { id: 'gyeonggi', name: '경기' },
        { id: 'incheon', name: '인천' }
    ];

    useEffect(() => {
        const fetchStudies = async () => {
            try {
                const response = await getAllStudyGroupsPaged(0, 10); // 최신 10개만 불러옴
                setStudies(response.data.content);
            } catch (err) {
                console.error("🔥 스터디 목록 불러오기 실패", err);
            }
        };

        fetchStudies();
    }, []);

    const handleStudyClick = (studyId) => {
        navigate(`/study/${studyId}`);
    };

    if (studies.length === 0) {
        return <div className="no-results">검색 결과가 없습니다.</div>;
    }

    return (
        <div className="home-study-list">
            {studies.map(study => (
                <div
                    key={study.id}
                    className="study-card"
                    onClick={() => handleStudyClick(study.id)}
                >
                    <div className="study-card-header">
                        <h3>{study.title}</h3>
                        <span className="study-leader">스터디장: {study.ownerId || '알 수 없음'}</span>
                    </div>
                    <div className="study-info">
                        <span>카테고리: {categories.find(c => c.id === study.category)?.name || '-'}</span>
                    </div>
                    <p className="study-description">{study.description}</p>
                </div>
            ))}
        </div>
    );
}

export default StudyCardList;
