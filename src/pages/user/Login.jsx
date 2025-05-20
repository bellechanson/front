// pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../store/authSlice";
import axios from "axios";

import "../../style/user/Login.css";

function Login() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [uEmail, setUEmail] = useState("");
    const [uPassword, setUPassword] = useState("");
    const [error, setError] = useState("");
    const [showResetModal, setShowResetModal] = useState(false);



    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:8921/api/users/login", {
                uEmail,
                uPassword
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (res.data.deletedAt) {
                alert(res.data.message);
                navigate('/restore-account', { state: { email: uEmail } });
                return;
            }

            const { accessToken } = res.data;
            localStorage.setItem('accessToken', accessToken);
            axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

            const userResponse = await axios.get('http://localhost:8921/api/users/me', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            dispatch(loginSuccess({
                uName: userResponse.data.uName,
                uEmail: userResponse.data.uEmail,
                uRole: userResponse.data.uRole,
                deletedAt: userResponse.data.deletedAt
            }));

            localStorage.setItem('userState', JSON.stringify({
                isLoggedIn: true,
                user: {
                    uName: userResponse.data.uName,
                    uEmail: userResponse.data.uEmail,
                    uRole: userResponse.data.uRole,
                    deletedAt: userResponse.data.deletedAt
                }
            }));

            alert("로그인 성공!");
            navigate("/");

        } catch (err) {
            console.error(err);
            if (err.response && err.response.data && err.response.data.error) {
                setError(err.response.data.error);
            } else {
                setError("로그인 중 오류가 발생했습니다.");
            }
        }
    };

    return (
        <>
             <div className="login-header">
                <h1 className="tone1">StudyLog</h1>
                <p className="tone1">계정을 등록해주세요</p>
            </div>

            <form className="login-form" onSubmit={handleLogin}>
                <div className="form-group">
                    <label>이메일</label>
                    <div className="input-icon">
                        <i className="fas fa-envelope"></i>
                        <input
                         type="email"
                         style={{border:"none"}}
                         placeholder="이메일을 입력해주세요"
                         value={uEmail}
                         onChange={(e) => setUEmail(e.target.value)}
                         required
                        />
                   </div>
                 </div>

                <div className="form-group">
                    <label>비밀번호</label>
                    <div className="input-icon">
                        <i className="fas fa-lock"></i>
                         <input
                        type="password"
                        style={{border:"none"}}
                        placeholder="Enter your password"
                        value={uPassword}
                        onChange={(e) => setUPassword(e.target.value)}
                        required
                         />
                    </div>
                </div>

                <div className="form-options">
                    <span onClick={() => setShowResetModal(true)} className="link">비밀번호 찾기
                    </span>

                </div>

                {error && <p className="error-message">{error}</p>}

                <button type="submit" className="submit-btn">로그인</button>
            </form>

            <p className="login-footer">
                계정이 없으신가요? <span onClick={() => navigate("/auth")} className="link">Sign up now</span>
            </p>
            {showResetModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>비밀번호 재설정</h3>
                        <input type="email" placeholder="이메일 입력" className="modal-input" />
                        <button className="submit-btn">인증 코드 전송</button>
                        <button className="close-btn" onClick={() => setShowResetModal(false)}>닫기</button>
                    </div>
                </div>
            )}


        </>

    );
}

export default Login;