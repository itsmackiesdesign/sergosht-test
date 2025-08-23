import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
    const [phoneRaw, setPhoneRaw] = useState('');
    const [isSent, setIsSent] = useState(false);

    const [agreementAccepted, setAgreementAccepted] = useState(false);
    const [error, setError] = useState('');
    const [code, setCode] = useState(['', '', '', '']);
    const [verifyError, setVerifyError] = useState('');
    const [loading, setLoading] = useState(false);

    const codeInputRefs = useRef([]);

    const navigate = useNavigate();

    const formatPhone = (value) => {
        const digits = value.replace(/\D/g, '').slice(0, 9);
        let formatted = '';

        if (digits.length >= 2) {
            formatted += `(${digits.slice(0, 2)})`;
        } else {
            formatted += digits;
        }

        if (digits.length >= 5) {
            formatted += ` ${digits.slice(2, 5)}`;
        } else if (digits.length > 2) {
            formatted += ` ${digits.slice(2)}`;
        }

        if (digits.length >= 7) {
            formatted += `-${digits.slice(5, 7)}`;
        } else if (digits.length > 5) {
            formatted += `-${digits.slice(5)}`;
        }

        if (digits.length >= 9) {
            formatted += `-${digits.slice(7, 9)}`;
        } else if (digits.length > 7) {
            formatted += `-${digits.slice(7)}`;
        }

        return formatted;
    };

    const handlePhoneChange = (e) => {
        const value = e.target.value;
        setPhoneRaw(formatPhone(value));
    };

    const handleCodeChange = (index, value) => {

        if (value && !/^\d$/.test(value)) return;

        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);


        if (value && index < 3) {
            codeInputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index, e) => {

        if (e.key === 'Backspace' && !code[index] && index > 0) {
            codeInputRefs.current[index - 1]?.focus();
        }
    };

    const sendCode = () => {
        const digits = phoneRaw.replace(/\D/g, '');

        if (!agreementAccepted) {
            setError('Примите условия соглашений, пожалуйста');
            return;
        }

        if (digits.length !== 9) {
            setError('Введите корректный номер (9 цифр после +998)');
            return;
        }

        setError('');

        fetch('https://rest.sergosht-api.uz/api/send-verification-code', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone: `+998${digits}` })
        })
            .then(() => {
                setIsSent(true);
                alert('СМС отправлен на номер');
            })
            .catch(() => {
                setError('Ошибка при отправке СМС');
            });
    };

    const handleVerify = async () => {
        const phone = `+998${phoneRaw.replace(/\D/g, '')}`;
        const codeString = code.join('');

        if (codeString.length !== 4) {
            setVerifyError('Введите все 4 цифры кода');
            return;
        }

        setLoading(true);
        setVerifyError('');

        try {
            const response = await axios.post('https://rest.sergosht-api.uz/api/check-verification-code', {
                phone,
                code: codeString
            });

            const { token, id, first_name, last_name, phone: userPhone } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem(
                'user_info',
                JSON.stringify({ id, first_name, last_name, phone: userPhone })
            );

            navigate('/');
        } catch (err) {
            if (err.response && err.response.data) {
                setVerifyError('Неверно указан код подтверждения');
            } else {
                setVerifyError('Произошла ошибка');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <button className="close-button">
                <Link to="/">✕</Link>
            </button>

            {isSent ? (
                <div className="login-code-section">
                    <div className="lock-icon">🔒</div>
                    <h1 className="login-title">Авторизация</h1>
                    <p className="login-description">
                        Введите код, который был отправлен вам на номер <br />
                        +998 {phoneRaw}
                    </p>


                    <div className="login-code-inputs">
                        {code.map((digit, index) => (
                            <input
                                key={index}
                                ref={(el) => (codeInputRefs.current[index] = el)}
                                type="text"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleCodeChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                className="code-circle-input"
                            />
                        ))}
                    </div>

                    {verifyError && <p className="error-message">{verifyError}</p>}

                    <button onClick={handleVerify} disabled={loading} className="login-button sms-button">
                        {loading ? 'Проверка...' : 'Войти'}
                    </button>

                    <button
                        className="back-button"
                        onClick={() => setIsSent(false)}
                    >
                        ← Изменить номер телефона
                    </button>
                </div>
            ) : (
                <>
                    <div className="lock-icon">🔒</div>
                    <h1 className="login-title">Авторизация</h1>
                    <p className="login-description">
                        Введите ваш номер телефона, чтобы получить код для авторизации
                    </p>

                    <div className="phone-input-wrapper">
                        <div className="phone-number-container">
                            <span className="country-code">+998</span>
                            <input
                                type="tel"
                                placeholder="(__) ___-__-__"
                                className="phone-input-with-code"
                                value={phoneRaw}
                                onChange={handlePhoneChange}
                            />
                        </div>
                    </div>

                    {error && <p style={{ color: 'red', marginBottom: '10px' }}>{error}</p>}

                    <label className="agreement">
                        <input
                            type="checkbox"
                            checked={agreementAccepted}
                            onChange={(e) => setAgreementAccepted(e.target.checked)}
                        />
                        Принимаю <a href="#">оферту</a> и условия сбора и обработки{' '}
                        <a href="#">персональных данных</a>
                    </label>

                    <button className="login-button telegram-button">
                        <i className="fa-brands fa-telegram"></i>
                        <div className="button-subtext">Войти через телеграм</div>
                    </button>

                    <button className="login-button sms-button" onClick={sendCode}>
                        📱 Получить код через смс
                        <div className="button-subtext">Для классиков и консерваторов</div>
                    </button>
                </>
            )}
        </div>
    );
}
