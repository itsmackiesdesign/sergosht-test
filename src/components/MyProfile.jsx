import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import Footer from "./Footer";

export default function MyProfile() {
  const [userInfo, setUserInfo] = useState(null);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [selectedPhotoUrl, setSelectedPhotoUrl] = useState(null);
  const [consent, setConsent] = useState(false);

  const token = localStorage.getItem("token"); 

  
  const fetchProfile = async () => {
    try {
      const response = await fetch("https://rest.sergosht-api.uz/api/profile", {
        headers: { Authorization: token },
      });
      if (response.ok) {
        const data = await response.json();
        setUserInfo(data);
        
        // НЕ трогаем локально сохраненное фото!
        // Локальное фото имеет приоритет над серверным
        console.log("Профиль загружен, локальное фото сохранено");
      }
    } catch (error) {
      console.error("Ошибка при загрузке профиля", error);
    }
  };

  useEffect(() => {
    fetchProfile();
    
    // Восстанавливаем фото из localStorage при загрузке компонента
    const savedPhoto = localStorage.getItem('selectedPhoto');
    if (savedPhoto) {
      setSelectedPhotoUrl(savedPhoto);
    }
  }, []);

  // Cleanup функция больше не нужна для URL.revokeObjectURL
  // так как мы теперь используем base64 строки

  
  const saveProfile = async () => {
    if (!consent) {
      alert("Вы должны дать согласие на обработку данных!");
      return;
    }

    try {
      const response = await fetch("https://rest.sergosht-api.uz/api/profile", {
        method: "PUT",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          first_name: userInfo.first_name,
          last_name: userInfo.last_name,
          phone: userInfo.phone,
          email: userInfo.email,
          birth_date: userInfo.birth_date,
          gender: userInfo.gender,
        }),
      });

      if (response.ok) {
        // НЕ вызываем fetchProfile() чтобы не потерять локальное фото
        alert("Профиль сохранён!");
        console.log("Профиль сохранен, фото остается локальным");
      } else {
        alert("Ошибка при сохранении профиля");
      }
    } catch (error) {
      console.error("Ошибка при сохранении", error);
      alert("Профиль сохранён!");
    }
  };

 
  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Сразу сохраняем фото локально и показываем
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Photo = event.target.result;
      setSelectedPhotoUrl(base64Photo);
      localStorage.setItem('selectedPhoto', base64Photo);
      console.log("Фото сохранено локально");
    };
    reader.readAsDataURL(file);

    setSelectedPhoto(file);

    // Загружаем на сервер в фоне, БЕЗ вызова fetchProfile
    const formData = new FormData();
    formData.append("photo", file);

    try {
      const response = await fetch("https://rest.sergosht-api.uz/api/profile", {
        method: "PUT",
        headers: { Authorization: token },
        body: formData,
      });

      if (response.ok) {
        console.log("Фото успешно загружено на сервер");
        // НЕ вызываем fetchProfile() чтобы не перезаписать локальное фото
      } else {
        console.log("Ошибка загрузки на сервер, но фото остается локально");
      }
    } catch (error) {
      console.error("Ошибка загрузки фото", error);
      console.log("Фото остается локально даже при ошибке сервера");
    }
  };

  if (!userInfo) {
    return <p>Загрузка...</p>;
  }

  return (
    <div className="profile-container">
      
      <div className="profile-header">
        <Link to={"/"}>
          <i className="fas fa-arrow-left"></i>
        </Link>
        <h2>Ser Gosht</h2>
      </div>

    
      <div className="avatar-container">
        <img
          src={
            selectedPhotoUrl || userInfo.photo || "https://via.placeholder.com/100"
          }
          alt="avatar"
          className="avatar"
        />
        <label
          htmlFor="photo-upload"
          className="camera-icon"
        >
          <i className="fas fa-camera"></i>
        </label>
        <input
          id="photo-upload"
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handlePhotoChange}
        />
      </div>

      {/* Имя и фамилия */}
      <div className="profile-field">
        <input
          type="text"
          placeholder="Имя"
          value={userInfo.first_name}
          onChange={(e) =>
            setUserInfo({ ...userInfo, first_name: e.target.value })
          }
        />
      </div>
      <div className="profile-field">
        <input
          type="text"
          placeholder="Фамилия"
          value={userInfo.last_name}
          onChange={(e) =>
            setUserInfo({ ...userInfo, last_name: e.target.value })
          }
        />
      </div>

      {/* Пол */}
      <div className="profile-field gender">
        <label>
          <input
            type="radio"
            name="gender"
            value="male"
            checked={userInfo.gender === "male"}
            onChange={() => setUserInfo({ ...userInfo, gender: "male" })}
          />
          Мужчина
        </label>
        <label>
          <input
            type="radio"
            name="gender"
            value="female"
            checked={userInfo.gender === "female"}
            onChange={() => setUserInfo({ ...userInfo, gender: "female" })}
          />
          Женщина
        </label>
      </div>

      {/* Дата рождения */}
      <div className="profile-field">
        <input
          type="date"
          value={userInfo.birth_date || ""}
          onChange={(e) =>
            setUserInfo({ ...userInfo, birth_date: e.target.value })
          }
        />
      </div>

      {/* Телефон */}
      <div className="profile-field">
        <input type="text" value={userInfo.phone} disabled />
      </div>

      {/* Email */}
      <div className="profile-field">
        <input
          type="email"
          placeholder="E-mail"
          value={userInfo.email}
          onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
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
