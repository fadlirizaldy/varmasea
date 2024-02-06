import { IAdmin } from "@/types/api";
import { ADMIN_ENDPOINT } from "@/utils/api/apiURL";
import useCRUD from "./useCRUD";

function useAdmin() {
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
  } = useCRUD<IAdmin>(ADMIN_ENDPOINT);

  return {
    admin: data !== null ? data.admin : null,
    admins:
      datas !== null && datas.admins !== null
        ? datas.admins.length > 0
          ? datas.admins
          : null
        : null,
    pageInfo,
    adminUpdated: dataUpdate,
    isLoading,
    error,
    getAdmin: getData,
    getAdmins: getDatas,
    updateAdmin: updateData,
  };
}

export default useAdmin;
