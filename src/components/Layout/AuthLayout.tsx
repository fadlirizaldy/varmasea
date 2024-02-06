import { GCP_PUBLIC_IMG } from "@/utils/api/apiURL";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen">
      <div
        className={`brightness-50 bg-[url(https://storage.googleapis.com/varmasea/public/img/background-login.jpg)] bg-no-repeat bg-cover absolute w-full h-full`}
      ></div>
      <Link
        href={"/"}
        className="font-semibold text-3xl absolute p-7 text-white flex items-center gap-3"
      >
        <Image
          src={`${GCP_PUBLIC_IMG}/logo.png`}
          alt="logo image"
          width={"45"}
          height={"45"}
          priority
        />
        Varmasea
      </Link>
      <div className="absolute top-1/2 transform -translate-x-1/2 -translate-y-1/2 left-1/2 w-[90%] md:w-[600px] h-fit rounded-[24px] bg-[#FFFFFF] p-[32px] justify-center border-2 border-[#E1E4EA] shadow-2xl">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
