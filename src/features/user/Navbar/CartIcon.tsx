import useCart from "@/hooks/CRUD/useCart";
import useAuth from "@/hooks/useAuth";
import { ICart } from "@/types/api";
import { GCP_PUBLIC_IMG } from "@/utils/api/apiURL";
import { gcpURL } from "@/utils/gcpURL";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { MdOutlineShoppingCart } from "react-icons/md";

const CartIcon = () => {
  const router = useRouter();
  const { role } = useAuth();

  const { carts, getCarts } = useCart();

  useEffect(() => {
    if (role === "User") {
      getCarts();
    }
  }, [role]);

  return (
    <div
      className="hidden sm:block dropdown dropdown-hover dropdown-end relative"
      onClick={() => {
        const elem = document.activeElement as HTMLElement;
        if (elem) {
          elem?.blur();
        }
        router.push("/cart");
      }}
    >
      {carts !== null && (
        <div className="rounded-full bg-secondary_blue w-[18px] h-[18px] absolute -top-1 -right-1 text-white flex justify-center items-center text-xs font-semibold">
          {carts?.length}
        </div>
      )}
      <div tabIndex={0} role="button" className="m-1">
        <MdOutlineShoppingCart size={25} />
      </div>
      <div
        tabIndex={0}
        className="dropdown-content z-[1] bg-base-100 rounded-xl border border-slate-400 w-[400px] py-3 mt-3 -mr-9 relative"
      >
        <div className="w-10 h-3 overflow-hidden bg-transparent absolute -top-3 right-8">
          <div className="bg-white w-10 h-10 rotate-45 mt-2 border border-slate-400"></div>
        </div>
        {/* Cart is Empty */}
        <h2 className="font-medium text-2xl mb-3 px-3">Your Cart</h2>
        {carts === null ? (
          <div className="h-32 flex flex-col justify-center items-center gap-2">
            <img
              src={`${GCP_PUBLIC_IMG}/empty-cart.jpg`}
              alt="Empty cart image"
              className="w-24 h-24"
            />
            <p className="font-semibold mb-3 text-gray-400">Cart is empty</p>
          </div>
        ) : (
          <>
            <div className="divide-y">
              {carts?.slice(0, 2).map((prod: Partial<ICart>) => (
                <div
                  className="py-2 px-5 flex gap-3 cursor-pointer hover:bg-base-200"
                  key={prod.id}
                >
                  {prod.drug?.image !== undefined && (
                    <img
                      src={gcpURL(prod.drug?.image)}
                      alt={`Image of ${prod.drug.name}`}
                      className="w-20 object-cover border border-slate-200"
                    />
                  )}
                  <div className="w-1/2">
                    <h5 className="font-medium text-lg">{prod.drug?.name}</h5>
                  </div>
                  <div className="text-primary_blue font-semibold w-full text-end">
                    x{prod.drug?.quantity}
                  </div>
                </div>
              ))}
            </div>
            <div className="w-full flex justify-between items-center mt-2 px-3">
              <p
                className={`text-gray-500 text-sm ${
                  carts?.length <= 2 && "opacity-0 pointer-events-none"
                }`}
              >
                {carts?.length - 2} other products
              </p>

              <Link
                href={"/cart"}
                className="btn py-1 rounded-none px-10 bg-secondary_blue hover:bg-primary_blue text-white"
              >
                Show my cart
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartIcon;
