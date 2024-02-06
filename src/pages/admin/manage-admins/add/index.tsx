import Admin from "@/features/admin/FormsAddOrEdit/Admin";
import React from "react";

const AddAdmin = () => {
  return (
    <div className="border border-slate-400 bg-white rounded-xl px-10 py-7 flex justify-start mt-3 min-h-full">
      <Admin
        type="ADD"
        initialData={{
          name: "",
          email: "",
          phone_number: "",
          photo: "",
          pharmacies: [],
        }}
      />
    </div>
  );
};

export default AddAdmin;
AddAdmin.title = "Admin | Add Admin Varmasea";
