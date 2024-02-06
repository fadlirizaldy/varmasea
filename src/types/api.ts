export interface IAdmin {
  id: number;
  name: string;
  email: string;
  photo: string | File;
  phone_number: string;
  pharmacies: Partial<IPharmacy>[];
}

export interface IPharmacy {
  id: number;
  name: string;
  pharmacist_name: string;
  email: string; //email of the admin who created the pharmacy?
  license_number: string;
  phone_number: string;
  address: IAddress;
}

export interface IAddress {
  detail: string;
  province: string;
  province_id: number;
  city: string;
  city_id: number;
  latitude: number;
  longitude: number;
}

export interface IAddressUser extends IAddress {
  id: number;
  is_default: boolean;
}

export interface IPharmacyRequest {
  name: string;
  pharmacist_name: string;
  pharmacist_license_number: string;
  pharmacist_phone_number: string;
  address: IAddressRequest;
}

export interface IAddressRequest {
  detail: string;
  province_id: number;
  city_id: number;
  latitude: number;
  longitude: number;
}

export interface IDoctor {
  id: number;
  name: string;
  email: string;
  is_verify: boolean;
  certificate: string;
  years_of_experience: number;
  online_status: string;
  photo: string | File;
  phone_number: string;
  specialization: string;
  specialization_id: number;
}

export interface IUser {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  photo: string;
  is_verify: boolean;
  addresses: IAddressUser[];
}

export interface IRegisteredUser {
  id: number;
  name: string;
  email: string;
  photo: string | File;
  phone_number: string;
}

export interface IProductBasic {
  id: number;
  name: string;
  generic_name: string;
  content: string;
  manufacture: string;
  manufacture_id: number;
  description: string;
  drug_form: string;
  drug_form_id: number;
  category: string;
  category_id: number;
  unit_in_pack: string;
  weight: number;
  height: number;
  length: number;
  width: number;
  image: string | File;
}

export interface IProductMaster extends IProductBasic {
  min_selling_unit: number;
  max_selling_unit: number;
  total_stock: number;
}

export interface IProductPharmacy extends IProductBasic {
  selling_unit: number;
  status: string;
  stock: number;
  pharmacy: Partial<IPharmacy>;
}

export interface IProductOrdered extends IProductBasic {
  selling_unit: number;
  amount: number;
}

export interface IProductCategory {
  id: number;
  name: string;
  icon: string | File;
}

export interface IOrder {
  id: number;
  user: IRegisteredUser;
  pharmacy: IPharmacy;
  order_date: string;
  address: IAddress;
  // shipping_method: IShippingMethod;
  payment: IPayment;
  order_status: TOrderStatus;
  shipping_cost: number;
  shipping_name: string;
  total_drugs_amount: number;
  total_amount: number;
  products: Partial<IProductOrdered>[];
  updated_at: string;
}

export type TOrderStatus =
  | "Waiting for Payment"
  | "Waiting for Confirmation"
  | "Processed"
  | "Sent"
  | "Order Confirmed"
  | "Canceled";

export interface IShippingMethod {
  name: string;
  cost_per_km: number;
}

export interface IPayment {
  id: number;
  payment_file: string;
  status: "Not Uploaded" | "Waiting Approval" | "Approved" | "Rejected";
}

export interface IStockMutationRequest {
  drug_id: number;
  from_pharmacy_id: number;
  to_pharmacy_id: number;
  quantity: number;
  action?: TStockMutationRequestAction;
}
export type TStockMutationRequestAction =
  | "edit"
  | "accept"
  | "reject"
  | "cancel";

export interface IStockMutationResponse {
  id: number;
  drug: IProductPharmacy;
  from_pharmacy: IPharmacy;
  to_pharmacy: IPharmacy;
  quantity: number;
  status_mutation: TStockMutationStatus;
  created_at: string;
}
export type TStockMutationStatus =
  | "accepted"
  | "pending"
  | "rejected"
  | "canceled";

export interface IProvince {
  id: number;
  name: string;
  cities: ICity[];
}

export interface ICity {
  id: number;
  name: string;
}

export interface IProductDrugForm {
  id: number;
  name: string;
}

export interface IProductManufacturer {
  id: number;
  name: string;
}

export interface ICart {
  id: number;
  drug: {
    id: number;
    name: string;
    image: string;
    quantity: number;
  };
}

export interface ICartFull {
  id: number;
  pharmacy_drug_id: number;
  drug_id: number;
  drug_name: string;
  drug_image: string;
  selling_unit: number;
  quantity: number;
  weight: number;
  height: number;
  length: number;
  width: number;
  price: number;
}

export interface ICheckout {
  pharmacy_id: number;
  total_proce: number;
  carts: ICartFull[];
}

export interface IPageInfo {
  pageNum: number;
  maxItem: number;
  maxPageNum: number;
}

export interface ISortOption {
  sortBy: string;
  sortDir: "asc" | "desc";
}
