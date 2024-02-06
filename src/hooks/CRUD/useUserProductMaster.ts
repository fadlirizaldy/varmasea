import { IProductMaster } from "@/types/api";
import { USER_PRODUCT_MASTER } from "@/utils/api/apiURL";
import useCRUD from "./useCRUD";

function useUserProductMaster() {
  const {
    data,
    datas,
    pageInfo,
    getDatasMessage,
    dataUpdate,
    isLoading,
    error,
    getData,
    getDatas,
    updateData,
  } = useCRUD<IProductMaster>(USER_PRODUCT_MASTER);

  return {
    productMasterUser: data !== null ? data.product : null,
    productsMasterUser:
      datas !== null && datas.products !== null
        ? datas.products.length > 0
          ? datas.products
          : null
        : null,
    pageInfo,
    getProductsMasterMessage: getDatasMessage,
    productMasterUserUpdated: dataUpdate,
    isLoading,
    error,
    getProductMasterUser: getData,
    getProductsMasterUser: getDatas,
    updateProductMasterUser: updateData,
  };
}

export default useUserProductMaster;
