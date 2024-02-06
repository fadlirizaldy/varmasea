import { Button } from "@/components/Button";
import { ImageInput } from "@/components/Form";
import OrderSteps from "@/components/OrderSteps";
import StatusBadge from "@/components/StatusBadge";
import ModalCancelOrder from "@/features/user/order/ModalCancelOrder";
import ModalConfirmDelivery from "@/features/user/order/ModalConfirmDelivery";
import useUserOrder from "@/hooks/CRUD/useUserOrder";
import useAuth from "@/hooks/useAuth";
import { currencyFormat } from "@/utils/formatting/currencyFormat";
import { gcpURL } from "@/utils/gcpURL";
import { getIdFromPath } from "@/utils/getIdFromPath";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { FaMapMarkerAlt, FaShoppingBasket } from "react-icons/fa";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { toast } from "sonner";

const OrderDetailPage = () => {
  const router = useRouter();
  const orderId = getIdFromPath(router);

  const { role } = useAuth();
  const {
    orderUser: orderData,
    getOrderUser,
    paymentProofUpdated,
    orderUserUpdated,
    updateOrderStatus,
    uploadPaymentProof,
  } = useUserOrder();
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [isModalConfirmDeliveryShown, setIsModalConfirmDeliveryShown] =
    useState(false);
  const [isModalCancelOrderShown, setIsModalCancelOrderShown] = useState(false);

  useEffect(() => {
    if (role === "User") {
      getOrderUser(Number(orderId));
    }
  }, [role, orderId]);

  const handleSubmitPaymentProof = () => {
    setIsButtonLoading(true);
    if (orderData === null || uploadedImage === null) {
      setIsButtonLoading(false);
      return;
    }
    uploadPaymentProof(orderData.payment.id, uploadedImage);
  };
  useEffect(() => {
    if (paymentProofUpdated !== null && paymentProofUpdated.data) {
      getOrderUser(Number(orderId));
      toast.success("Upload payment proof succesful", { duration: 1500 });
      return;
    }
    if (paymentProofUpdated !== null && paymentProofUpdated.message) {
      setIsButtonLoading(false);
    }
  }, [paymentProofUpdated]);

  const handleConfirmDelivery = () => {
    updateOrderStatus("Order Confirmed", Number(orderId));
  };
  const handleCancelOrder = () => {
    updateOrderStatus("Canceled", Number(orderId));
  };

  useEffect(() => {
    if (
      orderUserUpdated !== null &&
      orderUserUpdated.message === "Successfully Update Order Status"
    ) {
      getOrderUser(Number(orderId));
      toast.success("Order has been confirmed", { duration: 1500 });
      setIsModalConfirmDeliveryShown(false);
      return;
    }
    if (orderUserUpdated !== null && orderUserUpdated.message) {
      alert(orderUserUpdated.message);
    }
  }, [orderUserUpdated]);

  return (
    <>
      {orderData !== null && (
        <div className="max-w-[1200px] w-[90%] mx-auto pt-10">
          <div className="flex items-center justify-between">
            <button
              className="flex items-center gap-2 text-xl text-secondary_blue hover:underline"
              onClick={() => router.push("/profile/order")}
            >
              <MdOutlineKeyboardArrowLeft />
              Back
            </button>
            <div className="flex flex-row gap-2 items-center">
              <p className="uppercase text-slate-500">
                Order ID.{" "}
                <span className="font-medium text-black">{orderId}</span> |{" "}
                <span className="text-secondary_blue uppercase">
                  {orderData.order_status}
                </span>
              </p>
              {orderData.order_status === "Sent" && (
                <div>
                  <Button onClick={() => setIsModalConfirmDeliveryShown(true)}>
                    Confirm Delivery
                  </Button>
                </div>
              )}
              {orderData.order_status === "Waiting for Payment" && (
                <div>
                  <Button onClick={() => setIsModalCancelOrderShown(true)}>
                    Cancel Order
                  </Button>
                </div>
              )}
            </div>
          </div>
          <hr className="h-px my-5 bg-gray-200 border dark:bg-gray-700"></hr>

          <div className="flex justify-center mt-8">
            {orderData.order_status !== "Canceled" ? (
              <OrderSteps data={orderData} />
            ) : (
              <div className="text-center w-4/5">
                <p className="text-primary_red font-bold text-lg mb-4">
                  Order Canceled
                </p>
                <p className="text-primary_blue italic">
                  Sorry, we encountered problems processing your order.
                  We&apos;ll get back to you by phone to confirm the
                  cancellation and transfer back your paid amount to your
                  wallet.
                </p>
              </div>
            )}
          </div>

          <h2 className="text-xl flex items-center mb-3 gap-2 mt-8 font-bold">
            <FaMapMarkerAlt size={20} className="text-secondary_blue" />
            Shipment
          </h2>

          <section className="flex gap-7">
            <div className="flex flex-col gap-1 border-r border-slate-300 pr-6">
              <h3 className="text-lg font-medium">
                {orderData.address.province} | {orderData.address.city}
              </h3>
              <p className="line-clamp-2 text-slate-500">
                {orderData.address.detail}
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium">{orderData.shipping_name}</h3>
              <p className="text-slate-500 mb-3">
                {currencyFormat(orderData.shipping_cost)}
              </p>
            </div>
          </section>

          <div className="mt-5">
            <h2 className="text-xl flex items-center mb-3 gap-2 font-bold">
              <FaShoppingBasket size={20} className="text-secondary_blue" />
              Order Summary
            </h2>

            <div className="grid grid-cols-5 border-b border-slate-200">
              <h4 className="col-span-2 text-slate-400 font-medium text-lg py-2">
                Products
              </h4>
              <h4 className="text-slate-400 font-medium text-lg py-2">
                Price per unit
              </h4>
              <h4 className="text-slate-400 font-medium text-lg py-2">
                Quantity
              </h4>
              <h4 className="text-slate-400 font-medium text-lg py-2">
                Subtotal
              </h4>
            </div>
            {orderData.products.map((product, idx) => (
              <div
                key={idx}
                className={`grid grid-cols-5 px-2 py-1 ${
                  idx % 2 === 0 ? "bg-slate-200 bg-opacity-25" : "bg-white"
                }`}
              >
                <div className="flex gap-3 items-center col-span-2">
                  <img
                    src={gcpURL(product.image as string)}
                    alt={`Image of ${product.name}`}
                    className="w-20 h-14 object-cover"
                  />
                  <p className="line-clamp-2">{product.name}</p>
                </div>
                <p className="flex items-center">
                  {currencyFormat(product.selling_unit!)}
                </p>
                <p className="flex items-center">{product.amount}</p>
                <p className="flex items-center">
                  {currencyFormat(product.amount! * product.selling_unit!)}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-5">
            <div className="flex justify-end mt-3">
              <div className="w-2/5 grid grid-cols-2 gap-2">
                <h3 className="font-medium text-lg text-slate-500">
                  Subtotal Products
                </h3>
                <p className="text-end">
                  {currencyFormat(orderData.total_drugs_amount)}
                </p>
                <h3 className="font-medium text-lg text-slate-500">
                  Total Shipment Cost
                </h3>
                <p className="text-end">
                  {currencyFormat(orderData.shipping_cost)}
                </p>
                <h3 className="font-medium text-lg text-slate-500">
                  {orderData.payment.status === "Approved"
                    ? "Total Paid Amount"
                    : "Total Amount to Be Paid"}
                </h3>
                <p className="text-end text-2xl font-medium text-secondary_blue">
                  {currencyFormat(orderData.total_amount)}
                </p>
              </div>
            </div>
          </div>
          <hr className="h-px my-3 bg-gray-200 border dark:bg-gray-700"></hr>

          <div>
            <h2 className="text-xl flex items-center mb-3 gap-2 mt-4 font-bold">
              <span>Payment Proof</span>
              {orderData.payment.status !== "Not Uploaded" && (
                <StatusBadge status={orderData.payment.status} />
              )}
            </h2>

            {orderData.payment.status === "Rejected" && (
              <p className="text-primary_red italic">
                *Your proof of payment has been rejected. Please re-upload the
                proof of payment.
              </p>
            )}
            {orderData.order_status === "Waiting for Payment" && (
              <p className="text-slate-400 italic">
                *Please attach image file of your payment proof (.png, .jpg,
                .jpeg, etc).
              </p>
            )}
            {orderData.order_status === "Waiting for Confirmation" &&
              orderData.payment.status === "Waiting Approval" && (
                <p className="text-primary_blue italic">
                  *Your payment is being verified. Sit back and wait for
                  verification by our admin.
                </p>
              )}
            {orderData.payment.status === "Approved" &&
              orderData.order_status !== "Canceled" && (
                <p className="text-primary_blue italic">
                  Thank you for your order. We&apos;ll get back to you with your
                  medicines. We hope you stay healthy.
                </p>
              )}

            <div className="flex justify-center gap-4 mt-4">
              <div className="w-3/4">
                <ImageInput
                  titleText=""
                  initialImage={
                    orderData.payment.payment_file.length > 1
                      ? gcpURL(orderData.payment.payment_file)
                      : ""
                  }
                  setUploadedImage={setUploadedImage}
                  maxHeightDisplay="h-full"
                  isDisabled={orderData.order_status !== "Waiting for Payment"}
                />
              </div>
              {orderData.order_status === "Waiting for Payment" && (
                <div className="w-32">
                  <Button
                    onClick={() => handleSubmitPaymentProof()}
                    isLoading={isButtonLoading}
                    isDisabled={isButtonLoading}
                  >
                    Upload
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {isModalConfirmDeliveryShown && (
        <ModalConfirmDelivery
          isModalShown={isModalConfirmDeliveryShown}
          setIsModalShown={setIsModalConfirmDeliveryShown}
          isButtonLoading={isButtonLoading}
          handleConfirmDelivery={() => handleConfirmDelivery()}
        />
      )}
      {isModalCancelOrderShown && (
        <ModalCancelOrder
          isModalShown={isModalCancelOrderShown}
          setIsModalShown={setIsModalCancelOrderShown}
          isButtonLoading={isButtonLoading}
          handleCancelOrder={() => handleCancelOrder()}
        />
      )}
    </>
  );
};

export default OrderDetailPage;
OrderDetailPage.title = "Varmasea | Find your health solution";
