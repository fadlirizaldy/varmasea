import LoadingScreen from "@/components/LoadingScreen";
import { DeleteModal } from "@/components/Modal";
import PageTemplate from "@/features/admin/PageTemplate";
import { ItemTools, TD, TR } from "@/features/admin/Table";
import usePharmacy from "@/hooks/CRUD/usePharmacy";
import usePharmacyOfAdmin from "@/hooks/CRUD/usePharmacyOfAdmin";
import useAuth from "@/hooks/useAuth";
import { adminManagePharmaciesRoute } from "@/routes";
import { IPageInfo, IPharmacy, ISortOption } from "@/types/api";
import { initialPageInfo } from "@/utils/initialData";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const ManagePharmaciesPage = () => {
  const router = useRouter();
  const { role } = useAuth();
  const {
    pharmacies: pharmaciesGlobal,
    pageInfo: pageInfoPharmaciesGlobal,
    getPharmacies,
    isLoading: isLoadingPharmaciesGlobal,
  } = usePharmacy();
  const {
    pharmaciesOfAdmin,
    pageInfo: pageInfoPharmaciesOfAdmin,
    pharmacyUpdated,
    getPharmaciesOfAdmin,
    updatePharmacy,
    isLoading: isLoadingPharmaciesOfAdmin,
  } = usePharmacyOfAdmin();
  const [pharmaciesShown, setPharmaciesShown] = useState<IPharmacy[] | null>(null);
  const [pageInfo, setPageInfo] = useState<IPageInfo>(initialPageInfo);
  const [searchInput, setSearchInput] = useState("");
  const numOfItemPerPage = 10;
  const [sortOption, setSortOption] = useState<ISortOption | null>(null);

  const [isDeleteModalShown, setIsDeleteModalShown] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<IPharmacy | null>(null);
  const itemToDeleteText = itemToDelete !== null ? `Pharmacy: ${itemToDelete.name}` : "";

  useEffect(() => {
    if (role !== null) {
      const queries = {
        order_by: sortOption !== null ? sortOption.sortBy : undefined,
        sort: sortOption !== null ? sortOption.sortDir : undefined,
        search: searchInput !== "" ? searchInput : undefined,
        page: pageInfo?.pageNum,
        limit: numOfItemPerPage,
      };
      switch (role) {
        case "Admin":
          getPharmacies(undefined, queries);
          break;
        case "Pharmacy Admin":
          getPharmaciesOfAdmin(undefined, queries);
          break;
      }
    }
  }, [role, searchInput, sortOption, pageInfo.pageNum]);

  useEffect(() => {
    switch (role) {
      case "Admin":
        setPharmaciesShown(pharmaciesGlobal as IPharmacy[]);
        if (pageInfoPharmaciesGlobal !== null) {
          setPageInfo(pageInfoPharmaciesGlobal);
        }
        break;
      case "Pharmacy Admin":
        setPharmaciesShown(pharmaciesOfAdmin);
        if (pageInfoPharmaciesOfAdmin !== null) {
          setPageInfo(pageInfoPharmaciesOfAdmin);
        }
        break;
    }
  }, [pharmaciesGlobal, pharmaciesOfAdmin]);

  const handleAddItem = () => {
    router.push(`${adminManagePharmaciesRoute}/add`);
    return;
  };

  const handleDeleteItem = () => {
    if (itemToDelete !== null) {
      updatePharmacy("DELETE", undefined, itemToDelete.id);
      return;
    }
  };

  useEffect(() => {
    if (role === "Pharmacy Admin" && pharmacyUpdated !== null && pharmacyUpdated.message === "Success to delete") {
      getPharmaciesOfAdmin();
      toast.success(`${itemToDeleteText} has been deleted`, {
        duration: 1500,
      });
      setIsDeleteModalShown(false);
    }
  }, [pharmacyUpdated]);

  return (
    <>
      {(isLoadingPharmaciesGlobal || isLoadingPharmaciesOfAdmin) && <LoadingScreen />}
      <PageTemplate
        searchInputProps={{
          searchPlaceholder: "Search",
          maxSearchLength: 25,
          setSearchInput,
        }}
        addItemProps={
          role === "Pharmacy Admin"
            ? {
                addItemButtonText: "Add New Pharmacy",
                handleAddItem,
              }
            : undefined
        }
        paginationProps={{
          ...pageInfo,
          setPageNum: setPageInfo,
          numOfItemPerPage,
        }}
        tableHeads={{
          titles: ["ID", "Pharmacy", "Pharmacist", "License Number", "Phone Number", "Province", "City", "Street", ""],

          isSortable: [true, true, true, true, true, false, false, false, false],
          attributes: ["id", "name", "pharmaciest_name", "license_number", "phone_number"],
          defaultSortItem: "name",
          setSortOption,
        }}
      >
        {pharmaciesShown !== null &&
          pharmaciesShown !== undefined &&
          pharmaciesShown.map((pharmacy, id) => {
            return (
              <TR key={id}>
                <TD>{pharmacy.id}</TD>
                <TD>{pharmacy.name}</TD>
                <TD>{pharmacy.pharmacist_name}</TD>
                <TD>{pharmacy.license_number}</TD>
                <TD>{pharmacy.phone_number}</TD>
                <TD>{pharmacy.address.province}</TD>
                <TD>{pharmacy.address.city}</TD>
                <TD>{pharmacy.address.detail}</TD>

                <ItemTools
                  viewItemProps={
                    role === "Admin"
                      ? {
                          handleViewItem: () => {
                            router.push(`${adminManagePharmaciesRoute}/detail/${pharmacy.id}`);
                          },
                        }
                      : undefined
                  }
                  editItemProps={
                    role === "Pharmacy Admin"
                      ? {
                          handleEditItem: () => {
                            router.push(`${adminManagePharmaciesRoute}/edit/${pharmacy.id}`);
                          },
                        }
                      : undefined
                  }
                  deleteItemProps={
                    role === "Pharmacy Admin"
                      ? {
                          handleDeleteItem: () => {
                            setItemToDelete(pharmacy);
                            setIsDeleteModalShown(true);
                          },
                        }
                      : undefined
                  }
                />
              </TR>
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

export default ManagePharmaciesPage;
ManagePharmaciesPage.title = "Admin | Manage Pharmacies Varmasea";
