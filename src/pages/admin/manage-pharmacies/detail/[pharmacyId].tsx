import Pharmacy from "@/features/admin/FormsAddOrEdit/Pharmacy";
import usePharmacy from "@/hooks/CRUD/usePharmacy";
import { IPharmacy } from "@/types/api";
import { getIdFromPath } from "@/utils/getIdFromPath";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

const DetailPharmacy = () => {
  const router = useRouter();
  const pharmacyId = getIdFromPath(router);

  const { pharmacy, getPharmacy, isLoading } = usePharmacy();

  useEffect(() => {
    getPharmacy(Number(pharmacyId));
  }, [pharmacyId]);

  return (
    <>
      {pharmacy !== null && (
        <Pharmacy type="DETAIL" initialData={pharmacy as IPharmacy} />
      )}
    </>
  );
};

export default DetailPharmacy;
DetailPharmacy.title = "Admin | Detail Pharmacy Varmasea";
