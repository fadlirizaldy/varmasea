import React from "react";

const FormSelect = ({
  options,
  optionPlaceholderText,
  defaultValue,
  value,
  titleText,
  errorText,
  correctText,
  isError,
  isCorrect,
  isDisabled,
  onChange,
}: {
  options: string[];
  optionPlaceholderText?: string;
  defaultValue: string;
  value?: string[] | string | number;
  titleText?: string;
  errorText?: string;
  correctText?: string;
  isError?: boolean;
  isCorrect?: boolean;
  isDisabled?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}) => {
  return (
    <label className="form-control w-full">
      {titleText && (
        <div className="pb-1">
          <span className="label-text text-lg">{titleText}</span>
        </div>
      )}

      <select
        className="select select-bordered"
        disabled={isDisabled}
        onChange={onChange}
        defaultValue={defaultValue ? defaultValue : optionPlaceholderText}
        value={value}
      >
        {optionPlaceholderText && <option disabled>{optionPlaceholderText}</option>}
        {options?.map((optionText, idx) => {
          return (
            <option key={idx} value={optionText}>
              {optionText}
            </option>
          );
        })}
      </select>

      {(errorText || correctText) && (
        <div className={`label  ${isError || isCorrect ? "visible" : "invisible"} pb-0 pt-1`}>
          <span
            className={`label-text-alt   ${isError && "text-[red] animate-wiggle"} ${
              isCorrect && "text-[green] animate-wiggle"
            }`}
          >
            {isError && errorText}

            {isCorrect && correctText}
          </span>
        </div>
      )}
    </label>
  );
};

export default FormSelect;
