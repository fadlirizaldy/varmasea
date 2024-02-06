import React, { HTMLInputTypeAttribute, ReactNode } from "react";

interface IButton {
  children: ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  type?: "button" | "reset" | "submit";
  isLoading?: boolean;
  withoutHoverEffect?: boolean;
  flexibleHeight?: boolean;
  isDisabled?: boolean;
}

export const Button = ({
  children,
  onClick,
  type,
  isLoading,
  withoutHoverEffect,
  isDisabled,
}: IButton) => {
  return (
    <div className="card-actions w-full relative">
      <button
        className={`btn text-lg text-white w-full bg-secondary_blue ${
          !withoutHoverEffect && "hover:bg-primary_blue"
        } transition ease-linear delay-0`}
        onClick={onClick}
        type={type}
        disabled={isLoading || isDisabled}
      >
        {children}
        {isLoading && (
          <span className="loading loading-spinner loading-md absolute right-4 top-3"></span>
        )}
      </button>
    </div>
  );
};

export const ButtonInverted = ({
  children,
  onClick,
  type,
  withoutHoverEffect,
}: IButton) => {
  return (
    <div className="card-actions w-full">
      <button
        className={`btn  w-full  text-primary_orange bg-primary_blue ${
          !withoutHoverEffect &&
          "hover:text-primary_blue hover:bg-primary_orange hover:text-[1.125rem]"
        }`}
        onClick={onClick}
        type={type}
      >
        {children}
      </button>
    </div>
  );
};

export const ButtonBorderOnly = ({
  flexibleHeight,
  children,
  onClick,
  type,
  isLoading,
  isDisabled,
}: IButton) => {
  return (
    <div className={`card-actions w-full ${flexibleHeight ? "h-full" : ""}`}>
      <button
        className={`btn  w-full ${
          flexibleHeight ? "h-full" : ""
        } hover:bg-[white] text-primary_blue bg-[white] border-[grey] border-[1px] border-solid hover:border-primary_blue hover:border-2 disabled:bg-white disabled:text-black disabled:border-[grey] disabled:border-[1px] disabled:border-solid
        }`}
        onClick={onClick}
        type={type}
        disabled={isLoading || isDisabled}
      >
        {children}
      </button>
    </div>
  );
};

export const ButtonDanger = ({
  children,
  onClick,
  type,
  isLoading,
  withoutHoverEffect,
}: IButton) => {
  return (
    <div className="card-actions w-full relative">
      <button
        className={`btn text-lg text-[white] w-full bg-primary_red ${
          !withoutHoverEffect &&
          "hover:text-primary_red hover:opacity-90 hover:text-[1.125rem]"
        } transition ease-linear delay-0`}
        onClick={onClick}
        type={type}
      >
        {children}
        {isLoading && (
          <span className="loading loading-spinner loading-md absolute right-5 top-3"></span>
        )}
      </button>
    </div>
  );
};

export const ButtonGreen = ({
  children,
  onClick,
  type,
  isLoading,
  withoutHoverEffect,
}: IButton) => {
  return (
    <div className="card-actions w-full relative">
      <button
        className={`btn text-lg text-[white] w-full bg-primary_green ${
          !withoutHoverEffect &&
          "hover:text-primary_green hover:opacity-90 hover:text-[1.125rem]"
        } transition ease-linear delay-0`}
        onClick={onClick}
        type={type}
      >
        {children}
        {isLoading && (
          <span className="loading loading-spinner loading-md absolute right-5 top-3"></span>
        )}
      </button>
    </div>
  );
};
