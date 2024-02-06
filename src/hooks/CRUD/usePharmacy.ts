import { IPharmacy, IPharmacyRequest } from "@/types/api";
import { PHARMACIES_ENDPOINT } from "@/utils/api/apiURL";
import useCRUD from "./useCRUD";

function usePharmacy() {
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
  } = useCRUD<IPharmacy | IPharmacyRequest>(PHARMACIES_ENDPOINT);

  return {
    pharmacy: data !== null ? data.pharmacy : null,
    pharmacies:
      datas !== null && datas.pharmacies !== null
        ? datas.pharmacies.length > 0
          ? datas.pharmacies
          : null
        : null,
    pageInfo,
    pharmacyUpdated: dataUpdate,
    isLoading,
    error,
    getPharmacy: getData,
    getPharmacies: getDatas,
    updatePharmacy: updateData,
  };
}

export default usePharmacy;
