import OrderListPage from "@/features/user/order/OrderList";
import useUserOrder from "@/hooks/CRUD/useUserOrder";
import useAuth from "@/hooks/useAuth";
import Link from "next/link";
import React, { useEffect } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";

const OrderPage = () => {
  const { role } = useAuth();
  const { ordersUser, getOrdersUser } = useUserOrder();

  useEffect(() => {
    if (role === "User") {
      getOrdersUser(undefined, { limit: 999 });
    }
  }, [role]);

  const tabsTitle = [
    "All Orders",
    "Waiting for Payment",
    "Waiting for Confirmation",
    "Processed",
    "Sent",
    "Order Confirmed",
  ];

  return (
    <div className="max-w-[1200px] w-[90%] mx-auto pt-10">
      <Tabs
        onSelect={(index) => {
          if (index === 0) {
            getOrdersUser(undefined, { limit: 999 });
            return;
          }
          getOrdersUser(undefined, {
            order_status: tabsTitle[Number(index)],
          });
        }}
      >
        <TabList>
          {tabsTitle.map((title, idx) => (
            <Tab key={idx}>
              <h2 className="text-base md:text-xl p-1">{title}</h2>
            </Tab>
          ))}
        </TabList>
        {ordersUser !== null && (
          <TabPanel>
            <OrderListPage orderDetail={ordersUser} />
          </TabPanel>
        )}
        {ordersUser !== null &&
          tabsTitle.slice(1).map((status, idx) => (
            <TabPanel key={idx}>
              <OrderListPage orderDetail={ordersUser} />
            </TabPanel>
          ))}
        {ordersUser === null && (
          <p>
            Let&apos;s make your order!{" "}
            <Link
              href="/cart/checkout"
              className="text-lg text-primary_blue font-bold"
            >
              Order here
            </Link>
          </p>
        )}
      </Tabs>
    </div>
  );
};

export default OrderPage;
OrderPage.title = "Varmasea | Find your health solution";
