import { USER_SHIPMENT_FEE } from "@/utils/api/apiURL";
import { baseUrl } from "@/utils/baseUrl";
import useAuth from "../useAuth";
import { useFetch } from "../useFetch";

type ShipmentType = {
  name: string;
  fee: string;
};

interface IGetData {
  shipments: ShipmentType[];
  message: string;
}

type BodyShipmentType = {
  address_id: number;
  pharmacy_id: number | undefined;
  weight: number | undefined;
};

function useUserShipments() {
  const { token } = useAuth();
  const { data, isLoading, error, fetchData: fetchData } = useFetch<IGetData>();

  const getShipmentFee = (bodyShipment: BodyShipmentType) => {
    const url = `${baseUrl(USER_SHIPMENT_FEE)}`;
    const options: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(bodyShipment),
    };

    fetchData(url, options);
  };
  return {
    shipments:
      data !== null && data.shipments !== null
        ? data.shipments.length > 0
          ? data
          : null
        : null,
    shipmentsMessage:
      data !== null && data.message !== undefined ? data.message : null,
    isLoading,
    error,
    getShipmentFee,
  };
}

export default useUserShipments;
