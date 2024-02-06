import React from "react";
import StockMutationRequest from "@/features/admin/FormsAddOrEdit/StockMutationRequest";
import { initialStockMutationRequest } from "@/utils/initialData";

const AddStockMutation = () => {
  return (
    <div className="border border-slate-400 bg-white rounded-xl px-10 py-7 flex justify-start mt-3 min-h-full">
      <StockMutationRequest initialData={initialStockMutationRequest} />
    </div>
  );
};

export default AddStockMutation;
