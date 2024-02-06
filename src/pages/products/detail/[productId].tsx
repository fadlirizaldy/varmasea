import React, { useEffect, useState } from "react";
import { currencyFormat } from "@/utils/formatting/currencyFormat";
import { useRouter } from "next/router";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { toast } from "sonner";
import useProductMaster from "@/hooks/CRUD/useProductMaster";
import { gcpURL } from "@/utils/gcpURL";
import { numberOnlyFormat } from "@/utils/formatting/numberOnlyFormat";
import { baseUrl } from "@/utils/baseUrl";
import useAuth from "@/hooks/useAuth";
import { getIdFromPath } from "@/utils/getIdFromPath";

const ProductDetail = () => {
  const router = useRouter();
  const productId = getIdFromPath(router);

  const { productMaster, getProductMaster } = useProductMaster();

  const { token, role, userId } = useAuth();

  const [quantity, setQuantity] = useState<number>(0);

  useEffect(() => {
    getProductMaster(Number(productId));
  }, [role, productId]);

  const handleAddToCart = async (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    prodId: number
  ) => {
    e.stopPropagation();

    if (quantity < 1)
      return toast.info("Please input the amount", {
        duration: 2000,
        position: "top-center",
      });
    if (!token) {
      toast.info("Please login to add the product to cart", {
        duration: 3000,
        position: "top-center",
      });
      return router.push("/auth/login");
    }
    if (role !== "User") {
      toast.error("You can't add to cart, try another account", {
        duration: 3000,
        position: "top-center",
      });
      return;
    }
    const bodyCart = {
      user_id: userId,
      drug_id: prodId,
      quantity: 1,
    };

    const url = baseUrl("/carts");
    const options: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(bodyCart),
    };
    const response = await fetch(url, options);
    const dataResponse = await response.json();

    if (dataResponse.message)
      return toast.error("Failed add item to cart", { position: "top-center" });
    setQuantity(0);
    return toast.success("success add to cart", { position: "top-center" });
  };

  return (
    <div className="max-w-[1200px] w-[90%] mx-auto pt-10">
      <h1 className="font-semibold text-3xl mb-4">{productMaster?.name}</h1>
      <div className="flex flex-col md:flex-row border-t border-gray-200 gap-10 pt-6">
        <img
          src={gcpURL(productMaster?.image as string)}
          alt={`Image of ${productMaster?.name}`}
          className="w-[400px] md:w-[250px] lg:w-[400px] h-96 object-cover border border-slate-200"
        />
        <div className="w-full">
          <h3 className="font-bold text-2xl text-secondary_blue">
            {currencyFormat(productMaster?.min_selling_unit!)} -{" "}
            {currencyFormat(productMaster?.max_selling_unit!)}
          </h3>
          <p className="text-gray-500">per {productMaster?.unit_in_pack}</p>

          <div className="w-full">
            <div className="flex items-center gap-2 mt-4">
              <input
                type="text"
                className="border border-slate-400 p-2 min-w-1/5 w-20"
                value={quantity}
                onChange={(e) => setQuantity(numberOnlyFormat(e.target.value))}
              />
              <div
                className="btn flex items-center gap-2 bg-secondary_blue text-white text-sm sm:text-base w-1/2 md:w-80 lg:w-96 min-w-1/2"
                onClick={(e) => handleAddToCart(e, productMaster?.id!)}
              >
                <AiOutlineShoppingCart />
                Add to cart
              </div>
            </div>
            <div className="mt-5">
              <h3 className="text-slate-700 text-lg font-medium">
                Description
              </h3>
              <p className="text-justify text-slate-500">
                {productMaster?.description}
              </p>
            </div>
            <div className="mt-5 border-t border-slate-200 pt-2">
              <h3 className="text-slate-600 text-lg font-medium">
                Manufacture
              </h3>
              <p className="text-justify text-slate-500">
                {productMaster?.manufacture}
              </p>
            </div>
            <div className="mt-5 border-t border-slate-200 pt-2">
              <h3 className="text-slate-600 text-lg font-medium">Category</h3>
              <p className="text-justify text-slate-500">
                {productMaster?.category}
              </p>
            </div>
            <div className="mt-5 border-t border-slate-200 pt-2">
              <h3 className="text-slate-600 text-lg font-medium">
                Weight (in gram)
              </h3>
              <p className="text-justify text-slate-500">
                {productMaster?.weight}
              </p>
            </div>
            <div className="mt-5 border-t border-slate-200 pt-2">
              <h3 className="text-slate-600 text-lg font-medium">
                Dimension (in cm)
              </h3>
              <p className="text-justify text-slate-500">
                {productMaster?.length} x {productMaster?.width} x{" "}
                {productMaster?.height}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
ProductDetail.title = `Varmasea | Detail Product`;
