import { ICart } from "@/types/api";
import { USER_CART } from "@/utils/api/apiURL";
import useCRUD from "./useCRUD";

function useCart() {
  const {
    data,
    datas,
    dataUpdate,
    isLoading,
    error,
    getData,
    getDatas,
    updateData,
  } = useCRUD<ICart>(USER_CART);

  return {
    cart: data !== null ? data.cart : null,
    carts:
      datas !== null && datas.carts !== null
        ? datas.carts.length > 0
          ? datas.carts
          : null
        : null,
    cartUpdated: dataUpdate,
    isLoading,
    error,
    getCart: getData,
    getCarts: getDatas,
    updateCart: updateData,
  };
}

export default useCart;
