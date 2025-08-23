import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Checkout() {
    const [address, setAddress] = useState('Бухара, Бухарская ул., 147');
    const [phone, setPhone] = useState('+998');
    const [name, setName] = useState('');
    const [payment, setPayment] = useState('');
    const [comment, setComment] = useState('');

    return (
        <div className="checkout-container">
            <div className="delivery-section">
                <Link to={'/Cart'} className="Click2-close-btn">✕</Link>
                <h2>Доставка</h2>
                <div className="address-box">
                    <div>{address}</div>
                    <div className="address-inputs">
                        <input type="text" placeholder="Кв." />
                        <input type="text" placeholder="Подъезд" />
                        <input type="text" placeholder="Этаж" />
                    </div>
                </div>
                <input
                    type="text"
                    placeholder="Ваше имя"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input-field"
                />
                <input
                    type="text"
                    placeholder="Ваш номер телефона"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="input-field"
                />
                <div className="info-text">Доставка начнёт работу в 09:00. Сейчас вы можете сделать предзаказ.</div>
                <div className="preorder-select">
                    <select>
                        <option>Предзаказ на</option>
                    </select>
                    <input type="time" />
                </div>
                <select className="payment-select">
                    <option>Способ оплаты</option>
                </select>
            </div>

            <div className='order-summary-input'>
                <input
                    type="text"
                    placeholder="Комментарий к заказу"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="input-field"
                />
            </div>
            <div className="order-summary">

                <div className="order-items">
                    <div className="item-row">
                        <span>Товары в заказе 3 шт.</span>
                        <span>78000 UZS</span>
                    </div>
                    <div className="item-row">
                        <div>
                            Доставка
                            <div className="small-text">Закажите ещё на 122000 UZS для бесплатной доставки</div>
                        </div>
                        <span>10000 UZS</span>
                    </div>
                    <div className="item-row">
                        <span>Бонусы к начислению</span>
                        <span>+880</span>
                    </div>
                    <div className="item-row total">
                        <span>Итого</span>
                        <span>88000 UZS</span>
                    </div>
                </div>
                <button className="order-button">Заказать</button>
            </div>
        </div>
    );
}
