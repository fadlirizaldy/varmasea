import { IRegisteredUser } from "@/types/api";
import { REGISTERED_USER_ENDPOINT } from "@/utils/api/apiURL";
import useCRUD from "./useCRUD";

function useRegisteredUser() {
  const { data, datas, pageInfo, isLoading, error, getData, getDatas } =
    useCRUD<IRegisteredUser>(REGISTERED_USER_ENDPOINT);

  return {
    registeredUser: data !== null ? data.user : null,
    registeredUsers:
      datas !== null && datas.users !== null
        ? datas.users.length > 0
          ? datas.users
          : null
        : null,
    pageInfo,
    isLoading,
    error,
    getRegisteredUser: getData,
    getRegisteredUsers: getDatas,
  };
}

export default useRegisteredUser;
