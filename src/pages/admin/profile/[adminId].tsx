import Admin from "@/features/admin/FormsAddOrEdit/Admin";
import useAdmin from "@/hooks/CRUD/useAdmin";
import { getIdFromPath } from "@/utils/getIdFromPath";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

const AdminProfile = () => {
  const router = useRouter();
  const adminId = getIdFromPath(router);

  const { admin, getAdmin, isLoading } = useAdmin();

  useEffect(() => {
    if (router.isReady) {
      getAdmin(Number(adminId));
    }
  }, [router.isReady, adminId]);

  return (
    <>
      {admin && (
        <div className="border border-slate-400 bg-white rounded-xl px-10 py-7 flex justify-start mt-3 min-h-full">
          <Admin type="DETAIL" initialData={admin} adminId={Number(adminId)} />
        </div>
      )}
    </>
  );
};

export default AdminProfile;
