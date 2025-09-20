import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Footer from './Footer'

export default function Reviews() {
  const [reviews, setReviews] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [delivery, setDelivery] = useState(3)
  const [kitchen, setKitchen] = useState(3)
  const [service, setService] = useState(3)
  const [text, setText] = useState('')
  const navigate = useNavigate()

  // безопасно получаем токен из localStorage (учитываем разные форматы)
  const getToken = () => {
    let raw = localStorage.getItem('token')
    if (!raw) return null
    try {
      const parsed = JSON.parse(raw)
      // если в localStorage лежит объект { token: '...' } или {access: '...'}
      if (parsed && typeof parsed === 'object') {
        return parsed.token || parsed.access || parsed.Authorization || parsed.auth || null
      }
    } catch (e) {
      // raw — не JSON, оставляем как есть
    }
    // убираем случайные кавычки вокруг строки
    return raw.replace(/^"(.*)"$/, '$1').trim()
  }

  // fetch list
  const fetchReviews = async () => {
    try {
      const token = getToken()
      const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: token } : {})
      }
      console.log('GET /api/review headers:', headers)
      const res = await fetch('https://rest.sergosht-api.uz/api/review', {
        method: 'GET',
        headers,
      })
      console.log('GET status', res.status)
      const data = await res.json().catch(() => null)
      console.log('GET response', data)
      if (res.ok && Array.isArray(data)) {
        setReviews(data)
      } else {
        // если 401 — можно редиректить на логин
        if (res.status === 401) {
          console.warn('GET 401 — token invalid or missing')
        }
      }
    } catch (err) {
      console.error('fetchReviews error', err)
    }
  }

  useEffect(() => {
    fetchReviews()
  }, [])

  // POST with retry (first try raw token like curl, then try Bearer if 401)
  const postReview = async (payload) => {
    const token = getToken()
    if (!token) {
      navigate('/login')
      return
    }

    const url = 'https://rest.sergosht-api.uz/api/review'
    const basicHeaders = { 'Content-Type': 'application/json' }

    // Helper to do a fetch attempt with given Authorization value
    const attempt = async (authValue) => {
      const headers = { ...basicHeaders, Authorization: authValue }
      console.log('POST attempt headers:', headers, 'body:', payload)
      const res = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      })
      const body = await res.text().catch(() => null)
      let json = null
      try { json = body ? JSON.parse(body) : null } catch(e) { json = body }
      console.log('POST response status', res.status, 'body', json)
      return { res, json }
    }

    // 1) try raw token (как в твоём curl)
    let attempt1 = await attempt(token)
    if (attempt1.res.status === 401 || attempt1.res.status === 403) {
      // 2) пробуем с Bearer (на всякий случай)
      console.warn('POST first attempt 401/403, retrying with "Bearer " prefix')
      let attempt2 = await attempt(`Bearer ${token}`)
      if (!attempt2.res.ok) {
        throw new Error('POST failed, both attempts returned non-ok: ' + attempt2.res.status)
      }
      return attempt2.json
    } else {
      if (!attempt1.res.ok) throw new Error('POST failed: ' + attempt1.res.status)
      return attempt1.json
    }
  }

  const handleSubmit = async () => {
    try {
      const payload = {
        text,
        delivery_rating: delivery,
        kitchen_rating: kitchen,
        service_rating: service
      }
      const data = await postReview(payload) // может вернуть объект отзыва
      console.log('POST success, data:', data)

      // после успешного POST — перезапросим список (надёжно)
      await fetchReviews()

      // очистим форму и закроем
      setText('')
      setDelivery(3)
      setKitchen(3)
      setService(3)
      setShowForm(false)
    } catch (err) {
      console.error('handleSubmit error', err)
      alert('Не удалось добавить отзыв. Смотри консоль для деталей.')
    }
  }

  return (
    <div>
      <div className="header">
        <Link to={'/'}>
          <i className="fas fa-arrow-left"></i>
        </Link>

        <div className="header-title">Ser Gosht</div>
        <i className="fa-solid fa-magnifying-glass"></i>
      </div>

      <div className="page-title">
        <h1>
          Отзывы
          <button className="add-review" onClick={() => setShowForm(!showForm)}>+</button>
        </h1>
      </div>

      <div className="reviews-container">
        {reviews.map((review) => (
          <div className="review-item" key={review.id}>
            <div className="review-header">
              <div className="user-avatar">
                {review.user?.photo ? (
                  <img
                    src={`https://rest.sergosht-api.uz${review.user.photo}`}
                    alt={review.user.first_name}
                    style={{ width: "40px", height: "40px", borderRadius: "50%" }}
                  />
                ) : "👤"}
              </div>
              <div className="user-info">
                <div className="user-name">
                  {review.user?.first_name || review.user?.phone || `id${review.user?.id || review.id}`}
                </div>
                <div className="review-date">
                  {review.created_at ? new Date(review.created_at).toLocaleString('ru-RU', { day: '2-digit', month: 'long', hour:'2-digit', minute:'2-digit' }) : ''}
                </div>
              </div>
            </div>

            <div className="stars">
              {"★".repeat(Math.round(review.average_rating || 0))}
              {"☆".repeat(5 - Math.round(review.average_rating || 0))}
            </div>
            <div className="review-text">{review.text}</div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="review-form">
          <label>Скорость доставки: {delivery}</label>
          <input type="range" min="1" max="5" value={delivery} onChange={(e) => setDelivery(Number(e.target.value))} />

          <label>Кухня: {kitchen}</label>
          <input type="range" min="1" max="5" value={kitchen} onChange={(e) => setKitchen(Number(e.target.value))} />

          <label>Сервис: {service}</label>
          <input type="range" min="1" max="5" value={service} onChange={(e) => setService(Number(e.target.value))} />

          <textarea placeholder="Текст отзыва" value={text} onChange={(e) => setText(e.target.value)} />

          <button onClick={handleSubmit}>Добавить</button>
          <button onClick={() => setShowForm(false)}>Закрыть</button>
        </div>
      )}

      <Footer />
    </div>
  )
}
