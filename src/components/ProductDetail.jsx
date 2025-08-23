import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { MEDIA_URL } from '../urls'

export default function ProductDetail() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [count, setCount] = useState(1)
  const [selectedVariation, setSelectedVariation] = useState(null)
  const [addons, setAddons] = useState({})
  const [activeButton, setActiveButton] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`https://rest.sergosht-api.uz/api/products/${id}/`)
        const data = await res.json()
        setProduct(data)

        if (data.variations && data.variations.length > 0) {
          setSelectedVariation(data.variations[0])
        }

        if (data.related_products && data.related_products.length > 0) {
          const initialAddons = {}
          data.related_products.forEach(item => {
            initialAddons[item.id] = 0
          })
          setAddons(initialAddons)
        }
      } catch (error) {
        console.error('Ошибка при загрузке продукта:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  const increase = () => setCount(prev => prev + 1)
  const decrease = () => setCount(prev => (prev > 1 ? prev - 1 : 1))

  const handleMinusClick = () => {
    decrease();
    setActiveButton('minus');
  };

  const handlePlusClick = () => {
    increase();
    setActiveButton('plus');
  };

  const selectVariation = (variation) => {
    setSelectedVariation(variation)
  }

  const increaseAddon = (addonId) => {
    setAddons(prev => ({
      ...prev,
      [addonId]: prev[addonId] + 1
    }))
  }

  const decreaseAddon = (addonId) => {
    setAddons(prev => ({
      ...prev,
      [addonId]: Math.max(0, prev[addonId] - 1)
    }))
  }

  const getCurrentPrice = () => {
    if (selectedVariation) {
      return selectedVariation.price
    }
    return product.price
  }

  const getTotalPrice = () => {
    const basePrice = getCurrentPrice() * count

    let addonsPrice = 0
    if (product.related_products) {
      product.related_products.forEach(item => {
        addonsPrice += item.price * (addons[item.id] || 0)
      })
    }

    return basePrice + addonsPrice
  }

  if (loading) return <h2>загрузка...</h2>
  if (!product) return <h2>Товар не найден</h2>

  const hasVariations = product.variations && product.variations.length > 0

  const addToCart = () => {
    if (!product) return;

    try {
   
      const basePrice = selectedVariation ? selectedVariation.price : product.price;

      let addonsPrice = 0;
      if (product.related_products) {
        product.related_products.forEach(item => {
          addonsPrice += (addons[item.id] || 0) > 0 ? item.price : 0;
        });
      }

      const unitPrice = basePrice + addonsPrice; 

      const cartItem = {
        id: product.id,
        image: product.image,
        title: product.title,
        variation: selectedVariation ? selectedVariation.name : null,
        variation_id: selectedVariation ? selectedVariation.id : null,
        price: unitPrice, 
        quantity: count,
        related_products: []
      };

     
      if (product.related_products) {
        product.related_products.forEach(item => {
          const addonCount = addons[item.id];
          if (addonCount && addonCount > 0) {
            cartItem.related_products.push({
              id: item.id,
              title: item.title,
              quantity: addonCount,
              price: item.price
            });
          }
        });
      }

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


  return (
    <div className="product-card">
      <Link to="/" className="Click2-close-btn">✕</Link>

      <img src={product.image} alt={product.title} className="product-img" />

      <div className="product-info" style={{ paddingBottom: '100px' }}>
        <h2>{product.title}</h2>

        {product.description && (
          <p className="product-description">{product.description}</p>
        )}

        {!hasVariations && (
          <p>
            <span className="product-price">{product.price} UZS</span>
            <span className="product-weight">
              <span className="toch">•</span>
              {product.show_on_card}
            </span>
          </p>
        )}

        {hasVariations && (
          <div className="variations">
            <div className="variation-buttons">
              {product.variations.map((variation) => (
                <button
                  key={variation.id}
                  className={`variation-btn ${selectedVariation?.id === variation.id ? 'active' : ''}`}
                  onClick={() => selectVariation(variation)}
                >
                  <div className="variation-price">{variation.price} UZS</div>
                  <div className="variation-name">{variation.name}</div>
                </button>
              ))}
            </div>
          </div>
        )}



        {product.related_products?.length > 0 && (
          <div className="addons">
            <p>Qo'shimcha taklif</p>
            <div className="addons-list">
              {product.related_products.map((item) => (
                <div key={item.id} className="addon-item">
                  <div className="addon-info">
                    <div className="addon-icon">
                      <img src={item.image || '/default-addon-icon.png'} alt={item.title} />
                    </div>
                    <div className="addon-details">
                      <div className="addon-name">{item.title}</div>
                      <div className="addon-price">+{item.price} UZS</div>
                    </div>
                  </div>
                  <div className="addon-counter">
                    <button
                      className="addon-btn minus"
                      onClick={() => decreaseAddon(item.id)}
                      disabled={addons[item.id] === 0}
                    >
                      -
                    </button>
                    <span className="addon-count">{addons[item.id] || 0}</span>
                    <button
                      className="addon-btn plus"
                      onClick={() => increaseAddon(item.id)}
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="product-footer">
        <div className="counter">
          <button
            className={`minus-detail ${activeButton === 'minus' ? 'active-button' : ''}`}
            onClick={handleMinusClick}
          >
            -
          </button>
          <span className="number-detail">{count}</span>
          <button
            className={`plus-detail ${activeButton === 'plus' ? 'active-button' : ''}`}
            onClick={handlePlusClick}
          >
            +
          </button>
        </div>

        <button className="add-to-cart-btn" onClick={addToCart}>
          {getTotalPrice()} UZS
        </button>
      </div>
    </div>
  )
}
