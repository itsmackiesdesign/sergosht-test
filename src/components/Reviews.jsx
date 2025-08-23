import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Footer from './Footer'

export default function Reviews() {
    const [reviews, setReviews] = useState([
        {
            id: 1,
            avatar: "👤",
            user_name: "Aziza Qo'ryog'diyeva",
            review_date: "14 апреля 12:41",
            star: "★★★★★",
            text: "Tez-kor dostavka uchun rahmat. 20 minutda zakazimni oldim"
        },
        {
            id: 2,
            avatar: "👤",
            user_name: "id02507",
            review_date: "15 марта 19:12",
            star: "★★★★★",
            text: "Снова заказала сер гушт на этот раз привезли очень быстро, горяченький и очень вкусный 😋  спасибо за быструю доставку"
        },
        {
            id: 3,
            avatar: "👤",
            user_name: "id01870",
            review_date: "19 февраля 15:29",
            star: "★★★★★",
            text: "Было вкусно, спасибо поварам, так же отдельное спасибо доставщику, быстро привёз"
        },
        {
            id: 4,
            avatar: "👤",
            user_name: "id00126",
            review_date: "04 февраля 17:52",
            star: "★★★★☆",
            text: "У меня есть предложение разработчикам. 1.На приложение нет возможности добавить дополнительную услугу или другие добавки! 2. Здесь нет нижних комбо только обычный меню. Пока что телеграм бот удобнее жду скорых обновлений"
        },
        {
            id: 5,
            avatar: "👤",
            user_name: "id02413",
            review_date: "21 января 22:42",
            star: "★★★★☆",
            text: "Всё отлично 👌 Удачи вам 😊"
        },
    ])

    const navigate = useNavigate()

    const handleAddReview = () => {
        const token = localStorage.getItem('token')

        if (!token) {
            // Если токена нет — редиректим на страницу логина
            navigate('/login')
        } else {
            // Если токен есть — вызываем твою функцию добавления
            console.log("Можно добавить комментарий")
            // здесь потом подключим функцию, которую ты скажешь
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
                    <button className="add-review" onClick={handleAddReview}>+</button>
                </h1>
            </div>

            <div className="reviews-container">
                {reviews.map((review) => (
                    <div className="review-item" key={review.id}>
                        <div className="review-header">
                            <div className="user-avatar">{review.avatar}</div>
                            <div className="user-info">
                                <div className="user-name">{review.user_name}</div>
                                <div className="review-date">{review.review_date}</div>
                            </div>
                        </div>
                        <div className="stars">{review.star}</div>
                        <div className="review-text">{review.text}</div>
                    </div>
                ))}

                <a href="#" className="show-more">Показать еще</a>
            </div>
            <Footer/>
        </div>
    )
}
