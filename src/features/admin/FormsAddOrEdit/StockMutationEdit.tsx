import { ButtonBorderOnly } from "@/components/Button";
import { adminManageStockMutationsRoute } from "@/routes";
import {
  IProductPharmacy,
  IStockMutationResponse,
  TStockMutationRequestAction,
} from "@/types/api";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { FaArrowRight } from "react-icons/fa6";
import { currencyFormat } from "@/utils/formatting/currencyFormat";
import { TD, TH, TR, Table } from "../Table";
import StatusBadge from "@/components/StatusBadge";
import Image from "next/image";
import { gcpURL } from "@/utils/gcpURL";
import { Button, ButtonDanger, ButtonGreen } from "@/components/Button/Button";
import ModalStatus from "../ModalStatus";
import useStockMutation from "@/hooks/CRUD/useStockMutation";
import { toast } from "sonner";
import StockMutationRequest from "./StockMutationRequest";

const tableHeads = {
  Name: "name",
  "Generic Name": "generic_name",
  Category: "category",
  Manufacturer: "manufacture",
  "Drug Form": "drug_form",
  "Unit in Pack": "unit_in_pack",
  Weight: "weight",
  Price: "selling_unit",
  Quantity: "quantity",
};

const StockMutationEdit = ({
  initialData,
  pharmacyType,
}: {
  initialData: IStockMutationResponse;
  pharmacyType: "from" | "to";
}) => {
  const router = useRouter();
  const [dataStockMutation, setDataStockMutation] =
    useState<IStockMutationResponse>(initialData);
  const { stockMutationUpdated, editStockMutation, isLoading } =
    useStockMutation();
  const [isModalShown, setIsModalShown] = useState(false);
  const [actionType, setActionType] =
    useState<TStockMutationRequestAction>("reject");

  const dataSent = () => {
    return {
      drug_id: dataStockMutation.drug.id,
      from_pharmacy_id: dataStockMutation.from_pharmacy.id,
      to_pharmacy_id: dataStockMutation.to_pharmacy.id,
      quantity: dataStockMutation.quantity,
      action: actionType,
    };
  };

  useEffect(() => {
    setIsModalShown(false);
    if (stockMutationUpdated !== null && stockMutationUpdated.message) {
      alert(stockMutationUpdated.message);
      return;
    }
    if (stockMutationUpdated !== null && stockMutationUpdated.data) {
      {
        actionType !== "edit" &&
          setDataStockMutation((prev) => ({
            ...prev,
            status_mutation: `${actionType}ed`,
          }));
      }
      toast.success(`Stock mutation request has been ${actionType}ed`, {
        duration: 1500,
      });
    }
  }, [stockMutationUpdated]);

  return (
    <>
      <div className="w-full">
        <h1 className="mb-5 text-xl font-bold">
          {pharmacyType === "from" ? "Outgoing" : "Incoming"} Stock Mutation
          Request
        </h1>

        <>
          <div className="flex justify-between gap-4 mt-10 mb-4">
            <div className="flex gap-5 items-center w-full">
              <div className="w-full flex flex-col items-center">
                <h3 className="text-xl font-medium">Request From Pharmacy</h3>
                <p className="text-lg">
                  {dataStockMutation.from_pharmacy.name}
                </p>
              </div>
              <FaArrowRight size="50px" />
              <div className="w-full flex flex-col items-center">
                <h3 className="text-xl font-medium">To Pharmacy</h3>
                <p className="text-lg">{dataStockMutation.to_pharmacy.name}</p>
              </div>
            </div>
            <div className="divider divider-horizontal"></div>
            <div className="flex flex-col items-center w-1/4 gap-2">
              <h3 className="text-xl font-medium">Status</h3>
              <StatusBadge
                status={dataStockMutation.status_mutation}
                scale="scale-125"
              />
            </div>
          </div>

          <div>
            <h3 className="text-xl font-medium mt-10 mb-4">
              Product Requested
            </h3>
            <Table>
              <thead>
                <TR>
                  <TH>No</TH>
                  {Object.keys(tableHeads).map((title, idx) => {
                    return <TH key={idx}>{title}</TH>;
                  })}
                </TR>
              </thead>
              <tbody>
                <TR>
                  <TD>1</TD>
                  {Object.keys(tableHeads).map((title, idx) => {
                    const value =
                      dataStockMutation.drug[
                        tableHeads[
                          title as keyof typeof tableHeads
                        ] as keyof IProductPharmacy
                      ]?.toString();
                    return title === "Name" ? (
                      <TD key={idx}>
                        <div className="flex gap-4 items-center">
                          <Image
                            src={gcpURL(dataStockMutation.drug.image as string)}
                            alt={`Image of ${dataStockMutation.drug.name}`}
                            width={176}
                            height={176}
                            className="w-44 object-cover rounded-md"
                          />
                          {value}
                        </div>
                      </TD>
                    ) : title === "Weight" ? (
                      <TD>{dataStockMutation.drug.weight} gr</TD>
                    ) : title === "Quantity" ? (
                      <TD>x {dataStockMutation.quantity}</TD>
                    ) : title === "Price" ? (
                      <TD>
                        {currencyFormat(
                          Number(dataStockMutation.drug.selling_unit)
                        )}
                      </TD>
                    ) : (
                      <TD key={idx}>{value}</TD>
                    );
                  })}
                </TR>
              </tbody>
            </Table>
          </div>
        </>

        <div className="flex flex-row self-end gap-2 mt-8 justify-between">
          <div>
            <ButtonBorderOnly
              onClick={() => {
                if (isLoading) {
                  return;
                }
                router.replace(adminManageStockMutationsRoute);
              }}
            >
              Back
            </ButtonBorderOnly>
          </div>
          {dataStockMutation.status_mutation.toLowerCase() === "pending" &&
            pharmacyType === "to" && (
              <div className="flex gap-2 w-52">
                <ButtonDanger
                  onClick={() => {
                    setIsModalShown(true);
                    setActionType("reject");
                  }}
                >
                  Reject
                </ButtonDanger>
                <ButtonGreen
                  onClick={() => {
                    setIsModalShown(true);
                    setActionType("accept");
                  }}
                >
                  Accept
                </ButtonGreen>
              </div>
            )}
          {dataStockMutation.status_mutation.toLowerCase() === "pending" &&
            pharmacyType === "from" && (
              <div className="flex gap-2 w-52">
                <ButtonDanger
                  onClick={() => {
                    setIsModalShown(true);
                    setActionType("cancel");
                  }}
                >
                  Cancel
                </ButtonDanger>
                <Button
                  onClick={() => {
                    setIsModalShown(true);
                    setActionType("edit");
                  }}
                >
                  Edit
                </Button>
              </div>
            )}
        </div>
      </div>

      {isModalShown && (
        <ModalStatus
          modalType={actionType}
          textToShow={(() => {
            return `${actionType} this mutation request`;
          })()}
          isButtonLoading={isLoading}
          isModalShown={isModalShown}
          setIsModalShown={setIsModalShown}
          handleEditStatus={() => {
            editStockMutation(dataSent(), dataStockMutation.id!);
          }}
          editForm={
            <StockMutationRequest
              initialData={dataSent()}
              isInModalEdit={true}
              setIsModalShown={setIsModalShown}
              stockMutationIdToBeEdited={dataStockMutation.id.toString()}
            />
          }
        />
      )}
    </>
  );
};

export default StockMutationEdit;
