import { IOrder } from "@/types/api";
import React from "react";

const OrderSteps = ({ data }: { data: Partial<IOrder> }) => {
  const statusOrder = [
    "Waiting for Payment",
    "Waiting for Confirmation",
    "Processed",
    "Sent",
    "Order Confirmed",
  ];
  const indexCurrentStatus = statusOrder.findIndex(
    (status) => status === data.order_status
  );
  return (
    <ul className="steps">
      {statusOrder.map((status, idx) => {
        return (
          <li
            className={`step font-medium ${
              idx <= indexCurrentStatus &&
              data.order_status !== "Order Confirmed" &&
              "step after:!bg-primary_orange after:!text-primary_blue before:!bg-primary_orange"
            } ${
              data.order_status === "Order Confirmed" &&
              "step after:!bg-primary_green after:!text-white before:!bg-primary_green"
            } `}
            key={idx}
            data-content={`${
              data.order_status === "Order Confirmed"
                ? "✓"
                : indexCurrentStatus <= idx
                ? (idx + 1).toString()
                : "✓"
            }`}
          >
            {status}
          </li>
        );
      })}
    </ul>
  );
};

export default OrderSteps;
