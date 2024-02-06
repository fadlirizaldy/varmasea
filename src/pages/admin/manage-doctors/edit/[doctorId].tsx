import Doctor from "@/features/admin/FormsAddOrEdit/Doctor";
import useDoctor from "@/hooks/CRUD/useDoctor";
import useAuth from "@/hooks/useAuth";
import { getIdFromPath } from "@/utils/getIdFromPath";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

const EditDoctor = () => {
  const router = useRouter();
  const doctorId = getIdFromPath(router);
  const { role } = useAuth();
  const { doctor, getDoctor, isLoading } = useDoctor();

  useEffect(() => {
    getDoctor(Number(doctorId));
  }, [role, doctorId]);

  return (
    <>
      {doctor && (
        <div className="border border-slate-400 bg-white rounded-xl px-10 py-7 flex justify-start mt-3 min-h-full">
          <Doctor initialData={doctor} doctorId={Number(doctorId)} />
        </div>
      )}
    </>
  );
};

export default EditDoctor;
EditDoctor.title = "Admin | Edit Doctor Varmasea";
