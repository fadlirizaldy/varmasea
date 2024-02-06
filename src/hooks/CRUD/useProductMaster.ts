import { IProductMaster } from "@/types/api";
import { PRODUCTS_MASTER_ENDPOINT } from "@/utils/api/apiURL";
import useCRUD from "./useCRUD";

function useProductMaster() {
  const {
    data,
    datas,
    dataUpdate,
    pageInfo,
    isLoading,
    error,
    getData,
    getDatas,
    updateData,
  } = useCRUD<IProductMaster>(PRODUCTS_MASTER_ENDPOINT);

  return {
    productMaster: data !== null ? data.product : null,
    productsMaster:
      datas !== null && datas.products !== null
        ? datas.products.length > 0
          ? datas.products
          : null
        : null,
    productMasterUpdated: dataUpdate,
    pageInfo,
    isLoading,
    error,
    getProductMaster: getData,
    getProductsMaster: getDatas,
    updateProductMaster: updateData,
  };
}

export default useProductMaster;
