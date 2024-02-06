import React, { useEffect, useState } from "react";
import { IoMdCart } from "react-icons/io";
import { useRouter } from "next/router";
import useCart from "@/hooks/CRUD/useCart";
import useAuth from "@/hooks/useAuth";
import { ICart } from "@/types/api";
import { baseUrl } from "@/utils/baseUrl";
import ListCart from "@/features/user/Cart/ListCart";
import { GCP_PUBLIC_IMG } from "@/utils/api/apiURL";

const CartPage = () => {
  const router = useRouter();
  const { role, token, userId } = useAuth();

  const { carts, getCarts } = useCart();
  // const carts = useCartStore((state) => state.carts);
  // const getCarts = useCartStore((state) => state.getCarts);
  useEffect(() => {
    if (role === "User") {
      getCarts();
    }
  }, [role]);

  const handleUpdateCart = async (
    prodId: number,
    type: "ADD" | "MINUS",
    isMouseLeave?: boolean,
    currentQuantity?: number,
    idCart?: number,
    newQuantity?: number
  ) => {
    const bodyCart = {
      user_id: userId,
      drug_id: prodId,
      quantity: 0,
    };

    switch (type) {
      case "ADD":
        bodyCart["quantity"] = 1;
        break;
      case "MINUS":
        if (isMouseLeave) {
          bodyCart["quantity"] = newQuantity! - currentQuantity!;
          break;
        } else {
          bodyCart["quantity"] = -1;
          break;
        }
    }

    let url = baseUrl("/carts");
    const options: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(bodyCart),
    };

    if (!isMouseLeave && currentQuantity === 1 && type === "MINUS") {
      options["method"] = "DELETE";
      url = baseUrl(`/carts/${idCart}`);
      delete options.body;
    }

    const response = await fetch(url, options);
    const dataResponse = await response.json();

    getCarts();
  };

  return (
    <div className="max-w-[1200px] w-[90%] mx-auto">
      <h1 className="pt-10 pb-6 font-medium text-2xl flex items-center gap-5 text-primary_blue">
        <IoMdCart className="w-10 h-10" />
        My Cart
      </h1>

      {carts === null ? (
        <div className="h-32 flex flex-col justify-center items-center gap-2 mt-44">
          <img
            src={`${GCP_PUBLIC_IMG}/empty-cart.jpg`}
            className="w-52 h-52"
            alt="empty cart"
          />
          <p className="font-semibold mb-3 text-gray-400">Your cart is empty</p>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-10">
          <div className="divide-y w-full md:w-2/3">
            {carts?.map((prod: Partial<ICart>) => (
              <ListCart
                key={prod.id}
                prod={prod}
                handleUpdateCart={handleUpdateCart}
              />
            ))}
          </div>
          <div className="w-full md:w-1/3 min-h-44 h-fit rounded-md border border-slate-200 shadow-sm sticky top-[120px]">
            <h2 className="font-medium text-lg p-2">Summary</h2>
            <hr className="h-px bg-slate-400" />
            <div className="p-2 px-3 flex flex-col">
              {carts?.map((item: Partial<ICart>, idx) => (
                <div key={idx} className="flex justify-between gap-2 py-1">
                  <p>{item.drug?.name}</p>
                  <div className="flex items-center gap-3">
                    <p>x{item.drug?.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
            <hr className="h-px bg-slate-400" />

            <div className="p-2 flex">
              <h3 className="w-1/2 text-lg font-medium">Total item: </h3>
              <div className="w-1/2 text-end">
                <p className="">
                  {carts?.reduce((acc: number, curr: Partial<ICart>) => {
                    return acc + curr.drug?.quantity!;
                  }, 0)}{" "}
                  items
                </p>
              </div>
            </div>
            <hr className="h-px bg-slate-400" />

            <div className="w-full p-3">
              <button
                className="btn w-full h-10 bg-secondary_blue hover:bg-primary_blue text-white font-medium text-lg"
                onClick={() => router.push("/cart/checkout")}
              >
                Buy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
CartPage.title = "Cart | Varmasea";
