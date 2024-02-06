import { IProductCategory } from "@/types/api";
import { PRODUCT_CATEGORIES_LIST_ENDPOINT } from "@/utils/api/apiURL";
import useCRUD from "./useCRUD";

function useProductCategoryList() {
  const { datas, isLoading, error, getDatas } = useCRUD<IProductCategory>(
    PRODUCT_CATEGORIES_LIST_ENDPOINT
  );

  return {
    productCategoriesList:
      datas !== null && datas.categories !== null
        ? datas.categories.length > 0
          ? datas.categories
          : null
        : null,
    isLoading,
    error,
    getProductCategoriesList: getDatas,
  };
}

export default useProductCategoryList;
