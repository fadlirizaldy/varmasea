import ProductCategory from "@/features/admin/FormsAddOrEdit/ProductCategory";
import { initialProductCategory } from "@/utils/initialData";
import React from "react";

const AddProductCategory = () => {
  return (
    <div className="border border-slate-400 bg-white rounded-xl px-10 py-7 flex justify-start mt-3 min-h-full">
      <ProductCategory type="ADD" initialData={initialProductCategory} />
    </div>
  );
};

export default AddProductCategory;
