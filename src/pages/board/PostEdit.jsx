import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../../style/board/PostEdit.css';
import {
    fetchPostById,
    updatePost,
    deletePost,
} from '../../api/boardApi'; // ✅ axios 대신 boardApi 사용

function PostEdit() {
    const { postId } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);

    useEffect(() => {
        fetchPostById(postId)
            .then((response) => {
                const postData = response.data;
                setPost({
                    title: postData.title,
                    content: postData.content,
                    nickname: postData.nickname,
                });
            })
            .catch((error) => {
                console.error('게시글 불러오기 실패:', error);
            });
    }, [postId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPost((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        updatePost(postId, post)
            .then(() => {
                alert('수정이 완료되었습니다.');
                navigate('/board');
            })
            .catch((error) => {
                console.error('수정 실패:', error);
                alert('수정 중 오류가 발생했습니다.');
            });
    };

    const handleDelete = () => {
        if (window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
            deletePost(postId)
                .then(() => {
                    alert('게시글이 삭제되었습니다.');
                    navigate('/board');
                })
                .catch((error) => {
                    console.error('삭제 실패:', error);
                    alert('삭제 중 오류가 발생했습니다.');
                });
        }
    };

    if (!post) return <div>로딩 중...</div>;

    return (
        <div className="post-edit-container">
            <h2>게시글 수정</h2>
            <form onSubmit={handleSubmit} className="post-edit-form">
                <div>
                    <label htmlFor="title">제목:</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={post.title}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="content">내용:</label>
                    <textarea
                        id="content"
                        name="content"
                        value={post.content}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="nickname">작성자:</label>
                    <input
                        type="text"
                        id="nickname"
                        name="nickname"
                        value={post.nickname}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <button type="submit">수정 완료</button>
            </form>

            <button onClick={handleDelete} className="delete-button">
                삭제하기
            </button>
        </div>
    );
}

export default PostEdit;
