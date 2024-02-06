import LoadingScreen from "@/components/LoadingScreen";
import { DeleteModal } from "@/components/Modal";
import PageTemplate from "@/features/admin/PageTemplate";
import { ItemTools, TD, TR } from "@/features/admin/Table";
import useProductCategory from "@/hooks/CRUD/useProductCategory";
import useAuth from "@/hooks/useAuth";
import { adminManageProductCategoriesRoute } from "@/routes";
import { IPageInfo, IProductCategory, ISortOption } from "@/types/api";
import { gcpURL } from "@/utils/gcpURL";
import { initialPageInfo } from "@/utils/initialData";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const ManageProductCategoriesPage = () => {
  const router = useRouter();
  const { role } = useAuth();
  const {
    productCategories,
    pageInfo: pageInfoProductCategories,
    productCategoryUpdated,
    getProductCategories,
    isLoading,
    updateProductCategory,
  } = useProductCategory();

  const [pageInfo, setPageInfo] = useState<IPageInfo>(initialPageInfo);
  const [searchInput, setSearchInput] = useState("");
  const [sortOption, setSortOption] = useState<ISortOption | null>(null);
  const numOfItemPerPage = 10;

  const [isDeleteModalShown, setIsDeleteModalShown] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<IProductCategory | null>(
    null
  );
  const itemToDeleteText =
    itemToDelete !== null ? `Category: ${itemToDelete.name}` : "";

  useEffect(() => {
    if (role === "Admin") {
      const queries = {
        order_by: sortOption !== null ? sortOption.sortBy : undefined,
        sort: sortOption !== null ? sortOption.sortDir : undefined,
        search: searchInput !== "" ? searchInput : undefined,
        page: pageInfo?.pageNum,
        limit: numOfItemPerPage,
      };
      getProductCategories(undefined, queries);
    }
  }, [role, searchInput, sortOption, pageInfo.pageNum]);

  useEffect(() => {
    if (pageInfoProductCategories !== null) {
      setPageInfo(pageInfoProductCategories);
    }
  }, [productCategories]);

  const handleAddItem = () => {
    router.push(`${adminManageProductCategoriesRoute}/add`);
    return;
  };

  const handleDeleteItem = () => {
    if (itemToDelete !== null) {
      updateProductCategory("DELETE", undefined, itemToDelete.id);
      return;
    }
  };
  useEffect(() => {
    if (
      productCategoryUpdated !== null &&
      productCategoryUpdated.message === "success delete category"
    ) {
      getProductCategories();
      toast.success(`${itemToDeleteText} has been deleted`, {
        duration: 1500,
      });
      setIsDeleteModalShown(false);
    }
  }, [productCategoryUpdated]);

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
          addItemButtonText: "Add New Category",
          handleAddItem,
        }}
        paginationProps={{
          ...pageInfo,
          setPageNum: setPageInfo,
          numOfItemPerPage,
        }}
        tableHeads={{
          titles: ["ID", "Category", ""],
          isSortable: [true, true, false],
          attributes: ["id", "category"],
          defaultSortItem: "id",
          setSortOption,
        }}
      >
        {productCategories !== null &&
          productCategories !== undefined &&
          productCategories.map((productCategory, id) => {
            return (
              <TR key={id}>
                <TD>{productCategory.id}</TD>
                <TD>
                  <div className="flex flex-row items-center  gap-2">
                    <Image
                      src={gcpURL(productCategory.icon as string)}
                      alt={`Image of ${productCategory.name}`}
                      width={70}
                      height={70}
                    />
                    <span>{productCategory.name}</span>
                  </div>
                </TD>
                <ItemTools
                  editItemProps={{
                    handleEditItem: () => {
                      router.push(
                        `${adminManageProductCategoriesRoute}/edit/${productCategory.id}`
                      );
                    },
                  }}
                  deleteItemProps={{
                    handleDeleteItem: () => {
                      setItemToDelete(productCategory);
                      setIsDeleteModalShown(true);
                    },
                  }}
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

export default ManageProductCategoriesPage;
