import Navbar from "./admin/navbar/Navbar";
import Home from "./admin/home/Home";
import AddProduct from "./admin/addProduct/AddProduct";
import ViewProducts from "./admin/viewProducts/ViewProducts";
import EditProduct from "./admin/editProduct/EditProduct";
import Orders from "./admin/orders/Orders";
import OrderDetails from "./admin/orderDetails/OrderDetails";
import Coupon from "./admin/coupon/Coupon";
import Card from "./card/Card";
import Category from "./admin/category/Category";
import Brand from "./admin/brand/Brand";
import Loader from "./loader/Loader";
import CheckoutForm from "./checkout/checkoutForm/CheckoutForm"
import CheckoutSummary from "./checkout/checkoutSummary/CheckoutSummary";
import Slider from "./slider/Slider";
import CarouselItem from "./carousel/CarouselItem";
import ProductCarousel from "./carousel/Carousel";
import ProductCategory from "./ProductCategory/ProductCategory";
import FooterLinks from "./footer/FooterLinks";
import {productData} from "./carousel/data";
import PageMenu from "./pageMenu/PageMenu";
import AdminOnlyRoute from "./adminOnlyRoute/AdminOnlyRoute";
import Header from "./header/Header";
import Footer from "./footer/Footer";
import ProductDetails from "./product/productDetails/ProductDetails";
import { Spinner } from "./loader/Loader";
import ProductFilter from "./product/productFilter/ProductFilter";
import ProductList from "./product/productList/ProductList";
import ProductItem from "./product/productItem/ProductItem";
import VerifyCoupon from "./verifyCoupon/VerifyCoupon.jsx";


export { 
        Navbar,
        VerifyCoupon,
        Home,
        Card,
        AddProduct,
        Loader,
        ViewProducts, 
        EditProduct, 
        Orders, 
        OrderDetails, 
        Category,
        Coupon, 
        Brand, 
        CheckoutForm, 
        CheckoutSummary, 
        Slider, 
        Spinner,
        CarouselItem,
        productData, 
        ProductItem,
        ProductCarousel,
        ProductFilter,
        ProductList, 
        ProductCategory, 
        FooterLinks, 
        PageMenu, 
        AdminOnlyRoute, 
        ProductDetails, 
        Header, 
        Footer
 }