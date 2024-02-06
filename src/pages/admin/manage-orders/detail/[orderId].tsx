import Order from "@/features/admin/FormsAddOrEdit/Order";
import useOrderMaster from "@/hooks/CRUD/useOrderMaster";
import useOrderPharmacy from "@/hooks/CRUD/useOrderPharmacy";
import useAuth from "@/hooks/useAuth";
import { getIdFromPath } from "@/utils/getIdFromPath";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

const OrderDetail = () => {
  const router = useRouter();
  const { role } = useAuth();
  const orderId = getIdFromPath(router);
  const { orderMaster, getOrderMaster } = useOrderMaster();

  useEffect(() => {
    if (role === "Admin") {
      getOrderMaster(Number(orderId));
    }
  }, [role, orderId]);

  return (
    <>
      {orderMaster !== null && (
        <div className="border border-slate-400 bg-white rounded-xl px-10 py-7 flex justify-start mt-3 min-h-full">
          <Order type="DETAIL" initialData={orderMaster} />
        </div>
      )}
    </>
  );
};

export default OrderDetail;
OrderDetail.title = "Admin | Order Detail Varmasea";
