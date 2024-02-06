import Link from "next/link";
import React from "react";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { FaUser } from "react-icons/fa";
import { BiSolidBasket } from "react-icons/bi";
import { GiMedicines } from "react-icons/gi";
import { PiStethoscope } from "react-icons/pi";
import { IoIosSearch } from "react-icons/io";
import Image from "next/image";
import { useRouter } from "next/router";
import { IUser } from "@/types/api";
import { MdOutlineShoppingCart } from "react-icons/md";
import { gcpURL } from "@/utils/gcpURL";
import { removeCookie } from "@/utils/cookies";
import { toast } from "sonner";
import { GCP_PUBLIC_IMG } from "@/utils/api/apiURL";
import { IoChatboxEllipses } from "react-icons/io5";

type SidebarUserType = {
  showSidebar: boolean;
  dataUser: IUser;
  searchVal: string;
  setShowSidebar: React.Dispatch<React.SetStateAction<boolean>>;
  setSearchVal: React.Dispatch<React.SetStateAction<string>>;
};

const SidebarUser = (props: SidebarUserType) => {
  const router = useRouter();
  const { dataUser, showSidebar, searchVal, setShowSidebar, setSearchVal } =
    props;

  const redirectMenu = (url: string) => {
    router.push(url);
    setShowSidebar(false);
  };

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
    <>
      <div
        className={`flex flex-col items-center p-2 py-4 gap-6 w-3/4 min-h-screen  absolute transition z-[920] ${
          showSidebar ? "opacity-100 translate-x-[126%]" : "opacity-0"
        } left-[-101%] bottom-0 -top-6 bg-white`}
      >
        <Link href={"/"} className="flex items-center gap-1">
          <Image
            src={`${GCP_PUBLIC_IMG}/icon_logo.png`}
            alt={"Varmasea logo"}
            width={50}
            height={50}
          />
          <h2 className="font-medium text-xl">Varmasea</h2>
        </Link>
        <p
          onClick={() => setShowSidebar(false)}
          className="absolute cursor-pointer -right-24 text-white"
        >
          <IoMdCloseCircleOutline size={30} />
        </p>

        <div className="relative w-11/12">
          <input
            type="text"
            placeholder="Search something..."
            className="p-2 pr-3 pl-9 border border-slate-400 rounded-xl w-full"
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
          />
          <IoIosSearch
            size={24}
            className="text-slate-500 absolute left-2 top-2"
          />
        </div>

        <div className="flex flex-col items-center gap-2 w-11/12 mt-3">
          <h4
            onClick={() => redirectMenu("/products")}
            className="font-semibold w-full text-lg py-2 flex items-center gap-2 cursor-pointer hover:underline"
          >
            <GiMedicines size={25} />
            Products
          </h4>

          <h4
            onClick={() => redirectMenu("/doctors")}
            className="font-semibold w-full text-lg py-2 flex items-center gap-2 cursor-pointer hover:underline"
          >
            <PiStethoscope size={25} />
            Doctors
          </h4>
          <hr className="h-px my-1 w-full bg-gray-200 border dark:bg-gray-700"></hr>
          {dataUser !== null ? (
            <>
              <h4
                onClick={() => redirectMenu("/cart")}
                className="font-semibold w-full text-lg py-2 flex items-center gap-2 cursor-pointer hover:underline"
              >
                <MdOutlineShoppingCart size={25} /> Cart
              </h4>
              <h4
                onClick={() => redirectMenu("/order")}
                className="font-semibold w-full text-lg py-2 flex items-center gap-2 cursor-pointer hover:underline"
              >
                <BiSolidBasket size={25} /> My Order
              </h4>
              <h4
                onClick={() => redirectMenu("/chat")}
                className="font-semibold w-full text-lg py-2 flex items-center gap-2 cursor-pointer hover:underline"
              >
                <IoChatboxEllipses size={25} /> Chat
              </h4>
              <h4
                onClick={() => redirectMenu("/profile")}
                className="font-semibold w-full text-lg py-2 flex items-center gap-2 cursor-pointer hover:underline"
              >
                <FaUser size={25} /> Profile
              </h4>

              <img
                src={gcpURL(dataUser?.photo as string)}
                alt="photo_profile"
                className="w-20 h-20 rounded-full border border-slate-200"
              />
              <button className="btn mt-2" onClick={() => handleLogout()}>
                Logout
              </button>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <button
                className="btn py-[10px] w-24 bg-white border border-primary_blue text-primary_blue rounded-2xl hover:bg-primary_blue hover:text-white"
                onClick={() => router.push("/auth/login")}
              >
                Log In
              </button>
              <button
                className="btn py-[10px] w-24 border bg-primary_blue text-white rounded-2xl hover:opacity-95 hover:bg-primary_blue"
                onClick={() => router.push("/auth/register")}
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </div>
      <div
        className={`bg-slate-600 bg-opacity-50 w-screen transition z-[910] h-screen absolute ${
          showSidebar ? "inline" : "hidden"
        } -left-5 bottom-0 -top-6`}
        onClick={() => setShowSidebar(false)}
      ></div>
    </>
  );
};

export default SidebarUser;
