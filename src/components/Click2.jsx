import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Click2() {
  const navigate = useNavigate();

  const [isDelivery, setIsDelivery] = useState(true);
  const [address, setAddress] = useState("Бухара, ул. Бахауддина Накшбанда, 158");
  const [apartment, setApartment] = useState("");
  const [entrance, setEntrance] = useState("");
  const [floor, setFloor] = useState("");

  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [originalPhone, setOriginalPhone] = useState("");
  const [userId, setUserId] = useState(null);

  const [payment, setPayment] = useState("cash");
  const [cashChange, setCashChange] = useState(""); // сдача с
  const [comment, setComment] = useState("");
  const [cartItems, setCartItems] = useState([]);

  const [promoApplied, setPromoApplied] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState(0);

  const [timeType, setTimeType] = useState("soon"); // ближайшее время / предзаказ

  // Загружаем данные из localStorage
  useEffect(() => {
    try {
      const userInfoString = localStorage.getItem("user_info");
      if (userInfoString) {
        const userInfo = JSON.parse(userInfoString);
        setName(userInfo.first_name || "");
        setLastName(userInfo.last_name || "");
        setPhone(userInfo.phone || "");
        setOriginalPhone(userInfo.phone || "");
        setUserId(userInfo.id || null);
      }
    } catch (e) {
      console.error("Ошибка чтения user_info:", e);
    }

    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(cart);

    const savedFinalTotal = localStorage.getItem("cartFinalTotal");
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    if (savedFinalTotal && subtotal >= 100000) {
      const expected = subtotal + (subtotal < 200000 ? 3000 : 0);
      if (parseInt(savedFinalTotal) < expected) {
        setPromoApplied(true);
        setPromoDiscount(Math.floor(subtotal * 0.1));
      }
    }
  }, []);

  const getCartSubtotal = () =>
    cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const getCartTotalQuantity = () =>
    cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const getDeliveryInfo = () => {
    if (!isDelivery) return { cost: 0, message: "Самовывоз" };
    const subtotal = getCartSubtotal();
    if (subtotal < 30000) {
      return { cost: 3000, message: "Минимальная сумма заказа — 30000 UZS" };
    } else if (subtotal < 200000) {
      return {
        cost: 3000,
        message: `Добавьте ещё на ${200000 - subtotal} UZS для бесплатной доставки`
      };
    } else {
      return { cost: 0, message: "Бесплатная доставка" };
    }
  };

  const calculateTotal = () => {
    const subtotal = getCartSubtotal();
    const delivery = getDeliveryInfo().cost;
    return subtotal + delivery - (promoApplied ? promoDiscount : 0);
  };

  const handlePhoneChange = (newPhone) => {
    setPhone(newPhone);
    if (newPhone !== originalPhone && originalPhone) {
      navigate("/login");
    }
  };

  const handleOrder = async () => {
    if (cartItems.length === 0) {
      alert("Ваша корзина пуста!");
      return;
    }

    if (!name.trim() || !lastName.trim() || !phone.trim()) {
      alert("Введите имя, фамилию и номер телефона!");
      return;
    }

    if (!userId) {
      alert("Ошибка: не найден ID пользователя. Попробуйте снова войти.");
      navigate("/login");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Необходима авторизация");
      navigate("/login");
      return;
    }

    const orderProducts = [];
    cartItems.forEach((item) => {
      orderProducts.push({
        id: item.id,
        quantity: item.quantity,
        price: item.price,
        total: item.price * item.quantity
      });

      if (item.related_products?.length) {
        item.related_products.forEach((addon) => {
          orderProducts.push({
            id: addon.id,
            quantity: addon.quantity * item.quantity,
            price: addon.price,
            total: addon.price * addon.quantity * item.quantity
          });
        });
      }
    });

    let fullAddress = address;
    if (apartment) fullAddress += `, кв.${apartment}`;
    if (entrance) fullAddress += `, под.${entrance}`;
    if (floor) fullAddress += `, эт.${floor}`;

    const orderData = {
      user: { first_name: name, last_name: lastName, id: userId },
      order: {
        use_next_time: true,
        payment_type: payment,
        address: fullAddress,
        user: userId,
        products: orderProducts,
        comment: comment || "",
        promo_applied: promoApplied,
        promo_discount: promoApplied ? promoDiscount : 0,
        delivery_time: timeType, // ближайшее / предзаказ
        cash_change: payment === "cash" ? cashChange : null
      }
    };

    try {
      const response = await fetch("https://rest.sergosht-api.uz/api/order", {
        method: "POST",
        headers: {
          Authorization: token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(orderData)
      });

      if (response.ok) {
        localStorage.removeItem("cart");
        localStorage.removeItem("cartFinalTotal");

        const updatedUser = {
          ...JSON.parse(localStorage.getItem("user_info")),
          first_name: name,
          last_name: lastName,
          phone: phone
        };
        localStorage.setItem("user_info", JSON.stringify(updatedUser));

        alert("Заказ успешно оформлен!");
        navigate("/");
      } else {
        const err = await response.json();
        alert(`Ошибка при оформлении заказа: ${err.message || "Неизвестная ошибка"}`);
      }
    } catch (e) {
      console.error("Ошибка сети:", e);
      alert("Ошибка сети. Попробуйте ещё раз.");
    }
  };

  const deliveryInfo = getDeliveryInfo();

  return (
    <div className="checkout-container">
      <div className="delivery-section">
        <h2>Доставка</h2>
        <Link to="/cart" className="Click2-close-btn">✕</Link>

        {/* Адрес */}
        <div className="address-box">
          {isDelivery ? (
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="input-field"
            />
          ) : (
            "Узбекистан, Бухара"
          )}
          {isDelivery && (
            <div className="address-inputs">
              <input type="text" placeholder="Кв." value={apartment} onChange={(e) => setApartment(e.target.value)} />
              <input type="text" placeholder="Подъезд" value={entrance} onChange={(e) => setEntrance(e.target.value)} />
              <input type="text" placeholder="Этаж" value={floor} onChange={(e) => setFloor(e.target.value)} />
            </div>
          )}
        </div>

        {/* Данные пользователя */}
        <input type="text" placeholder="Ваше имя" value={name} onChange={(e) => setName(e.target.value)} className="input-field" />
        <input type="text" placeholder="Ваша фамилия" value={lastName} onChange={(e) => setLastName(e.target.value)} className="input-field" />
        <input type="text" placeholder="Ваш номер телефона" value={phone} onChange={(e) => handlePhoneChange(e.target.value)} className="input-field" />

        {/* Время */}
        <div className="time-buttons">
          <button
            className={`time-btn ${timeType === "soon" ? "active" : ""}`}
            onClick={() => setTimeType("soon")}
          >
            В ближайшее время
          </button>
          <button
            className={`time-btn ${timeType === "preorder" ? "active" : ""}`}
            onClick={() => setTimeType("preorder")}
          >
            Предзаказ
          </button>
        </div>

        {/* Оплата */}
        <div className="payment-select">
          <select value={payment} onChange={(e) => setPayment(e.target.value)}>
            <option value="cash">Наличными</option>
            <option value="card">Картой</option>
          </select>
        </div>

        {payment === "cash" && (
          <input
            type="number"
            placeholder="Сдача с..."
            value={cashChange}
            onChange={(e) => setCashChange(e.target.value)}
            className="input-field"
          />
        )}
      </div>

      {/* Комментарий */}
      <div className="order-summary-input">
        <input type="text" placeholder="Комментарий к заказу" value={comment} onChange={(e) => setComment(e.target.value)} className="input-field" />
      </div>

      {/* Итог */}
      <div className="order-summary">
        <div className="order-items">
          <div className="item-row"><span>Товары: {getCartTotalQuantity()} шт.</span><span>{getCartSubtotal()} UZS</span></div>
          {promoApplied && promoDiscount > 0 && (
            <div className="item-row">
              <span>Скидка</span>
              <span style={{ color: "green" }}>-{promoDiscount} UZS</span>
            </div>
          )}
          <div className="item-row"><span>Доставка</span><span>{deliveryInfo.cost === 0 ? "Бесплатно" : `${deliveryInfo.cost} UZS`}</span></div>
          {deliveryInfo.message && <div className="small-text">{deliveryInfo.message}</div>}
          <div className="item-row total"><span>Итого</span><span>{calculateTotal()} UZS</span></div>
        </div>

        <button className="order-button" onClick={handleOrder}>Заказать</button>
      </div>
    </div>
  );
}
