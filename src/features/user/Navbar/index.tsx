import useAuth from "@/hooks/useAuth";
import { useDebounce } from "@/hooks/useDebounce";
import { availableRoles } from "@/types/role";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { IoIosSearch, IoMdArrowDropdown } from "react-icons/io";
import { RxHamburgerMenu } from "react-icons/rx";
import SidebarUser from "./SidebarUser";
import { removeCookie } from "@/utils/cookies";
import { toast } from "sonner";
import { gcpURL } from "@/utils/gcpURL";
import { IUser } from "@/types/api";
import { GCP_PUBLIC_IMG } from "@/utils/api/apiURL";
import CartIcon from "./CartIcon";

const NavbarSearch = ({
  searchVal,
  searchBy,
  setSearchBy,
  setSearchVal,
  onEnter,
}: {
  searchVal: string;
  searchBy: string;
  setSearchBy: React.Dispatch<React.SetStateAction<string>>;
  setSearchVal: React.Dispatch<React.SetStateAction<string>>;
  onEnter: () => void;
}) => {
  return (
    <div className="relative hidden sm:block md:w-[330px] lg:w-[450px] xl:w-[650px] ml-10 group">
      <input
        type="text"
        placeholder="Type something..."
        className="p-2 pr-3 pl-44 border border-slate-400 rounded-xl w-full"
        value={searchVal}
        onChange={(e) => setSearchVal(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onEnter();
          }
        }}
      />
      <IoIosSearch
        size={24}
        className="text-slate-500 absolute left-2 top-2 z-10"
      />
      <kbd
        className="kbd kbd-sm absolute top-1/2 -translate-y-1/2 right-3 px-2 py-[2px] cursor-pointer hover:scale-[110%] active:scale-100"
        onClick={() => onEnter()}
      >
        Enter↵
      </kbd>
      <div className="dropdown dropdown-hover absolute top-0 left-0">
        <div
          tabIndex={0}
          role="button"
          className="p-[7.5px] pl-10 flex flex-row gap-2 justify-between items-center border border-slate-400 w-40 bg-slate-200 rounded-l-xl "
        >
          {searchBy === "" ? "Search for" : searchBy}
          <IoMdArrowDropdown size={25} />
        </div>
        <ul
          tabIndex={0}
          className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
        >
          <li onClick={() => setSearchBy("Product")}>
            <a>Product</a>
          </li>
          <li onClick={() => setSearchBy("Doctor")}>
            <a>Doctor</a>
          </li>
        </ul>
      </div>
    </div>
  );
};

