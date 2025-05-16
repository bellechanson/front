import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../style/board/PostCreate.css';
import {
    fetchCategoryList,
    fetchTags,
    createPost,
} from '../../api/boardApi'; // ✅ axios 대신 공통 API 사용

const PostCreate = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [author, setAuthor] = useState('');
    const [boardId, setBoardId] = useState('');
    const [boards, setBoards] = useState([]);
    const [tags, setTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);

    const navigate = useNavigate();
    const stored = JSON.parse(localStorage.getItem('userState'));
    const user = stored?.user;

    useEffect(() => {
        fetchCategoryList()
            .then((res) => setBoards(res.data))
            .catch((err) => console.error('보드 목록 불러오기 실패:', err));

        fetchTags()
            .then((res) => setTags(res.data))
            .catch((err) => console.error('태그 목록 불러오기 실패:', err));
    }, []);

    const handleTagChange = (e) => {
        const { value, checked } = e.target;
        if (checked) {
            setSelectedTags((prev) => [...prev, value]);
        } else {
            setSelectedTags((prev) => prev.filter((tag) => tag !== value));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!boardId) {
            alert('보드를 선택해주세요!');
            return;
        }

        const newPost = {
            title,
            content,
            nickname: author,
            authorId: user.email,
            board: { bId: Number(boardId) },
            tagNames: selectedTags,
        };

        createPost(boardId, newPost)
            .then((res) => {
                console.log('새로운 포스트가 저장되었습니다:', res.data);
                alert('포스트가 생성되었습니다!');
                setTitle('');
                setContent('');
                setAuthor('');
                setBoardId('');
                setSelectedTags([]);
                navigate('/board');
            })
            .catch((err) => {
                console.error('포스트 저장 실패:', err);
                alert('포스트 저장에 실패했습니다. 다시 시도해주세요.');
            });
    };

    return (
        <div className="post-create-container">
            <h2>포스트 생성</h2>
            <form onSubmit={handleSubmit} className="post-create-form">
                <div>
                    <label htmlFor="title">제목:</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="content">내용:</label>
                    <textarea
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="author">작성자:</label>
                    <input
                        type="text"
                        id="author"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="board">보드 선택:</label>
                    <select
                        id="board"
                        value={boardId}
                        onChange={(e) => setBoardId(e.target.value)}
                        required
                    >
                        <option value="">-- 보드 선택 --</option>
                        {boards.length > 0 ? (
                            boards.map((board) => (
                                <option key={board.bId} value={board.bId}>
                                    {board.category}
                                </option>
                            ))
                        ) : (
                            <option value="">보드를 불러오는 중...</option>
                        )}
                    </select>
                </div>

                <div className="tag-select-container">
                    <label>태그 선택:</label>
                    <div className="tag-list">
                        {tags.length > 0 ? (
                            tags.map((tag) => (
                                <div key={tag.id}>
                                    <input
                                        type="checkbox"
                                        id={`tag-${tag.id}`}
                                        className="tag-checkbox"
                                        value={tag.name}
                                        checked={selectedTags.includes(tag.name)}
                                        onChange={handleTagChange}
                                    />
                                    <label htmlFor={`tag-${tag.id}`} className="tag-label">
                                        {tag.name}
                                    </label>
                                </div>
                            ))
                        ) : (
                            <p>태그를 불러오는 중...</p>
                        )}
                    </div>
                </div>

                <button type="submit">포스트 생성</button>
            </form>
        </div>
    );
};

export default PostCreate;
