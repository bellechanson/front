import { useNavigate } from "react-router-dom";
import { useState } from "react";
import '../style/Home.css';
import ClickableBox from "../components/ClickableBox.jsx";
import StudyCardList from "../components/group/StudyCardList.jsx"; // 🔥 추가

function Home() {
    const navigate = useNavigate();
    const [keyword, setKeyword] = useState("");

    const handleKeyDown = (event) => {
        if (event.key === "Enter" && keyword.trim() !== "") {
            navigate(`/study/search?keyword=${encodeURIComponent(keyword.trim())}`);
        }
    };

    const handleSearchClick = () => {
        if (keyword.trim() !== "") {
            navigate(`/study/search?keyword=${encodeURIComponent(keyword.trim())}`);
        }
    };

    return (
        <div className="home-page">
            <h1>STUDYLOG</h1>
            <div className="search-box">
                <input
                    type="text"
                    placeholder="스터디 그룹을 찾아보세요"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <button className="home-search-button" onClick={handleSearchClick}>
                    <img src="/images/Search.jpg" alt="검색" />
                </button>
            </div>

            <div className="click-box">
                <ClickableBox to="https://www.kyobobook.co.kr" imageSrc="/images/kyobo.png" title="교보문고" />
                <ClickableBox to="https://www.yes24.com" imageSrc="/images/yes24.png" title="YES24" />
                <ClickableBox to="https://www.riss.kr" imageSrc="/images/riss.png" title="RISS" />
                <ClickableBox to="https://www.dbpia.co.kr" imageSrc="/images/dbpia.png" title="DBpia" />
                <ClickableBox to="https://www.nl.go.kr" imageSrc="/images/nl.png" title="국립중앙도서관" />
            </div>

            {/* 🔽 최신 스터디 카드 목록 */}
            <h4 style={{ marginTop: '50px' }}>최신 스터디 모집글</h4>
            <div>
                <StudyCardList />
            </div>
        </div>
    );
}

export default Home;
