import {
  IDoctor,
  IPageInfo,
  IProductCategory,
  IStockMutationRequest,
  IUser,
} from "@/types/api";

export const initialPharmacyDummy = {
  id: -1,
  name: "Select Pharmacy",
  license_number: "",
  address: {
    city: "",
    detail: "",
    latitude: 0,
    longitude: 0,
    province: "",
  },
  pharmacist_name: "",
  phone_number: "",
};

export const initialProduct = {
  name: "",
  generic_name: "",
  content: "",
  manufacture: "",
  manufacture_id: 0,
  description: "",
  drug_form: "",
  drug_form_id: 0,
  category: "",
  category_id: 0,
  selling_unit: 0,
  unit_in_pack: "",
  weight: 0,
  height: 0,
  length: 0,
  width: 0,
  image: undefined,
  status: "",
};

export const initialProductCategory: IProductCategory = {
  id: 1,
  name: "",
  icon: "",
};

export const initialStockMutationRequest: IStockMutationRequest = {
  drug_id: -1,
  from_pharmacy_id: -1,
  to_pharmacy_id: -1,
  quantity: 0,
};

export const initialPageInfo: IPageInfo = {
  maxItem: 1,
  maxPageNum: 1,
  pageNum: 1,
};

export const initialAddress = {
  detail: "",
  province: "",
  province_id: -1,
  city: "",
  city_id: -1,
  latitude: -6.175392,
  longitude: 106.827153,
  is_default: false,
};

export const initialUserData: IUser | IDoctor = {
  id: -1,
  name: "",
  email: "",
  phone_number: "",
  photo: "",
  is_verify: false,
  addresses: [],
  certificate: "",
  years_of_experience: 0,
  online_status: "",
  specialization: "",
};

export const initialChangePasswordData = {
  old_password: "",
  new_password: "",
};
