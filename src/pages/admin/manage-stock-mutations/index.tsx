import LoadingScreen from "@/components/LoadingScreen";
import StatusBadge from "@/components/StatusBadge";
import PageTemplate from "@/features/admin/PageTemplate";
import { ItemTools, TD, TR } from "@/features/admin/Table";
import useStockMutation from "@/hooks/CRUD/useStockMutation";
import useAuth from "@/hooks/useAuth";
import { adminManageStockMutationsRoute } from "@/routes";
import { IPageInfo, ISortOption } from "@/types/api";
import { timestampFormat } from "@/utils/formatting/timestampFormat";
import { initialPageInfo } from "@/utils/initialData";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const ManageStockMutationsPage = () => {
  const router = useRouter();
  const { role } = useAuth();
  const {
    pageInfo: pageInfoStockMutations,
    stockMutations,
    getStockMutations,
    isLoading,
  } = useStockMutation();

  const [typeOfRequest, setTypeOfRequest] =
    useState<string>("Incoming Request");

  const [pageInfo, setPageInfo] = useState<IPageInfo>(initialPageInfo);
  const [searchInput, setSearchInput] = useState("");
  const [sortOption, setSortOption] = useState<ISortOption | null>(null);
  const numOfItemPerPage = 10;

  useEffect(() => {
    const queries = {
      order_by: sortOption !== null ? sortOption.sortBy : undefined,
      sort: sortOption !== null ? sortOption.sortDir : undefined,
      search: searchInput !== "" ? searchInput : undefined,
      page: pageInfo?.pageNum,
      limit: numOfItemPerPage,
    };
    if (role === "Pharmacy Admin") {
      getStockMutations(undefined, {
        pharmacy: typeOfRequest === "Incoming Request" ? "to" : "from",
        ...queries,
      });
    }
  }, [role, typeOfRequest, searchInput, sortOption, pageInfo.pageNum]);

  useEffect(() => {
    if (pageInfoStockMutations !== null) {
      setPageInfo(pageInfoStockMutations);
    }
  }, [stockMutations]);

  const handleAddItem = () => {
    router.push(`${adminManageStockMutationsRoute}/add`);
    return;
  };

  return (
    <>
      {isLoading && <LoadingScreen />}
      <PageTemplate
        searchInputProps={{
          searchPlaceholder: "Search",
          maxSearchLength: 25,
          setSearchInput,
        }}
        selectDataFilterProps={
          role === "Pharmacy Admin"
            ? {
                defaultValue: typeOfRequest,
                optionPlaceholderText: "Type of Request",
                options: ["Incoming Request", "Outgoing Request"],
                setDataFilter: setTypeOfRequest,
              }
            : undefined
        }
        addItemProps={{
          addItemButtonText: "Request Stock Mutation",
          handleAddItem,
        }}
        paginationProps={{
          ...pageInfo,
          setPageNum: setPageInfo,
          numOfItemPerPage,
        }}
        tableHeads={{
          titles: [
            "Timestamp",
            "From",
            "To",
            "Product",
            "Quantity",
            "Status",
            "",
          ],
          isSortable: [true, true, true, false, true, true, false],
          attributes: [
            "created_at",
            "from_pharmacy_id",
            "to_pharmacy_id",
            "",
            "quantity",
            "status_mutation_id",
          ],
          defaultSortItem: "",
          setSortOption,
        }}
      >
        {stockMutations !== null &&
          stockMutations.map((mutation, id) => {
            return (
              <TR key={id}>
                <TD>{timestampFormat(mutation.created_at)}</TD>
                <TD>{mutation.from_pharmacy.name}</TD>
                <TD>{mutation.to_pharmacy.name}</TD>
                <TD>{mutation.drug.name}</TD>
                <TD>{mutation.quantity}</TD>
                <TD>
                  {
                    <StatusBadge
                      status={mutation.status_mutation.toLowerCase()}
                    />
                  }
                </TD>
                <ItemTools
                  editItemProps={{
                    handleEditItem: () => {
                      router.push(
                        `${adminManageStockMutationsRoute}/edit/${
                          mutation.id
                        }?ph=${
                          typeOfRequest === "Incoming Request" ? "to" : "from"
                        }`
                      );
                    },
                  }}
                />
              </TR>
            );
          })}
      </PageTemplate>
    </>
  );
};

export default ManageStockMutationsPage;
