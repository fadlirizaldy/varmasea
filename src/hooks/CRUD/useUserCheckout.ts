import { ICheckout } from "@/types/api";
import { USER_CHECKOUT } from "@/utils/api/apiURL";
import { baseUrl } from "@/utils/baseUrl";
import useAuth from "../useAuth";
import { useFetch } from "../useFetch";

interface IGetData {
  data: {
    checkout: ICheckout;
  };
  message: string;
}

function useUserCheckout() {
  const { token } = useAuth();
  const { data, isLoading, error, fetchData: fetchData } = useFetch<IGetData>();

  const getCheckout = (address_id: number) => {
    const url = `${baseUrl(USER_CHECKOUT)}`;
    const options: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ address_id: address_id }),
    };
    fetchData(url, options);
  };

  return {
    checkout:
      data !== null && data.data !== undefined ? data.data.checkout : null,
    checkoutMessage:
      data !== null && data.message !== undefined ? data.message : null,
    isLoading,
    error,
    getCheckout,
  };
}

export default useUserCheckout;
