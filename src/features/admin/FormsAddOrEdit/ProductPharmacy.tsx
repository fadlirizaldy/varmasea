import { Button, ButtonBorderOnly } from "@/components/Button";
import { Form, FormInput, FormSelect } from "@/components/Form";
import useProductMaster from "@/hooks/CRUD/useProductMaster";
import { adminManageProductsRoute } from "@/routes";
import { IProductMaster, IProductPharmacy } from "@/types/api";
import { numberOnlyFormat } from "@/utils/formatting/numberOnlyFormat";
import { gcpURL } from "@/utils/gcpURL";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { MdSave } from "react-icons/md";
import * as V from "@/utils/formFieldValidation";
import { toast } from "sonner";
import usePharmacyOfAdmin from "@/hooks/CRUD/usePharmacyOfAdmin";
import ProductBasicDetailTable from "../Table/ProductBasicDetailTable";
import Image from "next/image";
import useProductOfPharmacy from "@/hooks/CRUD/useProductOfPharmacy";
import useAuth from "@/hooks/useAuth";

const ProductPharmacy = ({
  type,
  initialData,
  pharmacyId,
  productId,
}: {
  type: "ADD" | "EDIT";
  initialData: Partial<IProductPharmacy>;
  pharmacyId?: number;
  productId?: number;
}) => {
  const router = useRouter();
  const { role } = useAuth();
  const [isButtonSaveClicked, setIsButtonSaveClicked] = useState(false);
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [productData, setProductData] = useState(initialData);
  const [selectedProductMasterId, setSelectedProductMasterId] = useState(
    productId ? productId : -1
  );
  const [selectedPharmacyId, setSelectedPharmacyId] = useState(
    pharmacyId ? pharmacyId : -1
  );
  const { pharmaciesOfAdmin, getPharmaciesOfAdmin } = usePharmacyOfAdmin();
  const { productMaster, productsMaster, getProductMaster, getProductsMaster } =
    useProductMaster();
  const { productOfPharmacyUpdated, updateProductOfPharmacy } =
    useProductOfPharmacy(selectedPharmacyId);

  useEffect(() => {
    if (role === "Pharmacy Admin") {
      getPharmaciesOfAdmin();
      getProductsMaster();
    }
  }, [role]);

  useEffect(() => {
    if (selectedProductMasterId !== -1) {
      getProductMaster(selectedProductMasterId);
    }
  }, [selectedProductMasterId]);

  useEffect(() => {
    if (productMaster) {
      setProductData((prev) => ({ ...prev, ...productMaster }));
    }
  }, [productMaster]);

  const handleErrorMessages = (
    inputType: keyof IProductMaster | keyof IProductPharmacy
  ) => {
    switch (inputType) {
      case "name":
        break;
    }

    return "This error is not shown";
  };
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsButtonSaveClicked(true);
    setIsButtonLoading(true);
    if (
      !V.isAllFieldFilled2(productData, V.minStockInput) ||
      !V.isProductPharmacyDataValid(productData)
    ) {
      setIsButtonLoading(false);
      return;
    }

    let productDataSent = {
      drug_id: selectedProductMasterId,
      pharmacy_id: selectedPharmacyId,
      status: productData.status,
      stock: productData.stock,
      selling_unit: productData.selling_unit,
    };
    updateProductOfPharmacy(type, productDataSent, productId);

    return;
  };

  useEffect(() => {
    if (productOfPharmacyUpdated !== null && productOfPharmacyUpdated.message) {
      setIsButtonLoading(false);
      return;
    }
    if (productOfPharmacyUpdated !== null && productOfPharmacyUpdated.data) {
      toast.success(
        type === "ADD"
          ? "New product has been created"
          : "Edit product data successful",
        { duration: 1500 }
      );
      router.replace(adminManageProductsRoute);
      return;
    }
  }, [productOfPharmacyUpdated]);
  return (
    <div className="">
      <h1 className="my-2 text-lg font-bold">
        {`${type === "ADD" ? "Add New" : "Edit"} Product`}
      </h1>

      <Form formnovalidate={true} onSubmit={handleFormSubmit} gap={"gap-2"}>
        <div className="grid grid-cols-[0.75fr_0.35fr] gap-10 h-full">
          <div className="flex flex-col gap-8">
            <div className="w-64">
              <FormSelect
                titleText="Product To Be Added"
                defaultValue={productData.name ? productData.name : ""}
                value={type === "EDIT" ? productData.name : undefined}
                optionPlaceholderText="Select product"
                options={
                  productsMaster !== null
                    ? productsMaster.map((item) => item.name)
                    : [""]
                }
                onChange={(e) => {
                  if (productsMaster) {
                    const selectedProduct = productsMaster.find(
                      (product) => product.name === e.target.value
                    );
                    setSelectedProductMasterId(selectedProduct!.id);
                  }
                }}
                errorText="Please select product"
                isError={productData.name === "" && isButtonSaveClicked}
                isDisabled={type === "EDIT"}
              />
            </div>
            {selectedProductMasterId !== -1 && (
              <div className="flex flex-row gap-14">
                <div className="">
                  <Image
                    src={
                      productMaster
                        ? gcpURL(productMaster.image as string)
                        : gcpURL(productData.image as string)
                    }
                    alt={`Image of ${productMaster?.name}`}
                    width={200}
                    height={200}
                    style={{ height: "auto", width: "325px" }}
                  />
                </div>
                <div className="w-full">
                  <h2>Product Detail</h2>
                  <ProductBasicDetailTable
                    product={productMaster ? productMaster : productData}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-8 border-l-2 border-solid border-gray-300 pl-10">
            <FormSelect
              titleText="Pharmacy"
              defaultValue={
                productData.pharmacy?.name ? productData.pharmacy?.name : ""
              }
              value={type === "EDIT" ? productData.pharmacy?.name : undefined}
              optionPlaceholderText="Select pharmacy"
              options={
                pharmaciesOfAdmin !== null
                  ? pharmaciesOfAdmin.map((item) => item.name)
                  : [""]
              }
              onChange={(e) => {
                if (pharmaciesOfAdmin !== null) {
                  const id = pharmaciesOfAdmin?.find(
                    (pharmacy) => pharmacy.name === e.target.value
                  )?.id;
                  setProductData((prev) => ({
                    ...prev,
                    pharmacy: {
                      id: id,
                      name: e.target.value,
                    },
                  }));
                  setSelectedPharmacyId(id!);
                }
              }}
              errorText="Please select pharmacy"
              isError={
                productData.pharmacy === undefined && isButtonSaveClicked
              }
              isDisabled={type === "EDIT"}
            />

            <FormSelect
              titleText="Display Status"
              defaultValue={productData.status ? productData.status : ""}
              optionPlaceholderText="Select status"
              options={["active", "inactive"]}
              onChange={(e) =>
                setProductData((prev) => ({
                  ...prev,
                  status: e.target.value,
                }))
              }
              errorText="Please select status"
              isError={productData.status === "" && isButtonSaveClicked}
            />
            <FormInput
              type="text"
              placeholder="Input stock number.."
              titleText="Stock"
              value={productData.stock?.toLocaleString("id-ID")}
              onChange={(e) =>
                setProductData((prev) => ({
                  ...prev,
                  stock: numberOnlyFormat(e.target.value),
                }))
              }
              handleError={V.handleError(
                "stock",
                productData.stock,
                isButtonSaveClicked
              )}
            />
            <FormInput
              type="text"
              placeholder="Input price.."
              titleText="Price"
              withPrefix={"Rp"}
              value={
                productData.selling_unit === 0
                  ? ""
                  : Number(productData.selling_unit).toLocaleString("id-ID")
              }
              onChange={(e) =>
                setProductData((prev) => ({
                  ...prev,
                  selling_unit: numberOnlyFormat(e.target.value),
                }))
              }
              handleError={V.handleError(
                "price",
                productData.selling_unit,
                isButtonSaveClicked
              )}
            />
          </div>
        </div>

        <div className="flex flex-row self-end gap-2 ">
          <div>
            <ButtonBorderOnly
              type="button"
              onClick={() => {
                if (isButtonLoading) {
                  return;
                }
                router.replace(adminManageProductsRoute);
              }}
            >
              Cancel
            </ButtonBorderOnly>
          </div>
          <div className="flex flex-row">
            <Button
              withoutHoverEffect={true}
              type={"submit"}
              isLoading={isButtonLoading}
              isDisabled={!V.isProductPharmacyDataValid(productData)}
            >
              Save Product
              <div className={`${isButtonLoading ? "invisible" : "block"}`}>
                <MdSave size={20} />
              </div>
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default ProductPharmacy;
