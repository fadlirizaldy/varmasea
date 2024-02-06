import { IUser } from "@/types/api";
import { USER_PROFILE_ENDPOINT } from "@/utils/api/apiURL";
import useCRUD from "./useCRUD";

function useUser() {
  const { data, dataUpdate, isLoading, error, getData, getDatas, updateData } = useCRUD<IUser>(USER_PROFILE_ENDPOINT);

  return {
    user: data !== null ? data?.user : null,
    userUpdated: dataUpdate,
    isLoading,
    error,
    getUser: getData,
    updateUser: updateData,
  };
}

export default useUser;
