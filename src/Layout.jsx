import Address from "./components/Address";
import Categories from "./components/Categories";
import Delivery from "./components/Delivery";
import Footer from "./components/Footer";
import Header from "./components/Header";
import ProductList from "./components/ProductList";
import Slider from "./components/Slider";
import { Outlet } from "react-router-dom"; 

export default function Layout() {
    return (
        <div className="container">
            <Header />

            <Delivery />

            <Address />

            <Slider />

            <Categories />

            <ProductList />

            <Outlet /> 

            <Footer />
        </div>
    );
}
