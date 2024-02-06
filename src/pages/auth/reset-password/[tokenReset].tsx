import React, { useState } from "react";
import { DataVerifyPasswordType } from "../verify/[tokenId]";
import { Form, FormInput } from "@/components/Form";
import * as V from "@/utils/formFieldValidation";
import { Button } from "@/components/Button";
import { useRouter } from "next/router";
import { toast } from "sonner";
import { baseUrl } from "@/utils/baseUrl";
import { getIdFromPath } from "@/utils/getIdFromPath";

const ResetPasswordPage = () => {
  const router = useRouter();
  const tokenReset = getIdFromPath(router);

  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [dataSetup, setDataSetup] = useState<DataVerifyPasswordType>({
    password: "",
    confirmPassword: "",
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
    }

    return "This error is not shown";
  };

  const handleNewPassword = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    setIsLoading(true);
    setIsButtonClicked(true);

    if (
      !V.isAllFieldFilled([dataSetup.password, dataSetup.confirmPassword]) ||
      !V.isPasswordValid(dataSetup.password) ||
      dataSetup.confirmPassword !== dataSetup.password
    ) {
      setIsLoading(false);
      return;
    }

    const url = baseUrl("/auth/reset-password");
    const options: RequestInit = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: tokenReset, password: dataSetup.password }),
    };
    const response = await fetch(url, options);
    const dataResponse = await response.json();

    if (dataResponse.message.includes("token is invalid")) {
      toast.error("Token not found! redirecting...");
      return router.replace("/auth/login");
    } else if (
      dataResponse.message.includes("'Password' failed on the 'required'")
    ) {
      toast.error("Input password!");
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
    toast.success("Success reset password!");
    return router.replace(`/auth/login`);
  };

  return (
    <>
      <h1 className="font-bold text-3xl text-primary_blue">
        Create your new password
      </h1>
      <hr className="h-px my-2 bg-gray-200 border-0 dark:bg-gray-700" />

      <Form gap="gap-2">
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
        <div className="mt-4">
          <Button
            onClick={(e) => handleNewPassword(e)}
            type="submit"
            isLoading={isLoading}
          >
            Submit
          </Button>
        </div>
      </Form>

      <p className="mt-5 text-sm text-slate-500 text-justify">
        If you don&apos;t see a code in your inbox, check your spam folder. If
        it&apos;s not there, the email address may not be confirmed, or it may
        not match an existing LinkedIn account.
      </p>
    </>
  );
};

export default ResetPasswordPage;
ResetPasswordPage.title = "Reset Password Account | Varmasea";
