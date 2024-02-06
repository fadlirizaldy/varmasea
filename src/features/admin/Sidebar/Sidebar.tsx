import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { ReactNode, useEffect, useState } from "react";
import { GiHamburgerMenu, GiHealthNormal } from "react-icons/gi";
import { PiSquaresFourFill } from "react-icons/pi";
import { IoReceipt } from "react-icons/io5";
import { MdCategory } from "react-icons/md";
import { RiHistoryFill, RiMedicineBottleFill } from "react-icons/ri";
import { BiTransfer } from "react-icons/bi";
import { FaUsers, FaUsersCog } from "react-icons/fa";
import { FaUserDoctor } from "react-icons/fa6";

import * as R from "@/routes";
import { removeCookie } from "@/utils/cookies";
import PageBreadcrumbs from "../PageBreadcrumbs";
import { Button, ButtonBorderOnly } from "@/components/Button";
import useAuth from "@/hooks/useAuth";
import { toast } from "sonner";
import { GCP_PUBLIC_IMG } from "@/utils/api/apiURL";

const Sidebar = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  let currentPage = router.route;
  //   if (currentPage.includes(R.dashboardShippingEditRoute)) {
  //     currentPage = R.dashboardShippingEditRoute;
  //   } else if (currentPage.includes(R.dashboardPromosEditRoute)) {
  //     currentPage = R.dashboardPromosEditRoute;
  //   } else if (currentPage.includes(R.dashboardPromosAddRoute)) {
  //     currentPage = R.dashboardPromosAddRoute;
  //   } else if (currentPage.includes(R.dashboardAddressEditRoute)) {
  //     currentPage = R.dashboardAddressEditRoute;
  //   } else if (currentPage.includes(R.dashboardAddressAddRoute)) {
  //     currentPage = R.dashboardAddressAddRoute;
  //   }

  const { role, userId } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    if (isLoggingOut) {
      removeCookie("token");
      toast.loading("Logging out ...", {
        duration: 1000,
        dismissible: false,
        onAutoClose: () => {
          toast.success("You have been logged out", {
            duration: 1500,
          });
          router.replace(R.homeRoute);
        },
      });
    }
  }, [isLoggingOut]);

  const activeText = (page: string) => {
    if (currentPage.includes(page)) {
      return "bg-primary_orange text-primary_blue text-lg hover:bg-primary_orange hover:text-primary_blue focus:!bg-primary_orange focus:!text-primary_blue";
    }
    return "text-md";
  };
  return (
    <div className="drawer lg:drawer-open ">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content p-8 flex flex-col justify-between">
        <div className="flex flex-row items-center gap-4">
          <label htmlFor="my-drawer-2" className="btn btn-ghost lg:hidden">
            <GiHamburgerMenu size={20} />
          </label>
          <PageBreadcrumbs
            currentPage={currentPage}
            userId={userId !== null ? userId : undefined}
          />
        </div>
        {children}
      </div>
      <div className="drawer-side font-semibold">
        <label
          htmlFor="my-drawer-2"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>

        <ul className="menu p-4 w-80 min-h-full bg-primary_blue text-primary_orange justify-between rounded-r-3xl">
          <div className="flex flex-col gap-4">
            <div className="flex flex-row justify-between h-fit mb-4 items-center">
              <Link href={R.adminDashboardRoute}>
                <Image
                  src={`${GCP_PUBLIC_IMG}/icon_logo.png`}
                  alt={"Varmasea logo"}
                  width={50}
                  height={50}
                />
              </Link>
              <div
                className={` ${
                  role === "Pharmacy Admin" ? "bg-[#2483af]" : "bg-primary_red"
                }  shadow-white drop-shadow-2xl text-white rounded-full text-base  px-3 py-1 h-fit`}
              >
                {role === "Pharmacy Admin" ? "Pharmacy Admin" : "Super Admin"}
              </div>
            </div>
            <span className="text-left ">GENERAL</span>
            <li>
              <Link
                href={R.adminDashboardRoute}
                className={activeText(R.adminDashboardRoute)}
              >
                <PiSquaresFourFill size={"1.5rem"} />
                DASHBOARD
              </Link>
            </li>
            <li>
              <Link
                href={R.adminManageOrdersRoute}
                className={activeText(R.adminManageOrdersRoute)}
              >
                <IoReceipt size={"1.5rem"} />
                ORDERS
              </Link>
            </li>
            <li>
              <Link
                href={R.adminManagePharmaciesRoute}
                className={activeText(R.adminManagePharmaciesRoute)}
              >
                <GiHealthNormal size={"1.5rem"} />
                {role === "Admin" ? "PHARMACIES" : "MY PHARMACIES"}
              </Link>
            </li>
            <div className="border-t-2 flex flex-col gap-4 pt-4">
              <span className="text-left">INVENTORY</span>
              {role === "Admin" && (
                <li>
                  <Link
                    href={R.adminManageProductCategoriesRoute}
                    className={activeText(R.adminManageProductCategoriesRoute)}
                  >
                    <MdCategory size={"1.5rem"} />
                    PRODUCT CATEGORIES
                  </Link>
                </li>
              )}
              <li>
                <Link
                  href={R.adminManageProductsRoute}
                  className={activeText(R.adminManageProductsRoute)}
                >
                  <RiMedicineBottleFill size={"1.5rem"} />
                  PRODUCTS
                </Link>
              </li>
              {role === "Pharmacy Admin" && (
                <>
                  <li>
                    <Link
                      href={R.adminHistoryStockMutationsRoute}
                      className={activeText(R.adminHistoryStockMutationsRoute)}
                    >
                      <RiHistoryFill size={"1.5rem"} />
                      STOCK HISTORY
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={R.adminManageStockMutationsRoute}
                      className={activeText(R.adminManageStockMutationsRoute)}
                    >
                      <BiTransfer size={"1.5rem"} />
                      STOCK MUTATIONS
                    </Link>
                  </li>
                </>
              )}
            </div>

            <div className="border-t-2 flex flex-col gap-4 pt-4">
              {role === "Admin" ? (
                <>
                  <span className="text-left">USERS</span>

                  <li>
                    <Link
                      href={R.adminManageAdminsRoute}
                      className={activeText(R.adminManageAdminsRoute)}
                    >
                      <FaUsersCog size={"1.5rem"} />
                      ADMINS
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={R.adminManageDoctorsRoute}
                      className={activeText(R.adminManageDoctorsRoute)}
                    >
                      <FaUserDoctor size={"1.5rem"} />
                      DOCTORS
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={R.adminManageRegisteredUsersRoute}
                      className={activeText(R.adminManageRegisteredUsersRoute)}
                    >
                      <FaUsers size={"1.5rem"} />
                      USERS
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <span className="text-left">PROFILE</span>

                  <li>
                    <Link
                      href={`${R.adminProfileRoute}/${userId}`}
                      className={activeText(R.adminProfileRoute)}
                    >
                      <FaUsersCog size={"1.5rem"} />
                      MY PROFILE
                    </Link>
                  </li>
                </>
              )}
            </div>
          </div>
          <div className="mb-6 flex flex-col gap-3">
            <ButtonBorderOnly
              onClick={() => {
                setIsLoggingOut(true);
              }}
              isDisabled={isLoggingOut}
            >
              Log Out
            </ButtonBorderOnly>
          </div>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
