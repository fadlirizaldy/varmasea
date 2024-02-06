import { ISortOption } from "@/types/api";
import React from "react";

const FilterTool = ({
  title,
  options,
  isActive,
  setSortOption,
  setSearchInput,
  setSelectedFilter,
}: {
  title: string;
  options: [
    string, //option
    string | undefined, //sortBy
    "asc" | "desc" | undefined, //sortDir
    string | undefined //search
  ][];
  isActive?: boolean[];
  setSortOption?: React.Dispatch<React.SetStateAction<ISortOption | null>>;
  setSearchInput?: React.Dispatch<React.SetStateAction<string>>;
  setSelectedFilter?: React.Dispatch<React.SetStateAction<string>>;
}) => {
  return (
    <div className="flex flex-col gap-1">
      <h4 className="text-gray-700 font-semibold uppercase">{title}</h4>
      {options.map((option, idx) => {
        return (
          <p
            key={idx}
            className={`font-light border-l-2 pl-2 py-1 cursor-pointer ${
              isActive !== undefined && isActive[idx]
                ? "text-secondary_blue  font-semibold border-l-4"
                : ""
            }`}
            onClick={() => {
              if (
                setSortOption !== undefined &&
                option[1] !== undefined &&
                option[2] !== undefined
              ) {
                setSortOption((prev) => ({
                  ...prev,
                  sortBy: option[1]!,
                  sortDir: option[2]!,
                  search: option[3] !== undefined ? option[3] : undefined,
                }));
              }
              if (setSearchInput !== undefined) {
                setSearchInput(option[0]);
              }
              if (setSelectedFilter !== undefined) {
                setSelectedFilter(option[0]);
              }
            }}
          >
            {option[0]}
          </p>
        );
      })}
    </div>
  );
};

export default FilterTool;
