import StockMutationEdit from "@/features/admin/FormsAddOrEdit/StockMutationEdit";
import useStockMutation from "@/hooks/CRUD/useStockMutation";
import useAuth from "@/hooks/useAuth";
import { getIdFromPath } from "@/utils/getIdFromPath";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

const EditStockMutation = () => {
  const router = useRouter();
  const { role } = useAuth();
  const stockMutationId = getIdFromPath(router);

  const { get: getPharmacyType } = useSearchParams();
  const pharmacyType = getPharmacyType("ph");
  const { stockMutation, getStockMutation, isLoading } = useStockMutation();

  useEffect(() => {
    if (role === "Pharmacy Admin") {
      getStockMutation(Number(stockMutationId));
    }
  }, [role, stockMutationId]);

  return (
    <>
      {stockMutation && (pharmacyType === "from" || pharmacyType === "to") && (
        <div className="border border-slate-400 bg-white rounded-xl px-10 py-7 flex justify-start mt-3 min-h-full">
          <StockMutationEdit
            initialData={stockMutation}
            pharmacyType={pharmacyType}
          />
        </div>
      )}
    </>
  );
};

export default EditStockMutation;
