import React from "react";

type FormInputTextAreaPropsType = {
  value?: string | number;
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  titleText?: string;
  placeholder?: string;
  maxLength: number;
  errorText?: string;
  correctText?: string;
  isError?: boolean;
  isCorrect?: boolean;
  isDisabled?: boolean;
  isRoundedFull?: boolean;
  handleError?: [string, boolean];
};

const FormInputTextArea = (props: FormInputTextAreaPropsType) => {
  const {
    value,
    onChange,
    titleText,
    maxLength,
    placeholder,
    handleError,
    errorText = handleError ? handleError[0] : undefined,
    isError = handleError ? handleError[1] : undefined,
    correctText,
    isCorrect,
    isDisabled,
    isRoundedFull,
  } = props;

  return (
    <div className="flex flex-col h-full">
      <label className="form-control w-full">
        {titleText && (
          <div className="pb-1">
            {titleText && (
              <span className="label-text text-lg">{titleText}</span>
            )}
          </div>
        )}
      </label>

      <textarea
        value={value}
        maxLength={maxLength}
        onChange={onChange}
        placeholder={placeholder}
        className={`input resize-none ${
          isError && "input-error"
        } input-bordered w-full h-full bg-[#f4f4f4] focus:border-dashed placeholder:tracking-normal p-4  ${
          isDisabled
            ? "!bg-[white] !cursor-text !border-none !text-primary_blue"
            : ""
        } ${isRoundedFull ? "rounded-full" : ""} 
        `}
        disabled={isDisabled}
      />

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
    </div>
  );
};

export default FormInputTextArea;
