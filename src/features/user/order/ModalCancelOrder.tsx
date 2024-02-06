import { ButtonBorderOnly, ButtonDanger } from "@/components/Button";
import { Modal } from "@/components/Modal";
import React from "react";
import { MdOutlineCancel } from "react-icons/md";

type TModalConfirmOrderProps = {
  isModalShown: boolean;
  setIsModalShown: React.Dispatch<React.SetStateAction<boolean>>;
  isButtonLoading: boolean;
  handleCancelOrder: () => void;
  editForm?: JSX.Element;
};

const ModalCancelOrder = (props: TModalConfirmOrderProps) => {
  const { isModalShown, setIsModalShown, isButtonLoading, handleCancelOrder } =
    props;

  return (
    <Modal isModalShown={isModalShown} setIsModalShown={setIsModalShown}>
      <div className="p-4 md:p-5 text-center">
        <MdOutlineCancel className="mx-auto mb-4 text-primary_red w-12 h-12" />

        <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
          Are you sure you want to cancel this order?
        </h3>
        <div className="flex flex-row justify-center gap-2">
          <>
            <div>
              <ButtonBorderOnly
                type="button"
                withoutHoverEffect
                isLoading={isButtonLoading}
                onClick={() => setIsModalShown(false)}
              >
                Back
              </ButtonBorderOnly>
            </div>
            <div>
              <ButtonDanger
                type="button"
                withoutHoverEffect
                onClick={() => handleCancelOrder()}
              >
                Confirm
              </ButtonDanger>
            </div>
          </>
        </div>
      </div>
    </Modal>
  );
};

export default ModalCancelOrder;
