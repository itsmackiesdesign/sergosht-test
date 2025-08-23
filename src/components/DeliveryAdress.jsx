import React, { useState } from 'react';
import DeliveryAddressMap from './DeliveryAddressMap';


export default function DeliveryAddress() {
  const [activeTab, setActiveTab] = useState('delivery');
  const [address, setAddress] = useState('Бухара, Бухарская ул., 147');
  const [apartment, setApartment] = useState('');
  const [entrance, setEntrance] = useState('');
  const [floor, setFloor] = useState('');

  const handleConfirm = () => {
    console.log({
      type: activeTab,
      address,
      apartment,
      entrance,
      floor,
    });
    
  };

  return (
    <div className="delivery-container">
      {/* Map */}
      <div className="delivery-map">
        <DeliveryAddressMap activeTab={activeTab} />
      </div>

      {/* Tabs */}
      <div className="delivery-tabs">
        <button
          onClick={() => setActiveTab('delivery')}
          className={`delivery-tab-button ${activeTab === 'delivery' ? 'active' : ''}`}
        >
          Доставка
        </button>
        <button
          onClick={() => setActiveTab('pickup')}
          className={`delivery-tab-button ${activeTab === 'pickup' ? 'active' : ''}`}
        >
          Самовывоз
        </button>
      </div>

      {/* Address section */}
      <div className="delivery-section">
        <div className="delivery-label">
          {activeTab === 'delivery' ? 'Адрес доставки' : 'Точка самовывоза'}
        </div>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="delivery-input"
          disabled={activeTab === 'pickup'}
        />

        {activeTab === 'delivery' && (
          <div className="delivery-input-row">
            <input
              type="text"
              placeholder="Квартира"
              value={apartment}
              onChange={(e) => setApartment(e.target.value)}
              className="delivery-input delivery-input-small"
            />
            <input
              type="text"
              placeholder="Подъезд"
              value={entrance}
              onChange={(e) => setEntrance(e.target.value)}
              className="delivery-input delivery-input-small"
            />
            <input
              type="text"
              placeholder="Этаж"
              value={floor}
              onChange={(e) => setFloor(e.target.value)}
              className="delivery-input delivery-input-small"
            />
          </div>
        )}
      </div>

      {/* Confirm button */}
      <button onClick={handleConfirm} className="delivery-button">
        Готово
      </button>
    </div>
  );
}