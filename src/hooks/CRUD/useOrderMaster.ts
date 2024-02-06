import { IOrder, TOrderStatus } from "@/types/api";
import { ORDERS_MASTER_ENDPOINT } from "@/utils/api/apiURL";
import useCRUD from "./useCRUD";

function useOrderMaster() {
  const { data, datas, pageInfo, isLoading, error, getData, getDatas } =
    useCRUD<IOrder>(ORDERS_MASTER_ENDPOINT);

  return {
    orderMaster: data !== null ? data.order : null,
    ordersMaster:
      datas !== null && datas.orders !== null
        ? datas.orders.length > 0
          ? datas.orders
          : null
        : null,
    pageInfo,
    isLoading,
    error,
    getOrderMaster: getData,
    getOrdersMaster: getDatas,
  };
}

export default useOrderMaster;
