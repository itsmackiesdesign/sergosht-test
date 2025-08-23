import React, { useState, useRef, useEffect } from "react";
import YandexMap from "./YandexMap";

export default function Pickup() {
  const [visibleCount, setVisibleCount] = useState(3);
  const [selectedBranchId, setSelectedBranchId] = useState(null);
  const [mode, setMode] = useState("pickup");
  const listRef = useRef(null);

  const branches = [
    { id: 1, title: "Филиал 1", address: "Бухара, улица Мухаммада Икбала, 19-уй", hours: "09:00 - 23:00" },
    { id: 2, title: "Филиал 2", address: "Бухара, улица Навоий, 12", hours: "09:00 - 22:00" },
    { id: 3, title: "Филиал 3", address: "Бухара, улица Пахлавон Махмуда, 7", hours: "09:00 - 20:00" },
    { id: 4, title: "Филиал 4", address: "Бухара, улица Гулобод, 5", hours: "10:00 - 21:30" },
    { id: 5, title: "Филиал 5", address: "Бухара, улица Шафирканская, 25", hours: "08:30 - 23:00" },
    { id: 6, title: "Филиал 6", address: "Бухара, улица Дехконобод, 3А", hours: "10:00 - 22:00" },
  ];

  const handleScroll = () => {
    const el = listRef.current;
    if (el && el.scrollTop + el.clientHeight >= el.scrollHeight - 5) {
      setVisibleCount((prev) => Math.min(prev + 3, branches.length));
    }
  };

  useEffect(() => {
    const el = listRef.current;
    if (el) {
      el.addEventListener("scroll", handleScroll);
      return () => el.removeEventListener("scroll", handleScroll);
    }
  }, []);

  const handleSelectBranch = (id) => {
    setSelectedBranchId(id);
  };

  return (
    <div className="pickup-container">
      {/* Map at the top */}
      <div className="pickup-map-container">
        <YandexMap selectedBranchId={selectedBranchId} branches={branches} />
      </div>

      {/* Mode buttons below the map */}
      <div className="pickup-mode-container">
        <button
          className={`pickup-mode-button ${mode === "delivery" ? "active" : "inactive"}`}
          onClick={() => setMode("delivery")}
        >
          Доставка
        </button>
        <button
          className={`pickup-mode-button ${mode === "pickup" ? "active" : "inactive"}`}
          onClick={() => setMode("pickup")}
        >
          Самовывоз
        </button>
      </div>

      {/* Content below buttons */}
      {mode === "pickup" && (
        <>
          <div className="pickup-title">
            <h2>Выберите филиал</h2>
          </div>

          <div ref={listRef} className="pickup-branch-list">
            {branches.slice(0, visibleCount).map((branch) => (
              <div
                key={branch.id}
                className={`pickup-branch-item ${selectedBranchId === branch.id ? "selected" : ""}`}
                onClick={() => handleSelectBranch(branch.id)}
              >
                <div className="pickup-branch-content">
                  <input
                    type="radio"
                    name="branch"
                    checked={selectedBranchId === branch.id}
                    onChange={() => handleSelectBranch(branch.id)}
                    className="pickup-branch-radio"
                  />
                  <div className="pickup-branch-details">
                    <h3 className="pickup-branch-title">
                      {branch.title}
                    </h3>
                    <p className="pickup-branch-address">
                      {branch.address}
                    </p>
                    <p className="pickup-branch-hours">
                      {branch.hours}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="pickup-action-container">
            <button
              className={`pickup-action-button ${selectedBranchId ? "enabled" : "disabled"}`}
              disabled={!selectedBranchId}
            >
              Готово
            </button>
          </div>
        </>
      )}

      {mode === "delivery" && (
        <div className="pickup-delivery-content">
          <p className="pickup-delivery-text">Здесь будет экран доставки.</p>
        </div>
      )}
    </div>
  );
}