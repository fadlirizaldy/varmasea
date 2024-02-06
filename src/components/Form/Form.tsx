import React, { ReactNode } from "react";

interface FormType {
  children: ReactNode;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  formnovalidate?: boolean;
  gap?: string;
}

const Form = ({ children, onSubmit, formnovalidate, gap }: FormType) => {
  return (
    <form onSubmit={onSubmit} noValidate={formnovalidate} className={`flex flex-col justify-start w-full ${gap}`}>
      {children}
    </form>
  );
};

export default Form;
