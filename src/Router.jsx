
import { BrowserRouter, Routes, Route } from 'react-router-dom';


import Layout from './Layout';
import Reviews from './components/Reviews';
import Login from './components/Login';
import Cart from './components/Cart';
import ProductDetail from './components/ProductDetail';
import Sergo_Project from './components/Sergo_project';
import Click2 from './components/Click2';
import Pickup from './components/Pickup';
import MyProfile from './components/MyProfile';
import Order from './components/Order';
import ProtectedRoute from './components/ProtectedRoute';


export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/pickup" element={<Pickup />} />
        <Route path="/click2" element={<Click2 />} />
        <Route path="/sergo-project" element={<Sergo_Project />} />
        <Route path="/detail/:id" element={<ProductDetail />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/my-profile" element={<MyProfile />} />
          <Route path="/order" element={<Order />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

