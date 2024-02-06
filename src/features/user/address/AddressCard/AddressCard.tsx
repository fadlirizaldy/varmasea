import { IAddressUser } from "@/types/api";
import React, { useEffect, useState } from "react";
import ModalAddress from "../ModalAddress";
import { DeleteModal } from "@/components/Modal";
import useUserAddress from "@/hooks/CRUD/useUserAddress";
import { toast } from "sonner";

const AddressCard = ({
  address,
  rerenderPage,
}: {
  address: IAddressUser;
  rerenderPage: () => void;
}) => {
  const [isModalAddressShown, setIsModalAddressShown] = useState(false);
  const [isDeleteModalShown, setIsDeleteModalShown] = useState(false);
  const itemToDeleteText = "this address";

  const { addressUserUpdated, updateAddressUser } = useUserAddress();

  const handleDeleteItem = () => {
    updateAddressUser("DELETE", undefined, address.id);
  };

  const handleSetMainAddress = () => {
    updateAddressUser("SETDEFAULT", undefined, address.id);
  };

  useEffect(() => {
    if (
      addressUserUpdated !== null &&
      (addressUserUpdated.message === "Successfully delete address" ||
        addressUserUpdated.message === "Succesfully set default address")
    ) {
      rerenderPage();
      toast.success(
        `${
          isDeleteModalShown
            ? "Address has been deleted"
            : "Set default address succesfull"
        } `,
        {
          duration: 1500,
        }
      );
      setIsDeleteModalShown(false);
      return;
    }
    if (addressUserUpdated !== null && addressUserUpdated.message !== null) {
      alert(addressUserUpdated?.message);
    }
  }, [addressUserUpdated]);

  return (
    <>
      <div
        key={address.id}
        className="py-3 px-5 border-2 border-slate-200 rounded-lg flex flex-col sm:flex-row justify-between gap-3 sm:items-center"
      >
        <div>
          <h3 className="font-medium">
            {address.province} | {address.city}
          </h3>
          <p className="line-clamp-2 text-slate-500">{address.detail}</p>
          {address.is_default && (
            <p className="px-2 mt-1 w-fit border border-primary_blue text-primary_blue">
              Main
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex justify-center gap-3">
            <button
              className="font-medium text-secondary_blue hover:underline"
              onClick={() => setIsModalAddressShown(true)}
            >
              Edit
            </button>
            {!address.is_default && (
              <button
                className="font-medium text-secondary_blue hover:underline"
                onClick={() => setIsDeleteModalShown(true)}
              >
                Remove
              </button>
            )}
          </div>
          <button
            className="btn border border-slate-400 text-gray-600 h-10 min-h-10"
            disabled={address.is_default}
            onClick={() => handleSetMainAddress()}
          >
            Set as Main Address
          </button>
        </div>
      </div>
      {isModalAddressShown && (
        <ModalAddress
          isModalShown={isModalAddressShown}
          setIsModalShown={setIsModalAddressShown}
          type="EDIT"
          initialData={address}
          rerenderPage={rerenderPage}
        />
      )}
      {isDeleteModalShown && (
        <DeleteModal
          itemToDelete={itemToDeleteText}
          isModalShown={isDeleteModalShown}
          setIsModalShown={setIsDeleteModalShown}
          handleDeleteItem={() => handleDeleteItem()}
        />
      )}
    </>
  );
};

export default AddressCard;
