import React from 'react';

export default function Footer() {
  return (
    <footer className="footer">
      <p className="footer-powered">
        Работает на эффективном ядре <a href="#" className="footer-link">Foodpicásso™</a> ver. 3.2
      </p>

      <div className="footer-icons">
        <a href="#"><img src="/icons/instagram.svg" alt="Instagram" className="footer-icon" /></a>
        <a href="#"><img src="/icons/telegram.svg" alt="Telegram" className="footer-icon" /></a>
      </div>

      <div className="footer-links">
        <a href="#" className="footer-text">Политика конфиденциальности</a>
        <a href="#" className="footer-text">Публичная оферта</a>
      </div>

      <p className="footer-note">
        Акции, скидки, кэшбэк – в нашем приложении!
      </p>

      <div className="footer-store-icons">
        <a href="#"><img src="/icons/apple.svg" alt="App Store" className="footer-store-icon" /></a>
        <a href="#"><img src="/icons/googleplay.svg" alt="Google Play" className="footer-store-icon" /></a>
      </div>
    </footer>
  );
}
