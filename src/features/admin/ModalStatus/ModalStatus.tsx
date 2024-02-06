import { Button, ButtonBorderOnly } from "@/components/Button";
import { ButtonDanger } from "@/components/Button/Button";
import { Modal } from "@/components/Modal";
import React from "react";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { GiCancel } from "react-icons/gi";

type ModalStatusPropsType = {
  modalType: "accept" | "reject" | "cancel" | "edit";
  textToShow: string;
  isModalShown: boolean;
  setIsModalShown: React.Dispatch<React.SetStateAction<boolean>>;
  isButtonLoading: boolean;
  handleEditStatus: () => void;
  editForm?: JSX.Element;
};

const ModalOrder = (props: ModalStatusPropsType) => {
  const {
    modalType,
    textToShow,
    isModalShown,
    setIsModalShown,
    isButtonLoading,
    handleEditStatus,
    editForm,
  } = props;

  return (
    <Modal isModalShown={isModalShown} setIsModalShown={setIsModalShown}>
      {modalType !== "edit" && (
        <div className="p-4 md:p-5 text-center">
          {modalType === "accept" ? (
            <AiOutlineExclamationCircle className="mx-auto mb-4 text-gray-300 w-12 h-12" />
          ) : (
            <GiCancel className="mx-auto mb-4 text-primary_red w-12 h-12" />
          )}
          <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
            Are you sure you want to {textToShow}?
          </h3>

          <div className="flex flex-row justify-center gap-2">
            {modalType === "accept" ? (
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
                    onClick={() => handleEditStatus()}
                    isLoading={isButtonLoading}
                  >
                    Confirm
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div>
                  <ButtonDanger
                    type="button"
                    withoutHoverEffect
                    onClick={() => handleEditStatus()}
                    isLoading={isButtonLoading}
                  >
                    {modalType === "reject" ? "Reject" : "Confirm"}
                  </ButtonDanger>
                </div>
                <div>
                  <Button
                    type="button"
                    withoutHoverEffect
                    onClick={() => setIsModalShown(false)}
                  >
                    {modalType === "reject" ? "Cancel" : "Back"}
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      {modalType === "edit" && editForm !== undefined && (
        <div className="p-8">{editForm}</div>
      )}
    </Modal>
  );
};

export default ModalOrder;
