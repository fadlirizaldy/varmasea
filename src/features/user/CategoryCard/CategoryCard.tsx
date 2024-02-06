import { IProductCategory } from "@/types/api";
import { gcpURL } from "@/utils/gcpURL";
import React from "react";
import { IoMdCloseCircleOutline } from "react-icons/io";

const CategoryCard = ({
  cat,
  onClick,
  isActive,
  setInactive,
}: {
  cat: IProductCategory;
  onClick?: () => void;
  isActive?: boolean;
  setInactive?: () => void;
}) => {
  return (
    <div
      key={cat.id}
      className={`relative flex items-center gap-3 p-2 h-16 min-w-52 rounded-lg cursor-pointer ${
        isActive
          ? "bg-secondary_blue/30 border-primary_blue border"
          : "hover:shadow-md  border border-slate-200"
      }`}
      onClick={onClick}
    >
      <img
        src={gcpURL(cat.icon as string)}
        alt={`Icon of ${cat.name}`}
        className="w-10 object-cover rounded-full border border-slate-200"
      />
      <h3>{cat.name}</h3>

      {isActive && (
        <div
          className="absolute top-[2px] right-[2px] hover:scale-[115%]"
          onClick={setInactive}
        >
          <IoMdCloseCircleOutline color={"red"} size={20} />
        </div>
      )}
    </div>
  );
};

export default CategoryCard;