const Navbar = ({ user }: { user: IUser }) => {
  const router = useRouter();
  const [searchVal, setSearchVal] = useState("");
  const [searchBy, setSearchBy] = useState("");
  const { role } = useAuth();
  const searchDebounce = useDebounce(searchVal, 500);
  const [showSidebar, setShowSidebar] = useState<boolean>(false);

  // const carts = useCartStore((state) => state.carts);
  // const getCarts = useCartStore((state) => state.getCarts);

  useEffect(() => {
    if (router.asPath.includes("/doctors")) {
      setSearchBy("Doctor");
    } else if (router.asPath.includes("/products")) {
      setSearchBy("Product");
    }
    const keywordSearch = router.asPath.split("keyword=")[1];
    if (
      keywordSearch !== "" &&
      keywordSearch !== null &&
      keywordSearch !== undefined
    ) {
      setSearchVal(keywordSearch);
    }
  }, [router]);

  const handleLogout = () => {
    removeCookie("token");
    toast.loading("Logging out ...", {
      duration: 1000,
      dismissible: false,
      onAutoClose: () => {
        toast.success("You have been logged out", {
          duration: 1500,
        });
        router.reload();
      },
    });
  };

  return (
    <div className="w-full shadow-md py-6 bg-white z-[900] sticky top-0">
      <div className="max-w-[1200px] w-[90%] mx-auto flex justify-center relative sm:justify-between sm:gap-3 md:gap-6 items-center">
        <RxHamburgerMenu
          size={25}
          className="absolute block sm:hidden left-0 cursor-pointer"
          onClick={() => setShowSidebar(true)}
        />
        <Link href={"/"} className="flex items-center gap-1">
          <Image
            src={`${GCP_PUBLIC_IMG}/icon_logo.png`}
            alt={"Varmasea logo"}
            width={50}
            height={50}
          />
          <h2 className="font-medium text-xl">Varmasea</h2>
        </Link>

        <div className="flex items-center gap-6">
          <NavbarSearch
            searchVal={searchVal}
            setSearchVal={setSearchVal}
            searchBy={searchBy}
            setSearchBy={setSearchBy}
            onEnter={() => {
              if (
                searchBy.toLowerCase() !== "product" &&
                searchBy.toLowerCase() !== "doctor"
              ) {
                if (searchVal === "") {
                  return;
                }
                setSearchBy("Product");
                router.push(`/products?keyword=${searchVal}`);
                return;
              }
              router.push(`/${searchBy.toLowerCase()}s?keyword=${searchVal}`);
            }}
          />
          {role === "User" && <CartIcon />}
          <hr className="hidden sm:block h-px w-10 rotate-90 bg-slate-400 border-0 dark:bg-slate-700"></hr>

          {role === null || !availableRoles.includes(role) ? (
            <div className="flex items-center gap-3">
              <button
                className="hidden lg:block btn py-[10px] w-24 bg-white border border-primary_blue text-primary_blue rounded-2xl hover:bg-primary_blue hover:text-white"
                onClick={() => router.push("/auth/login")}
              >
                Log In
              </button>

              <button
                className="hidden sm:block btn py-[10px] w-24 border bg-primary_blue text-white rounded-2xl hover:opacity-95 hover:bg-primary_blue"
                onClick={() => router.push("/auth/register")}
              >
                Sign Up
              </button>
            </div>
          ) : (
            <div
              className="dropdown dropdown-hover dropdown-end flex items-center gap-2 cursor-pointer"
              onClick={() => {
                const elem = document.activeElement as HTMLElement;
                if (elem) {
                  elem?.blur();
                }
              }}
            >
              <h2 className="text-lg hidden lg:block">
                Hi, {user?.name.split(" ")[0]}
              </h2>
              <img
                src={gcpURL(user?.photo!)}
                alt={`Photo of ${user?.name}`}
                className="w-12 h-12 rounded-full border border-slate-200 hidden sm:block"
              />
              <div
                tabIndex={0}
                className="hidden sm:block dropdown-content z-[1] bg-base-100 rounded-xl border border-slate-400 w-[200px] mt-52 -mr-7 relative"
              >
                <div className="w-10 h-3 overflow-hidden bg-transparent absolute -top-3 right-8">
                  <div className="bg-white w-10 h-10 rotate-45 mt-2 border border-slate-400"></div>
                </div>
                <div className="flex flex-col">
                  <Link
                    href={"/profile"}
                    className="text-lg font-medium px-5 py-2 hover:bg-gray-100 rounded-t-xl"
                  >
                    Profile
                  </Link>
                  <Link
                    href={"/profile/order"}
                    className="text-lg font-medium px-5 py-2 hover:bg-gray-100 border-y border-slate-200"
                  >
                    My Order
                  </Link>
                  <p
                    className="text-lg font-medium px-5 py-2 hover:bg-gray-100 rounded-b-xl pb-3"
                    onClick={() => handleLogout()}
                  >
                    Logout
                  </p>
                </div>
              </div>
            </div>
          )}

          <SidebarUser
            showSidebar={showSidebar}
            searchVal={searchVal}
            setShowSidebar={setShowSidebar}
            setSearchVal={setSearchVal}
            dataUser={user!}
          />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
