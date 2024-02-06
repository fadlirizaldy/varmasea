import StatusBadge from "@/components/StatusBadge";
import PageTemplate from "@/features/admin/PageTemplate";
import { ItemTools, TD, TR } from "@/features/admin/Table";
import usePharmacyOfAdmin from "@/hooks/CRUD/usePharmacyOfAdmin";
import useStockMutation from "@/hooks/CRUD/useStockMutation";
import useAuth from "@/hooks/useAuth";
import { IPageInfo, ISortOption } from "@/types/api";
import { timestampFormat } from "@/utils/formatting/timestampFormat";
import { initialPageInfo } from "@/utils/initialData";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const HistoryStockMutationsPage = () => {
  const router = useRouter();
  const { role } = useAuth();
  const { stockMutations, getStockMutations, isLoading } = useStockMutation();
  const { pharmaciesOfAdmin, getPharmaciesOfAdmin } = usePharmacyOfAdmin();
  const [productsShownFilter, setProductsShownFilter] = useState("All");

  const [pageInfo, setPageInfo] = useState<IPageInfo>(initialPageInfo);
  const [searchInput, setSearchInput] = useState("");
  const [sortOption, setSortOption] = useState<ISortOption | null>(null);
  const numOfItemPerPage = 10;

  // const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  // const [sortItem, setSortItem] = useState<string>(tableHeads.defaultSortItem);

  // const toggleSorting = () => {
  //   if (sortDir === "desc") {
  //     setSortDir("asc");
  //     return;
  //   }
  //   setSortDir("desc");
  //   return;
  // };

  // const handleSorting = (item: typeof sortItem) => {
  //   setSortItem(item);
  //   toggleSorting();
  // };

  useEffect(() => {
    if (role === "Pharmacy Admin") {
      getStockMutations();
      getPharmaciesOfAdmin();
    }
  }, [role]);

  // useEffect(() => {
  //   if (originAddresses !== null && originAddresses !== undefined) {
  //     const filteredOriginAddress = (originAddresses as IOriginAddress[])
  //       ?.slice()
  //       .filter(
  //         (address) =>
  //           address.branchName
  //             .toLowerCase()
  //             .includes(searchBranchName.toLowerCase()) ||
  //           searchBranchName === ""
  //       );

  //     setMaxItem(filteredOriginAddress.length);
  //   }
  // }, [searchBranchName, originAddresses]);

  return (
    <>
      <PageTemplate
        searchInputProps={{
          searchPlaceholder: "Search",
          maxSearchLength: 25,
          setSearchInput,
        }}
        paginationProps={{
          ...pageInfo,
          setPageNum: setPageInfo,
          numOfItemPerPage,
        }}
        selectDataFilterProps={
          pharmaciesOfAdmin !== null
            ? {
                defaultValue: "All",
                optionPlaceholderText: "Select Pharmacy",
                options: ["All", ...pharmaciesOfAdmin.map((item) => item.name)],
                setDataFilter: setProductsShownFilter,
              }
            : undefined
        }
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
          isSortable: [true, true, false, false, true, false, false],
          attributes: ["test", "test2"],
          defaultSortItem: "Name",
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
                <TD>{<StatusBadge status={mutation.status_mutation} />}</TD>
                <ItemTools
                  viewItemProps={{
                    handleViewItem: () => {
                      toast.warning(
                        "This feature is still in development, please stay tune!",
                        { duration: 1500 }
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

export default HistoryStockMutationsPage;
HistoryStockMutationsPage.title = "Admin | History Stock Mutation Varmasea";
