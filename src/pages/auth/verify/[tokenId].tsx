import React, { useState } from "react";
import { useRouter } from "next/router";
import * as V from "@/utils/formFieldValidation";
import { Form, FormInput } from "@/components/Form";
import { Button, ButtonBorderOnly } from "@/components/Button";
import { FaPlus } from "react-icons/fa6";
import { useSearchParams } from "next/navigation";
import { AiFillCloseCircle } from "react-icons/ai";
import { toast } from "sonner";
import { baseUrl } from "@/utils/baseUrl";
import { getIdFromPath } from "@/utils/getIdFromPath";

export type DataVerifyPasswordType = {
  password: string;
  confirmPassword: string;
  uploadCertificate?: File | null;
};

const SetupPassword = () => {
  const router = useRouter();
  const tokenId = getIdFromPath(router);

  const isDoctor = (tokenId as string)?.slice(-1) === "d";

  const [isLoading, setIsLoading] = useState(false);
  const [isButtonClicked, setIsButtonClicked] = useState(false);

  const [dataSetup, setDataSetup] = useState<DataVerifyPasswordType>({
    password: "",
    confirmPassword: "",
    uploadCertificate: null,
  });

  const handleErrorMessages = (
    inputType: "email" | "fullname" | "password" | "confirmPassword" | "file"
  ) => {
    switch (inputType) {
      case "password":
        if (V.isFormFieldEmpty(dataSetup.password)) {
          return "Please input password";
        }
        if (!V.isPasswordValid(dataSetup.password)) {
          return `Strong password is required`;
        }
        break;
      case "confirmPassword":
        if (
          V.isFormFieldEmpty(dataSetup.confirmPassword) ||
          dataSetup.confirmPassword !== dataSetup.password
        ) {
          return "Please re-type your password";
        }
        if (dataSetup.confirmPassword === dataSetup.password) {
          return "";
        }

        break;
      case "file":
        if (V.isFileFieldEmpty(dataSetup.uploadCertificate!)) {
          return "Please input your certificate";
        }
        if (!V.isFilePdf(dataSetup.uploadCertificate!)) {
          return `File must be in pdf format`;
        }
        break;
    }

    return "This error is not shown";
  };

  const handleVerifyPassword = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    setIsLoading(true);
    setIsButtonClicked(true);

    if (
      !V.isAllFieldFilled([dataSetup.password, dataSetup.confirmPassword]) ||
      !V.isPasswordValid(dataSetup.password) ||
      (isDoctor && V.isFileFieldEmpty(dataSetup.uploadCertificate!)) ||
      (isDoctor && !V.isFilePdf(dataSetup.uploadCertificate!)) ||
      dataSetup.confirmPassword !== dataSetup.password
    ) {
      setIsLoading(false);
      return;
    }

    const form = new FormData();
    form.append("token", tokenId as string);
    form.append("password", dataSetup.password);
    form.append("certificate", dataSetup.uploadCertificate!);

    const url = baseUrl("/auth/verify");
    const options: RequestInit = {
      method: "POST",
      body: form,
    };

    const response = await fetch(url, options);
    const dataResponse = await response.json();

    if (dataResponse.message.includes("token not found")) {
      toast.error("Token not found! redirecting...", { duration: 2500 });
      return router.replace("/");
    }

    setIsLoading(false);
    toast.success("Success create password, please login to continue!", {
      duration: 2000,
    });
    return router.push("/auth/login");
  };

  return (
    <div>
      <h1 className="font-semibold text-2xl mb-5 text-primary_blue text-center">
        Setup Your New Password
      </h1>
      <Form gap="gap-3">
        <FormInput
          type="password"
          titleText="Password"
          placeholder="Input your password.."
          value={dataSetup.password}
          onChange={(e) =>
            setDataSetup((prev) => ({ ...prev, password: e.target.value }))
          }
          errorText={handleErrorMessages("password")}
          isError={
            (V.isFormFieldEmpty(dataSetup.password) && isButtonClicked) ||
            (!V.isPasswordValid(dataSetup.password) &&
              !V.isFormFieldEmpty(dataSetup.password))
          }
        />
        <FormInput
          type="password"
          titleText="Confirm Password"
          placeholder="Re-type your password.."
          value={dataSetup.confirmPassword}
          onChange={(e) =>
            setDataSetup((prev) => ({
              ...prev,
              confirmPassword: e.target.value,
            }))
          }
          errorText={handleErrorMessages("confirmPassword")}
          isError={
            (V.isFormFieldEmpty(dataSetup.password) && isButtonClicked) ||
            (!V.isPasswordValid(dataSetup.password) &&
              !V.isFormFieldEmpty(dataSetup.password)) ||
            dataSetup.confirmPassword !== dataSetup.password
          }
        />
        {isDoctor ? (
          dataSetup.uploadCertificate ? (
            <div>
              <label htmlFor="" className="label-text text-lg">
                Upload your certification
              </label>
              <p className="bg-slate-100 p-4 rounded-lg mt-2 relative">
                {dataSetup.uploadCertificate.name} <br />{" "}
                <span className="font-semibold text-sm italic">
                  {(dataSetup.uploadCertificate.size / 1000).toFixed(1)}kb
                </span>
                <div
                  className="absolute top-2 right-2 cursor-pointer"
                  onClick={() =>
                    setDataSetup((prev) => ({
                      ...prev,
                      uploadCertificate: null,
                    }))
                  }
                >
                  <AiFillCloseCircle size={"20"} />
                </div>
              </p>
              {isButtonClicked &&
                !V.isFilePdf(dataSetup.uploadCertificate!) && (
                  <p className="text-[red] text-sm">
                    {handleErrorMessages("file")}
                  </p>
                )}
            </div>
          ) : (
            <>
              <div>
                <label htmlFor="" className="label-text text-lg">
                  Upload your certification
                </label>
                {isButtonClicked && (
                  <p className="text-[red] text-xs mb-3">
                    {handleErrorMessages("file")}
                  </p>
                )}

                <div className="relative w-20 h-20 cursor-pointer bg-[#D2D7E0] rounded-2xl flex justify-center items-center">
                  <input
                    type="file"
                    name="uploadCertificate"
                    className="absolute w-full h-full opacity-0 cursor-pointer"
                    accept="application/pdf"
                    placeholder="Input Certification"
                    onChange={(e) =>
                      setDataSetup((prev) => ({
                        ...prev,
                        [e.target.name]: e.target.files![0],
                      }))
                    }
                  />
                  <FaPlus />
                </div>
              </div>
            </>
          )
        ) : null}
        <div className="mt-5">
          <Button
            onClick={(e) => handleVerifyPassword(e)}
            type="submit"
            isLoading={isLoading}
          >
            Confirm Password
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default SetupPassword;
SetupPassword.title = "Set up your password | Varmasea";
