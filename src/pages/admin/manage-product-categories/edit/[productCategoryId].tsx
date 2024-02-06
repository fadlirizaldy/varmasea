import ProductCategory from "@/features/admin/FormsAddOrEdit/ProductCategory";
import useProductCategory from "@/hooks/CRUD/useProductCategory";
import { getIdFromPath } from "@/utils/getIdFromPath";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

const EditProductCategory = () => {
  const router = useRouter();
  const productCategoryId = getIdFromPath(router);

  const { productCategory, getProductCategory, isLoading } =
    useProductCategory();

  useEffect(() => {
    getProductCategory(Number(productCategoryId));
  }, [productCategoryId]);

  return (
    <>
      {productCategory && (
        <div className="border border-slate-400 bg-white rounded-xl px-10 py-7 flex justify-start mt-3 min-h-full">
          <ProductCategory
            type="EDIT"
            initialData={productCategory}
            productCategoryId={Number(productCategoryId)}
          />
        </div>
      )}
    </>
  );
};

export default EditProductCategory;
