import { Button, ButtonBorderOnly } from "@/components/Button";
import { adminManageOrdersRoute } from "@/routes";
import { IOrder, IProductOrdered } from "@/types/api";
import { LatLng } from "leaflet";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { FaLongArrowAltDown } from "react-icons/fa";
import { currencyFormat } from "@/utils/formatting/currencyFormat";
import { isImageExtension } from "@/utils/formFieldValidation";
import { ButtonDanger } from "@/components/Button/Button";
import ModalStatus from "@/features/admin/ModalStatus";
import ListPayment from "../order/ListPayment";
import Image from "next/image";
import { gcpURL } from "@/utils/gcpURL";
import { timestampFormat } from "@/utils/formatting/timestampFormat";
import useOrderPharmacy from "@/hooks/CRUD/useOrderPharmacy";
import ContactTools from "../ContactTools";
import { toast } from "sonner";
import OrderSteps from "@/components/OrderSteps";

const countSubTotalProduct = (data: Partial<IProductOrdered>[]) => {
  return data?.reduce((acc, curr) => {
    const tmp = curr.amount! * curr.selling_unit!;
    return tmp + acc;
  }, 0);
};

const AddressDetail = ({
  type,
  orderData,
  isWhatsappShortcutShown,
}: {
  type: "sender" | "receiver";
  orderData: Partial<IOrder>;
  isWhatsappShortcutShown?: boolean;
}) => {
  let name, phoneNumber, address;

  switch (type) {
    case "sender":
      name = orderData.pharmacy!.name;
      phoneNumber = orderData.pharmacy!.phone_number;
      address = orderData.pharmacy!.address;
      break;
    case "receiver":
      name = orderData.user!.name;
      phoneNumber = orderData.user!.phone_number;
      address = orderData.address;
      break;
  }
  return (
    <div className="p-3 border border-slate-300 rounded-md w-full">
      <h2 className="font-medium text-lg mb-2">{name}</h2>
      <div className="flex gap-4">
        <span className="text-gray-600">{phoneNumber}</span>
        {isWhatsappShortcutShown && <ContactTools phoneNumber={phoneNumber} />}
      </div>
      <p className="text-gray-600">
        {address!.city}, {address!.province}
      </p>
      <p className="text-gray-600 text-justify">{address!.detail}</p>
    </div>
  );
};

