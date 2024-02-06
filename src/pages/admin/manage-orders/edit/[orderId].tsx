import Order from "@/features/admin/FormsAddOrEdit/Order";
import useOrderPharmacy from "@/hooks/CRUD/useOrderPharmacy";
import useAuth from "@/hooks/useAuth";
import { getIdFromPath } from "@/utils/getIdFromPath";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

const EditOrder = () => {
  const router = useRouter();
  const { role } = useAuth();
  const orderId = getIdFromPath(router);

  const { orderPharmacy, getOrderPharmacy, isLoading } = useOrderPharmacy();

  useEffect(() => {
    if (role === "Pharmacy Admin") {
      getOrderPharmacy(Number(orderId));
    }
  }, [role, orderId]);
  return (
    <>
      {orderPharmacy !== null && (
        <div className="border border-slate-400 bg-white rounded-xl px-10 py-7 flex justify-start mt-3 min-h-full">
          <Order type="EDIT" initialData={orderPharmacy} />
        </div>
      )}
    </>
  );
};

export default EditOrder;
EditOrder.title = "Admin | Edit Order Varmasea";
