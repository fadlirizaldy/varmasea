import * as T from "@/types/api";
import { TRole } from "@/types/role";

export const minPasswordLength = 8;
export const maxPasswordLength = 15;
export const minPhoneNumDigit = 12;
export const maxPhoneNumDigit = 15;
export const minNameLength = 2;
export const minLicenseNumberLength = 5;
export const minStockInput = 0;
export const minProductPrice = 1;
export const minStockMutationQty = 1;
export const minProductDimensionVal = 0;
export const maxProductDimensionVal = 999;
export const minProductWeight = 0;
export const maxProductWeight = 999;
export const maxImageSize = 500; //kB
export const phoneNumStartDigits = "+62";
export const minYearsOfExperience = 0;
export const maxYearsOfExperience = 99;

export const isFormFieldEmpty = (field: string) => field === "";
export const isFileFieldEmpty = (file: File) => {
  if (!file) return true;
  return typeof file.name !== "string";
};

export const isAllFieldFilled = (fields: string[]) => {
  for (const field of fields) {
    if (isFormFieldEmpty(field)) {
      return false;
    }
  }
  return true;
};
export const isAllFieldFilled2 = (obj: Object, minNumber?: number) => {
  let idx = 0;
  for (let key of Object.keys(obj)) {
    const value = obj[key as keyof typeof obj];
    if (typeof value === "string" && value === "") {
      return false;
    }

    if (
      typeof value === "number" &&
      ((minNumber === undefined && value === 0) ||
        (minNumber !== undefined && value < minNumber)) &&
      key !== "latitude" &&
      key !== "longitude"
    ) {
      return false;
    }
    if (typeof value === "object") {
      for (let val of Object.values(value)) {
        if (typeof val === "string" && val === "") {
          return false;
        }
        if (typeof val === "number" && val === 0) {
          return false;
        }
      }
    }
    idx = idx + 1;
  }
  return true;
};

export const isFieldError = (
  data: any,
  isDataValid: (data: any) => boolean,
  isButtonSubmitClicked: boolean
) => {
  return (
    (isFormFieldEmpty(data) && isButtonSubmitClicked) ||
    (!isDataValid(data) && !isFormFieldEmpty(data))
  );
};

export const handleError = (
  inputType: string,
  data: any,
  isButtonSubmitClicked?: boolean,
  additionalText?: string
): [string, boolean] => {
  if (isButtonSubmitClicked === undefined) {
    isButtonSubmitClicked = true;
  }
  let errorText = "This error is not shown";

  if (isFormFieldEmpty(data) && isButtonSubmitClicked) {
    errorText = "This field must not be empty";
  }
  switch (inputType) {
    case "name":
      if (!isNameValid(data) && !isFormFieldEmpty(data)) {
        errorText = `${additionalText} must be min ${minNameLength} characters`;
      }
      break;
    case "license_number":
      if (data.length < minLicenseNumberLength && !isFormFieldEmpty(data)) {
        errorText = `License number must be min ${minLicenseNumberLength} characters`;
      }
      break;
    case "phone_number":
      if (!isPhoneNumValid(data) && !isFormFieldEmpty(data)) {
        errorText = `Input number must be between ${minPhoneNumDigit - 3} and ${
          maxPhoneNumDigit - 3
        } digit`;
      }
      break;
    case "stock":
      if (
        (data === undefined || data < minStockInput) &&
        isButtonSubmitClicked
      ) {
        errorText = `Stock must be greater than or equal to ${minStockInput}`;
      }
      break;
    case "price":
      if (data < minProductPrice && isButtonSubmitClicked) {
        errorText = `Price must be greater than or equal to ${minProductPrice}`;
      }
      break;
    case "quantity":
      if (data[0] < minStockMutationQty && isButtonSubmitClicked) {
        errorText = `Quantity must be greater than or equal to ${minStockMutationQty}`;
      }
      if (data[1] === "insufficient stock") {
        errorText = `The requested pharmacy does not have the requested stock amount`;
      }
      break;
    case "Length":
    case "Width":
    case "Height":
      if (
        (data <= minProductDimensionVal || data > maxProductDimensionVal) &&
        data !== 0
      ) {
        errorText = `${inputType} must be between ${minProductDimensionVal} - ${maxProductDimensionVal} ${additionalText}`;
      }
      break;
    case "Weight":
      if ((data <= minProductWeight || data > maxProductWeight) && data !== 0) {
        errorText = `${inputType} must be between ${minProductWeight} - ${maxProductWeight} ${additionalText}`;
      }
      break;
    case "image":
      if (data[0] === "" && data[1] === null && isButtonSubmitClicked) {
        errorText = "Please upload an image";
      }
      break;
    case "years_of_experience":
      if (
        data < minYearsOfExperience &&
        data > maxYearsOfExperience &&
        isButtonSubmitClicked
      ) {
        errorText = `Year of experience must be between ${minYearsOfExperience} - ${maxYearsOfExperience} years `;
      }
      break;
    default:
      break;
  }

  if (isFormFieldEmpty(data) && !isButtonSubmitClicked) {
    return [errorText, false];
  }
  if (errorText === "This error is not shown") {
    return [errorText, false];
  }
  return [errorText, true];
};

