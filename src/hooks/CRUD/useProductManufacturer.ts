import { IProductManufacturer } from "@/types/api";
import { PRODUCT_MANUFACTURER_ENDPOINT } from "@/utils/api/apiURL";
import useCRUD from "./useCRUD";

function useProductManufacturer() {
  const { datas, isLoading, error, getDatas } = useCRUD<IProductManufacturer>(
    PRODUCT_MANUFACTURER_ENDPOINT
  );

  return {
    productManufacturers:
      datas !== null && datas.manufactures !== null
        ? datas.manufactures.length > 0
          ? datas.manufactures
          : null
        : null,
    isLoading,
    error,
    getProductManufacturers: getDatas,
  };
}

export default useProductManufacturer;
