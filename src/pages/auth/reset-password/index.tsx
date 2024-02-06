import React, { useState } from "react";
import { Form, FormInput } from "@/components/Form";
import * as V from "@/utils/formFieldValidation";
import { Button } from "@/components/Button";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { baseUrl } from "@/utils/baseUrl";
import { toast } from "sonner";
import { GCP_PUBLIC_IMG } from "@/utils/api/apiURL";

const PasswordResetPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [dataEmail, setDataEmail] = useState("");
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmited, setIsSubmited] = useState(false);
  const [error, setError] = useState("");

  const handleErrorMessages = (
    inputType: "email" | "fullname" | "password" | "confirmPassword"
  ) => {
    switch (inputType) {
      case "email":
        if (V.isFormFieldEmpty(dataEmail)) {
          return "Please input email";
        }
        if (!V.isEmailValid(dataEmail)) {
          return "Wrong email format (ex: example@domain.com)";
        }
        break;
    }

    return "This error is not shown";
  };

  const handleResetPassword = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    setIsLoading(true);
    setIsButtonClicked(true);

    if (V.isFormFieldEmpty(dataEmail) || !V.isEmailValid(dataEmail)) {
      setIsLoading(false);
      return;
    }

    const url = baseUrl("/auth/forgot-password");
    const options: RequestInit = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: dataEmail }),
    };
    const response = await fetch(url, options);
    const dataResponse = await response.json();

    if (dataResponse.message.includes("can't find user with email")) {
      setError(`can't find user with email ${dataEmail}`);
      setIsLoading(false);
      return;
    }

    toast.success(`Email sent to ${dataEmail}!`);
    setIsSubmited(true);
  };

  return (
    <>
      {isSubmited ? (
        <div className="flex flex-col items-center animate-fade animate-once">
          <img
            src={`${GCP_PUBLIC_IMG}/email_sent.jpg`}
            alt="sent email illustration"
          />
          <h3 className="font-semibold text-2xl mb-2 mt-4 text-primary_blue">
            Check your email address
          </h3>
          <p className="text-secondary_text text-center">
            We&apos;ve send reset password link to {dataEmail}
          </p>
        </div>
      ) : (
        <>
          <h1 className="font-bold text-3xl text-primary_blue">
            Reset Password
          </h1>

          <hr className="h-px my-2 bg-gray-200 border-0 dark:bg-gray-700" />
          <Form gap="gap-2">
            <FormInput
              type="email"
              titleText="Email"
              placeholder="Input your email.."
              value={dataEmail}
              onChange={(e) => setDataEmail(e.target.value)}
              errorText={handleErrorMessages("email")}
              isError={
                (V.isFormFieldEmpty(dataEmail) && isButtonClicked) ||
                (!V.isEmailValid(dataEmail) && !V.isFormFieldEmpty(dataEmail))
              }
            />
            {error && <p className="text-[red] text-sm mt-0">{error}</p>}

            <div
              className={`mt-1 w-1/3 ${isLoading ? "pointer-events-none" : ""}`}
            >
              <Button type="submit" onClick={(e) => handleResetPassword(e)}>
                {isLoading ? (
                  <span className="loading loading-spinner loading-md"></span>
                ) : (
                  "Send Request"
                )}
              </Button>
            </div>
          </Form>

          <p className="mt-5 text-sm text-slate-500 text-justify">
            If you don&apos;t see a code in your inbox, check your spam folder.
            If it&apos;s not there, the email address may not be confirmed, or
            it may not match an existing LinkedIn account.
          </p>
        </>
      )}
    </>
  );
};

export default PasswordResetPage;
PasswordResetPage.title = "Reset Password Account | Varmasea";
