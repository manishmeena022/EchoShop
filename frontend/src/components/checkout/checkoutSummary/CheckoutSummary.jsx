import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import styles from "./CheckoutSummary.module.scss";
import Card from "../../card/Card";
import { CartDiscount } from "../../verifyCoupon/VerifyCoupon";
import { CALCULATE_SUBTOTAL, selectCartItems, selectCartTotalAmount, selectCartTotalQuantity } from "../../../redux/features/product/cartSlice";

const CheckoutSummary = () => {

  const { coupon } = useSelector((state) => state.coupon);
  const cartItems = useSelector(selectCartItems);
  const cartTotalAmount = useSelector(selectCartTotalAmount);
  const cartTotalQuantity = useSelector(selectCartTotalQuantity);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(CALCULATE_SUBTOTAL({ coupon: coupon }));
  }, [cartItems, dispatch, coupon]);

  return (
    <div>
      <h3>Checkout Summary</h3>
      <div>
        {cartItems.lenght === 0 ? (
          <>
            <p>No item in your cart.</p>
            <button className="--btn">
              <Link to="/#products">Back To Shop</Link>
            </button>
          </>
        ) : (
          <div>
            <p>
              <b>{`Cart item(s): ${cartTotalQuantity}`}</b>
            </p>
            <div className={styles.text}>
              <h4>Subtotal:</h4>
              <h3>{cartTotalAmount.toFixed(2)}</h3>
            </div>
            <CartDiscount />
            {cartItems.map((item, index) => {
              const { _id, name, price, cartQuantity } = item;
              return (
                <Card key={_id} cardClass={styles.card}>
                  <h4>Product: {name}</h4>
                  <p>Quantity: {cartQuantity}</p>
                  <p>Unit price: {price}</p>
                  <p>Set price: {price * cartQuantity}</p>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutSummary;
