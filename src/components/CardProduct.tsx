import { IProductBasic, IProductMaster } from "@/types/api";
import { currencyFormat } from "@/utils/formatting/currencyFormat";
import { gcpURL } from "@/utils/gcpURL";
import { useRouter } from "next/router";
import React from "react";
import { FaCartShopping } from "react-icons/fa6";

interface ProductPropsType extends IProductMaster {
  handleAddToCart: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

const CardProduct = (props: ProductPropsType) => {
  const router = useRouter();
  return (
    <div
      key={props.id}
      className="rounded-xl border border-slate-200 shadow-md pb-4 cursor-pointer hover:shadow-lg h-[400px]"
      onClick={() => router.push(`/products/detail/${props.id}`)}
    >
      <img
        src={gcpURL(props.image as string)}
        alt={`Photo of ${props.image as string}`}
        className="w-full rounded-t-xl h-3/4 object-cover"
      />
      <div className="pl-5 pr-4 pt-2 border-t border-slate-200">
        <h2 className="text-lg truncate">{props.name}</h2>
        <p className="text-gray-400">{props.unit_in_pack}</p>
        <div className="flex justify-between items-center gap-2">
          <p className="font-semibold">
            {currencyFormat(props.min_selling_unit)} -{" "}
            {currencyFormat(props.max_selling_unit)}
          </p>
          <div
            className="tooltip bg-primary_blue cursor-pointer rounded-full p-2"
            data-tip="Add to Cart"
            onClick={props.handleAddToCart}
          >
            <FaCartShopping className="text-white" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardProduct;
