import { GCP_PUBLIC_IMG } from "@/utils/api/apiURL";
import Link from "next/link";
import React from "react";

const Custom404Page = () => {
  return (
    <div className="max-w-[1200px] w-[90%] mx-auto pt-10 flex flex-col items-center justify-center">
      <h1 className="text-8xl text-slate-300 font-bold mb-5">404</h1>
      <img
        src={`${GCP_PUBLIC_IMG}/no-page.png`}
        alt={"No page illustration"}
        className="w-1/2 lg:w-1/3 object-cover"
      />
      <h3 className="font-medium text-primary_blue text-2xl mt-4">
        Page not found
      </h3>
      <p className="text-center">
        We&apos;re sorry, the page you requested could not be found
      </p>
      <Link
        href={"/"}
        className="btn mt-2 px-10 bg-secondary_blue hover:bg-primary_blue text-white"
      >
        Go to homepage
      </Link>
    </div>
  );
};

export default Custom404Page;
Custom404Page.title = "Not found | Varmasea";
