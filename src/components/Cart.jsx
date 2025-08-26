import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Cart() {
    const [cartItems, setCartItems] = useState([]);
    const [showConfirm, setShowConfirm] = useState(false);
    const [promoCode, setPromoCode] = useState('SERGOSHT');
    const [promoApplied, setPromoApplied] = useState(false);
    const [promoError, setPromoError] = useState('');
    // Добавляем состояние для переключения доставка/самовывоз
    const [isDelivery, setIsDelivery] = useState(true);

    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            setCartItems(JSON.parse(savedCart));
        }
    }, []);

   
    useEffect(() => {
        const total = getTotalPrice();
        if (promoApplied && total < 100000) {
            setPromoApplied(false);
            setPromoError("Минимальная сумма заказа для промокода — 100000 UZS");
        } else if (!promoApplied && total >= 100000 && promoError.includes("Минимальная сумма")) {
            setPromoError('');
        }
    }, [cartItems, promoApplied]);

    const updateQuantity = (index, change) => {
        const updatedCart = [...cartItems];
        updatedCart[index].quantity += change;

        if (updatedCart[index].quantity <= 0) {
            updatedCart.splice(index, 1);
        }

        setCartItems(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    const getTotalPrice = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    // Подсчет общего количества всех товаров (сумма количеств)
    const getTotalItemsQuantity = () => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    };

    // Модифицированная логика доставки с учетом выбора
    const getDeliveryInfo = () => {
        // Если выбран самовывоз, доставка всегда бесплатная
        if (!isDelivery) {
            return {
                cost: 0,
                message: "Самовывоз",
                showWarning: false
            };
        }

        // Логика для доставки
        const total = getTotalPrice();
        
        if (total < 30000) {
            return {
                cost: 3000,
                message: "Пожалуйста, закажите на минимальную сумму заказа по указанному адресу — 30000 UZS",
                showWarning: true
            };
        } else if (total >= 30000 && total < 200000) {
            const remaining = 200000 - total;
            return {
                cost: 3000,
                message: `Закажите еще на ${remaining} UZS для бесплатной доставки`,
                showWarning: false
            };
        } else {
            return {
                cost: 0,
                message: "Бесплатная доставка",
                showWarning: false
            };
        }
    };

  
    const applyPromoCode = () => {
        const total = getTotalPrice();
        
        if (total < 100000) {
            setPromoError("Минимальная сумма заказа для промокода — 100000 UZS");
            setPromoApplied(false);
            return;
        }

        if (promoCode.trim() === '') {
            setPromoError("Введите промокод");
            return;
        }

        // Проверяем конкретный промокод SERGOSHT
        if (promoCode.trim().toUpperCase() === 'SERGOSHT') {
            setPromoApplied(true);
            setPromoError('');
        } else {
            setPromoError("Неверный промокод");
            setPromoApplied(false);
        }
    };

    // Функция удаления промокода
    const removePromoCode = () => {
        setPromoApplied(false);
        setPromoError('');
        setPromoCode('SERGOSHT');
    };

    const getPromoDiscount = () => {
        if (promoApplied && getTotalPrice() >= 100000) {
            return Math.floor(getTotalPrice() * 0.1);
        }
        return 0;
    };

    const getFinalTotal = () => {
        const deliveryInfo = getDeliveryInfo();
        const subtotal = getTotalPrice();
        const discount = getPromoDiscount();
        return subtotal + deliveryInfo.cost - discount;
    };

    const clearCart = () => {
        localStorage.removeItem('cart');
        setCartItems([]);
        setShowConfirm(false);
    };

    const deliveryInfo = getDeliveryInfo();

    return (
        <div className="cart-container">

            {showConfirm && (
                <div className="cart-confirm-overlay">
                    <div className="cart-confirm-modal">
                        <div className="cart-confirm-icon"></div>
                        <div className="cart-confirm-title">Очистить содержимое корзины?</div>
                        <button className="cart-confirm-ok" onClick={clearCart}>ОК</button>
                        <button className="cart-confirm-cancel" onClick={() => setShowConfirm(false)}>Отменить</button>
                    </div>
                </div>
            )}

            <div className="cart-header">
                <div className="cart-header-content">
                    <div className="cart-header-title">Корзина</div>
                
                    {cartItems.length > 0 && (
                        <button onClick={() => setShowConfirm(true)} className="cart-trash-btn">🗑</button>
                    )}
                    <Link to={'/'} className="cart-close-btn">✕</Link>
                </div>
            </div>

          
            {cartItems.length === 0 ? (
                <div className="cart-empty-fullscreen">
                    <div className="cart-empty-content">
                        <div className="cart-empty-icon">🛒</div>
                        <h2 className="cart-empty-title">Ваша корзина пуста</h2>
                        <p className="cart-empty-description">
                            Загляните в меню и наполните её<br/>
                            прямо сейчас любимыми блюдами!
                        </p>
                        <Link to="/" className="cart-empty-button">
                            Перейти в меню
                        </Link>
                    </div>
                </div>
            ) : (
              
                <>
                    <div className="cart-tabs">
                        <div 
                            className={`cart-tab ${isDelivery ? 'active' : ''}`}
                            onClick={() => setIsDelivery(true)}
                        >
                            Доставка
                        </div>
                        <div 
                            className={`cart-tab ${!isDelivery ? 'active' : ''}`}
                            onClick={() => setIsDelivery(false)}
                        >
                            Самовывоз
                        </div>
                    </div>
                    

                    <div className="cart-address-section">
                        <div className="cart-address-info">
                            <span className='cart-tabi'>
                                <span className="cart-location-icon">📍</span> 
                                {isDelivery ? 'улица Бахауддина Накшбанда, 158' : 'Узбекистан, Бухара'}
                            </span>
                        </div>
                    </div>

                    <div className="cart-items">
                        {cartItems.map((item, index) => (
                            <div className="cart-item" key={index}>
                                <div className="cart-item-image">
                                    <img src={item.image} alt={item.title} />
                                </div>

                                <div className="cart-item-details">
                                    <div className="cart-item-name">{item.title}</div>
                                    <div className="cart-item-description">
                                        {item.variation && <div>{item.variation}</div>}
                                        {item.related_products?.map(addon => (
                                            <div key={addon.id}>
                                                +{addon.title} × {addon.quantity}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="cart-item-price">{item.price * item.quantity} UZS</div>
                                </div>

                                <div className="cart-quantity-controls">
                                    <button 
                                        className="cart-quantity-btn" 
                                        onClick={() => updateQuantity(index, -1)}
                                    >−</button>
                                    <span className="cart-quantity">{item.quantity}</span>
                                    <button 
                                        className="cart-quantity-btn" 
                                        onClick={() => updateQuantity(index, 1)}
                                    >+</button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Промокод секция */}
                    <div className="cart-promo-section">
                        <div className="cart-promo-input-container">
                            <input 
                                type="text" 
                                placeholder="Введите промокод"
                                value={promoCode}
                                onChange={(e) => setPromoCode(e.target.value)}
                                className="cart-promo-input"
                            />
                            <button 
                                onClick={applyPromoCode}
                                className="cart-promo-apply-btn"
                            >
                                Применить
                            </button>
                        </div>
                        
                        {promoError && (
                            <div className="cart-promo-error">
                                <span className="cart-warning-icon">⚠️</span>
                                {promoError}
                            </div>
                        )}
                        
                        {promoApplied && (
                            <div className="cart-promo-success">
                                <span className="cart-success-icon">✅</span>
                                Промокод применен! Скидка 10%
                                <button 
                                    onClick={removePromoCode}
                                    className="cart-promo-remove-btn"
                                    title="Удалить промокод"
                                >
                                    ✕
                                </button>
                            </div>
                        )}
                    </div>


                    
                    <div className="cart-order-summary">
                        <div className="cart-summary-row">
                            <span className="cart-summary-label">Товары в заказе {getTotalItemsQuantity()} шт</span>
                            <span className="cart-summary-value">{getTotalPrice()} UZS</span>
                        </div>

                        {promoApplied && getPromoDiscount() > 0 && (
                            <div className="cart-summary-row">
                                <span className="cart-summary-label">Скидка по промокоду</span>
                                <span className="cart-summary-value cart-discount">-{getPromoDiscount()} UZS</span>
                            </div>
                        )}

                        <div className="cart-summary-row">
                            <span className="cart-summary-label">
                                {isDelivery ? 'Доставка' : 'Самовывоз'}
                            </span>
                            <span className="cart-summary-value">
                                {deliveryInfo.cost === 0 ? 'Бесплатно' : `${deliveryInfo.cost} UZS`}
                            </span>
                        </div>

                        <div className="cart-delivery-info">
                            {deliveryInfo.message}
                        </div>

                        {/* Показываем бонусы к начислению только для доставки */}
                        {isDelivery && (
                            <div className="cart-bonus-row">
                                <span className="cart-summary-label">Бонусы к начислению</span>
                                <span className="cart-bonus-value">+{Math.floor(getTotalPrice() / 100)} ○</span>
                            </div>
                        )}

                        <div className="cart-total-row">
                            <span>Итого</span>
                            <span>{getFinalTotal()} UZS</span>
                        </div>
                    </div>

                    <div className="cart-bottom-padding"></div>

                    <Link to={'/Click2'}>
                        <button className="cart-checkout-btn">Продолжить оформление</button>
                    </Link>
                </>
            )}
        </div>
    );
}
