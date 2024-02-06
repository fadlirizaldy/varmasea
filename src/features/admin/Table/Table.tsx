import React, { ReactNode } from "react";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";

export const TH = ({
  onClick,
  children,
  isSortable,
  sortType,
  isSortActive,
}: {
  onClick?: () => void;
  children?: ReactNode;
  isSortable?: boolean;
  sortType?: "asc" | "desc";
  isSortActive?: boolean;
}) => {
  return (
    <th className="text-sm whitespace-nowrap uppercase px-3 py-2 border bg-base-300 ">
      <div className="flex flex-row justify-between gap-2 items-center ">
        {children}
        {isSortable && (
          <div
            className="cursor-pointer hover:bg-primary_orange rounded-full"
            onClick={onClick}
          >
            {isSortActive && sortType === "asc" ? (
              <FaCaretDown size={20} />
            ) : isSortActive && sortType === "desc" ? (
              <FaCaretUp size={20} />
            ) : !isSortActive ? (
              <FaCaretDown size={20} />
            ) : (
              <></>
            )}
          </div>
        )}
      </div>
    </th>
  );
};

export const TD = ({
  children,
  rowSpan,
  colSpan,
  isChildrenCentered,
}: {
  children?: ReactNode;
  rowSpan?: number;
  colSpan?: number;
  isChildrenCentered?: boolean;
}) => {
  return (
    <td
      className={`px-3 py-2 border ${isChildrenCentered && "text-center"}`}
      rowSpan={rowSpan}
      colSpan={colSpan}
    >
      {children}
    </td>
  );
};
export const TR = ({
  children,
  additionalStyle,
}: {
  children: ReactNode;
  additionalStyle?: string;
}) => {
  return (
    <tr
      className={`border-b  hover:bg-base-300 ${
        additionalStyle && additionalStyle
      } w-full`}
    >
      {children}
    </tr>
  );
};

export const Table = ({ children }: { children: ReactNode }) => {
  return (
    <div className="rounded-lg w-full">
      <table className="border rounded-lg w-full">{children}</table>
    </div>
  );
};
