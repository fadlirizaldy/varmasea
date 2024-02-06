import { IOrder, IPayment, TOrderStatus } from "@/types/api";
import {
  USER_ORDER_ENDPOINT,
  USER_UPLOAD_PAYMENT_ENDPOINT,
} from "@/utils/api/apiURL";
import useCRUD from "./useCRUD";
import { formData } from "@/utils/formData";

function useUserOrder() {
  const {
    data,
    datas,
    getDatasMessage,
    dataUpdate: orderUserUpdated,
    isLoading,
    error,
    getData,
    getDatas,
    updateData,
  } = useCRUD<IOrder>(USER_ORDER_ENDPOINT);
  const {
    dataUpdate: paymentProofUpdated,
    isLoading: isUploadingPaymentProof,
    error: errorUploadingPaymentProof,
    updateData: updatePaymentProof,
  } = useCRUD<IOrder>(USER_UPLOAD_PAYMENT_ENDPOINT);

  const updateOrderStatus = (newStatus: TOrderStatus, orderId: number) => {
    updateData("EDIT", { order_status: newStatus }, orderId);
  };
  const uploadPaymentProof = (paymentId: number, paymentFile: File) => {
    const requestBody = {
      id: paymentId,
      file: paymentFile,
    };
    updatePaymentProof("ADD", formData(requestBody));
  };

  return {
    orderUser: data !== null ? data.order : null,
    ordersUser:
      datas !== null && datas.orders !== null
        ? datas.orders.length > 0
          ? datas.orders
          : null
        : null,
    getOrdersUserMessage: getDatasMessage,
    orderUserUpdated,
    paymentProofUpdated,
    isLoading: isLoading || isUploadingPaymentProof,
    error: error || errorUploadingPaymentProof,
    getOrderUser: getData,
    getOrdersUser: getDatas,
    updateOrderStatus,
    uploadPaymentProof,
  };
}

export default useUserOrder;
