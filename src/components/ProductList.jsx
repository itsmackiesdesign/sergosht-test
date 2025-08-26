import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BACKEND_URL, CATEGORIES_WITH_PRODUCTS, MEDIA_URL } from '../urls'
import useFetch from '../hopkes/useFetch'

export default function ProductList() {
  const { loading, result: categories } = useFetch(`${BACKEND_URL}${CATEGORIES_WITH_PRODUCTS}`)

  const addToCart = (product) => {
    try {
      const cartItem = {
        id: product.id,
        image: MEDIA_URL + product.image,
        title: product.title,
        variation: null,
        variation_id: null,
        price: product.price,
        quantity: 1,
        related_products: []
      };

      let storedCart = [];
      const rawCart = localStorage.getItem('cart');
      if (rawCart) {
        try {
          storedCart = JSON.parse(rawCart);
        } catch {
          storedCart = [];
        }
      }

      const existingIndex = storedCart.findIndex(i =>
        i.id === cartItem.id &&
        i.variation === cartItem.variation &&
        JSON.stringify(i.related_products) === JSON.stringify(cartItem.related_products)
      );

      if (existingIndex > -1) {
        storedCart[existingIndex].quantity += cartItem.quantity;
      } else {
        storedCart.push(cartItem);
      }

      localStorage.setItem('cart', JSON.stringify(storedCart));
      alert("Товар добавлен в корзину!");
    } catch (err) {
      console.error("Ошибка при добавлении в корзину:", err);
      alert("Произошла ошибка при добавлении товара в корзину.");
    }
  };

  if (loading) return <h2>загрузка...</h2>

  return (
    <div className='category-list'>
      {categories.map(category => (
        <div key={category.id} id={category.slug} className='category-block'>
          <h2>{category.title}</h2>

          {category.products.length > 0 ? (
            <div className='product-grid'>
              {category.products.map(product => (
                <div className='card' key={product.id}>
                  <div className="tags">
                    {product.tags.map((tag, id) => (
                      <div key={id} className={tag.class_name}>{tag.title}</div>
                    ))}
                  </div>
                  
                  <Link to={`/detail/${product.id}`} className="product-link">
                    <div className="img-container">
                      <img
                        className='img-card'
                        src={MEDIA_URL + product.image || '/no-image.png'}
                        alt={product.title}
                      />
                    </div>
                    
                    <div className="product-info">
                      <h5>{product.title}</h5>
                      <h6>{product.show_on_card}</h6>
                      <h3>{parseInt(product.price)} UZS</h3>
                    </div>
                  </Link>

                  <button 
                    className="plus-btn" 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      addToCart(product);
                    }}
                  >
                    +
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className='empty-message'>Bu kategoriyada hozircha mahsulot yo'q.</p>
          )}
        </div>
      ))}
    </div>
  )
}
