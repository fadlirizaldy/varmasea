import ProductPharmacy from "@/features/admin/FormsAddOrEdit/ProductPharmacy";
import { initialProduct } from "@/utils/initialData";
import React from "react";

const AddProductPharmacy = () => {
  return (
    <div>
      <ProductPharmacy type="ADD" initialData={initialProduct} />
    </div>
  );
};

export default AddProductPharmacy;