export const isPharmacyDataValid = (data: Partial<T.IPharmacy>) => {
  return (
    !handleError("name", data.name!)[1] &&
    !handleError("name", data.pharmacist_name!)[1] &&
    !handleError("license_number", data.license_number)[1] &&
    !handleError("phone_number", data.phone_number)[1] &&
    !isFormFieldEmpty(data.address!.province!) &&
    !isFormFieldEmpty(data.address!.city!) &&
    !handleError("name", data.address!.detail)[1] &&
    data.address?.latitude !== undefined &&
    data.address.longitude !== undefined
  );
};

export const isUserAddressDataValid = (data: Partial<T.IAddressUser>) => {
  return (
    !isFormFieldEmpty(data.province!) &&
    !isFormFieldEmpty(data.city!) &&
    !handleError("name", data.detail)[1] &&
    data.latitude !== undefined &&
    data.longitude !== undefined
  );
};

export const isProductPharmacyDataValid = (
  data: Partial<T.IProductPharmacy>
) => {
  return (
    data.name !== "" &&
    data.pharmacy !== undefined &&
    data.status !== "" &&
    !handleError("stock", data.stock)[1] &&
    !handleError("price", data.selling_unit)[1]
  );
};

export const isStockMutationRequestDataValid = (
  data: T.IStockMutationRequest
) => {
  return (
    data.from_pharmacy_id !== -1 &&
    data.to_pharmacy_id !== -1 &&
    data.from_pharmacy_id !== data.to_pharmacy_id &&
    data.quantity >= minStockMutationQty &&
    data.drug_id !== -1
  );
};

export const isProductMasterDataValid = (
  data: Partial<T.IProductMaster>,
  uploadedImage: File | null
) => {
  return (
    !handleError("name", data.name)[1] &&
    !handleError("name", data.generic_name)[1] &&
    !handleError("name", data.content)[1] &&
    !isFormFieldEmpty(data.category!) &&
    !isFormFieldEmpty(data.drug_form!) &&
    !isFormFieldEmpty(data.manufacture!) &&
    !handleError("Weight", data.weight)[1] &&
    !handleError("Length", data.length)[1] &&
    !handleError("Height", data.height)[1] &&
    !handleError("Width", data.width)[1] &&
    !handleError("any", data.unit_in_pack)[1] &&
    !handleError("image", [data.image, uploadedImage])[1] &&
    !handleError("name", data.description)[1]
  );
};

export const isProfileUserDataValid = (
  role: TRole | null,
  data: Partial<T.IUser | T.IDoctor>
) => {
  return (
    !handleError("name", data.name)[1] &&
    !handleError("phone_number", data.phone_number!)[1] &&
    (role === "Doctor"
      ? !handleError(
          "years_of_experience",
          (data as T.IDoctor)?.years_of_experience
        )[1] &&
        !isFormFieldEmpty((data as T.IDoctor)?.specialization) &&
        (data as T.IDoctor).specialization !== null
      : true)
  );
};

export const isEmailValid = (email: string) => {
  const pattern =
    /^(([^<>()[\]\\.,;:\s@]+(\.[^<>()[\]\\.,;:\s@]+)*)|(.+))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return pattern.test(email);
};

export const isPasswordValid = (
  password: string,
  disableStrongPassword?: boolean
) => {
  if (disableStrongPassword) {
    return true;
  }
  var re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
  return re.test(password);
};

export const isNameValid = (name: string) => {
  return (
    name.match(/([^ a-zA-Z\d.])/g) === null && name.length >= minNameLength
  );
};

export const isFilePdf = (file: File) => {
  if (!file) return false;
  return file.type === "application/pdf";
};

export function isFileImage(file: File) {
  return file && file["type"].split("/")[0] === "image";
}

export const isPhoneNumValid = (phoneNum: string) => {
  if (phoneNum === null) {
    return false;
  }
  return (
    phoneNum.startsWith(phoneNumStartDigits) &&
    phoneNum.length >= minPhoneNumDigit &&
    phoneNum.length <= maxPhoneNumDigit
  );
};

export const isImageExtension = (filename: string) => {
  return /\.(gif|jpe?g|tiff?|png|webp|bmp)$/i.test(filename);
};

// export const isFieldLengthValid = (min:number,max?:number)=>{

// }
