import React, { useEffect, useState } from "react";
import Footer from "./Footer";
import { Link } from "react-router-dom";


export default function Order() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch("https://rest.sergosht-api.uz/api/order", {
      headers: {
        Authorization: "508d62640ab48851117eecbed0153087801720f5",
      },
    })
      .then((res) => res.json())
      .then((data) => setOrders(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <>
      <div className="order-container">
        <div className="order-top">
          <Link to={"/"}>
            <i className="fas fa-arrow-left"></i>
          </Link>
          <h2 className="order-title">Ser Gosht</h2>
        </div>

        {/* Статус: количество заказов */}
        <div className="order-status-box">
          <p>
            <b>Статус:</b> {orders.length} заказов
          </p>
        </div>

        {orders.length === 0 ? (
          <p>Заказов пока нет</p>
        ) : (
          orders.map((order) => {
            // доставка
            let delivery = order.total > 20000 ? 0 : 3000;

            return (
              <div className="order-card" key={order.id}>
                {/* дата */}
                {order.created_at && (
                  <p className="order-date">
                    {new Date(order.created_at).toLocaleString("ru-RU")}
                  </p>
                )}

                {/* статус */}
                <span
                  className={`order-status-label ${
                    order.status === "принят"
                      ? "status-accepted"
                      : order.status === "отменён"
                      ? "status-cancelled"
                      : "status-pending"
                  }`}
                >
                  {order.status}
                </span>

                <p>Ser Gosht</p>
                <p>Заказ №{order.id}</p>
                <p>{order.address}</p>
                <p>{order.name}</p>
                <p>--</p>

                {/* промокод */}
                {order.promocode && <p>Промокод: {order.promocode}</p>}
                <p>--</p>

                {/* товары */}
                {order.products.map((item, i) => (
                  <div key={i}>
                    <p>
                      {item.product.title} – {item.product.price} UZS ×{" "}
                      {item.quantity} шт.
                    </p>
                  </div>
                ))}

                <p>--</p>
                <p>Форма оплаты: {order.payment_type}</p>
                <p>Сумма заказа: {order.total} UZS</p>

                {/* скидка */}
                {order.discount && <p>Скидка: {order.discount} UZS</p>}

                <p>Доставка: {delivery} UZS</p>
                <p>
                  <b>Итого: {order.total - (order.discount || 0) + delivery} UZS</b>
                </p>

                
              </div>
            );
          })
        )}
      </div>

      <Footer />
    </>
  );
}
