import { IDoctor } from "@/types/api";
import { DOCTOR_PROFILE_ENDPOINT } from "@/utils/api/apiURL";
import useCRUD from "./useCRUD";

function useDoctorProfile() {
  const { data, pageInfo, dataUpdate, isLoading, error, getData, updateData } =
    useCRUD<IDoctor>(DOCTOR_PROFILE_ENDPOINT);

  return {
    doctorProfile: data !== null ? data.doctor : null,
    pageInfo,
    doctorUpdated: dataUpdate,
    isLoading,
    error,
    getDoctorProfile: getData,
    updateDoctor: updateData,
  };
}

export default useDoctorProfile;
