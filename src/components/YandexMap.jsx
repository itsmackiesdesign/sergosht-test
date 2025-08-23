import React, { useEffect, useState } from 'react';
import { YMaps, Map, Placemark } from 'react-yandex-maps';
import axios from 'axios';

export default function YandexMap() {
  const [branches, setBranches] = useState([]);

  useEffect(() => {
    axios.get('https://rest.sergosht-api.uz/api/branches/')
      .then(res => setBranches(res.data))
      .catch(err => console.error('Ошибка при загрузке точек:', err));
  }, []);

  const defaultState = {
    center: [39.76, 64.43],
    zoom: 12,
  };

  return (
    <YMaps>
      <Map defaultState={defaultState} width="100%" height="400px">
        {branches.map(branch => (
          <Placemark
            key={branch.id}
            geometry={[
              parseFloat(branch.latitude),  
              parseFloat(branch.longitude)
            ]}
            properties={{ balloonContent: branch.title }}
          />
        ))}
      </Map>
    </YMaps>
  );
}
