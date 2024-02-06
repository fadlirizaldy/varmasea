import ProductMaster from "@/features/admin/FormsAddOrEdit/ProductMaster";
import { initialProduct } from "@/utils/initialData";
import React from "react";

const AddProductMaster = () => {
  return (
    <div>
      <ProductMaster type="ADD" initialData={initialProduct} />
    </div>
  );
};

export default AddProductMaster;
