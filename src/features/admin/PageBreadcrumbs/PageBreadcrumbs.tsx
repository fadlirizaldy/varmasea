import React from "react";
import * as R from "@/routes";
import Link from "next/link";

const PageTitle = ({ currentPage }: { currentPage: string }) => {
  let title = "";
  switch (currentPage.split("/").slice(0, 3).join("/")) {
    case R.adminDashboardRoute:
      title = "Dashboard";
      break;
    case R.adminManageOrdersRoute:
      title = "Manage Orders";
      break;
    case R.adminManageAdminsRoute:
      title = "Manage Admins";
      break;
    case R.adminManageRegisteredUsersRoute:
      title = "Manage Registered Users";
      break;
    case R.adminManageDoctorsRoute:
      title = "Manage Doctors";
      break;
    case R.adminManageProductCategoriesRoute:
      title = "Manage Product Categories";
      break;
    case R.adminManageProductsRoute:
      title = "Manage Products";
      break;
    case R.adminManagePharmaciesRoute:
      title = "Manage Pharmacies";
      break;
    case R.adminManageStockMutationsRoute:
      title = "Manage Stock Mutations";
      break;
    case R.adminHistoryStockMutationsRoute:
      title = "Stock History";
      break;
    case R.adminProfileRoute:
      title = "Admin Profile";
      break;
  }

  return <span>{title}</span>;
};

const PageBreadcrumbs = ({
  currentPage,
  userId,
}: {
  currentPage: string;
  userId?: number;
}) => {
  const mainRoute = currentPage.split("/").slice(0, 4).join("/");

  return (
    <div className="text-sm breadcrumbs">
      <ul>
        <li>
          <Link
            href={
              mainRoute === R.adminProfileRoute
                ? `${mainRoute}/${userId}`
                : mainRoute
            }
          >
            <PageTitle currentPage={currentPage} />
          </Link>
        </li>
        {currentPage.includes("/edit") && (
          <li>
            <span>Edit</span>
          </li>
        )}
        {currentPage.includes("/add") && (
          <li>
            <span>Add</span>
          </li>
        )}
        {currentPage.includes("/detail") && (
          <li>
            <span>Detail</span>
          </li>
        )}
      </ul>
    </div>
  );
};
export default PageBreadcrumbs;
