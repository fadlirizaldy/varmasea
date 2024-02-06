import React from "react";
import { TD } from ".";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";

type TItemTools = {
  rowSpan?: number;
  colSpan?: number;
  viewItemProps?: {
    handleViewItem: () => void;
  };
  editItemProps?: {
    handleEditItem: () => void;
  };
  deleteItemProps?: {
    handleDeleteItem: () => void;
  };
};

export const ItemTools = ({
  rowSpan,
  colSpan,
  viewItemProps,
  editItemProps,
  deleteItemProps,
}: TItemTools) => {
  return (
    <TD colSpan={colSpan} rowSpan={rowSpan}>
      <div className="flex flex-row gap-4 justify-center">
        {viewItemProps !== undefined && (
          <div
            className="cursor-pointer"
            onClick={() => viewItemProps.handleViewItem()}
          >
            <PiDotsThreeOutlineVerticalFill size={20} />
          </div>
        )}
        {editItemProps !== undefined && (
          <div
            className="cursor-pointer"
            onClick={() => editItemProps.handleEditItem()}
          >
            <FaEdit size={20} />
          </div>
        )}
        {deleteItemProps !== undefined && (
          <div
            className="cursor-pointer"
            onClick={() => deleteItemProps.handleDeleteItem()}
          >
            <RiDeleteBin6Line size={20} />
          </div>
        )}
      </div>
    </TD>
  );
};
