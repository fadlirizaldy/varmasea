import { useDebounce } from "@/hooks/useDebounce";
import { IPageInfo } from "@/types/api";
import { numberOnlyFormat } from "@/utils/formatting/numberOnlyFormat";
import React, { useEffect, useState } from "react";
import {
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaAngleLeft,
  FaAngleRight,
} from "react-icons/fa";

const PaginationButton = ({
  numOfPages,
  currentPage,
  maxItem,
  itemPerPage,
  setPage,
  leftPageNumShown = 5,
  rightPageNumShown = 3,
}: {
  numOfPages: number;
  currentPage: number;
  maxItem: number;
  itemPerPage: number;
  setPage: React.Dispatch<React.SetStateAction<IPageInfo>>;
  leftPageNumShown?: number;
  rightPageNumShown?: number;
}) => {
  const [isSearchingPage, setIsSearchingPage] = useState(false);
  const [searchPageNum, setSearchPageNum] = useState(0);
  const [isNavButtonClicked, setIsNavButtonClicked] = useState(false);
  const debouncedSearchPageNum = useDebounce(searchPageNum.toString(), 800);

  useEffect(() => {
    if (debouncedSearchPageNum !== "" && debouncedSearchPageNum !== "0") {
      setPage((prev) => ({
        ...prev,
        pageNum: numberOnlyFormat(debouncedSearchPageNum),
      }));
    } else if (debouncedSearchPageNum === "0") {
      setPage((prev) => ({
        ...prev,
        pageNum: 1,
      }));
    }
  }, [debouncedSearchPageNum]);

  useEffect(() => {
    setIsNavButtonClicked(false);
  }, [searchPageNum]);

  return (
    <div className="flex flex-col xs:flex-row justify-between">
      <span>{`Showing ${(currentPage - 1) * itemPerPage + 1}-${
        currentPage * itemPerPage < maxItem
          ? currentPage * itemPerPage
          : maxItem
      } of ${maxItem} items`}</span>
      <div className="join ">
        <button
          className="join-item btn btn-sm"
          onClick={() => {
            setIsNavButtonClicked(true);
            setPage((prev) => ({ ...prev, pageNum: 1 }));
          }}
        >
          <FaAngleDoubleLeft />
        </button>
        <button
          className={`join-item btn btn-sm ${
            currentPage === 1 && "cursor-not-allowed !scale-100"
          }`}
          onClick={() => {
            setIsNavButtonClicked(true);
            if (currentPage !== 1) {
              setPage((prev) => ({ ...prev, pageNum: currentPage - 1 }));
              return;
            }
          }}
        >
          <FaAngleLeft />
        </button>
        {[...Array(numOfPages)].map((_, idx) => {
          if (idx === leftPageNumShown) {
            return !isSearchingPage &&
              !(
                currentPage > leftPageNumShown &&
                currentPage <= numOfPages - rightPageNumShown
              ) ? (
              <button
                key={idx}
                className={`join-item btn btn-sm ${
                  currentPage === idx + 1 && "btn-active"
                }`}
                onClick={() => {
                  setIsSearchingPage(true);
                }}
              >
                . . .
              </button>
            ) : (
              <button
                key={idx}
                className={`join-item btn  btn-sm ${
                  currentPage === idx + 1 && "btn-active"
                } p-0`}
              >
                <input
                  type="text"
                  className="w-16 h-8 join-item text-center btn-active placeholder:text-gray-500"
                  value={
                    currentPage > leftPageNumShown &&
                    currentPage <= numOfPages - rightPageNumShown &&
                    isNavButtonClicked
                      ? currentPage
                      : searchPageNum === 0
                      ? ""
                      : searchPageNum
                  }
                  onChange={(e) => {
                    const input = numberOnlyFormat(e.target.value);
                    if (input <= numOfPages) {
                      setSearchPageNum(input);
                      return;
                    }
                  }}
                  placeholder="Jump to"
                />
              </button>
            );
          } else if (
            idx > leftPageNumShown &&
            idx < numOfPages - rightPageNumShown
          ) {
            return <></>;
          }
          return (
            <button
              key={idx}
              className={`join-item btn btn-sm ${
                currentPage === idx + 1 && "btn-active"
              }`}
              onClick={() => {
                setIsNavButtonClicked(true);
                setPage((prev) => ({ ...prev, pageNum: idx + 1 }));
              }}
            >
              {idx + 1}
            </button>
          );
        })}
        <button
          className={`join-item btn btn-sm ${
            currentPage === numOfPages && "cursor-not-allowed !scale-100"
          }`}
          onClick={() => {
            if (currentPage !== numOfPages) {
              setPage((prev) => ({ ...prev, pageNum: currentPage + 1 }));
              return;
            }
          }}
        >
          <FaAngleRight />
        </button>
        <button
          className="join-item btn btn-sm"
          onClick={() => {
            setIsNavButtonClicked(true);
            setPage((prev) => ({ ...prev, pageNum: numOfPages }));
          }}
        >
          <FaAngleDoubleRight />
        </button>
      </div>
    </div>
  );
};

export default PaginationButton;
