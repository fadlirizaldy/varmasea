import { IAddressUser } from "@/types/api";
import { USER_ADDRESS_ENDPOINT } from "@/utils/api/apiURL";
import useCRUD from "./useCRUD";

function useUserAddress() {
  const {
    data,
    datas,
    getDatasMessage,
    dataUpdate,
    isLoading,
    error,
    getData,
    getDatas,
    updateData,
  } = useCRUD<IAddressUser>(USER_ADDRESS_ENDPOINT);

  const updateAddressUser = (
    type: "ADD" | "EDIT" | "DELETE" | "SETDEFAULT",
    body?: Partial<IAddressUser> | FormData,
    itemId?: number
  ) => {
    if (type === "DELETE") {
      updateData(
        "DELETE",
        { address_id: itemId } as Partial<IAddressUser>,
        undefined
      );
      return;
    } else if (type === "SETDEFAULT") {
      updateData(
        "ADD",
        { address_id: itemId } as Partial<IAddressUser>,
        undefined,
        "/default"
      );
      return;
    }
    updateData(type, body, itemId);
  };

  return {
    addressUser: data !== null ? data.address : null,
    addressesUser:
      datas !== null && datas.addresses !== null
        ? datas.addresses.length > 0
          ? datas.addresses
          : null
        : null,
    getAddressesUserMessage: getDatasMessage,
    addressUserUpdated: dataUpdate,
    isLoading,
    error,
    getAddressUser: getData,
    getAddressesUser: getDatas,
    updateAddressUser,
  };
}

export default useUserAddress;
