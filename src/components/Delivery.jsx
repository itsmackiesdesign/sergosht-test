import React from 'react'
import { Link, useLocation } from "react-router-dom"

export default function Delivery() {
  const location = useLocation();

  return (
    <div>
      <div className="delivery-toggle">
        <Link to="/">
          <button className={`buttondos ${location.pathname === "/" ? "active" : ""}`}>
            Доставка
          </button>
        </Link>
        <Link to="/pickup">
          <button className={`buttondos ${location.pathname === "/pickup" ? "active" : ""}`}>
            Самовывоз
          </button>
        </Link>
      </div>
    </div>
  )
}
