import React, { useState, useEffect } from 'react'
import { ArrowLeft, Search, Plus } from 'lucide-react'

export default function Reviews() {
  const [reviews, setReviews] = useState([
    {
      id: 1,
      user: {
        first_name: "Umid",
        photo: null,
        id: 123
      },
      text: "Zo'r",
      average_rating: 4,
      created_at: "2024-09-20T15:28:00Z"
    },
    {
      id: 2,
      user: {
        first_name: "Umid",
        photo: null,
        id: 124
      },
      text: "Great service!",
      average_rating: 4,
      created_at: "2024-09-20T15:29:00Z"
    }
  ])
  const [showForm, setShowForm] = useState(false)

  // поля формы
  const [delivery, setDelivery] = useState(3)
  const [kitchen, setKitchen] = useState(3)
  const [service, setService] = useState(3)
  const [text, setText] = useState("")

  // Симуляция загрузки отзывов (заменить на реальный API)
  useEffect(() => {
    // Здесь будет ваш API вызов
    console.log('Loading reviews...')
  }, [])

  // Отправка отзыва
  const handleSubmit = () => {
    const newReview = {
      id: Date.now(),
      user: {
        first_name: "Новый пользователь",
        photo: null,
        id: Date.now()
      },
      text,
      average_rating: Math.round((delivery + kitchen + service) / 3),
      created_at: new Date().toISOString()
    }

    setReviews(prev => [newReview, ...prev])
    setShowForm(false)
    setText("")
    setDelivery(3)
    setKitchen(3)
    setService(3)
  }

  const RangeSlider = ({ label, value, onChange, color }) => {
    return (
      <div className="range-container">
        <div className="range-label-container">
          <label className="range-label">{label}</label>
          <span className="range-asterisk">*</span>
        </div>
        <div className="range-wrapper">
          <input 
            type="range" 
            min="1" 
            max="5" 
            value={value} 
            onChange={(e) => onChange(Number(e.target.value))}
            className="range-input"
            style={{ '--thumb-color': color }}
          />
          <div 
            className="range-value"
            style={{ 
              left: `${((value - 1) / 4) * 100}%`,
              backgroundColor: color 
            }}
          >
            {value}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="reviews-app">
      
      <div className="header">
        <div className="header-icon">
          <ArrowLeft size={20} />
        </div>
        <div className="header-title">Ser Gosht</div>
        <div className="header-icon">
          <Search size={20} />
        </div>
      </div>

      <div className="page-title">
        <h1>
          Отзывы
          <button className="add-review" onClick={() => setShowForm(!showForm)}>
            <Plus size={16} />
          </button>
        </h1>
      </div>

      <div className="reviews-container">
        {reviews.map((review) => (
          <div className="review-item" key={review.id}>
            <div className="review-header">
              <div className="user-avatar">
                {review.user.photo ? (
                  <img 
                    src={`https://rest.sergosht-api.uz${review.user.photo}`} 
                    alt={review.user.first_name} 
                  />
                ) : "👤"}
              </div>
              <div className="user-info">
                <div className="user-name">
                  {review.user.first_name || "id" + review.user.id}
                </div>
                <div className="review-date">
                  {new Date(review.created_at).toLocaleDateString("ru-RU", {
                    day: '2-digit',
                    month: 'long',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            </div>

            <div className="stars">
              {"★".repeat(Math.round(review.average_rating))}
              {"☆".repeat(5 - Math.round(review.average_rating))}
            </div>
            <div className="review-text">{review.text}</div>
          </div>
        ))}
      </div>

      {showForm && (
        <>
          <div className="form-overlay" onClick={() => setShowForm(false)} />
          <div className="review-form">
            <RangeSlider 
              label="Скорость доставки" 
              value={delivery} 
              onChange={setDelivery}
              color="#ffc107"
            />
            
            <RangeSlider 
              label="Кухня" 
              value={kitchen} 
              onChange={setKitchen}
              color="#28a745"
            />
            
            <RangeSlider 
              label="Сервис (общение, курьер, оплата)" 
              value={service} 
              onChange={setService}
              color="#fd7e14"
            />

            <textarea 
              className="form-textarea"
              placeholder="Текст отзыва" 
              value={text} 
              onChange={(e) => setText(e.target.value)} 
            />

            <button className="submit-button" onClick={handleSubmit}>
              Добавить
              <span>→</span>
            </button>
          </div>
        </>
      )}
    </div>
  )
}