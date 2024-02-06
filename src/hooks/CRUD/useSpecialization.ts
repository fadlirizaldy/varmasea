import { SPECIALIZATIONS_ENDPOINT } from "@/utils/api/apiURL";
import useCRUD from "./useCRUD";

interface ISpecialization {
  id: number;
  name: string;
}

function useSpecialization() {
  const { datas, isLoading, error, getDatas } = useCRUD<ISpecialization>(
    SPECIALIZATIONS_ENDPOINT
  );

  return {
    specializations:
      datas !== null && datas.specializations !== null
        ? datas.specializations.length > 0
          ? datas.specializations.map((item) => item.name)
          : null
        : null,
    specializationsResponse:
      datas !== null && datas.specializations !== null
        ? datas.specializations.length > 0
          ? datas.specializations
          : null
        : null,
    isLoading,
    error,
    getSpecializations: getDatas,
  };
}

export default useSpecialization;
