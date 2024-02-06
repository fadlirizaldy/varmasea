import LoadingScreen from "@/components/LoadingScreen";
import { DeleteModal } from "@/components/Modal";
import PageTemplate from "@/features/admin/PageTemplate";
import { ItemTools, TD, TR } from "@/features/admin/Table";
import useDoctor from "@/hooks/CRUD/useDoctor";
import useAuth from "@/hooks/useAuth";
import { adminManageDoctorsRoute } from "@/routes";
import { IPageInfo, ISortOption } from "@/types/api";
import { initialPageInfo } from "@/utils/initialData";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const ManageDoctorsPage = () => {
  const router = useRouter();
  const { role } = useAuth();
  const { doctors, pageInfo: pageInfoDoctors, getDoctors, isLoading } = useDoctor();
  const [pageInfo, setPageInfo] = useState<IPageInfo>(initialPageInfo);
  const [searchInput, setSearchInput] = useState("");
  const [sortOption, setSortOption] = useState<ISortOption | null>(null);
  const numOfItemPerPage = 10;

  const [isDeleteModalShown, setIsDeleteModalShown] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const itemToDeleteText = "deleteThis";

  useEffect(() => {
    if (role === "Admin") {
      const queries = {
        // order_by: sortOption !== null ? sortOption.sortBy : undefined,
        sort: sortOption !== null ? sortOption.sortDir : undefined,
        search: searchInput !== "" ? searchInput : undefined,
        page: pageInfo?.pageNum,
        limit: numOfItemPerPage,
      };
      getDoctors(undefined, queries);
    }
  }, [role, searchInput, sortOption, pageInfo.pageNum]);

  useEffect(() => {
    if (pageInfoDoctors !== null) {
      setPageInfo(pageInfoDoctors);
    }
  }, [doctors]);

  const handleDeleteItem = () => {
    if (itemToDelete !== null) {
      // updateOriginAddress("DELETE", itemToDelete?.id);
      // setTimeout(() => {
      //   getOriginAddresses();
      // }, 500);
      setTimeout(() => {
        toast.success(`${itemToDeleteText} has been deleted`, {
          duration: 1500,
        });
        setIsDeleteModalShown(false);
      }, 1000);
      return;
    }
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
        paginationProps={{
          ...pageInfo,
          setPageNum: setPageInfo,
          numOfItemPerPage,
        }}
        tableHeads={{
          titles: ["Name", "Email", "Phone Number", "Specialization", "YoE", "Status", ""],
          isSortable: [true, true, false, true, true, true],
          attributes: ["name", "email", "phone_number", "specialization", "years_of_experience", "is_verify"],
          defaultSortItem: "name",
          setSortOption,
        }}
      >
        {doctors !== null &&
          doctors.map((doctor, id) => {
            return (
              <TR key={id}>
                <TD>{doctor.name}</TD>
                <TD>{doctor.email}</TD>
                <TD>{doctor.phone_number}</TD>
                <TD>{doctor.specialization}</TD>
                <TD>{doctor.years_of_experience}</TD>
                <TD>
                  <div
                    className={`${
                      doctor.is_verify ? "bg-primary_green" : "bg-primary_red"
                    } text-white p-2 rounded-badge text-center text-sm w-28`}
                  >
                    {doctor.is_verify ? "Verified" : "Not Verified"}
                  </div>
                </TD>
                <ItemTools
                  editItemProps={{
                    handleEditItem: () => {
                      router.push(`${adminManageDoctorsRoute}/edit/${doctor.id}`);
                    },
                  }}
                />
              </TR>
            );
          })}
      </PageTemplate>
      {isDeleteModalShown && itemToDelete !== null && (
        <DeleteModal
          itemToDelete={itemToDeleteText.toLowerCase()}
          isModalShown={isDeleteModalShown}
          setIsModalShown={setIsDeleteModalShown}
          handleDeleteItem={() => handleDeleteItem()}
        />
      )}
    </>
  );
};

export default ManageDoctorsPage;
ManageDoctorsPage.title = "Admin | Manage Doctors Varmasea";
