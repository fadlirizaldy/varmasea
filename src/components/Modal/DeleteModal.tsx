import React, { useState } from "react";
import { Modal } from ".";
import { Button, ButtonBorderOnly } from "../Button";

export const DeleteModal = ({
  itemToDelete,
  isModalShown,
  setIsModalShown,
  handleDeleteItem,
}: {
  itemToDelete: string;
  isModalShown: boolean;
  setIsModalShown: React.Dispatch<React.SetStateAction<boolean>>;
  handleDeleteItem: () => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  return (
    <Modal isModalShown={isModalShown} setIsModalShown={setIsModalShown}>
      <div className="p-4 md:p-5 text-center">
        <svg
          className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 20 20"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>
        <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
          Are you sure you want to delete {itemToDelete}?
        </h3>
        <div className="flex flex-row justify-center gap-2">
          <div>
            <ButtonBorderOnly
              type="button"
              withoutHoverEffect
              onClick={() => {
                handleDeleteItem();
                setIsLoading(true);
              }}
              isLoading={isLoading}
            >
              Yes, I&apos;m sure
            </ButtonBorderOnly>
          </div>
          <div>
            <Button
              type="button"
              withoutHoverEffect
              onClick={() => setIsModalShown(false)}
            >
              No, cancel
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
