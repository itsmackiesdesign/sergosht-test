import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Footer from "./Footer";


export default function MyProfile() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState("male");
  const [id, setId] = useState(null);
  const [consent, setConsent] = useState(false);

  useEffect(() => {
    const savedUserInfo = localStorage.getItem("user_info");
    if (savedUserInfo) {
      const parsed = JSON.parse(savedUserInfo);
      setFirstName(parsed.first_name || "");
      setLastName(parsed.last_name || "");
      setPhone(parsed.phone || "");
      setEmail(parsed.email || "");
      setBirthDate(parsed.birth_date || "");
      setGender(parsed.gender || "male");
      setId(parsed.id || null);
    }
  }, []);

  const saveProfile = () => {
    if (!consent) {
      alert("Вы должны дать согласие на обработку данных!");
      return;
    }
    const updatedUserInfo = {
      id,
      first_name: firstName,
      last_name: lastName,
      phone,
      email,
      birth_date: birthDate,
      gender,
    };
    localStorage.setItem("user_info", JSON.stringify(updatedUserInfo));
    alert("Профиль сохранён!");
  };

  return (
    <div className="profile-container">
      {/* Верхняя панель */}
      <div className="profile-header">
        <Link to={"/"}>
          <i className="fas fa-arrow-left"></i>
        </Link>
        <h2>Ser Gosht</h2>
      </div>

      {/* Аватар */}
      <div className="avatar-container">
        <img
          src="https://via.placeholder.com/100"
          alt="avatar"
          className="avatar"
        />
        <div className="camera-icon">
          <i className="fas fa-camera"></i>
        </div>
      </div>

      {/* Имя и фамилия */}
      <div className="profile-field">
        <input
          type="text"
          placeholder="Имя"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
      </div>
      <div className="profile-field">
        <input
          type="text"
          placeholder="Фамилия"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
      </div>

      {/* Пол */}
      <div className="profile-field gender">
        <label>
          <input
            type="radio"
            name="gender"
            value="male"
            checked={gender === "male"}
            onChange={() => setGender("male")}
          />
          Мужчина
        </label>
        <label>
          <input
            type="radio"
            name="gender"
            value="female"
            checked={gender === "female"}
            onChange={() => setGender("female")}
          />
          Женщина
        </label>
      </div>

      {/* Дата рождения */}
      <div className="profile-field">
        <input
          type="date"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
        />
      </div>

      {/* Телефон */}
      <div className="profile-field">
        <input type="text" value={phone} disabled />
      </div>

      {/* Email */}
      <div className="profile-field">
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      {/* Согласие */}
      <div className="profile-field consent">
        <label>
          <input
            type="checkbox"
            checked={consent}
            onChange={() => setConsent(!consent)}
          />
          Я даю согласие на обработку <a href="#">персональных данных</a>
        </label>
      </div>

      {/* Кнопка */}
      <button onClick={saveProfile} className="save-btn">
        Сохранить изменения
      </button>

      <br />
      <br />
      <Footer />
    </div>
  );
}
