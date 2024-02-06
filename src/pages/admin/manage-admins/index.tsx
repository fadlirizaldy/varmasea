import LoadingScreen from "@/components/LoadingScreen";
import { DeleteModal } from "@/components/Modal";
import PageTemplate from "@/features/admin/PageTemplate";
import { ItemTools, TD, TR } from "@/features/admin/Table";
import useAdmin from "@/hooks/CRUD/useAdmin";
import useAuth from "@/hooks/useAuth";
import { adminManageAdminsRoute } from "@/routes";
import { IAdmin, IPageInfo, ISortOption } from "@/types/api";
import { initialPageInfo } from "@/utils/initialData";
import { useRouter } from "next/router";
import React, { Fragment, useEffect, useState } from "react";
import { toast } from "sonner";

const ManageAdminsPage = () => {
  const router = useRouter();
  const { role } = useAuth();
  const { admins, pageInfo: pageInfoAdmins, adminUpdated, getAdmins, isLoading, updateAdmin } = useAdmin();

  const [pageInfo, setPageInfo] = useState<IPageInfo>(initialPageInfo);
  const [searchInput, setSearchInput] = useState("");
  const [sortOption, setSortOption] = useState<ISortOption | null>(null);
  const numOfItemPerPage = 10;

  const [isDeleteModalShown, setIsDeleteModalShown] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<IAdmin | null>(null);
  const itemToDeleteText = itemToDelete !== null ? `Admin: ${itemToDelete.name}` : "";

  useEffect(() => {
    const queries = {
      // order_by: sortOption !== null ? sortOption.sortBy : undefined,
      sort: sortOption !== null ? sortOption.sortDir : undefined,
      search: searchInput !== "" ? searchInput : undefined,
      page: pageInfo?.pageNum,
      limit: numOfItemPerPage,
    };
    if (role === "Admin") {
      getAdmins(undefined, queries);
    }
  }, [role, searchInput, sortOption, pageInfo.pageNum]);

  useEffect(() => {
    if (pageInfoAdmins !== null) {
      setPageInfo(pageInfoAdmins);
    }
  }, [admins]);

  const handleAddItem = () => {
    router.push(`${adminManageAdminsRoute}/add`);
    return;
  };
  const handleDeleteItem = () => {
    if (itemToDelete !== null) {
      updateAdmin("DELETE", undefined, itemToDelete.id);
      return;
    }
  };

  useEffect(() => {
    if (adminUpdated !== null && adminUpdated.message === "successfully delete admin pharmcy") {
      getAdmins();
      toast.success(`${itemToDeleteText} has been deleted`, {
        duration: 1500,
      });
      setIsDeleteModalShown(false);
    }
  }, [adminUpdated]);

  return (
    <>
      {isLoading && <LoadingScreen />}
      <PageTemplate
        searchInputProps={{
          searchPlaceholder: "Search",
          maxSearchLength: 25,
          setSearchInput,
        }}
        addItemProps={{
          addItemButtonText: "Add New Admin",
          handleAddItem,
        }}
        paginationProps={{
          ...pageInfo,
          setPageNum: setPageInfo,
          numOfItemPerPage,
        }}
        tableHeads={{
          titles: ["Name", "Email", "Phone Number", "Assigned Pharmacy", ""],
          isSortable: [true, true, true, false, false],
          attributes: ["name", "email", "phone_number"],
          defaultSortItem: "name",
          setSortOption,
        }}
      >
        {admins !== null &&
          admins?.map((admin, idx1) => {
            const rowSpan = admin.pharmacies.length > 1 ? admin.pharmacies.length : 1;
            return (
              <Fragment key={idx1}>
                <TR>
                  <TD rowSpan={rowSpan} colSpan={1}>
                    {admin.name}
                  </TD>
                  <TD rowSpan={rowSpan} colSpan={1}>
                    {admin.email}
                  </TD>
                  <TD rowSpan={rowSpan} colSpan={1}>
                    {admin.phone_number}
                  </TD>
                  <TD>{admin.pharmacies.length > 1 ? admin.pharmacies[0].name : ""}</TD>
                  <ItemTools
                    rowSpan={rowSpan}
                    colSpan={1}
                    editItemProps={
                      role === "Pharmacy Admin"
                        ? {
                            handleEditItem: () => {
                              router.push(`${adminManageAdminsRoute}/edit/${admin.id}`);
                            },
                          }
                        : undefined
                    }
                    deleteItemProps={{
                      handleDeleteItem: () => {
                        setItemToDelete(admin);
                        setIsDeleteModalShown(true);
                      },
                    }}
                  />
                </TR>
                {admin.pharmacies.length > 1 &&
                  admin.pharmacies.slice(1).map((pharmacy, idx2) => {
                    return (
                      <TR key={idx1 * 100 + idx2}>
                        <TD>{pharmacy.name}</TD>
                      </TR>
                    );
                  })}
              </Fragment>
            );
          })}
      </PageTemplate>
      {isDeleteModalShown && itemToDelete !== null && (
        <DeleteModal
          itemToDelete={itemToDeleteText}
          isModalShown={isDeleteModalShown}
          setIsModalShown={setIsDeleteModalShown}
          handleDeleteItem={() => handleDeleteItem()}
        />
      )}
    </>
  );
};

export default ManageAdminsPage;
ManageAdminsPage.title = "Admin | Manage Admin Varmasea";
