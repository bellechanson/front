import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import "../../style/user/Register.css";

function Register({ onSwitch }) {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        uEmail: "",
        uPassword: "",
        confirmPassword: "",
        uName: "",
    });
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
        if (name === "confirmPassword" || name === "uPassword") {
            setError("");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.uPassword !== form.confirmPassword) {
            setError("비밀번호가 일치하지 않습니다.");
            return;
        }

        try {
            localStorage.setItem('tempRegisterData', JSON.stringify(form));

            await axios.post("http://localhost:8921/api/mail/send-verification", null, {
                params: {
                    email: form.uEmail
                }
            });

            navigate("/email-verification");
        } catch (error) {
            if (error.response && error.response.data) {
                setError(error.response.data.message || "이메일 전송 실패");
            } else {
                setError("이메일 전송 중 오류가 발생했습니다.");
            }
        }
    };

    return (
        <>
            <div className="login-header">
                <h1 className="tone1">StudyLog</h1>
                <p className="tone1">회원가입 정보를 입력해주세요</p>
            </div>

            <form className="login-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="uEmail">이메일</label>
                    <input
                        type="email"
                        id="uEmail"
                        name="uEmail"
                        placeholder="Enter your email"
                        className="input1"
                        value={form.uEmail}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="uPassword">비밀번호</label>
                    <input
                        type="password"
                        id="uPassword"
                        name="uPassword"
                        placeholder="Enter your password"
                        className="input1"
                        value={form.uPassword}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="confirmPassword">비밀번호 확인</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        placeholder="Confirm your password"
                        className="input1"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="uName">이름</label>
                    <input
                        type="text"
                        id="uName"
                        name="uName"
                        placeholder="Enter your name"
                        className="input1"
                        value={form.uName}
                        onChange={handleChange}
                        required
                    />
                </div>

                {error && <p className="error-message">{error}</p>}

                <button type="submit" className="submit-btn">회원가입</button>
            </form>

            <p className="login-footer">
                이미 계정이 있으신가요?
                <span className="link" onClick={onSwitch}> 로그인</span>
            </p>
        </>
    );
}

export default Register;