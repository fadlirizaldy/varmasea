import Pharmacy from "@/features/admin/FormsAddOrEdit/Pharmacy";
import React from "react";

const AddPharmacy = () => {
  return (
    <>
      <Pharmacy
        type="ADD"
        initialData={{
          name: "",
          pharmacist_name: "",
          license_number: "",
          phone_number: "",
          address: {
            detail: "",
            province: "",
            province_id: -1,
            city: "",
            city_id: -1,
            latitude: -6.175392,
            longitude: 106.827153,
          },
        }}
      />
    </>
  );
};

export default AddPharmacy;
AddPharmacy.title = "Admin | Add Pharmacy Varmasea";
