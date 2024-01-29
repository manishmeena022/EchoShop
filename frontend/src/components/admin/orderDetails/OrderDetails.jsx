import React from "react";
import { useParams } from "react-router-dom";
import "./OrderDetails.module.scss";
import { useSelector } from "react-redux";
import ChangeOrderStatus from "../changeOrderStatus/ChangeOrderStatus";
import Order from "../../../pages/orderDetails/Order";

const OrderDetails = () => {
  const { id } = useParams();
  const { order } = useSelector(
    (state) => state.order
  );

  return (
    <>
      <Order />
      <div className="container">
        <ChangeOrderStatus order={order} id={id} />
      </div>
    </>
  );
};

export default OrderDetails;
