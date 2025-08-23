import React, { useEffect, useState } from 'react';
import { YMaps, Map, Placemark } from 'react-yandex-maps';
import axios from 'axios';

export default function DeliveryAddressMap({ activeTab }) {
    const [branches, setBranches] = useState([]);

    useEffect(() => {
        axios.get('https://rest.sergosht-api.uz/api/branches/')
            .then(res => setBranches(res.data))
            .catch(err => console.error('Ошибка при загрузке точек:', err));
    }, []);

    const defaultState = {
        center: [39.7747, 64.4286],
        zoom: 13,
    };

    return (
        <YMaps>
            <Map defaultState={defaultState} width="100%" height="400px">
                {activeTab === 'delivery' && (
                    <Placemark
                        geometry={[39.7747, 64.4286]}
                        properties={{ balloonContent: 'Бухара, Бухарская ул., 147' }}
                        options={{ preset: 'islands#blueDotIcon' }}
                    />
                )}

                {activeTab === 'pickup' && branches.map(branch => (
                    <Placemark
                        key={branch.id}
                        geometry={[
                            parseFloat(branch.latitude),
                            parseFloat(branch.longitude)
                        ]}
                        properties={{ balloonContent: branch.title }}
                        options={{ preset: 'islands#redDotIcon' }}
                    />
                ))}
            </Map>
        </YMaps>
    );
}    