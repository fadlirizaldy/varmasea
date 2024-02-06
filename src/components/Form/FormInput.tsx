import React, { HTMLInputTypeAttribute, useState } from "react";
import { FaRegQuestionCircle } from "react-icons/fa";
import { IoMdEyeOff } from "react-icons/io";
import { IoMdEye } from "react-icons/io";

type FormInputPropsType = {
  type: HTMLInputTypeAttribute;
  value?: string | number;
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  titleText?: string;
  placeholder?: string;
  errorText?: string;
  correctText?: string;
  isError?: boolean;
  isCorrect?: boolean;
  isDisabled?: boolean;
  isHidden?: boolean;
  isRoundedFull?: boolean;
  withPrefix?: string | JSX.Element;
  withSuffix?: string | JSX.Element;
  withElementAtRight?: JSX.Element;
  handleError?: [string, boolean];
  disableStrongPassword?: boolean;
};

const FormInput = (props: FormInputPropsType) => {
  const {
    type,
    value,
    onChange,
    titleText,
    placeholder,
    handleError,
    errorText = handleError ? handleError[0] : undefined,
    isError = handleError ? handleError[1] : undefined,
    correctText,
    isCorrect,
    isDisabled,
    isHidden,
    isRoundedFull,
    withPrefix,
    withSuffix,
    withElementAtRight,
    disableStrongPassword,
  } = props;
  const [toggleForTypePassword, setToggleForTypePassword] =
    useState("password");

  return (
    <label className="form-control w-full">
      {titleText && (
        <div className="pb-1 flex flex-row items-center">
          {titleText && <span className="label-text text-lg">{titleText}</span>}
          {type === "password" && !disableStrongPassword && (
            <span
              className="tooltip tooltip-top ml-2"
              data-tip="Strong password: must be minimum 8 character and includes at least a number (1-9), an uppercase (A-Z), a lowercase (a-z), and a symbol (!@#$%^&*)."
            >
              <FaRegQuestionCircle />
            </span>
          )}
        </div>
      )}
      <div className="flex flex-row gap-1 relative">
        <input
          type={type === "password" ? toggleForTypePassword : type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`input ${
            isError && "input-error"
          } input-bordered w-full bg-[#f4f4f4] focus:border-dashed ${
            type === "password" ? "tracking-widest" : "tracking-normal"
          } placeholder:tracking-normal ${isHidden ? "hidden" : ""} ${
            isDisabled
              ? "!bg-[#eae9e9] !cursor-text !border-none !text-primary_blue pointer-events-none"
              : ""
          } ${isRoundedFull ? "rounded-full" : ""} ${withPrefix ? "pl-10" : ""}
        `}
          disabled={isDisabled}
        />
        {type === "password" && (
          <div
            className="cursor-pointer rounded-full w-fit h-fit p-1 hover:bg-primary_orange absolute top-1/2 right-2.5 -translate-y-1/2"
            onMouseDown={() => setToggleForTypePassword("text")}
            onMouseUp={() => setToggleForTypePassword("password")}
          >
            {toggleForTypePassword === "password" ? (
              <IoMdEyeOff />
            ) : (
              <IoMdEye />
            )}
          </div>
        )}
        {withSuffix && (
          <div className="absolute top-1/2 right-2.5 -translate-y-1/2">
            {withSuffix}
          </div>
        )}
        {withPrefix && (
          <div className="absolute top-1/2 left-3.5 -translate-y-1/2">
            {withPrefix}
          </div>
        )}
        {withElementAtRight && <div>{withElementAtRight}</div>}
      </div>

      {(errorText || correctText) && (
        <div
          className={`label  ${
            isError || isCorrect ? "visible" : "invisible"
          } pb-0 pt-1`}
        >
          <span
            className={`label-text-alt   ${
              isError && "text-[red] animate-wiggle"
            } ${isCorrect && "text-[green] animate-wiggle"}`}
          >
            {isError && errorText}
            {isCorrect && correctText}
          </span>
        </div>
      )}
    </label>
  );
};

export default FormInput;
