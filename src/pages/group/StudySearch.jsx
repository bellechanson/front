import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../style/group/StudySearch.css';
import { getAllStudyGroupsPaged } from '../../api/GroupServiceApi'; // ✅ API 모듈 연결

function StudySearch() {
    const navigate = useNavigate();
    const [studies, setStudies] = useState([]);
    const [filteredStudies, setFilteredStudies] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [category, setCategory] = useState('all');
    const [location, setLocation] = useState('all');
    const [sortBy, setSortBy] = useState('latest');
    const [isLoading, setIsLoading] = useState(true);

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
            setIsLoading(true);
            try {
                const response = await getAllStudyGroupsPaged(0, 100); // ✅ API 호출 변경
                const data = response.data.content;
                setStudies(data);
                setFilteredStudies(data);
            } catch (error) {
                console.error('❌ 스터디 데이터 로딩 실패:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStudies();
    }, []);

    useEffect(() => {
        let filtered = studies;

        if (searchTerm) {
            filtered = filtered.filter(study =>
                study.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                study.description?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (category !== 'all') {
            filtered = filtered.filter(study => study.category === category);
        }

        if (location !== 'all') {
            filtered = filtered.filter(study => study.location === location);
        }

        switch (sortBy) {
            case 'members':
                filtered.sort((a, b) => b.currentMember - a.currentMember);
                break;
            case 'startDate':
                filtered.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
                break;
            default:
                filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }

        setFilteredStudies(filtered);
    }, [searchTerm, category, location, sortBy, studies]);

    const handleStudyClick = (studyId) => {
        navigate(`/study/${studyId}`);
    };

    if (isLoading) {
        return <div className="loading">로딩 중...</div>;
    }

    return (
        <div className="study-search">
            <div className="search-filters">
                <input
                    type="text"
                    placeholder="스터디 검색..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                    {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </select>
                <select value={location} onChange={(e) => setLocation(e.target.value)}>
                    {locations.map(loc => (
                        <option key={loc.id} value={loc.id}>{loc.name}</option>
                    ))}
                </select>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                    <option value="latest">최신순</option>
                    <option value="members">인원순</option>
                    <option value="startDate">시작일순</option>
                </select>
            </div>

            <div className="study-list">
                {filteredStudies.length === 0 ? (
                    <div className="no-results">검색 결과가 없습니다.</div>
                ) : (
                    filteredStudies.map(study => (
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
                                <span>지역: {locations.find(l => l.id === study.location)?.name || '-'}</span>
                                <span>인원: {study.currentMember}/{study.maxMember}</span>
                                <span>시작일: {study.startDate || '-'}</span>
                                <span>모임: {study.meetingDay?.join(', ') || '-'} {study.meetingTime || ''}</span>
                            </div>
                            <p className="study-description">{study.description}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default StudySearch;
