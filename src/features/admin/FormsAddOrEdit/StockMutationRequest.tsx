import { Button, ButtonBorderOnly } from "@/components/Button";
import { Form, FormInput, FormSelect } from "@/components/Form";
import { adminManageStockMutationsRoute } from "@/routes";
import { IPharmacy, IStockMutationRequest } from "@/types/api";
import { numberOnlyFormat } from "@/utils/formatting/numberOnlyFormat";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { MdSave } from "react-icons/md";
import usePharmacy from "@/hooks/CRUD/usePharmacy";
import usePharmacyOfAdmin from "@/hooks/CRUD/usePharmacyOfAdmin";
import useProductOfPharmacy from "@/hooks/CRUD/useProductOfPharmacy";
import useStockMutation from "@/hooks/CRUD/useStockMutation";
import { toast } from "sonner";
import * as V from "@/utils/formFieldValidation";
import useAuth from "@/hooks/useAuth";

const StockMutationRequest = ({
  initialData,
  isInModalEdit,
  stockMutationIdToBeEdited,
  setIsModalShown,
}: {
  initialData: IStockMutationRequest;
  isInModalEdit?: boolean;
  stockMutationIdToBeEdited?: string;
  setIsModalShown?: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const router = useRouter();
  const { role } = useAuth();
  const [dataStockMutation, setDataStockMutation] =
    useState<IStockMutationRequest>(initialData);
  const { pharmacies, getPharmacies } = usePharmacy();
  const { pharmaciesOfAdmin, getPharmaciesOfAdmin } = usePharmacyOfAdmin();
  const {
    productsOfPharmacy: productsOfPharmacyFrom,
    getProductsOfPharmacy: getProductsOfPharmacyFrom,
  } = useProductOfPharmacy(dataStockMutation.from_pharmacy_id);
  const {
    productsOfPharmacy: productsOfPharmacyTo,
    getProductsOfPharmacy: getProductsOfPharmacyTo,
  } = useProductOfPharmacy(dataStockMutation.to_pharmacy_id);
  const { stockMutationUpdated, requestStockMutation, editStockMutation } =
    useStockMutation();
  const [isButtonSaveClicked, setIsButtonSaveClicked] = useState(false);
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [errorResponse, setErrorResponse] = useState("");
  useEffect(() => {
    if (role === "Pharmacy Admin" && !isInModalEdit) {
      getPharmacies(undefined, { limit: 999 });
      getPharmaciesOfAdmin(undefined, { limit: 999 });
    }
  }, [role]);

  useEffect(() => {
    if (dataStockMutation.from_pharmacy_id !== -1) {
      getProductsOfPharmacyFrom(undefined, { limit: 999 });
    }
    if (dataStockMutation.to_pharmacy_id !== -1) {
      getProductsOfPharmacyTo(undefined, { limit: 999 });
    }
  }, [dataStockMutation.from_pharmacy_id, dataStockMutation.to_pharmacy_id]);

  const filteredProductsAvailable = () => {
    const productsFiltered =
      productsOfPharmacyFrom !== null && productsOfPharmacyTo !== null
        ? productsOfPharmacyFrom.filter((product) => {
            return productsOfPharmacyTo.some((f) => {
              return f.id === product.id;
            });
          })
        : null;
    return productsFiltered !== null
      ? productsFiltered.map((item) => item.name)
      : [""];
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsButtonSaveClicked(true);
    setIsButtonLoading(true);
    setErrorResponse("");
    if (
      !V.isAllFieldFilled2(dataStockMutation) ||
      !V.isStockMutationRequestDataValid(dataStockMutation)
    ) {
      setIsButtonLoading(false);
      return;
    }
    if (isInModalEdit && stockMutationIdToBeEdited !== undefined) {
      const dataSent: IStockMutationRequest = {
        ...dataStockMutation,
        action: "edit",
      };
      editStockMutation(dataSent, Number(stockMutationIdToBeEdited));
      return;
    }
    requestStockMutation(dataStockMutation);
    return;
  };

  useEffect(() => {
    if (stockMutationUpdated !== null && stockMutationUpdated.message) {
      setIsButtonSaveClicked(false);
      setIsButtonLoading(false);
      setErrorResponse(stockMutationUpdated.message);
      return;
    }
    if (stockMutationUpdated !== null && stockMutationUpdated.data) {
      toast.success("New stock mutation request has been sent", {
        duration: 1500,
      });
      router.replace(adminManageStockMutationsRoute);
      return;
    }
  }, [stockMutationUpdated]);

  useEffect(() => {
    setErrorResponse("");
  }, [dataStockMutation.quantity]);

  return (
    <>
      <div className="w-full">
        {!isInModalEdit ? (
          <h1 className="mb-5 text-3xl font-bold">Request Stock Mutation</h1>
        ) : (
          <h1 className="mb-5 text-xl font-bold">Edit Request</h1>
        )}

        <Form formnovalidate={true} onSubmit={handleFormSubmit}>
          <>
            {!isInModalEdit && (
              <div className="flex gap-5 items-center mb-3">
                <FormSelect
                  titleText="Request From Pharmacy"
                  defaultValue={""}
                  optionPlaceholderText="Select pharmacy"
                  options={
                    pharmacies !== null
                      ? pharmacies.map((item) => item.name)
                      : [""]
                  }
                  onChange={(e) => {
                    const id = (pharmacies as IPharmacy[])!.find(
                      (pharma) => pharma.name === e.target.value
                    )!.id;
                    setDataStockMutation((prev) => ({
                      ...prev,
                      from_pharmacy_id: id,
                    }));
                  }}
                  errorText={
                    dataStockMutation.from_pharmacy_id ===
                    dataStockMutation.to_pharmacy_id
                      ? "Cannot request from and to the same pharmacy"
                      : "Please select pharmacy"
                  }
                  isError={
                    (dataStockMutation.from_pharmacy_id === -1 &&
                      isButtonSaveClicked) ||
                    (dataStockMutation.from_pharmacy_id ===
                      dataStockMutation.to_pharmacy_id &&
                      dataStockMutation.from_pharmacy_id !== -1)
                  }
                />
                <FormSelect
                  titleText="To Pharmacy"
                  defaultValue={""}
                  optionPlaceholderText="Select pharmacy"
                  options={
                    pharmaciesOfAdmin !== null
                      ? pharmaciesOfAdmin.map((pharma) => pharma.name)
                      : [""]
                  }
                  onChange={(e) => {
                    if (pharmaciesOfAdmin !== null) {
                      const id = pharmaciesOfAdmin.find(
                        (pharma) => pharma.name === e.target.value
                      )!.id;
                      setDataStockMutation((prev) => ({
                        ...prev,
                        to_pharmacy_id: id,
                      }));
                    }
                  }}
                  errorText={
                    dataStockMutation.from_pharmacy_id ===
                    dataStockMutation.to_pharmacy_id
                      ? "Can not request from and to the same pharmacy"
                      : "Please select pharmacy"
                  }
                  isError={
                    (dataStockMutation.to_pharmacy_id === -1 &&
                      isButtonSaveClicked) ||
                    (dataStockMutation.from_pharmacy_id ===
                      dataStockMutation.to_pharmacy_id &&
                      dataStockMutation.from_pharmacy_id !== -1)
                  }
                />
              </div>
            )}
            <FormSelect
              titleText="Request Product"
              defaultValue={""}
              value={
                initialData.drug_id !== -1 && productsOfPharmacyFrom !== null
                  ? productsOfPharmacyFrom.find(
                      (prod) => prod.id === initialData.drug_id
                    )!.name
                  : "Select product"
              }
              optionPlaceholderText="Select product"
              options={filteredProductsAvailable()}
              onChange={(e) => {
                if (productsOfPharmacyFrom !== null) {
                  const id = productsOfPharmacyFrom.find(
                    (prod) => prod.name === e.target.value
                  )!.id;
                  setDataStockMutation((prev) => ({ ...prev, drug_id: id }));
                }
              }}
              errorText={"Please select product"}
              isError={dataStockMutation.drug_id === -1 && isButtonSaveClicked}
              isDisabled={
                dataStockMutation.from_pharmacy_id === -1 ||
                dataStockMutation.to_pharmacy_id === -1
              }
            />

            <div className="mt-3">
              <FormInput
                type="text"
                placeholder="Input product quantity to be requested.."
                titleText="Quantity"
                value={
                  dataStockMutation.quantity !== 0
                    ? dataStockMutation.quantity
                    : ""
                }
                onChange={(e) => {
                  setDataStockMutation((prev) => ({
                    ...prev,
                    quantity: numberOnlyFormat(e.target.value),
                  }));
                }}
                handleError={V.handleError(
                  "quantity",
                  [dataStockMutation.quantity, errorResponse],
                  isButtonSaveClicked
                )}
              />
            </div>
          </>

          <div className="flex flex-row self-end gap-2 mt-9">
            <div>
              <ButtonBorderOnly
                type={"button"}
                onClick={() => {
                  if (isButtonLoading) {
                    return;
                  }
                  if (!isInModalEdit) {
                    router.replace(adminManageStockMutationsRoute);
                    return;
                  }
                  setIsModalShown!(false);
                }}
              >
                Cancel
              </ButtonBorderOnly>
            </div>
            <div>
              <Button
                withoutHoverEffect={true}
                type={"submit"}
                isLoading={isButtonLoading}
                isDisabled={
                  !V.isStockMutationRequestDataValid(dataStockMutation) ||
                  errorResponse !== ""
                }
              >
                {isInModalEdit ? "Edit" : "Request Stock"}
                <div className={`${isButtonLoading ? "invisible" : "block"}`}>
                  <MdSave size={20} />
                </div>
              </Button>
            </div>
          </div>
        </Form>
      </div>
    </>
  );
};

export default StockMutationRequest;
