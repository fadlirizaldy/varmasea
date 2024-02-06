import { IProvince } from "@/types/api";
import { PROVINCES_ENDPOINT } from "@/utils/api/apiURL";
import useCRUD from "./useCRUD";

function useProvince() {
  const { data, datas, isLoading, error, getData, getDatas } =
    useCRUD<IProvince>(PROVINCES_ENDPOINT);

  return {
    province: data,
    provinces:
      datas !== null && datas.provinces !== null
        ? datas.provinces.length > 0
          ? datas.provinces
          : null
        : null,
    isLoading,
    error,
    getProvince: getData,
    getProvinces: getDatas,
  };
}

export default useProvince;
