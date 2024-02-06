import { Button, ButtonBorderOnly } from "@/components/Button";
import { Modal } from "@/components/Modal";
import React from "react";
import { AiOutlineExclamationCircle } from "react-icons/ai";

type TModalConfirmDeliveryProps = {
  isModalShown: boolean;
  setIsModalShown: React.Dispatch<React.SetStateAction<boolean>>;
  isButtonLoading: boolean;
  handleConfirmDelivery: () => void;
  editForm?: JSX.Element;
};

const ModalConfirmDelivery = (props: TModalConfirmDeliveryProps) => {
  const {
    isModalShown,
    setIsModalShown,
    isButtonLoading,
    handleConfirmDelivery,
    editForm,
  } = props;

  return (
    <Modal isModalShown={isModalShown} setIsModalShown={setIsModalShown}>
      <div className="p-4 md:p-5 text-center">
        <AiOutlineExclamationCircle className="mx-auto mb-4 text-gray-300 w-12 h-12" />

        <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
          Are you sure you want to confirm the delivery of this order?
        </h3>
        <div className="flex flex-row justify-center gap-2">
          <>
            <div>
              <ButtonBorderOnly
                type="button"
                withoutHoverEffect
                onClick={() => setIsModalShown(false)}
              >
                Cancel
              </ButtonBorderOnly>
            </div>
            <div>
              <Button
                type="button"
                withoutHoverEffect
                onClick={() => handleConfirmDelivery()}
                isLoading={isButtonLoading}
              >
                Confirm
              </Button>
            </div>
          </>
        </div>
      </div>
    </Modal>
  );
};

export default ModalConfirmDelivery;
