import React from "react";
import { Route, Routes } from "react-router-dom";
import styles from "./Admin.module.scss";
import { Navbar, Home, AddProduct, ViewProducts, EditProduct, Orders, OrderDetails, Category, Coupon, Brand } from "../../components/index.js";

const Admin = () => {
  
  return (
    <div className={styles.admin}>
      <div className={styles.navbar}>
        <Navbar />
      </div>
      <div className={styles.content}>
        <Routes>
          <Route path="home" element={<Home />} />
          <Route path="all-products" element={<ViewProducts />} />
          <Route path="add-product" element={<AddProduct />} />
          <Route path="edit-product/:id" element={<EditProduct />} />
          <Route path="orders" element={<Orders />} />
          <Route path="order-details/:id" element={<OrderDetails />} />
          <Route path="coupon" element={<Coupon />} />
          <Route path="category" element={<Category />} />
          <Route path="brand" element={<Brand />} />
        </Routes>
      </div>
    </div>
  );
};

export default Admin;
