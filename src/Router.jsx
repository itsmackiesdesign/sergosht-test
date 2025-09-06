
import { BrowserRouter as RouterProvider, Routes, Route } from 'react-router-dom';

import Layout from './Layout';
import Reviews from './components/Reviews';
import Login from './components/Login';
import Cart from './components/Cart';
import ProductDetail from './components/ProductDetail';
import Sergo_Project from './components/Sergo_project';
import Click2 from './components/Click2';
import Pickup from './components/Pickup';
import MyProfile from './components/MyProfile';



export default function AppRouter() {
  return (
    <RouterProvider>
      <Routes>

        <Route path="/" element={<Layout />} />
        <Route path="/my-profile" element={<MyProfile />} />

        <Route path="/reviews" element={<Reviews />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Cart" element={<Cart />} /> 
        <Route path="/Pickup" element={<Pickup />} /> 
        {/* <Route path="/YandexMap" element={<YandexMap />} />  */}
        <Route path="/Click2" element={<Click2 />} /> 
        <Route path="/sergo-project" element={<Sergo_Project />} />
        <Route path="/detail/:id" element={<ProductDetail />} />
        <Route path="/order" element={<Order />} />
        
      </Routes>
    </RouterProvider>
  );
}
