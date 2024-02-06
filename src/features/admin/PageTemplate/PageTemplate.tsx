import { Button } from "@/components/Button";
import { FormSelect, SearchInput } from "@/components/Form";
import PaginationButton from "@/features/admin/PaginationButton";
import { TH, TR, Table } from "@/features/admin/Table";
import { IPageInfo, ISortOption } from "@/types/api";
import React, { ReactNode, useEffect, useState } from "react";

type TPageTemplates = {
  searchInputProps: {
    searchPlaceholder: string;
    maxSearchLength: number;
    setSearchInput: React.Dispatch<React.SetStateAction<string>>;
  };
  selectDataFilterProps?: {
    defaultValue: string;
    optionPlaceholderText: string;
    options: string[];
    setDataFilter: React.Dispatch<React.SetStateAction<string>>;
  };
  tableHeads: {
    titles: string[];
    attributes: string[];
    isSortable: boolean[];
    defaultSortItem: string;
    setSortOption?: React.Dispatch<React.SetStateAction<ISortOption | null>>;
  };
  addItemProps?: {
    addItemButtonText: string;
    handleAddItem: () => void;
  };
  paginationProps: {
    pageNum: number;
    setPageNum: React.Dispatch<React.SetStateAction<IPageInfo>>;
    maxPageNum: number;
    maxItem: number;
    numOfItemPerPage: number;
    leftPageNumShown?: number;
    rightPageNumShown?: number;
  };
  children: ReactNode;
};

const PageTemplate = ({
  searchInputProps,
  selectDataFilterProps,
  tableHeads,
  addItemProps,
  paginationProps,
  children,
}: TPageTemplates) => {
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [sortBy, setSortBy] = useState<string>(tableHeads.defaultSortItem);
  const [activeColumn, setActiveColumn] = useState(tableHeads.defaultSortItem);
  const toggleSorting = () => {
    if (sortDir === "desc") {
      setSortDir("asc");
      return;
    }
    setSortDir("desc");
    return;
  };

  const handleSorting = (sortBy: string, title: string) => {
    setSortBy(sortBy);
    setActiveColumn(title);
    toggleSorting();
  };

  useEffect(() => {
    if (sortBy !== "" && tableHeads.setSortOption !== undefined) {
      tableHeads.setSortOption((prev) => ({
        ...prev,
        sortBy: sortBy,
        sortDir: prev?.sortDir === "asc" ? "desc" : "asc",
      }));
    }
  }, [sortDir, sortBy]);

  return (
    <div className="h-full flex flex-col justify-between gap-4">
      <div className="">
        <div className="flex flex-row justify-between gap-4 items-center">
          <div className="flex flex-row gap-4 justify-between items-center">
            <div className="w-64 my-4">
              <SearchInput
                placeholder={searchInputProps.searchPlaceholder}
                maxInputLength={searchInputProps.maxSearchLength}
                setSearchInputDebounced={searchInputProps.setSearchInput}
                setPageNum={paginationProps.setPageNum}
              />
            </div>

            {selectDataFilterProps && (
              <div className="w-64 my-4">
                <FormSelect
                  defaultValue={selectDataFilterProps.defaultValue}
                  optionPlaceholderText={
                    selectDataFilterProps.optionPlaceholderText
                  }
                  options={selectDataFilterProps.options}
                  onChange={(e) =>
                    selectDataFilterProps.setDataFilter(e.target.value)
                  }
                />
              </div>
            )}
          </div>

          {addItemProps && (
            <div>
              <Button
                withoutHoverEffect
                onClick={() => addItemProps.handleAddItem()}
              >
                {addItemProps.addItemButtonText}
              </Button>
            </div>
          )}
        </div>
        <Table>
          <thead>
            <TR>
              {tableHeads.titles.map((title, idx) => {
                const sortBy = tableHeads.attributes[idx];
                return (
                  <TH
                    key={idx}
                    onClick={() => handleSorting(sortBy, title)}
                    isSortable={tableHeads.isSortable[idx]}
                    sortType={sortDir}
                    isSortActive={title === activeColumn}
                  >
                    {title}
                  </TH>
                );
              })}
            </TR>
          </thead>
          <tbody>{children}</tbody>
        </Table>
      </div>
      <PaginationButton
        numOfPages={paginationProps.maxPageNum}
        currentPage={paginationProps.pageNum}
        maxItem={paginationProps.maxItem}
        itemPerPage={paginationProps.numOfItemPerPage}
        setPage={paginationProps.setPageNum}
        leftPageNumShown={paginationProps.leftPageNumShown}
        rightPageNumShown={paginationProps.rightPageNumShown}
      />
    </div>
  );
};

export default PageTemplate;
