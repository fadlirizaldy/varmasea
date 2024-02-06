import LoadingScreen from "@/components/LoadingScreen";
import StatusBadge from "@/components/StatusBadge";
import ContactTools from "@/features/admin/ContactTools";
import PageTemplate from "@/features/admin/PageTemplate";
import { ItemTools, TD, TR } from "@/features/admin/Table";
import useOrderMaster from "@/hooks/CRUD/useOrderMaster";
import useOrderPharmacy from "@/hooks/CRUD/useOrderPharmacy";
import useAuth from "@/hooks/useAuth";
import { adminManageOrdersRoute } from "@/routes";
import { IOrder, IPageInfo, ISortOption } from "@/types/api";
import { currencyFormat } from "@/utils/formatting/currencyFormat";
import { timestampFormat } from "@/utils/formatting/timestampFormat";
import { initialPageInfo } from "@/utils/initialData";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const ManageOrdersMasterPage = () => {
  const router = useRouter();
  const { role } = useAuth();
  const {
    ordersMaster,
    pageInfo: pageInfoOrdersMaster,
    isLoading: isLoadingOrdersMaster,
    getOrdersMaster,
  } = useOrderMaster();
  const {
    ordersPharmacy,
    pageInfo: pageInfoOrdersPharmacy,
    isLoading: isLoadingOrdersPharmacy,
    getOrdersPharmacy,
  } = useOrderPharmacy();
  const [ordersShown, setOrdersShown] = useState<IOrder[] | null>(null);

  const [pageInfo, setPageInfo] = useState<IPageInfo>(initialPageInfo);
  const [searchInput, setSearchInput] = useState("");
  const [sortOption, setSortOption] = useState<ISortOption | null>(null);
  const numOfItemPerPage = 10;

  const getOrders = () => {
    const queries = {
      // order_by: sortOption !== null ? sortOption.sortBy : undefined,
      sort: sortOption !== null ? sortOption.sortDir : undefined,
      search: searchInput !== "" ? searchInput : undefined,
      page: pageInfo?.pageNum,
      limit: numOfItemPerPage,
    };
    switch (role) {
      case "Admin":
        getOrdersMaster(undefined, queries);
        break;
      case "Pharmacy Admin":
        getOrdersPharmacy(undefined, queries);
        break;
    }
  };

  useEffect(() => {
    if (role !== null) {
      getOrders();
    }
  }, [role, searchInput, sortOption, pageInfo.pageNum]);

  useEffect(() => {
    if (ordersMaster !== null) {
      setOrdersShown(ordersMaster);
      if (pageInfoOrdersMaster !== null) {
        setPageInfo(pageInfoOrdersMaster);
      }
      return;
    }
    if (ordersPharmacy !== null) {
      setOrdersShown(ordersPharmacy);
      if (pageInfoOrdersPharmacy !== null) {
        setPageInfo(pageInfoOrdersPharmacy);
      }
      return;
    }
    setOrdersShown(null);
  }, [ordersMaster, ordersPharmacy]);

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
        tableHeads={{
          titles: ["Order Timestamp", "User Name", "From", "To", "Total", "Status", ""],
          isSortable: [true, true, true, true, true, true, false],
          attributes: ["created_at", ""],
          defaultSortItem: "created_at",
          setSortOption,
        }}
      >
        {(isLoadingOrdersMaster || isLoadingOrdersPharmacy) && <LoadingScreen />}
        {ordersShown !== null &&
          ordersShown.map((order, id) => {
            return (
              <TR key={id}>
                <TD>{timestampFormat(order.order_date)}</TD>
                <TD>{order.user.name}</TD>
                <TD>
                  <div className="flex justify-between">
                    <div>{order.pharmacy.name}</div>
                    <ContactTools phoneNumber={order.pharmacy.phone_number} email={order.pharmacy.email} />
                  </div>
                </TD>
                <TD>{order.address.city}</TD>
                <TD>{currencyFormat(order.total_amount)}</TD>
                <TD>{<StatusBadge status={order.order_status} />}</TD>
                {role === "Admin" ? (
                  <>
                    <ItemTools
                      viewItemProps={{
                        handleViewItem: () => {
                          router.push(`${adminManageOrdersRoute}/detail/${order.id}`);
                        },
                      }}
                    />
                  </>
                ) : (
                  <ItemTools
                    editItemProps={{
                      handleEditItem: () => {
                        router.push(`${adminManageOrdersRoute}/edit/${order.id}`);
                      },
                    }}
                  />
                )}
              </TR>
            );
          })}
      </PageTemplate>
    </>
  );
};

export default ManageOrdersMasterPage;
ManageOrdersMasterPage.title = "Admin | Manage Order Master Varmasea";
