import { Button, ButtonBorderOnly } from "@/components/Button";
import { Form, FormInput } from "@/components/Form";
import { adminProfileRoute } from "@/routes";
import { IAdmin } from "@/types/api";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { MdSave } from "react-icons/md";
import * as V from "@/utils/formFieldValidation";
import useAdmin from "@/hooks/CRUD/useAdmin";
import ImageInput from "@/components/Form/ImageInput";
import { toast } from "sonner";
import { gcpURL } from "@/utils/gcpURL";
import { numberOnlyFormat } from "@/utils/formatting/numberOnlyFormat";
import { BiEdit } from "react-icons/bi";
import { formData } from "@/utils/formData";

const Admin = ({
  type,
  initialData,
  adminId,
}: {
  type: "ADD" | "EDIT" | "DETAIL";
  initialData: Partial<IAdmin>;
  adminId?: number;
}) => {
  const router = useRouter();
  const [isButtonSaveClicked, setIsButtonSaveClicked] = useState(false);
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [dataUpdateAdmin, setDataUpdateAdmin] =
    useState<Partial<IAdmin>>(initialData);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [isEmailAlreadyExists, setIsEmailAlreadyExists] = useState(false);
  const [isPhoneNumberExists, setIsPhoneNumberExists] = useState(false);

  const { adminUpdated, error: errorUpdateAdmin, updateAdmin } = useAdmin();

  useEffect(() => {
    setDataUpdateAdmin((prev) => ({
      ...prev,
      photo:
        uploadedImage !== null
          ? uploadedImage
          : initialData.photo
          ? initialData.photo
          : "",
    }));
  }, [uploadedImage]);

  const handleErrorMessages = (
    inputType: "email" | "fullname" | "phone" | "pharmacies"
  ) => {
    switch (inputType) {
      case "email":
        if (V.isFormFieldEmpty(dataUpdateAdmin.email!)) {
          return "Please input email";
        }
        if (!V.isEmailValid(dataUpdateAdmin.email!)) {
          return "Wrong email format (ex: example@domain.com)";
        }
        if (isEmailAlreadyExists) {
          return "Email is already exists";
        }
        if (isPhoneNumberExists) {
          return "Phone number is already exists";
        }
        break;
      case "fullname":
        if (V.isFormFieldEmpty(dataUpdateAdmin.name!)) {
          return "Please input your name";
        }
        if (!V.isNameValid(dataUpdateAdmin.name!)) {
          return `Name must be ${V.minNameLength} characters long or more`;
        }
        break;
      case "phone":
        if (V.isFormFieldEmpty(dataUpdateAdmin.phone_number!)) {
          return "Please input your phone number";
        }
        if (!V.isPhoneNumValid(dataUpdateAdmin.phone_number!)) {
          return `Phone number must be between ${V.minPhoneNumDigit - 3} and ${
            V.maxPhoneNumDigit - 3
          } digit`;
        }
        if (errorUpdateAdmin && isButtonSaveClicked) {
          return "Phone number has already been used by other user";
        }
        break;
      case "pharmacies":
        if (dataUpdateAdmin.pharmacies!.length < 1) {
          return "Select at least one pharmacy to assigned";
        }

        break;
    }

    return "This error is not shown";
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsButtonSaveClicked(true);
    setIsButtonLoading(true);

    if (
      !V.isAllFieldFilled([
        dataUpdateAdmin.email!,
        dataUpdateAdmin.name!,
        dataUpdateAdmin.phone_number!,
      ]) ||
      !V.isEmailValid(dataUpdateAdmin.email!) ||
      !V.isNameValid(dataUpdateAdmin.name!) ||
      !V.isPhoneNumValid(dataUpdateAdmin.phone_number!)
    ) {
      setIsButtonLoading(false);
      return;
    }

    let dataAdminSent = { ...dataUpdateAdmin };
    if (typeof dataUpdateAdmin.photo === "string") {
      delete dataAdminSent.photo;
    }
    if (type === "EDIT") {
      updateAdmin(type, formData(dataAdminSent), adminId);
    } else if (type === "ADD") {
      updateAdmin(type, dataAdminSent, adminId);
    }
  };

  useEffect(() => {
    if (
      adminUpdated !== null &&
      (adminUpdated.data ||
        adminUpdated.message === "Succesfullly update admin pharmacy data")
    ) {
      toast.success(
        type === "ADD"
          ? "New admin has been created"
          : "Edit admin data successful",
        { duration: 1500 }
      );
      router.back();
      return;
    }
    if (adminUpdated !== null && adminUpdated.message) {
      if (adminUpdated.message.includes("email")) {
        setIsEmailAlreadyExists(true);
      } else if (
        adminUpdated.message ===
        'ERROR: duplicate key value violates unique constraint "users_phone_number_key" (SQLSTATE 23505)'
      ) {
        setIsPhoneNumberExists(true);
      } else {
        alert(adminUpdated.message);
      }
      setIsButtonLoading(false);
      return;
    }
  }, [adminUpdated]);

  useEffect(() => {
    setIsButtonSaveClicked(false);
  }, [dataUpdateAdmin]);

  return (
    <div className="max-w-3xl w-[90%]">
      <h1 className="mb-5 text-3xl font-bold">{`${
        type === "ADD"
          ? "Add New Pharmacy Admin"
          : type === "DETAIL"
          ? "Admin Profile"
          : "Edit Profile"
      } `}</h1>

      <Form formnovalidate={true} onSubmit={handleFormSubmit} gap="gap-4">
        <FormInput
          type="text"
          placeholder="Input name.."
          titleText="Full Name"
          value={dataUpdateAdmin.name}
          onChange={(e) =>
            setDataUpdateAdmin((prev) => ({ ...prev, name: e.target.value }))
          }
          errorText={handleErrorMessages("fullname")}
          isError={
            (V.isFormFieldEmpty(dataUpdateAdmin.name!) &&
              isButtonSaveClicked) ||
            (!V.isNameValid(dataUpdateAdmin.name!) &&
              !V.isFormFieldEmpty(dataUpdateAdmin.name!))
          }
          isDisabled={type === "DETAIL"}
        />
        <FormInput
          type="email"
          titleText="Email"
          placeholder="Input your email.."
          value={dataUpdateAdmin.email}
          onChange={(e) =>
            setDataUpdateAdmin((prev) => ({ ...prev, email: e.target.value }))
          }
          errorText={handleErrorMessages("email")}
          isError={
            (V.isFormFieldEmpty(dataUpdateAdmin.email!) &&
              isButtonSaveClicked) ||
            (!V.isEmailValid(dataUpdateAdmin.email!) &&
              !V.isFormFieldEmpty(dataUpdateAdmin.email!)) ||
            isEmailAlreadyExists
          }
          isDisabled={type === "EDIT" || type === "DETAIL"}
        />
        <FormInput
          type="text"
          placeholder="Input phone number.."
          titleText="Phone Number"
          value={
            Number(dataUpdateAdmin.phone_number) === 0
              ? ""
              : dataUpdateAdmin.phone_number?.startsWith("+62")
              ? dataUpdateAdmin.phone_number.slice(3)
              : dataUpdateAdmin.phone_number
          }
          onChange={(e) => {
            const phoneNumberInput = `+62${numberOnlyFormat(
              e.target.value
            ).toString()}`;
            if (phoneNumberInput.length <= V.maxPhoneNumDigit)
              setDataUpdateAdmin((prev) => {
                return {
                  ...prev,
                  phone_number: phoneNumberInput,
                };
              });
          }}
          withPrefix={<div className="-ml-1">+62</div>}
          errorText={handleErrorMessages("phone")}
          isError={
            (V.isFormFieldEmpty(dataUpdateAdmin.phone_number!) &&
              isButtonSaveClicked) ||
            (!V.isPhoneNumValid(dataUpdateAdmin.phone_number!) &&
              !V.isFormFieldEmpty(dataUpdateAdmin.phone_number!)) ||
            (errorUpdateAdmin !== undefined &&
              errorUpdateAdmin !== null &&
              isButtonSaveClicked) ||
            isPhoneNumberExists
          }
          isDisabled={type === "DETAIL"}
        />

        {(type === "EDIT" || type === "DETAIL") && (
          <>
            <ImageInput
              titleText="Photo"
              initialImage={
                initialData.photo && (initialData.photo as string).length > 1
                  ? gcpURL(initialData.photo as string)
                  : ""
              }
              setUploadedImage={setUploadedImage}
              maxHeightDisplay="h-full"
              isDisabled={type === "DETAIL"}
            />
          </>
        )}

        <div className="flex flex-row self-end gap-2 mt-6">
          {type !== "DETAIL" && (
            <div>
              <ButtonBorderOnly
                type={"button"}
                onClick={() => {
                  if (isButtonLoading) return;
                  router.back();
                }}
              >
                Cancel
              </ButtonBorderOnly>
            </div>
          )}
          <div className="flex flex-row">
            {type === "DETAIL" ? (
              <Button
                withoutHoverEffect={true}
                type={"button"}
                isLoading={isButtonLoading}
                onClick={() =>
                  router.push(`${adminProfileRoute}/edit/${adminId}`)
                }
              >
                Edit
                <div className={`${isButtonLoading ? "invisible" : "block"}`}>
                  <BiEdit size={20} />
                </div>
              </Button>
            ) : (
              <Button
                withoutHoverEffect={true}
                type={"submit"}
                isLoading={isButtonLoading}
              >
                Save
                <div className={`${isButtonLoading ? "invisible" : "block"}`}>
                  <MdSave size={20} />
                </div>
              </Button>
            )}
          </div>
        </div>
      </Form>
    </div>
  );
};

export default Admin;
