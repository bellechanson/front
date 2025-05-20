// components/ResetPasswordModal.jsx
import { useState } from 'react';
import '../../style/user/Modal1.css';

function ResetPasswordModal({ onClose }) {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handleSendVerificationCode = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8921/api/mail/send-verification', null, {
                params: { email }
            });
            setStep(2);
            setError('');
        } catch (error) {
            setError(error.response?.data?.message || '인증 코드 전송에 실패했습니다.');
        }
    };

    const handleVerifyCode = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8921/api/users/verify-code', {
                email,
                code: verificationCode
            });
            setStep(3);
            setError('');
        } catch (error) {
            setError(error.response?.data?.message || '인증 코드가 일치하지 않습니다.');
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setError('비밀번호가 일치하지 않습니다.');
            return;
        }

        try {
            await axios.post('http://localhost:8921/api/users/reset-password', {
                email,
                newPassword
            });
            alert('비밀번호가 성공적으로 변경되었습니다.');
            navigate('/login');
        } catch (error) {
            setError(error.response?.data?.message || '비밀번호 변경에 실패했습니다.');
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="modal-close" onClick={onClose}>×</button>

                {step === 1 && (
                    <>
                        <h3>이메일 인증</h3>
                        <input type="email" placeholder="이메일 입력" value={email} onChange={(e) => setEmail(e.target.value)} />
                        <button onClick={handleSendVerificationCode}>인증 코드 전송</button>
                    </>
                )}

                {step === 2 && (
                    <>
                        <h3>인증 코드 확인</h3>
                        <input type="text" placeholder="인증 코드" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} />
                        <button onClick={handleVerifyCode}>확인</button>
                    </>
                )}

                {step === 3 && (
                    <>
                        <h3>새 비밀번호 입력</h3>
                        <input type="password" placeholder="새 비밀번호" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                        <input type="password" placeholder="비밀번호 확인" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                        <button onClick={handleResetPassword}>비밀번호 변경</button>
                    </>
                )}

                {error && <p className="error-message">{error}</p>}
            </div>
        </div>
    );
}

export default ResetPasswordModal;
