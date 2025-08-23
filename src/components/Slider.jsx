import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

import React, { useState } from 'react';

import useFetch from '../hopkes/useFetch';
import { BACKEND_URL, SLIDER } from '../urls';

export default function Slider() {
  const [selectedSlide, setSelectedSlide] = useState(null);
  const { loading, result: slides } = useFetch(`${BACKEND_URL}${SLIDER}/`);

  if (loading) return <h2>загрузка...</h2>;

  return (
    <>
      <Swiper>
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <img
              src={slide.image}
              alt={slide.title}
              onClick={() => slide.clickable && setSelectedSlide(slide)}
              style={{ cursor: slide.clickable ? 'pointer' : 'default' }}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {selectedSlide && (
        <div className="modal-overlay" onClick={() => setSelectedSlide(null)}>
          <div className="modal-window" onClick={(e) => e.stopPropagation()}>
            <div className="modal-image-wrapper">
              <img src={selectedSlide.image} alt={selectedSlide.title} />
              <button
                className="modal-close"
                onClick={() => setSelectedSlide(null)}
              >
                ✖
              </button>
            </div>
            <h2>{selectedSlide.title}</h2>
            <p>{selectedSlide.text}</p>
            <button className="apply-button">Применить промокод</button>
            {selectedSlide.promocode && (
              <div className="promo-code">{selectedSlide.promocode}</div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
