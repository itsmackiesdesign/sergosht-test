import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Header() {
  const [showSearch, setShowSearch] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    updateCartInfo();

    const token = localStorage.getItem('token');
    const savedUserInfo = JSON.parse(localStorage.getItem('user_info')) || null;

    setIsLoggedIn(!!token);
    setUserInfo(savedUserInfo);
  }, []);


  useEffect(() => {
    const handleStorageChange = () => updateCartInfo();
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const updateCartInfo = () => {
    const savedCart = localStorage.getItem('cart') && JSON.parse(localStorage.getItem('cart')) || [];
    const totalCount = savedCart.reduce((sum, item) => sum + (item.quantity || 0), 0);
    const totalPrice = savedCart.reduce((sum, item) => sum + (item.price * (item.quantity || 0)), 0);
    setCartCount(totalCount);
    setCartTotal(totalPrice);
  };

  useEffect(() => {
    fetch('https://rest.sergosht-api.uz/api/products/')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error(err));
  }, []);

  const filtered = products.filter(p =>
    p.title.toLowerCase().includes(query.toLowerCase())
  );

  const handleProductClick = (id) => {
    setShowSearch(false);
    setQuery('');
    navigate(`/detail/${id}`);
  };

  const handleLogout = () => {
    const confirmed = window.confirm('Вы точно хотите разлогиниться? Если вы выйдете из учетной записи...');
    if (confirmed) {
      localStorage.removeItem('token');
      localStorage.removeItem('user_info');
      setIsLoggedIn(false);
      setUserInfo(null);
      setShowMenu(false);
      navigate('/');
    }
  };

  const CartButton = () => (
    <Link to={'/Cart'} className='al1'>
      <button className="menu-item al1 cart-button">
        <i className="fa-solid fa-cart-shopping"></i>
        <span>Корзина</span>
        {cartCount > 0 && (
          <>
            <span className="cart-badge">{cartCount}</span>
            <span className="cart-badge">{cartTotal} UZS</span>
          </>
        )}
      </button>
    </Link>
  );

  return (
    <div className={'header-container'}>
      <div className={'header'}>
        <button
          className="menu-button"
          onClick={() => setShowMenu(true)}
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <i className="fa-solid fa-bars" />
        </button>

        <h1>Ser Gosht</h1>
        <div className={'header-icons'}>
          <i className="fa-solid fa-circle-info"></i>
          <i
            className="fa-solid fa-magnifying-glass"
            onClick={() => setShowSearch(true)}
          />
        </div>
      </div>

      {showSearch && (
        <div className={'search-modal'}>
          <div className={'search-header'}>
            <input
              type="text"
              placeholder="Поиск по товарам..."
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button onClick={() => setShowSearch(false)}>✖</button>
          </div>
          <ul className={'search-results'}>
            {filtered.map(product => (
              <li key={product.id} onClick={() => handleProductClick(product.id)}>
                {product.title}
              </li>
            ))}
          </ul>
        </div>
      )}

      {showMenu && (
        <div className="menu-modal" onClick={(e) => {
          if (e.target.className === 'menu-modal') {
            setShowMenu(false);
          }
        }}>
          <div className="menu-modal-content">
            <div className="side-menu">
              {isLoggedIn ? (
                <>

                  <button className="menu-item al1">
                    <Link to={'/my-profile'} className='al1'>
                      <i className="fa-solid fa-user "></i>
                      <span className='al1'>
                        {userInfo?.first_name
                          ? `${userInfo.first_name} ${userInfo.last_name || ''}`.trim()
                          : 'Ваш аккаунт'}
                      </span>

                    </Link>

                  </button>

                  <button className="menu-item al1">
                    <i className="fa-solid fa-clock-rotate-left"></i>
                    История заказов
                  </button>

                  <button className="menu-item al1">
                    <i className="fa-solid fa-wallet"></i>
                    Кэшбэк
                  </button>

                  <Link to={"/"} className='al1'>
                    <button className="menu-item al1">
                      <i className="fa-solid fa-bars al1"></i>
                      Меню
                    </button>
                  </Link>

                  <CartButton />

                  <Link to={"/reviews"} className='al1'>
                    <button className="menu-item al1">
                      <div className="review-icon">
                        <svg viewBox="0 0 24 24">
                          <path className="chat-bubble"
                            d="M12 2C6.48 2 2 6.48 2 12c0 1.54.36 2.98.97 4.29L1 23l6.71-1.97C9.02 21.64 10.46 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2z" />
                          <polygon className="star" points="12,8 14,14 10,14" />
                        </svg>
                      </div>
                      Отзывы
                    </button>
                  </Link>

                  <Link to={'/sergo-project'} className='al1'>
                    <button className="menu-item al1">
                      <i className="fa-solid fa-circle-info"></i>
                      Sergo'sht haqida qisqacha...
                    </button>
                  </Link>

                  <button className="menu-item al1" onClick={handleLogout}>
                    <i className="fa-solid fa-right-from-bracket"></i>
                    Разлогиниться
                  </button>
                </>
              ) : (
                <>
                  <button className="menu-item al1">
                    <i className="fa-solid fa-bars"></i>
                    Меню
                  </button>

                  <CartButton />

                  <Link to={"/reviews"} className='al1'>
                    <button className="menu-item al1">
                      <div className="review-icon">
                        <svg viewBox="0 0 24 24">
                          <path className="chat-bubble"
                            d="M12 2C6.48 2 2 6.48 2 12c0 1.54.36 2.98.97 4.29L1 23l6.71-1.97C9.02 21.64 10.46 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2z" />
                          <polygon className="star" points="12,8 14,14 10,14" />
                        </svg>
                      </div>
                      Отзывы
                    </button>
                  </Link>

                  <Link to={'/sergo-project'} className='al1'>
                    <button className="menu-item al1">
                      <i className="fa-solid fa-circle-info"></i>
                      Sergo'sht haqida qisqacha...
                    </button>
                  </Link>

                  <Link to={'/Login'} className='al1'>
                    <button className="menu-item al1">
                      <i className="fa-solid fa-right-to-bracket"></i>
                      Войти
                    </button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}