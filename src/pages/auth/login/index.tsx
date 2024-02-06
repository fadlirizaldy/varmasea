import { Button, ButtonBorderOnly } from "@/components/Button";
import Form from "@/components/Form/Form";
import FormInput from "@/components/Form/FormInput";
import { IParsedJWT } from "@/hooks/useAuth";
import { adminDashboardRoute } from "@/routes";
import { GCP_PUBLIC_IMG } from "@/utils/api/apiURL";
import { baseUrl } from "@/utils/baseUrl";
import { getCookie, removeCookie, setCookie } from "@/utils/cookies";
import * as V from "@/utils/formFieldValidation";
import { parseJwt } from "@/utils/parseJwt";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";

export type DataLoginType = {
  email: string;
  password: string;
};

const LoginPage = () => {
  const router = useRouter();
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [isRememberingUser, setIsRememberingUser] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorLogin, setErrorLogin] = useState("");

  const [dataLogin, setDataLogin] = useState<DataLoginType>({
    email: "",
    password: "",
  });

  useEffect(() => {
    const rememberedEmail = atob(getCookie("rmbusr"));
    if (rememberedEmail !== "") {
      setDataLogin((prev) => ({ ...prev, email: rememberedEmail }));
      setIsRememberingUser(true);
    }
  }, []);

  const handleErrorMessages = (
    inputType: "email" | "fullname" | "password" | "confirmPassword"
  ) => {
    switch (inputType) {
      case "email":
        if (V.isFormFieldEmpty(dataLogin.email)) {
          return "Please input email";
        }
        if (!V.isEmailValid(dataLogin.email)) {
          return "Wrong email format (ex: example@domain.com)";
        }
        break;
      case "password":
        if (V.isFormFieldEmpty(dataLogin.password)) {
          return "Please input password";
        }
        if (!V.isPasswordValid(dataLogin.password)) {
          return `Strong password is required`;
        }
        break;
    }

    return "This error is not shown";
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsButtonClicked(true);
    setIsLoading(true);

    if (
      !V.isAllFieldFilled([dataLogin.email, dataLogin.password]) ||
      !V.isEmailValid(dataLogin.email) ||
      !V.isPasswordValid(dataLogin.password, true)
    ) {
      setIsLoading(false);

      return;
    }

    const url = baseUrl("/auth/login");
    const options: RequestInit = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataLogin),
    };

    const response = await fetch(url, options);
    const dataResponse = await response.json();

    if (!dataResponse.hasOwnProperty("data")) {
      setErrorLogin(dataResponse.message);
      setIsLoading(false);
      return;
    }
    if (isRememberingUser) {
      setCookie("rmbusr", btoa(dataLogin.email), 1);
    } else {
      removeCookie("rmbusr");
    }

    setCookie("token", dataResponse?.data?.token, 1);
    const parsedJWT: IParsedJWT = parseJwt(dataResponse?.data?.token);
    const role = parsedJWT.Role;

    toast.success("Success login!", { duration: 1500 });
    setIsLoading(false);

    if (role === "Admin" || role === "Pharmacy Admin") {
      return router.replace(adminDashboardRoute);
    } else if (role === "User") {
      return router.push("/");
    } else {
      return router.push("/");
    }
  };
  return (
    <>
      <div className="flex items-center gap-3">
        <img src={`${GCP_PUBLIC_IMG}/icon_logo.png`} alt="Varmasea logo" />
        <h1 className="font-bold text-3xl text-primary_blue">Varmasea</h1>
      </div>
      <p className="mb-5 mt-1 text-secondary_text">
        Easy Solution to Find Your Medicines and Health Needs!
      </p>

      <Form gap="gap-3" onSubmit={handleLogin}>
        <FormInput
          type="email"
          titleText="Email"
          placeholder="Input your email.."
          value={dataLogin.email}
          onChange={(e) =>
            setDataLogin((prev) => ({ ...prev, email: e.target.value }))
          }
          errorText={handleErrorMessages("email")}
          isError={
            (V.isFormFieldEmpty(dataLogin.email) && isButtonClicked) ||
            (!V.isEmailValid(dataLogin.email) &&
              !V.isFormFieldEmpty(dataLogin.email))
          }
        />
        <FormInput
          type="password"
          titleText="Password"
          placeholder="Input your password.."
          value={dataLogin.password}
          onChange={(e) =>
            setDataLogin((prev) => ({ ...prev, password: e.target.value }))
          }
          errorText={handleErrorMessages("password")}
          isError={
            (V.isFormFieldEmpty(dataLogin.password) && isButtonClicked) ||
            (!V.isPasswordValid(dataLogin.password, true) &&
              !V.isFormFieldEmpty(dataLogin.password))
          }
          disableStrongPassword={true}
        />
        {errorLogin && <p className="text-[red] text-sm mt-0">{errorLogin}</p>}

        <div className="flex flex-row justify-between items-center mb-7">
          <div className="form-control">
            <label className="cursor-pointer flex flex-row gap-2">
              <input
                type="checkbox"
                className="checkbox "
                checked={isRememberingUser}
                onChange={() => {
                  if (!isRememberingUser) {
                    setIsRememberingUser(true);
                    return;
                  }
                  setIsRememberingUser(false);
                }}
              />
              <span className="label-text">Remember me?</span>
            </label>
          </div>
          <Link
            href={"/auth/reset-password"}
            className="cursor-pointer text-primary_blue font-medium"
          >
            Forgot password?
          </Link>
        </div>

        <Button type="submit" isLoading={isLoading}>
          Log In
        </Button>
      </Form>

      <div className="divider my-5 text-sm">Or</div>

      <ButtonBorderOnly
        onClick={() => {
          toast.warning(
            "This feature is still in development, please stay tune!",
            { duration: 1500 }
          );
        }}
      >
        <div className="flex items-center gap-4 mx-auto">
          <FcGoogle size="23" />
          <span className="text-lg">Log in with Google</span>
        </div>
      </ButtonBorderOnly>

      <div className="flex flex-col items-center xs:items-start xs:flex-row gap-1 justify-center mt-10">
        Don&apos;t have account?
        <Link
          href="/auth/register"
          className="text-secondary_blue font-medium hover:text-primary_blue"
        >
          Create a new account!
        </Link>
      </div>
    </>
  );
};

export default LoginPage;
LoginPage.title = "Login | Varmasea";
