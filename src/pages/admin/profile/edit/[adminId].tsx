import Admin from "@/features/admin/FormsAddOrEdit/Admin";
import useAdmin from "@/hooks/CRUD/useAdmin";
import useAuth from "@/hooks/useAuth";
import { getIdFromPath } from "@/utils/getIdFromPath";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

const EditAdmin = () => {
  const router = useRouter();
  const { role } = useAuth();
  const adminId = getIdFromPath(router);

  const { admin, getAdmin, isLoading } = useAdmin();

  useEffect(() => {
    if (role) {
      getAdmin(Number(adminId));
    }
  }, [role, adminId]);

  return (
    <>
      {admin !== null && (
        <div className="border border-slate-400 bg-white rounded-xl px-10 py-7 flex justify-start mt-3 min-h-full">
          <Admin type="EDIT" initialData={admin} adminId={Number(adminId)} />
        </div>
      )}
    </>
  );
};

export default EditAdmin;
