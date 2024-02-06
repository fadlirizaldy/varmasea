import { IProductCategory } from "@/types/api";
import { PRODUCT_CATEGORIES_ENDPOINT } from "@/utils/api/apiURL";
import useCRUD from "./useCRUD";

function useProductCategory() {
  const {
    data,
    datas,
    pageInfo,
    dataUpdate,
    isLoading,
    error,
    getData,
    getDatas,
    updateData,
  } = useCRUD<IProductCategory>(PRODUCT_CATEGORIES_ENDPOINT);

  return {
    productCategory: data !== null ? data.category : null,
    productCategories:
      datas !== null && datas.categories !== null
        ? datas.categories.length > 0
          ? datas.categories
          : null
        : null,
    pageInfo,
    productCategoryUpdated: dataUpdate,
    isLoading,
    error,
    getProductCategory: getData,
    getProductCategories: getDatas,
    updateProductCategory: updateData,
  };
}

export default useProductCategory;
