import { ICart } from "@/types/api";
import { numberOnlyFormat } from "@/utils/formatting/numberOnlyFormat";
import { gcpURL } from "@/utils/gcpURL";
import React, { useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa6";

type ListCartPropsType = {
  prod: Partial<ICart>;
  handleUpdateCart: (
    prodId: number,
    type: "ADD" | "MINUS",
    isMouseLeave?: boolean,
    currentQuantity?: number,
    idCart?: number,
    newQuantity?: number
  ) => Promise<void>;
};

const ListCart = (props: ListCartPropsType) => {
  const { prod, handleUpdateCart } = props;

  const [quantity, setQuantity] = useState(prod.drug?.quantity);

  return (
    <div key={prod.id} className="flex items-center gap-7 py-3">
      <img
        src={gcpURL(prod.drug?.image!)}
        alt={`Photo of ${prod.drug?.name}`}
        className="w-24 object-cover"
      />
      <div className="flex items-center justify-between gap-4 w-full">
        <div className="flex flex-col gap-1">
          <h2 className="font-semibold text-lg">{prod.drug?.name}</h2>
        </div>
        <div className="w-fit flex flex-col gap-2">
          <h4 className="font-medium text-primary_blue text-lg text-center">
            x{prod.drug?.quantity}
          </h4>
          <div className="flex items-center border border-slate-300">
            <div
              className="flex justify-center items-center cursor-pointer py-2"
              onClick={(e) => {
                handleUpdateCart(
                  prod.drug?.id!,
                  "MINUS",
                  false,
                  prod.drug?.quantity,
                  prod.id!
                );
                setQuantity((prev) => prev! - 1);
              }}
            >
              <FaMinus className="w-6" />
            </div>
            <input
              type="text"
              defaultValue={prod.drug?.quantity}
              className="w-10 border-x border-slate-300 p-1 text-center"
              onBlur={(e) => {
                handleUpdateCart(
                  prod.drug?.id!,
                  "MINUS",
                  true,
                  prod.drug?.quantity,
                  undefined,
                  quantity
                );
              }}
              value={quantity}
              onChange={(e) => setQuantity(numberOnlyFormat(e.target.value))}
            />
            <div
              className="flex justify-center items-center cursor-pointer py-2"
              onClick={(e) => {
                handleUpdateCart(prod.drug?.id!, "ADD");
                setQuantity((prev) => prev! + 1);
              }}
            >
              <FaPlus className="w-6" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListCart;
