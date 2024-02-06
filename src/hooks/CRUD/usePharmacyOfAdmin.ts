import { IPharmacy } from "@/types/api";
import { ADMIN_ENDPOINT } from "@/utils/api/apiURL";
import useCRUD from "./useCRUD";
import usePharmacy from "./usePharmacy";

function usePharmacyOfAdmin() {
  const { datas, pageInfo, isLoading, error, getDatas } = useCRUD<IPharmacy>(
    `${ADMIN_ENDPOINT}/pharmacies`
  );

  const { pharmacyUpdated, updatePharmacy } = usePharmacy();

  return {
    pharmaciesOfAdmin:
      datas !== null && datas.pharmacies !== null
        ? datas.pharmacies.length > 0
          ? datas.pharmacies
          : null
        : null,
    pageInfo,
    pharmacyUpdated,
    isLoading,
    error,
    getPharmaciesOfAdmin: getDatas,
    updatePharmacy,
  };
}

export default usePharmacyOfAdmin;
