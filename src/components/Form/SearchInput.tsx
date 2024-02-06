import React, { useEffect, useState } from "react";
import { FormInput } from ".";
import { FaSearch } from "react-icons/fa";
import { IPageInfo } from "@/types/api";

const SearchInput = ({
  placeholder,
  maxInputLength,
  setSearchInputDebounced,
  setPageNum,
}: {
  placeholder: string;
  maxInputLength: number;
  setSearchInputDebounced: React.Dispatch<React.SetStateAction<string>>;
  setPageNum?: React.Dispatch<React.SetStateAction<IPageInfo>>;
}) => {
  const [searchTrackingNumberInput, setSearchTrackingNumberInput] =
    useState("");
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout>();

  useEffect(() => {
    clearTimeout(searchTimeout);
    setSearchTimeout(
      setTimeout(() => {
        setSearchInputDebounced(searchTrackingNumberInput);
        if (setPageNum) {
          setPageNum((prev) => ({ ...prev, pageNum: 1 }));
        }
      }, 800)
    );
  }, [searchTrackingNumberInput]);

  return (
    <FormInput
      type="text"
      withPrefix={<FaSearch />}
      placeholder={placeholder}
      value={searchTrackingNumberInput}
      onChange={(e) => {
        if (
          e.target.value.replace(/[^ \da-zA-Z]/g, "").length <= maxInputLength
        ) {
          setSearchTrackingNumberInput(
            e.target.value.replace(/[^ \da-zA-Z]/g, "")
          );
        }
      }}
      isRoundedFull
    />
  );
};

export default SearchInput;
