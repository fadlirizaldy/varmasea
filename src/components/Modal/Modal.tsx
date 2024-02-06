import { ReactNode } from "react";
import { IoMdClose } from "react-icons/io";

export const Modal = ({
  isModalShown,
  setIsModalShown,
  maxWidth,
  height,
  padding,
  children,
}: {
  isModalShown: boolean;
  setIsModalShown: React.Dispatch<React.SetStateAction<boolean>>;
  maxWidth?: string;
  height?: string;
  padding?: string;
  children: ReactNode;
}) => {
  return (
    <div
      tabIndex={-1}
      className={`fixed z-[999] ${
        isModalShown ? "flex" : "hidden"
      } overflow-y-auto overflow-x-hidden justify-center items-center w-full h-full inset-0 max-h-full bg-[rgba(0,0,0,0.4)]`}
    >
      <div
        className={`relative p-4 w-full max-h-full ${height} ${
          maxWidth ?? "max-w-md"
        }`}
      >
        <div
          className={`relative bg-[white] rounded-lg shadow h-full  ${
            padding ? padding : ""
          }`}
        >
          {children}
        </div>

        <button
          type="button"
          className="absolute top-5 end-5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
          onClick={() => setIsModalShown(false)}
        >
          <IoMdClose size={25} />
        </button>
      </div>
    </div>
  );
};
