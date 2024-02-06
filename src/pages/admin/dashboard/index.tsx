import { GCP_PUBLIC_IMG } from "@/utils/api/apiURL";
import React from "react";

const DashboardPage = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center gap-4 pt-10">
      <img src={`${GCP_PUBLIC_IMG}/under-development.jpg`} alt="no-data" className="w-56 sm:w-96" />
      <p className="text-slate-400 font-medium">We are very sorry this page is still under development</p>
    </div>
  );
};

export default DashboardPage;
DashboardPage.title = "Admin | Dashboard Varmasea";
