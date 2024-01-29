import { Route, Routes, useLocation } from "react-router-dom";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Header, Footer, AdminOnlyRoute, ProductDetails } from "./components/index.js";
import { Home, Login, Register, Profile, Admin, NotFound, Product, Cart, CheckoutDetails, 
  Checkout, CheckoutSuccess, OrderHistory, OrderDetails, ReviewProducts, CheckoutFlutterwave, 
  CheckoutPaypal, CheckoutWallet, Wallet, Wishlist } from "./pages/index.js";
import { useDispatch, useSelector } from "react-redux";
import { getLoginStatus, getUser, selectIsLoggedIn, selectUser } from "./redux/features/auth/authSlice";
import { useEffect } from "react";
import { AnimatePresence } from "framer-motion";

axios.defaults.withCredentials = true;
// Deploy

function App() {
  const location = useLocation();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const user = useSelector(selectUser);

  useEffect(() => {
    dispatch(getLoginStatus());
  }, [dispatch]);

  useEffect(() => {
    if (isLoggedIn && user === null) {
      dispatch(getUser());
    }
  }, [dispatch, isLoggedIn, user]);

  return (
    <>
      <ToastContainer />
      <Header />
      <AnimatePresence>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/profile" element={<Profile />} />

          <Route
            path="/admin/*"
            element={
              <AdminOnlyRoute>
                <Admin />
              </AdminOnlyRoute>
            }
          />

          <Route path="/shop" element={<Product />} />
          <Route path="/product-details/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />

          <Route path="/checkout-details" element={<CheckoutDetails />} />
          <Route path="/checkout" element={<Checkout />} />
          
          <Route path="/checkout-paypal" element={<CheckoutPaypal />} />
          <Route path="/checkout-wallet" element={<CheckoutWallet />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/checkout-success" element={<CheckoutSuccess />} />

          <Route path="/order-history" element={<OrderHistory />} />
          <Route path="/order-details/:id" element={<OrderDetails />} />

          <Route path="/review-product/:id" element={<ReviewProducts />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>
      <Footer />
    </>
  );
}

export default App;
