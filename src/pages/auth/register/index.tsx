import { Button, ButtonBorderOnly } from "@/components/Button";
import Form from "@/components/Form/Form";
import FormInput from "@/components/Form/FormInput";
import { GCP_PUBLIC_IMG } from "@/utils/api/apiURL";
import { baseUrl } from "@/utils/baseUrl";
import * as V from "@/utils/formFieldValidation";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { FaPlus } from "react-icons/fa6";

export type DataRegisterType = {
  name: string;
  email: string;
};

const RegisterPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userRole = searchParams.get("user_role");

  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorLogin, setErrorLogin] = useState("");

  const [dataRegister, setDataRegister] = useState<DataRegisterType>({
    name: "",
    email: "",
  });
  const [isRegistered, setIsRegistered] = useState(false);

  const handleErrorMessages = (
    inputType: "email" | "fullname" | "password" | "confirmPassword"
  ) => {
    switch (inputType) {
      case "email":
        if (V.isFormFieldEmpty(dataRegister.email)) {
          return "Please input email";
        }
        if (!V.isEmailValid(dataRegister.email)) {
          return "Wrong email format (ex: example@domain.com)";
        }
        break;
      case "fullname":
        if (V.isFormFieldEmpty(dataRegister.name)) {
          return "Please input your name";
        }
        if (!V.isNameValid(dataRegister.name)) {
          return `Name must be ${V.minNameLength} characters long or more`;
        }
        break;
    }

    return "This error is not shown";
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsButtonClicked(true);
    setIsLoading(true);

    if (
      !V.isAllFieldFilled([dataRegister.email, dataRegister.name]) ||
      !V.isEmailValid(dataRegister.email) ||
      !V.isNameValid(dataRegister.name)
    ) {
      setIsLoading(false);
      return;
    }

    const url = baseUrl("/auth/register");
    const role = userRole === "doctor" ? "Doctor" : "User";

    const options: RequestInit = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...dataRegister, role }),
    };
    const response = await fetch(url, options);
    const dataResponse = await response.json();

    if (!dataResponse.message.includes("Succesfully Create User")) {
      setErrorLogin(dataResponse.message);
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
    setIsRegistered(true);

    setTimeout(() => {
      router.push("/auth/login");
    }, 5000);
  };

  return (
    <>
      {isRegistered ? (
        <div className="flex flex-col items-center animate-fade animate-once">
          <img
            src={`${GCP_PUBLIC_IMG}/email_sent.jpg`}
            alt="sent email illustration"
          />
          <h3 className="font-semibold text-2xl mb-2 mt-4 text-primary_blue">
            Verify your email address
          </h3>
          <p className="text-secondary_text text-center">
            You&apos;ve entered {dataRegister.email} as the email address for
            you account. Please check the email to verify your account.
          </p>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-3">
            <img src={`${GCP_PUBLIC_IMG}/icon_logo.png`} alt="Varmasea logo" />
            <h1 className="font-bold text-3xl text-primary_blue">Varmasea</h1>
          </div>
          <p className="mb-5 mt-1 text-secondary_text w-4/5">
            Welcome to Varmasea! To get started, please complete your basic
            Account information!
          </p>

          <Form gap="gap-3" onSubmit={handleRegister}>
            <FormInput
              type="text"
              titleText="Full Name"
              placeholder="Input your name.."
              value={dataRegister.name}
              onChange={(e) =>
                setDataRegister((prev) => ({ ...prev, name: e.target.value }))
              }
              errorText={handleErrorMessages("fullname")}
              isError={
                (V.isFormFieldEmpty(dataRegister.name) && isButtonClicked) ||
                (!V.isNameValid(dataRegister.name) &&
                  !V.isFormFieldEmpty(dataRegister.name))
              }
            />
            <FormInput
              type="email"
              titleText="Email"
              placeholder="Input your email.."
              value={dataRegister.email}
              onChange={(e) =>
                setDataRegister((prev) => ({
                  ...prev,
                  email: e.target.value,
                }))
              }
              errorText={handleErrorMessages("email")}
              isError={
                (V.isFormFieldEmpty(dataRegister.email) && isButtonClicked) ||
                (!V.isEmailValid(dataRegister.email) &&
                  !V.isFormFieldEmpty(dataRegister.email))
              }
            />
            {errorLogin && (
              <p className="text-[red] text-sm mt-0">{errorLogin}</p>
            )}

            <div className="mt-5">
              <Button type="submit" isLoading={isLoading}>
                Sign Up
              </Button>
            </div>
          </Form>

          <div className="flex flex-col items-center xs:items-start xs:flex-row gap-1 justify-center mt-5">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="text-secondary_blue font-medium hover:text-primary_blue"
            >
              Sign in here!
            </Link>
          </div>
        </>
      )}
    </>
  );
};

export default RegisterPage;
RegisterPage.title = "Register | Varmasea";
