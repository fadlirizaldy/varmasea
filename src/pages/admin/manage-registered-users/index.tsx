import LoadingScreen from "@/components/LoadingScreen";
import PageTemplate from "@/features/admin/PageTemplate";
import { TD, TR } from "@/features/admin/Table";
import useRegisteredUser from "@/hooks/CRUD/useRegisteredUser";
import useAuth from "@/hooks/useAuth";
import { IPageInfo, ISortOption } from "@/types/api";
import { initialPageInfo } from "@/utils/initialData";
import React, { useEffect, useState } from "react";

const ManageRegisteredUsersPage = () => {
  const { role } = useAuth();
  const {
    registeredUsers,
    pageInfo: pageInfoRegisteredUsers,
    getRegisteredUsers,
    isLoading,
  } = useRegisteredUser();

  const [pageInfo, setPageInfo] = useState<IPageInfo>(initialPageInfo);
  const [searchInput, setSearchInput] = useState("");
  const [sortOption, setSortOption] = useState<ISortOption | null>(null);
  const numOfItemPerPage = 10;

  useEffect(() => {
    if (role === "Admin") {
      const queries = {
        order_by: sortOption !== null ? sortOption.sortBy : undefined,
        sort: sortOption !== null ? sortOption.sortDir : undefined,
        search: searchInput !== "" ? searchInput : undefined,
        page: pageInfo?.pageNum,
        limit: numOfItemPerPage,
      };
      getRegisteredUsers(undefined, queries);
    }
  }, [role, searchInput, sortOption, pageInfo.pageNum]);

  useEffect(() => {
    if (pageInfoRegisteredUsers !== null) {
      setPageInfo(pageInfoRegisteredUsers);
    }
  }, [registeredUsers]);

  return (
    <>
      {isLoading && <LoadingScreen />}
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
        tableHeads={{
          titles: ["Name", "Email", "Phone Number"],
          isSortable: [true, true, false, true, true, true],
          attributes: ["name", "email", "phone_number"],
          defaultSortItem: "name",
          setSortOption,
        }}
      >
        {registeredUsers !== null &&
          registeredUsers.map((registeredUser, id) => {
            return (
              <TR key={id}>
                <TD>{registeredUser.name}</TD>
                <TD>{registeredUser.email}</TD>
                <TD>{registeredUser.phone_number}</TD>
              </TR>
            );
          })}
      </PageTemplate>
    </>
  );
};

export default ManageRegisteredUsersPage;
