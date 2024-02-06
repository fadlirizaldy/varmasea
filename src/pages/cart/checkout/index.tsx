import { FaMapMarkerAlt } from "react-icons/fa";
import React, { useEffect, useState } from "react";
import { Modal } from "@/components/Modal";
import { FaCheck } from "react-icons/fa";
import { currencyFormat } from "@/utils/formatting/currencyFormat";
import { FaShoppingBasket, FaTruck } from "react-icons/fa";
import { FormInput, FormSelect } from "@/components/Form";
import { useRouter } from "next/router";
import useUserAddress from "@/hooks/CRUD/useUserAddress";
import useAuth from "@/hooks/useAuth";
import { IAddressUser, ICartFull, ICheckout } from "@/types/api";
import useUserCheckout from "@/hooks/CRUD/useUserCheckout";
import useUserShipments from "@/hooks/CRUD/useUserShipment";
import { toast } from "sonner";
import { baseUrl } from "@/utils/baseUrl";
import Link from "next/link";
import { gcpURL } from "@/utils/gcpURL";
import { GCP_PUBLIC_IMG } from "@/utils/api/apiURL";

const CheckoutPage = () => {
  const { addressesUser, getAddressesUser } = useUserAddress();
  const { checkout, checkoutMessage, getCheckout } = useUserCheckout();
  const { shipments, shipmentsMessage, getShipmentFee } = useUserShipments();
  const { role, token } = useAuth();

  const [choosenAddress, setChoosenAddress] = useState<IAddressUser | null>(
    null
  );
  const [showModal, setShowModal] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    if (role === "User") {
      getAddressesUser();
    }
  }, [role]);

  useEffect(() => {
    if (addressesUser !== null) {
      setChoosenAddress(addressesUser.find((item) => item.is_default)!);
    }
  }, [addressesUser]);

  useEffect(() => {
    if (choosenAddress !== null && addressesUser) {
      getCheckout(choosenAddress.id);
      setSelectedShipment("");
    }
  }, [choosenAddress]);

  useEffect(() => {
    if (checkout !== null && choosenAddress !== null) {
      const bodyShipment = {
        address_id: choosenAddress.id,
        pharmacy_id: checkout?.pharmacy_id,
        weight: checkout?.carts.reduce(
          (acc, curr) => acc + curr.weight * curr.quantity,
          0
        ),
      };
      getShipmentFee(bodyShipment);
    }
  }, [checkout]);

  useEffect(() => {
    if (selectedShipment === "") {
      setSelectedShipment(
        shipments !== null && shipments.shipments[0] !== undefined
          ? `${shipments.shipments[0].name} (${currencyFormat(
              Number(shipments.shipments[0].fee)
            )})`
          : "-"
      );
    }
  }, [shipments]);

  const handleOrder = async () => {
    const body = {
      pharmacy_id: checkout?.pharmacy_id,
      address_id: choosenAddress?.id,
      shipping_name: selectedShipment.split(" ")[0],
      shipping_cost: Number(selectedShipment.replace(/\D/g, "")),
      total_product_price: Number(
        checkout?.carts.reduce((acc, curr) => acc + curr.price, 0)
      ),
    };

    if (body.shipping_name === "-") {
      toast.error(
        "Please choose another shipment method or try to change address",
        {
          position: "top-center",
          duration: 3000,
        }
      );
      return;
    }

    let url = baseUrl("/orders");
    const options: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    };

    const response = await fetch(url, options);
    const dataResponse = await response.json();

    toast.success("Success! please doing the payment", {
      position: "top-center",
    });

    return router.replace(`/profile/order/${dataResponse.data.order.id}`);
  };

  return (
    <div className="max-w-[1200px] w-[90%] mx-auto pt-10">
      <h2 className="flex items-center gap-2 font-medium text-2xl">
        <div className="w-1 h-10 bg-primary_blue rounded-md"></div>
        Checkout
      </h2>

      <h2 className="text-xl flex items-center mb-2 gap-2 mt-4">
        <FaMapMarkerAlt size={20} className="text-secondary_blue" />
        Shipment Address
      </h2>
      <section className="border border-slate-200 rounded-md p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">
              {choosenAddress?.province} | {choosenAddress?.city}
            </h3>
            <p className="line-clamp-2 text-slate-500">
              {choosenAddress?.detail}
            </p>
            {choosenAddress?.is_default && (
              <p className="px-2 mt-1 w-fit border border-primary_blue text-primary_blue">
                Main
              </p>
            )}
          </div>
          <button
            className="font-medium text-secondary_blue hover:underline px-3"
            onClick={() => setShowModal(true)}
          >
            Edit
          </button>
        </div>

        <Modal
          isModalShown={showModal}
          setIsModalShown={setShowModal}
          maxWidth="max-w-2xl"
          height="h-96"
        >
          <div className="p-4 w-full">
            <h2 className="font-medium text-xl">Choose Address</h2>

            <div className="grid grid-cols-1 gap-3 h-64 mt-3 overflow-y-scroll rounded-sm mb-2">
              {addressesUser?.map((item: IAddressUser) => (
                <div
                  key={item.id}
                  className={`py-3 px-5 border border-slate-200 rounded-lg flex flex-col sm:flex-row justify-between gap-3 sm:items-center ${
                    item.id === choosenAddress?.id
                      ? "bg-secondary_blue bg-opacity-10 border-l-4 border-secondary_blue"
                      : "bg-white"
                  }`}
                >
                  <div>
                    <h3 className="flex items-center gap-2 font-medium">
                      {item.province} | {item.city}
                    </h3>
                    <p className="line-clamp-2 text-slate-500">{item.detail}</p>
                    {item.is_default && (
                      <p className="px-2 mt-1 w-fit border border-primary_blue text-primary_blue">
                        Main
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    {/* <div className="flex justify-center gap-3">
                      <button className="font-medium text-secondary_blue hover:underline">Edit</button>
                    </div> */}
                    {item.id === choosenAddress?.id ? (
                      <FaCheck size={20} className="mr-5" />
                    ) : (
                      <button
                        className="btn bg-secondary_blue border border-slate-400 text-white h-10 min-h-10"
                        onClick={() => {
                          setChoosenAddress(item);
                          setShowModal(false);
                        }}
                      >
                        Choose
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Modal>
      </section>

      <div className="mt-5">
        <h2 className="text-xl flex items-center mb-3 gap-2">
          <FaShoppingBasket size={20} className="text-secondary_blue" />
          List of Order
        </h2>

        <div className="grid grid-cols-5 border-b border-slate-200">
          <h4 className="col-span-2 text-slate-400 font-medium text-lg py-2">
            Name
          </h4>
          <h4 className="text-slate-400 font-medium text-lg py-2">
            Price per unit
          </h4>
          <h4 className="text-slate-400 font-medium text-lg py-2">Amount</h4>
          <h4 className="text-slate-400 font-medium text-lg py-2">Subtotal</h4>
        </div>
        {checkoutMessage === null ? (
          checkout?.carts.map((item: ICartFull, idx: number) => (
            <div
              key={idx}
              className={`grid grid-cols-5 px-2 py-1 ${
                idx % 2 === 0 ? "bg-slate-200 bg-opacity-25" : "bg-white"
              }`}
            >
              <div className="flex gap-3 items-center col-span-2">
                <img
                  src={gcpURL(item?.drug_image)}
                  alt={`Image of ${item.drug_name}`}
                  className="w-20 h-14 object-cover"
                />
                <p className="line-clamp-2">{item?.drug_name}</p>
              </div>
              <p className="flex items-center">
                {currencyFormat(item.selling_unit)}
              </p>
              <p className="flex items-center">{item.quantity}</p>
              <p className="flex items-center">{currencyFormat(item.price)}</p>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center gap-4">
            <img
              src={`${GCP_PUBLIC_IMG}/no_data.jpg`}
              alt="no data"
              className="w-56 sm:w-96"
            />
            <p className="text-slate-400 font-medium">
              Sorry, there&apos;s no product nearest. Try to choose another
              address
            </p>
          </div>
        )}
      </div>

      <div className="mt-5">
        <h2 className="text-xl flex items-center mb-3 gap-2">
          <FaTruck size={20} className="text-secondary_blue" />
          Shipment
        </h2>

        <div className="grid grid-cols-2 gap-5">
          <FormSelect
            titleText="Choose Shipment"
            defaultValue={""}
            value={
              selectedShipment !== ""
                ? selectedShipment
                : "No shipment available"
            }
            optionPlaceholderText="Select shipment"
            options={
              shipments !== null
                ? shipments.shipments.map(
                    (item) =>
                      `${item.name} (${currencyFormat(Number(item.fee))})`
                  )!
                : ["No shipment available"]
            }
            onChange={(e) => setSelectedShipment(e.target.value)}
            errorText="Please select status"
          />
        </div>
      </div>

      <div className="mt-5">
        <h2 className="text-xl flex items-center mb-3 gap-2">Summary</h2>

        <div className="flex justify-end">
          <div className="w-1/3 grid grid-cols-2 gap-2">
            <h3 className="font-medium text-lg text-slate-500">
              Subtotal Product
            </h3>
            <p className="text-end">
              {checkoutMessage === null && addressesUser !== null
                ? currencyFormat(
                    Number(
                      checkout?.carts.reduce((acc, curr) => acc + curr.price, 0)
                    )
                  )
                : "-"}
            </p>
            <h3 className="font-medium text-lg text-slate-500">
              Total Shipment
            </h3>
            <p className="text-end">
              {selectedShipment.match(/\((.*)\)/) !== null
                ? selectedShipment.match(/\((.*)\)/)!.pop()
                : "-"}
            </p>
            <h3 className="font-medium text-lg text-slate-500">Total Amount</h3>
            <p className="text-end text-2xl font-medium text-secondary_blue">
              {checkoutMessage === null && addressesUser !== null
                ? currencyFormat(
                    Number(
                      checkout?.carts.reduce((acc, curr) => acc + curr.price, 0)
                    ) +
                      (selectedShipment.match(/\((.*)\)/) !== null
                        ? Number(
                            shipments?.shipments.find((item) =>
                              selectedShipment.includes(item.name)
                            )?.fee!
                          )
                        : 0)
                  )
                : "-"}
            </p>
          </div>
        </div>
        <hr className="h-px my-3 bg-gray-200 border dark:bg-gray-700"></hr>

        <div className="flex justify-end">
          <button
            className="btn text-white w-1/4 text-lg bg-secondary_blue hover:bg-primary_blue"
            onClick={() => handleOrder()}
            disabled={checkoutMessage !== null || addressesUser === null}
          >
            Proceed
          </button>
        </div>
      </div>

      {addressesUser === null && (
        <div className="fixed z-[999] overflow-y-auto overflow-x-hidden justify-center items-center w-full h-full inset-0 max-h-full bg-[rgba(0,0,0,0.4)]">
          <div className="flex flex-col items-center relative w-1/4 bg-white h-fit p-4 rounded-md left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <img
              src={`${GCP_PUBLIC_IMG}/no_data.jpg`}
              alt="no data"
              className="w-56 sm:w-96 mb-3"
            />
            <p className="text-slate-700 font-medium text-center">
              Sorry, you can&apos;t proceed your cart
            </p>
            <p className="text-slate-400 font-medium text-center">
              You can input your address to proceed
            </p>
            <Link
              href={"/profile"}
              className="btn bg-secondary_blue hover:bg-primary_blue mt-2 text-white"
            >
              Go to Profile
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
CheckoutPage.title = "Checkout | Varmasea";
