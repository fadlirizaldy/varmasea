import { IPharmacy, IProductPharmacy } from "@/types/api";
import { ADMIN_ENDPOINT, PHARMACIES_ENDPOINT } from "@/utils/api/apiURL";
import useCRUD from "./useCRUD";

function useProductOfPharmacy(pharmacyId: number) {
  const {
    datas: dataProductsOfPharmacies,
    dataUpdate: productAdded,
    isLoading: isLoadingProductsOfPharmacies,
    error: errorProductsOfPharmacies,
    getDatas: getProductsOfPharmacies,
    pageInfo: pageInfoProductsOfPharmacies,
  } = useCRUD<IProductPharmacy>(`${ADMIN_ENDPOINT}/products`);

  const {
    data: dataProductOfPharmacy,
    datas: dataProductsOfPharmacy,
    dataUpdate: productEditedDeleted,
    isLoading: isLoadingProductsOfPharmacy,
    error: errorProductsOfPharmacy,
    getData: getProductOfPharmacy,
    getDatas: getProductsOfPharmacy,
    updateData: updateProductOfPharmacy,
    pageInfo: pageInfoProductsOfPharmacy,
  } = useCRUD<IProductPharmacy>(
    `${PHARMACIES_ENDPOINT}/${pharmacyId}/products`
  );

  return {
    productsOfPharmacies:
      dataProductsOfPharmacies !== null &&
      dataProductsOfPharmacies.products !== null
        ? dataProductsOfPharmacies.products.length > 0
          ? dataProductsOfPharmacies.products
          : null
        : null,
    productOfPharmacy:
      dataProductOfPharmacy !== null ? dataProductOfPharmacy.product : null,
    productsOfPharmacy:
      dataProductsOfPharmacy !== null
        ? dataProductsOfPharmacy.products.length > 0
          ? dataProductsOfPharmacy.products
          : null
        : null,
    productOfPharmacyUpdated:
      productAdded !== null
        ? productAdded
        : productEditedDeleted !== null
        ? productEditedDeleted
        : null,
    pageInfoProductsOfPharmacy,
    pageInfoProductsOfPharmacies,
    isLoading: isLoadingProductsOfPharmacies || isLoadingProductsOfPharmacy,
    error: errorProductsOfPharmacies || errorProductsOfPharmacy,
    getProductsOfPharmacies,
    getProductOfPharmacy,
    getProductsOfPharmacy,
    updateProductOfPharmacy,
  };
}

export default useProductOfPharmacy;