const Order = ({
  type,
  initialData,
}: {
  type: "EDIT" | "DETAIL";
  initialData: Partial<IOrder>;
}) => {
  const router = useRouter();
  const {
    orderPharmacy,
    orderStatusUpdated,
    updateOrderStatus,
    getOrderPharmacy,
    isLoading,
  } = useOrderPharmacy();
  const [isModalShown, setIsModalShown] = useState(false);
  const [modalType, setModalType] = useState<"accept" | "reject" | "cancel">(
    "reject"
  );

  const [orderData, setOrderData] = useState(initialData);
  const [mapZoom, setMapZoom] = useState(12.8);
  const [mapCenter, setMapCenter] = useState<Partial<LatLng>>({
    lat: initialData.address!.latitude,
    lng: initialData.address!.longitude,
  });
  const [mapCenter2] = useState<Partial<LatLng>>({
    lat: initialData.pharmacy!.address.latitude,
    lng: initialData.pharmacy!.address.longitude,
  });

  const OrderMap = dynamic(() => import("@/components/MapView"), {
    ssr: false,
  });

  const newStatus = () => {
    switch (orderData.order_status) {
      case "Waiting for Confirmation":
        if (modalType === "accept") {
          return "Processed";
        } else if (modalType === "reject") {
          return "Waiting for Payment";
        }
      case "Processed":
        if (modalType === "accept") {
          return "Sent";
        } else if (modalType === "cancel") {
          return "Canceled";
        }
    }
  };

  useEffect(() => {
    if (orderPharmacy !== null) {
      setOrderData(orderPharmacy);
    }
  }, [orderPharmacy]);

  useEffect(() => {
    setIsModalShown(false);
    if (orderStatusUpdated !== null && orderStatusUpdated.message) {
      getOrderPharmacy(orderData.id);
      toast.success(`Order status has been succesfully updated}`, {
        duration: 1500,
      });
    }
  }, [orderStatusUpdated]);

  return (
    <>
      <div className="w-full">
        <h1 className="mb-5 text-3xl font-bold">Order Detail</h1>
        <div className="flex justify-center mt-8">
          {orderData.order_status !== "Canceled" ? (
            <OrderSteps data={orderData} />
          ) : (
            <p className="text-primary_red font-bold text-lg">Order Canceled</p>
          )}
        </div>

        <hr className="h-px mt-7 mb-5 bg-gray-200 border dark:bg-gray-700"></hr>
        <div className="flex justify-between ">
          <div className="flex items-center gap-5">
            <Image
              src={gcpURL(orderData.user?.photo as string)}
              alt={`Photo of ${orderData.user?.name}`}
              width={64}
              height={64}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <h4 className="font-semibold text-lg">{orderData.user?.name}</h4>
              <p className="text-gray-600 text-sm">{orderData.user?.email}</p>
            </div>
          </div>
          <div className="flex flex-col items-end mb-2 text-[#757575] font-medium ">
            <p>{orderData.shipping_name}</p>
            <p>Ordered at: {timestampFormat(orderData.order_date as string)}</p>
            <p>
              Last updated: {timestampFormat(orderData.updated_at as string)}
            </p>
          </div>
        </div>

        <hr className="h-px my-5 bg-gray-200 border dark:bg-gray-700"></hr>
        <div>
          <h2 className="text-xl font-medium">Shipping address</h2>
          <div className="grid grid-cols-2 gap-20">
            <div className="mt-3 col-span-1 flex flex-col items-center gap-4">
              <AddressDetail
                type="sender"
                orderData={orderData}
                isWhatsappShortcutShown={type === "DETAIL"}
              />
              <FaLongArrowAltDown size={30} />{" "}
              <AddressDetail
                type="receiver"
                orderData={orderData}
                isWhatsappShortcutShown={true}
              />
            </div>

            <div className="h-[450px] col-span-1 relative pt-3">
              <OrderMap
                titleText="Address Pin Point"
                center={mapCenter}
                center2={mapCenter2}
                zoom={mapZoom}
                setMapCenter={setMapCenter}
                setMapZoom={setMapZoom}
                isLocationDetailShown={true}
                isDisabled={true}
              />
            </div>
          </div>
        </div>

        <hr className="h-px my-5 bg-gray-200 border dark:bg-gray-700"></hr>

        <div className="flex flex-col gap-2">
          <h2 className="font-medium text-xl mb-2">Products</h2>

          {orderData.products?.map((prod) => (
            <div
              key={prod.id}
              className="py-2 pl-4 pr-7 flex gap-4 rounded-lg border border-slate-400"
            >
              <Image
                src={gcpURL(prod.image as string)}
                alt={`Image of ${prod.name}`}
                height={100}
                width={100}
              />
              <div className="flex justify-between items-center">
                <div className="w-3/4">
                  <h2 className="font-medium">{prod.name}</h2>
                  <p className="text-slate-500 line-clamp-1">
                    {prod.description}
                  </p>
                </div>
                <div className="flex flex-col items-center">
                  <p className="text-secondary_blue font-medium">
                    {currencyFormat(prod.selling_unit!)}
                  </p>
                  <p>x{prod.amount}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <hr className="h-px my-5 bg-gray-200 border dark:bg-gray-700"></hr>

        <h2 className="font-medium text-xl flex gap-4 items-center">
          <span>Payment</span>
          <div
            className={`p-1 px-2 rounded-xl ${
              orderData.payment!.status === "Approved"
                ? "bg-green-500"
                : orderData.payment!.status === "Waiting Approval"
                ? "bg-primary_orange"
                : "bg-red-500"
            } w-fit  text-white font-semibold capitalize`}
          >
            {orderData.payment?.status}
          </div>
        </h2>
        <div className="mt-6 border-t border-gray-100">
          <dl className="divide-y divide-gray-100">
            <ListPayment text="Subtotal Product">
              {currencyFormat(countSubTotalProduct(orderData.products!))}
            </ListPayment>
            <ListPayment text="Shipment Cost">
              {currencyFormat(orderData.shipping_cost!)}
            </ListPayment>
            <ListPayment text="Total Amount">
              {currencyFormat(
                orderData.shipping_cost! +
                  countSubTotalProduct(orderData.products!)
              )}
            </ListPayment>
            <ListPayment text="Payment Proof">
              {orderData.order_status === "Waiting for Payment" ? (
                <p>No uploaded attachment</p>
              ) : isImageExtension(orderData.payment?.payment_file!) ? (
                <Image
                  src={gcpURL(orderData?.payment?.payment_file as string)}
                  alt={`Uploaded photo of payment proof`}
                  width={150}
                  height={150}
                />
              ) : (
                <embed
                  src={gcpURL(orderData.payment?.payment_file as string)}
                  height="550px"
                  width="400px"
                />
              )}
            </ListPayment>
            {type === "EDIT" &&
              (orderData.order_status === "Waiting for Confirmation" ||
                orderData.order_status === "Processed") && (
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-sm font-medium leading-6 text-gray-900">
                    {orderData.order_status === "Waiting for Confirmation"
                      ? "Order Confirmation"
                      : "Send Order Confirmation "}
                  </dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0 flex gap-2 w-fit">
                    <>
                      <div>
                        <ButtonDanger
                          onClick={() => {
                            setIsModalShown(true);
                            setModalType(
                              orderData.order_status ===
                                "Waiting for Confirmation"
                                ? "reject"
                                : "cancel"
                            );
                          }}
                        >
                          {orderData.order_status === "Waiting for Confirmation"
                            ? "Reject"
                            : "Cancel"}
                        </ButtonDanger>
                      </div>
                      <div>
                        <Button
                          onClick={() => {
                            setIsModalShown(true);
                            setModalType("accept");
                          }}
                        >
                          {orderData.order_status === "Waiting for Confirmation"
                            ? "Accept"
                            : "Send Order"}
                        </Button>
                      </div>
                    </>
                  </dd>
                </div>
              )}
          </dl>
        </div>

        <div className="flex flex-row self-end gap-2 mt-10">
          <div>
            <ButtonBorderOnly
              type="button"
              onClick={() => {
                if (isLoading) return;
                router.replace(adminManageOrdersRoute);
              }}
            >
              Back
            </ButtonBorderOnly>
          </div>
        </div>
      </div>
      {isModalShown && (
        <ModalStatus
          modalType={modalType}
          textToShow={(() => {
            switch (orderData.order_status) {
              case "Waiting for Confirmation":
                return modalType === "accept"
                  ? "process this order"
                  : `reject this order`;
              case "Processed":
                return modalType === "accept"
                  ? "send this order"
                  : "cancel this ongoing order";
              default:
                return "";
            }
          })()}
          isButtonLoading={isLoading}
          isModalShown={isModalShown}
          setIsModalShown={setIsModalShown}
          handleEditStatus={() => {
            updateOrderStatus(newStatus()!, orderData.id!);
          }}
        />
      )}
    </>
  );
};

export default Order;
