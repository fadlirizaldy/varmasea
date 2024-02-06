import LoadingScreen from "@/components/LoadingScreen";
import StatusBadge from "@/components/StatusBadge";
import PageTemplate from "@/features/admin/PageTemplate";
import { ItemTools, TD, TR } from "@/features/admin/Table";
import usePharmacyOfAdmin from "@/hooks/CRUD/usePharmacyOfAdmin";
import useProductMaster from "@/hooks/CRUD/useProductMaster";
import useProductOfPharmacy from "@/hooks/CRUD/useProductOfPharmacy";
import useAuth from "@/hooks/useAuth";
import { adminManageProductsRoute } from "@/routes";
import {
  IPageInfo,
  IProductMaster,
  IProductPharmacy,
  ISortOption,
} from "@/types/api";
import { TRole } from "@/types/role";
import { currencyFormat } from "@/utils/formatting/currencyFormat";
import { gcpURL } from "@/utils/gcpURL";
import { initialPageInfo } from "@/utils/initialData";
import { productPriceFormat } from "@/utils/productPriceFormat";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const ManageProductsPage = () => {
  const router = useRouter();
  const { role } = useAuth();
  const [pharmacyId, setPharmacyId] = useState(-1);

  const {
    productsMaster,
    getProductsMaster,
    pageInfo: pageInfoProductMaster,
    isLoading: isLoadingProductMaster,
  } = useProductMaster();
  const {
    productsOfPharmacies,
    productsOfPharmacy,
    pageInfoProductsOfPharmacies,
    pageInfoProductsOfPharmacy,
    getProductsOfPharmacies,
    getProductsOfPharmacy,
    isLoading: isLoadingProductOfPharmacy,
  } = useProductOfPharmacy(pharmacyId);

  const { pharmaciesOfAdmin, getPharmaciesOfAdmin } = usePharmacyOfAdmin();
  const [productsShown, setProductsShown] = useState<
    IProductMaster[] | IProductPharmacy[] | null
  >(null);

  const [productsShownFilter, setProductsShownFilter] = useState("All");
  const [pageInfo, setPageInfo] = useState<IPageInfo>(initialPageInfo);
  const [searchInput, setSearchInput] = useState("");
  const numOfItemPerPage = 10;
  const [sortOption, setSortOption] = useState<ISortOption | null>(null);

  const queries = {
    // order_by: sortOption !== null ? sortOption.sortBy : undefined,
    sort: sortOption !== null ? sortOption.sortDir : undefined,
    search: searchInput !== "" ? searchInput : undefined,
    page: pageInfo?.pageNum,
    limit: numOfItemPerPage,
  };

  const getProducts = (role: TRole) => {
    if (role === "Admin") {
      getProductsMaster(undefined, queries);
    } else if (role === "Pharmacy Admin") {
      getProductsOfPharmacies(undefined, queries);
      getPharmaciesOfAdmin(undefined, { limit: 999 });
      if (pharmacyId !== -1) {
        getProductsOfPharmacy(undefined, queries);
      }
    }
    return;
  };

  useEffect(() => {
    if (role !== null) {
      getProducts(role);
    }
  }, [role, searchInput, sortOption, pageInfo.pageNum]);

  useEffect(() => {
    if (role === "Admin" || role === null) {
      return;
    }
    if (productsShownFilter === "All") {
      setPharmacyId(-1);
    } else if (pharmaciesOfAdmin !== null) {
      setPharmacyId(
        pharmaciesOfAdmin.find(
          (pharmacy) => pharmacy.name === productsShownFilter
        )!.id
      );
    }
    getProductsOfPharmacies(undefined, queries);
  }, [productsShownFilter, searchInput, sortOption, pageInfo.pageNum]);

  useEffect(() => {
    if (pharmacyId !== -1 && role === "Pharmacy Admin") {
      getProductsOfPharmacy(undefined, queries);
    }
  }, [pharmacyId, searchInput, sortOption, pageInfo.pageNum]);

  useEffect(() => {
    if (productsMaster !== null) {
      setProductsShown(productsMaster);
      if (pageInfoProductMaster !== null) {
        setPageInfo(pageInfoProductMaster);
      }
      return;
    }
    if (productsOfPharmacies !== null && productsShownFilter === "All") {
      setProductsShown(productsOfPharmacies);
      if (pageInfoProductsOfPharmacies !== null) {
        setPageInfo(pageInfoProductsOfPharmacies);
      }
      return;
    }
    if (productsOfPharmacy !== null) {
      setProductsShown(productsOfPharmacy);
      if (pageInfoProductsOfPharmacy !== null) {
        setPageInfo(pageInfoProductsOfPharmacy);
      }
      return;
    }
    setProductsShown(null);
  }, [productsMaster, productsOfPharmacies, productsOfPharmacy]);

  const handleAddItem = () => {
    if (role === "Admin") {
      router.push(`${adminManageProductsRoute}/master/add`);
    } else if (role === "Pharmacy Admin") {
      router.push(`${adminManageProductsRoute}/pharmacy/add`);
    }
    return;
  };

  const tableHeadsSuperAdminObj = {
    "Product Name": true,
    "Generic Name": true,
    Category: true,
    Manufacturer: true,
    "Drug Form": true,
    Price: false,
    "Total Stock": true,
    "": false,
  };

  const tableHeadsPharmacyAdminAllObj = {
    "Product Name": true,
    "Generic Name": true,
    Category: true,
    Manufacturer: true,
    "Drug Form": true,
    Price: false,
    Stock: true,
    Pharmacy: true,
    Status: true,
    "": false,
  };

  const tableHeadsPharmacyAdminObj = {
    "Product Name": true,
    "Generic Name": true,
    Category: true,
    Manufacturer: true,
    "Drug Form": true,
    Price: false,
    Stock: true,
    Status: true,
    "": false,
  };

  return (
    <>
      {(isLoadingProductMaster || isLoadingProductOfPharmacy) && (
        <LoadingScreen />
      )}
      {role !== null && (
        <PageTemplate
          searchInputProps={{
            searchPlaceholder: "Search",
            maxSearchLength: 25,
            setSearchInput,
          }}
          selectDataFilterProps={
            role === "Pharmacy Admin" && pharmaciesOfAdmin !== null
              ? {
                  defaultValue: "All",
                  optionPlaceholderText: "Select Pharmacy",
                  options: [
                    "All",
                    ...pharmaciesOfAdmin.map((item) => item.name),
                  ],
                  setDataFilter: setProductsShownFilter,
                }
              : undefined
          }
          addItemProps={{
            addItemButtonText: "Add New Product",
            handleAddItem,
          }}
          paginationProps={{
            ...pageInfo,
            setPageNum: setPageInfo,
            numOfItemPerPage,
          }}
          tableHeads={{
            titles:
              role === "Admin"
                ? Object.keys(tableHeadsSuperAdminObj)
                : productsShownFilter === "All"
                ? Object.keys(tableHeadsPharmacyAdminAllObj)
                : Object.keys(tableHeadsPharmacyAdminObj),
            isSortable: (() => {
              let tableHeadsObj: any;
              if (role === "Admin") {
                tableHeadsObj = tableHeadsSuperAdminObj;
              } else if (
                role === "Pharmacy Admin" &&
                productsShownFilter === "All"
              ) {
                tableHeadsObj = tableHeadsPharmacyAdminAllObj;
              } else {
                tableHeadsObj = tableHeadsPharmacyAdminObj;
              }
              return Object.keys(tableHeadsObj).map(
                (key) => tableHeadsObj[key as keyof typeof tableHeadsObj]
              );
            })(),

            attributes: [
              "name",
              "generic_name",
              "category",
              "manufacture",
              "drug_form",
              "",
            ],
            defaultSortItem: "name",
            setSortOption,
          }}
        >
          {productsShown !== null &&
            productsShown.map((product, id) => {
              return (
                <TR key={id}>
                  <TD>
                    <div className="flex flex-row items-center  gap-2">
                      <Image
                        src={gcpURL(product.image as string)}
                        alt={`Image of ${product.name}`}
                        width={70}
                        height={70}
                      />
                      <span>{product.name}</span>
                    </div>
                  </TD>
                  <TD>{product.generic_name}</TD>
                  <TD>{product.category}</TD>
                  <TD>{product.manufacture}</TD>
                  <TD>{product.drug_form}</TD>
                  {role === "Admin" && (
                    <>
                      <TD>{productPriceFormat(product as IProductMaster)}</TD>
                      <TD>{(product as IProductMaster).total_stock}</TD>
                    </>
                  )}

                  {role === "Pharmacy Admin" && (
                    <>
                      <TD>
                        {currencyFormat(
                          (product as IProductPharmacy).selling_unit
                        )}
                      </TD>
                      <TD>{(product as IProductPharmacy).stock}</TD>
                      {productsShownFilter === "All" && (
                        <TD>{(product as IProductPharmacy).pharmacy.name}</TD>
                      )}
                      <TD>
                        <StatusBadge
                          status={(product as IProductPharmacy).status}
                        />
                      </TD>
                    </>
                  )}

                  <ItemTools
                    editItemProps={{
                      handleEditItem: () => {
                        switch (role) {
                          case "Admin":
                            router.push(
                              `${adminManageProductsRoute}/master/edit/${product.id}`
                            );
                            break;
                          case "Pharmacy Admin":
                            router.push(
                              `${adminManageProductsRoute}/pharmacy/${
                                (product as IProductPharmacy).pharmacy.id
                              }/edit/${product.id}`
                            );
                            break;
                        }
                      },
                    }}
                  />
                </TR>
              );
            })}
        </PageTemplate>
      )}
    </>
  );
};

export default ManageProductsPage;
