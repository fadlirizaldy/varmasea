import React, { useEffect, useState } from "react";
import { FormInput, FormSelect } from "@/components/Form";
import { IoMdAdd } from "react-icons/io";
import useUser from "@/hooks/CRUD/useUser";
import useAuth from "@/hooks/useAuth";
import { IDoctor, IUser } from "@/types/api";
import { gcpURL } from "@/utils/gcpURL";
import * as V from "@/utils/formFieldValidation";
import { numberOnlyFormat } from "@/utils/formatting/numberOnlyFormat";
import { Button } from "@/components/Button";
import { toast } from "sonner";
import ModalAddress from "@/features/user/address/ModalAddress";
import AddressCard from "@/features/user/address/AddressCard";
import { GCP_PUBLIC_IMG } from "@/utils/api/apiURL";
import useSpecialization from "@/hooks/CRUD/useSpecialization";
import useDoctorProfile from "@/hooks/CRUD/useDoctorProfile";
import {
  initialChangePasswordData,
  initialUserData,
} from "@/utils/initialData";
import { formData } from "@/utils/formData";
import { TbPhotoEdit } from "react-icons/tb";

const ProfilePage = () => {
  const maxUserAddresses = 5;
  const { role, userId, token } = useAuth();
  const { user, userUpdated, isLoading, getUser, updateUser } = useUser();
  const { doctorProfile, doctorUpdated, getDoctorProfile, updateDoctor } =
    useDoctorProfile();
  const { specializations, specializationsResponse, getSpecializations } =
    useSpecialization();

  const [profileShown, setProfileShown] = useState<
    Partial<IUser> | Partial<IDoctor>
  >(initialUserData);
  const [dataImage, setDataImage] = useState<string | File | null>(null);

  const [dataPassword, setDataPassword] = useState(initialChangePasswordData);
  const [isButtonSaveClicked, setIsButtonSaveClicked] = useState(false);
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [errorOldPass, setErrorOldPass] = useState<string>("");
  const [isModalAddressShown, setIsModalAddressShown] = useState(false);
  const [modalAddressType, setModalAddressType] = useState<"ADD" | "EDIT">(
    "ADD"
  );

  const rerenderPage = () => {
    if (role === "User") {
      getUser();
      return;
    }
    if (role === "Doctor") {
      getDoctorProfile();
      getSpecializations();
      return;
    }
  };

  useEffect(() => {
    rerenderPage();
  }, [role, userId]);

  useEffect(() => {
    if (user !== null) {
      setProfileShown(user);
      setDataImage(user.photo);
      return;
    }
    if (doctorProfile !== null) {
      setProfileShown(doctorProfile);
      setDataImage(doctorProfile.photo);
      return;
    }
  }, [user, doctorProfile]);

  const handleErrorMessages = (
    inputType: "name" | "phone" | "old_password" | "new_password"
  ) => {
    switch (inputType) {
      case "name":
        if (V.isFormFieldEmpty(profileShown?.name!)) {
          return "Please enter name";
        }
        break;
      case "old_password":
        if (V.isFormFieldEmpty(dataPassword.old_password)) {
          return "Please input your old password";
        }
        if (!V.isPasswordValid(dataPassword.old_password)) {
          return `Strong password is required`;
        }
        break;
      case "new_password":
        if (V.isFormFieldEmpty(dataPassword.new_password)) {
          return "Please input your new password";
        }
        if (!V.isPasswordValid(dataPassword.new_password)) {
          return `Strong password is required`;
        }
        break;
    }

    return "This error is not shown";
  };

  const handleFormSubmit = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    setIsButtonSaveClicked(true);
    setIsButtonLoading(true);

    if (
      !V.isAllFieldFilled2(profileShown!, 0) ||
      !V.isProfileUserDataValid(role, profileShown!) ||
      !V.isPhoneNumValid(profileShown?.phone_number!) ||
      (!V.isPasswordValid(dataPassword.new_password) &&
        dataPassword.old_password)
    ) {
      setIsButtonLoading(false);
      return;
    }

    let dataSent = { ...profileShown };
    if (dataPassword.new_password !== "" && dataPassword.old_password !== "") {
      dataSent = { ...dataSent, ...dataPassword };
    }
    if (typeof dataImage !== "string" && dataImage !== null) {
      dataSent = { ...dataSent, photo: dataImage };
    } else {
      delete dataSent.photo;
    }

    // const form = new FormData();
    // form.append("name", profileShown?.name!);
    // form.append("phone_number", profileShown?.phone_number!);

    // if (dataPassword.new_password !== "" && dataPassword.old_password !== "") {
    //   form.append("old_password", dataPassword.old_password);
    //   form.append("new_password", dataPassword.new_password);
    // }
    // if (typeof dataImage !== "string" && dataImage !== null) {
    //   form.append("photo", dataImage);
    // }
    if (role === "User") {
      updateUser("EDIT", formData(dataSent));
    } else if (role === "Doctor") {
      updateDoctor("EDIT", formData(dataSent));
    }

    // const url = baseUrl("/user");
    // const options: RequestInit = {
    //   method: "PUT",
    //   headers: {
    //     Authorization: `Bearer ${token}`,
    //   },
    //   body: form,
    // };

    // const response = await fetch(url, options);
    // const dataResponse = await response.json();

    // if (dataResponse.message?.includes("incorrect"))
    //   setErrorOldPass(dataResponse.message);

    // toast.success("Success update data");
    // setIsButtonLoading(false);

    return;
  };

  useEffect(() => {
    if (userUpdated !== null && userUpdated.message) {
      setErrorOldPass(userUpdated.message);
    }
    if (doctorUpdated !== null && doctorUpdated.message) {
      setErrorOldPass(doctorUpdated.message);
    }

    if (
      (userUpdated !== null && userUpdated.data) ||
      (doctorUpdated !== null && doctorUpdated.data)
    ) {
      rerenderPage();
      setDataPassword(initialChangePasswordData);
      toast.success("Success update data");
    }

    setIsButtonLoading(false);
  }, [userUpdated, doctorUpdated]);

  return (
    <>
      <div className="max-w-[1200px] w-[90%] mx-auto flex flex-col md:flex-row gap-10 pt-10">
        <div className="w-48 h-48 overflow-hidden relative rounded-full group border border-slate-200">
          {dataImage !== null && (
            <img
              src={
                typeof dataImage === "string"
                  ? gcpURL(profileShown?.photo! as string)
                  : URL.createObjectURL(dataImage as File)
              }
              alt={`Photo of ${profileShown?.name}`}
              className="rounded-full object-cover w-full h-full"
            />
          )}
          <h4 className="bg-slate-600 bg-opacity-70 text-white flex justify-center absolute transition-all -bottom-12 group-hover:bottom-0 w-full pb-3 pt-1 cursor-pointer">
            <input
              type="file"
              name="upload_photo"
              accept="image/*"
              className="absolute w-full h-full cursor-pointer top-0 opacity-0"
              placeholder="Input Image"
              onChange={(e) => setDataImage(e.target.files![0])}
            />
            <TbPhotoEdit size={24} />
          </h4>
        </div>

        <div className="flex flex-col gap-5 w-full md:w-4/5">
          <div className="flex flex-col rounded-xl border border-slate-200 p-4 gap-6">
            <h2 className="font-medium text-2xl mb-4">My Profile</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput
                type="text"
                placeholder="Input .."
                titleText="Full Name"
                value={profileShown?.name}
                onChange={(e) =>
                  setProfileShown((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
                handleError={V.handleError(
                  "name",
                  profileShown?.name!,
                  isButtonSaveClicked,
                  "Name"
                )}
              />
              <FormInput
                type="text"
                placeholder="Input email.."
                titleText="Email"
                value={profileShown?.email}
                isDisabled={true}
              />
              <div>
                <h3 className="label-text text-lg">Status</h3>
                <p
                  className={`${
                    profileShown?.is_verify
                      ? "text-primary_green"
                      : "text-primary_red"
                  } italic font-medium`}
                >
                  {profileShown?.is_verify ? "Verified" : "Unverified"}
                </p>
              </div>
              <FormInput
                type="text"
                placeholder="Input phone number.."
                titleText="Phone Number"
                withPrefix={<div className="-ml-1">+62</div>}
                value={
                  Number(profileShown?.phone_number) === 0
                    ? ""
                    : profileShown?.phone_number?.startsWith("+62")
                    ? profileShown?.phone_number.slice(3)
                    : profileShown?.phone_number
                }
                onChange={(e) => {
                  const phoneNumberInput = `+62${numberOnlyFormat(
                    e.target.value
                  ).toString()}`;
                  if (phoneNumberInput.length <= V.maxPhoneNumDigit)
                    setProfileShown((prev) => {
                      return {
                        ...prev,
                        phone_number: phoneNumberInput,
                      };
                    });
                }}
                handleError={V.handleError(
                  "phone_number",
                  profileShown?.phone_number!,
                  isButtonSaveClicked
                )}
              />
              {role === "Doctor" && (
                <>
                  <div>
                    <FormInput
                      type="text"
                      placeholder="Input .."
                      titleText="Years of Experience"
                      withSuffix={"year"}
                      value={(profileShown as IDoctor)?.years_of_experience}
                      onChange={(e) => {
                        if (
                          numberOnlyFormat(e.target.value) >
                          V.maxYearsOfExperience
                        ) {
                          return;
                        }
                        setProfileShown((prev) => ({
                          ...prev,
                          years_of_experience: numberOnlyFormat(e.target.value),
                        }));
                      }}
                      handleError={V.handleError(
                        "years_of_experience",
                        (profileShown as IDoctor)?.years_of_experience,
                        isButtonSaveClicked
                      )}
                    />
                  </div>
                  <FormSelect
                    titleText="Specialization"
                    defaultValue={""}
                    value={
                      profileShown !== undefined &&
                      (profileShown as IDoctor).specialization !== ""
                        ? (profileShown as IDoctor).specialization
                        : ""
                    }
                    optionPlaceholderText="Select specialization"
                    options={specializations !== null ? specializations : [""]}
                    onChange={(e) =>
                      setProfileShown((prev) => ({
                        ...prev,
                        specialization: e.target.value,
                        specialization_id:
                          specializationsResponse !== null
                            ? specializationsResponse.find(
                                (item) => item.name === e.target.value
                              )?.id
                            : undefined,
                      }))
                    }
                    errorText="Please select specialization"
                    isError={
                      V.isFormFieldEmpty(
                        (profileShown as IDoctor)?.specialization
                      ) &&
                      (profileShown as IDoctor).specialization !== null &&
                      isButtonSaveClicked
                    }
                  />
                </>
              )}
            </div>
            {role === "Doctor" && (
              <div>
                <div className="pb-1">
                  <span className="label-text text-lg">
                    Uploaded Certificate
                  </span>
                </div>
                <embed
                  src={
                    doctorProfile !== null
                      ? gcpURL(doctorProfile.certificate)
                      : ""
                  }
                  type="application/pdf"
                  height="600px"
                  className="w-full"
                />
              </div>
            )}

            <hr className="h-px mt-7 mb-5 bg-gray-200 border dark:bg-gray-700"></hr>
            <h4 className="font-medium text-lg mb-3">Change password</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput
                type="password"
                placeholder="Input your old password.."
                titleText="Old Password"
                value={dataPassword.old_password}
                onChange={(e) =>
                  setDataPassword((prev) => ({
                    ...prev,
                    old_password: e.target.value,
                  }))
                }
                errorText={errorOldPass}
                isError={errorOldPass ? true : false}
              />
              <FormInput
                type="password"
                placeholder="Input your new password.."
                titleText="New Password"
                value={dataPassword.new_password}
                onChange={(e) =>
                  setDataPassword((prev) => ({
                    ...prev,
                    new_password: e.target.value,
                  }))
                }
                errorText={handleErrorMessages("new_password")}
                isError={
                  (dataPassword.old_password &&
                    V.isFormFieldEmpty(dataPassword.new_password) &&
                    isButtonSaveClicked) ||
                  (!V.isPasswordValid(dataPassword.new_password) &&
                    !V.isFormFieldEmpty(dataPassword.new_password))
                }
              />
            </div>
            <div className="flex justify-end">
              <div className="mt-5">
                <Button
                  isLoading={isButtonLoading}
                  onClick={handleFormSubmit}
                  isDisabled={!V.isProfileUserDataValid(role, profileShown)}
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </div>

          {role === "User" && (
            <div className="rounded-xl border border-slate-200 p-4 pb-7">
              <div className="flex items-center justify-between">
                <h2 className="font-medium text-2xl mb-4">Saved Addresses</h2>
                <div className=" w-1/2 sm:w-fit">
                  <Button
                    onClick={() => {
                      if (
                        user !== null &&
                        user.addresses.length < maxUserAddresses
                      ) {
                        setIsModalAddressShown(true);
                        return;
                      }
                      toast.error(
                        `Saved addresses number has reached maximum limit (limit: ${maxUserAddresses})`,
                        {
                          duration: 1500,
                          important: true,
                          action: { label: "OK", onClick: () => {} },
                        }
                      );
                    }}
                  >
                    <IoMdAdd className="w-5 h-5 hidden sm:block" /> Add New
                    Address
                  </Button>
                </div>
              </div>

              <div className="flex flex-col gap-4 mt-5">
                {(profileShown as IUser)?.addresses!.length! < 1 ? (
                  <div className="flex flex-col gap-3 justify-center items-center">
                    <img
                      src={`${GCP_PUBLIC_IMG}/no-address.jpg`}
                      alt="no address"
                      className="w-1/4"
                    />
                    <p className="text-slate-600 font-medium">
                      Currently you have no saved addresses. Let&apos;s add a
                      new one!
                    </p>
                  </div>
                ) : (
                  <>
                    {(profileShown as IUser)
                      ?.addresses!.filter((address) => address.is_default)
                      .map((address, idx) => (
                        <AddressCard
                          key={idx}
                          address={address}
                          rerenderPage={rerenderPage}
                        />
                      ))}
                    {(profileShown as IUser)
                      ?.addresses!.filter((address) => !address.is_default)
                      .map((address, idx) => (
                        <AddressCard
                          key={idx}
                          address={address}
                          rerenderPage={rerenderPage}
                        />
                      ))}
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      {isModalAddressShown && (
        <ModalAddress
          isModalShown={isModalAddressShown}
          setIsModalShown={setIsModalAddressShown}
          type={modalAddressType}
          rerenderPage={rerenderPage}
        />
      )}
    </>
  );
};

export default ProfilePage;
ProfilePage.title = "Varmasea | Find your health solution";
