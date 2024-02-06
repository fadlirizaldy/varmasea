import { IProvince } from "@/types/api";
import { PROVINCES_ENDPOINT } from "@/utils/api/apiURL";
import useCRUD from "./useCRUD";

function useCity() {
  const { data, isLoading, error, getData } =
    useCRUD<IProvince>(PROVINCES_ENDPOINT);

  const getCities = (provinceId: string) => {
    getData(Number(provinceId));
  };

  return {
    cities:
      data !== null && data.province.cities !== null
        ? data.province.cities.length > 0
          ? data.province.cities
          : null
        : null,
    isLoading,
    error,
    getCities,
  };
}

export default useCity;
