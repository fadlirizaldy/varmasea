import React, { ReactNode } from "react";
import Sidebar from "@/features/admin/Sidebar";

const MainLayoutAdmin = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      <Sidebar>
        <div className="h-full">{children}</div>
      </Sidebar>
    </div>
  );
};

export default MainLayoutAdmin;
