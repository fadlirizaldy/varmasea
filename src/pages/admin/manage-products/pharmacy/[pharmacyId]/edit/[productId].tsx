import ProductPharmacy from "@/features/admin/FormsAddOrEdit/ProductPharmacy";
import useProductOfPharmacy from "@/hooks/CRUD/useProductOfPharmacy";
import { getIdFromPath } from "@/utils/getIdFromPath";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

const EditProductPharmacy = () => {
  const router = useRouter();
  const pharmacyId =
    router.asPath.split("/")[router.asPath.split("/").length - 2];
  const productId = getIdFromPath(router);

  const { productOfPharmacy, getProductOfPharmacy, isLoading } =
    useProductOfPharmacy(Number(pharmacyId));

  useEffect(() => {
    getProductOfPharmacy(Number(productId));
  }, [productId]);

  return (
    <>
      {productOfPharmacy !== null && (
        <ProductPharmacy
          type="EDIT"
          initialData={productOfPharmacy}
          pharmacyId={Number(pharmacyId)}
          productId={Number(productId)}
        />
      )}
    </>
  );
};

export default EditProductPharmacy;
