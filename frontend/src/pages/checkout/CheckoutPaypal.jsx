import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import styles from "../../components/checkout/checkoutForm/CheckoutForm.module.scss";
import { Card, CheckoutSummary } from "../../components/index.js";
import { CALCULATE_SUBTOTAL, selectCartItems, selectCartTotalAmount } from "../../redux/features/product/cartSlice";
import { selectPaymentMethod, selectShippingAddress } from "../../redux/features/product/checkoutSlice";
import { createOrder } from "../../redux/features/product/orderSlice";


const CheckoutPaypal = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartTotalAmount = useSelector(selectCartTotalAmount);
  const cartItems = useSelector(selectCartItems);
  const shippingAddress = useSelector(selectShippingAddress);
  const paymentMethod = useSelector(selectPaymentMethod);

  const [urlParams] = useSearchParams();
  const payment = urlParams.get("payment");
  const { coupon } = useSelector((state) => state.coupon);
  
  useEffect(() => {
    dispatch(CALCULATE_SUBTOTAL({ coupon: coupon }));
  }, [cartItems, dispatch]);

  // Save order to Order History
  const saveOrder = async () => {
    const today = new Date();
    const formData = {
      orderDate: today.toDateString(),
      orderTime: today.toLocaleTimeString(),
      orderAmount: cartTotalAmount,
      orderStatus: "Order Placed...",
      cartItems,
      shippingAddress,
      paymentMethod,
      coupon: coupon != null ? coupon : { name: "nil" },
    };
    dispatch(createOrder(formData));
    navigate("/checkout-success");
  };

  useEffect(() => {
    if (payment === "successful" && cartTotalAmount > 0) {
      toast.success("Payment successful");
      saveOrder();
    }
    if (payment === "failed") {
      toast.success("Payment Failed, please try again later");
    }
  }, [payment, cartTotalAmount]);

  function extractCartProperties(arr) {
    return arr.map((item) => {
      return { sku: item.sku, quantity: item.quantity };
    });
  }

  const initialOptions = {
    "client-id": process.env.REACT_APP_PAYPAL_CID,
    currency: "USD",
    intent: "capture",
  };

  //   Create Order paypal
  const createOrderPaypal = (data) => {
    return fetch(
      `${process.env.REACT_APP_BACKEND_URL}/my-server/create-paypal-order`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          product: {
            description: "EchoShop product",
            cost: cartTotalAmount,
          },
          purchase_units: [
            {
              amount: {
                value: cartTotalAmount,
              },
            },
          ],
        }),
      }
    )
      .then((response) => response.json())
      .then((order) => order.id);
  };

  const onApprove = (data) => {
    return fetch(
      `${process.env.REACT_APP_BACKEND_URL}/my-server/capture-paypal-order`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderID: data.orderID,
        }),
      }
    ).then((response) => response.json());
  };
  
  return (
    <PayPalScriptProvider options={initialOptions}>
      <section>
        <div className={`container ${styles.checkout}`}>
          <h2>Checkout</h2>
          <form>
            <div>
              <Card cardClass={styles.card}>
                <CheckoutSummary />
              </Card>
            </div>
            <div>
              <Card cardClass={`${styles.card} ${styles.pay}`}>
                <h3>Paypal Checkout</h3>

                <PayPalButtons
                  createOrder={(data, actions) => {
                    return actions.order.create({
                      purchase_units: [
                        {
                          amount: {
                            value: cartTotalAmount,
                          },
                        },
                      ],
                    });
                  }}
                  onApprove={(data, actions) => {
                    return actions.order.capture().then((details) => {
                      const status = details.status;
                      if (status === "COMPLETED") {
                        toast.success("Payment Successful");
                        saveOrder();
                      } else {
                        toast.error(
                          "Something went wrong!!!  Please Contact us."
                        );
                      }
                    });
                  }}
                />
              </Card>
            </div>
          </form>
        </div>
      </section>
    </PayPalScriptProvider>
  );
};

export default CheckoutPaypal;
