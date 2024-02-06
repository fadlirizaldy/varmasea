import ProductMaster from "@/features/admin/FormsAddOrEdit/ProductMaster";
import useProductMaster from "@/hooks/CRUD/useProductMaster";
import { getIdFromPath } from "@/utils/getIdFromPath";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

const EditProductMaster = () => {
  const router = useRouter();
  const productId = getIdFromPath(router);

  const { productMaster, getProductMaster, isLoading } = useProductMaster();

  useEffect(() => {
    getProductMaster(Number(productId));
  }, [productId]);

  return (
    <>
      {productMaster !== null && (
        <ProductMaster
          type="EDIT"
          initialData={productMaster}
          productId={Number(productId)}
        />
      )}
    </>
  );
};

export default EditProductMaster;
