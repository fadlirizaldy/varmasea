import { IDoctor } from "@/types/api";
import { DOCTOR_ENDPOINT } from "@/utils/api/apiURL";
import useCRUD from "./useCRUD";

function useDoctor() {
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
  } = useCRUD<IDoctor>(DOCTOR_ENDPOINT);

  return {
    doctor: data !== null && data !== undefined ? data.doctor : null,
    doctors:
      datas !== null && datas.doctors !== null
        ? datas.doctors.length > 0
          ? datas.doctors
          : null
        : null,
    pageInfo,
    doctorUpdated: dataUpdate,
    isLoading,
    error,
    getDoctor: getData,
    getDoctors: getDatas,
    updateDoctor: updateData,
  };
}

export default useDoctor;
