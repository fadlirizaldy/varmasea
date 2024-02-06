import { IOrder, TOrderStatus } from "@/types/api";
import { ADMIN_ENDPOINT } from "@/utils/api/apiURL";
import useCRUD from "./useCRUD";

function useOrderPharmacy() {
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
  } = useCRUD<IOrder>(`${ADMIN_ENDPOINT}/orders`);

  const updateOrderStatus = (newStatus: TOrderStatus, orderId: number) => {
    const body: Partial<IOrder> = {
      order_status: newStatus,
    };
    updateData("EDIT", body, orderId);
  };

  return {
    orderPharmacy: data !== null ? data.order : null,
    ordersPharmacy:
      datas !== null && datas.orders !== null
        ? datas.orders.length > 0
          ? datas.orders
          : null
        : null,
    pageInfo,
    orderStatusUpdated: dataUpdate !== null ? dataUpdate : null,
    isLoading,
    error,
    getOrderPharmacy: getData,
    getOrdersPharmacy: getDatas,
    updateOrderStatus,
  };
}

export default useOrderPharmacy;
