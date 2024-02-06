import { userOrderRoute } from "@/routes";
import { IOrder, IProductOrdered } from "@/types/api";
import { currencyFormat } from "@/utils/formatting/currencyFormat";
import { dateFormat } from "@/utils/formatting/dateFormat";
import { gcpURL } from "@/utils/gcpURL";
import { useRouter } from "next/router";
import React from "react";

const OrderedProductDetail = ({
  product,
}: {
  product: Partial<IProductOrdered>;
}) => {
  return (
    <div className="p-3 flex gap-4">
      <img
        src={gcpURL(product.image as string)}
        alt={`Image of ${product.name}`}
        className="w-14 h-14 inline mr-3"
      />
      <div className="flex justify-between w-full">
        <div>
          <h2 className="text-lg">{product.name}</h2>
          <p className="text-slate-400 line-clamp-2">{product.description}</p>
          <p>x{product.amount}</p>
        </div>
        <h4 className="text-primary_blue/50 flex orders-center font-medium">
          {currencyFormat(product.selling_unit!)}
        </h4>
      </div>
    </div>
  );
};

const OrderListPage = ({ orderDetail }: { orderDetail: IOrder[] }) => {
  const router = useRouter();
  return (
    <div className="flex flex-col gap-3">
      {orderDetail.map((order) => (
        <div key={order.id} className="border border-slate-200 rounded-md">
          <div className="p-3 flex orders-center justify-between bg-primary_blue/5 rounded-t-md">
            <div className="flex flex-row gap-4">
              <h5 className="text-gray-400">
                Ordered at: {dateFormat(order.order_date)}
              </h5>
              <h2>{order.pharmacy.name}</h2>
            </div>
            <div className="flex flex-row gap-0">
              <h5 className="text-secondary_blue font-medium">
                {order.order_status}
              </h5>

              <div className="divider divider-horizontal "></div>
              <h5
                className="cursor-pointer hover:text-primary_red"
                onClick={() => {
                  router.push(`${userOrderRoute}/${order.id}`);
                }}
              >
                See Detail
              </h5>
            </div>
          </div>
          <hr className="h-px bg-gray-200 border dark:bg-gray-700"></hr>

          <div className="flex flex-col divide-y">
            {order.products.map((orderedProduct, idx) => {
              return (
                <OrderedProductDetail key={idx} product={orderedProduct} />
              );
            })}
          </div>
          <hr className="h-px bg-gray-100 border dark:bg-gray-700"></hr>
          <div className="p-1 pr-2 flex orders-center justify-end ">
            <div className="flex flex-row gap-0 ">
              Total Amount: {currencyFormat(order.total_drugs_amount)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderListPage;
