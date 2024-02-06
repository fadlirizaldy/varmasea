import { Button, ButtonBorderOnly } from "@/components/Button";
import {
  Form,
  FormInput,
  FormSelect,
  ImageInput,
  FormInputTextArea,
} from "@/components/Form";
import useProductMaster from "@/hooks/CRUD/useProductMaster";
import useProductCategoryList from "@/hooks/CRUD/useProductCategoryList";
import { adminManageProductsRoute } from "@/routes";
import { IProductMaster, IProductPharmacy } from "@/types/api";
import { numberOnlyFormat } from "@/utils/formatting/numberOnlyFormat";
import { gcpURL } from "@/utils/gcpURL";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { MdSave } from "react-icons/md";
import { toast } from "sonner";
import { productPriceFormat } from "@/utils/productPriceFormat";
import { formData } from "@/utils/formData";
import useProductDrugForm from "@/hooks/CRUD/useProductDrugForm";
import useProductManufacturer from "@/hooks/CRUD/useProductManufacturer";
import * as V from "@/utils/formFieldValidation";

const ProductMaster = ({
  type,
  initialData,
  productId,
}: {
  type: "ADD" | "EDIT";
  initialData: Partial<IProductMaster>;
  productId?: number;
}) => {
  const router = useRouter();
  const [isButtonSaveClicked, setIsButtonSaveClicked] = useState(false);
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [productData, setProductData] = useState(initialData);
  const { productCategoriesList, getProductCategoriesList } =
    useProductCategoryList();
  const { productDrugForms, getProductDrugForms } = useProductDrugForm();
  const { productManufacturers, getProductManufacturers } =
    useProductManufacturer();
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const { productMasterUpdated, updateProductMaster } = useProductMaster();

  useEffect(() => {
    setProductData((prev) => ({
      ...prev,
      image:
        uploadedImage !== null
          ? uploadedImage
          : initialData.image
          ? initialData.image
          : "",
    }));
  }, [uploadedImage]);

  useEffect(() => {
    getProductCategoriesList();
    getProductDrugForms();
    getProductManufacturers();
  }, []);
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsButtonSaveClicked(true);
    setIsButtonLoading(true);
    if (
      !V.isAllFieldFilled2(productData) ||
      !V.isProductMasterDataValid(productData, uploadedImage)
    ) {
      let productDataSent = { ...productData };
      if (typeof productData.image === "string") {
        delete productDataSent.image;
      }
      updateProductMaster(type, formData(productDataSent), productId);
    }
    return;
  };

  useEffect(() => {
    if (productMasterUpdated !== null && productMasterUpdated.message) {
      setIsButtonLoading(false);
      return;
    }
    if (productMasterUpdated !== null && productMasterUpdated.data) {
      toast.success(
        type === "ADD"
          ? "New product has been created"
          : "Edit product data successful",
        { duration: 1500 }
      );
      router.replace(adminManageProductsRoute);
      return;
    }
  }, [productMasterUpdated]);
  return (
    <div className="">
      <h1 className="my-2 text-lg font-bold">
        {`${type === "ADD" ? "Add New" : "Edit"} Product`}
      </h1>

      <Form formnovalidate={true} onSubmit={handleFormSubmit} gap={"gap-2"}>
        <div className="grid grid-cols-2 gap-5 h-full">
          <div className="flex flex-col gap-8">
            <div className="grid grid-cols-2 gap-4">
              <FormInput
                type="text"
                placeholder="Input product name.."
                titleText="Product Name"
                value={productData.name}
                onChange={(e) =>
                  setProductData((prev) => ({ ...prev, name: e.target.value }))
                }
                handleError={V.handleError(
                  "name",
                  productData.name!,
                  isButtonSaveClicked,
                  "Product name"
                )}
              />
              <FormInput
                type="text"
                placeholder="Input generic name.."
                titleText="Generic Name"
                value={productData.generic_name}
                onChange={(e) =>
                  setProductData((prev) => ({
                    ...prev,
                    generic_name: e.target.value,
                  }))
                }
                handleError={V.handleError(
                  "name",
                  productData.generic_name!,
                  isButtonSaveClicked,
                  "Generic name"
                )}
              />
            </div>
            <FormInputTextArea
              maxLength={500}
              placeholder="Input content.."
              titleText="Content"
              value={productData.content}
              onChange={(e) =>
                setProductData((prev) => ({
                  ...prev,
                  content: e.target.value,
                }))
              }
              handleError={V.handleError(
                "name",
                productData.content!,
                isButtonSaveClicked,
                "Content"
              )}
            />
            <div className="grid grid-cols-3 gap-4">
              <FormSelect
                titleText="Category"
                defaultValue={
                  productData.category
                    ? productData.category
                    : "Select category"
                }
                // value={
                //   productData.category
                //     ? productData.category
                //     : "Select category"
                // }
                optionPlaceholderText="Select category"
                options={
                  productCategoriesList !== null
                    ? productCategoriesList.map((item) => item.name)
                    : [""]
                }
                onChange={(e) =>
                  setProductData((prev) => ({
                    ...prev,
                    category: e.target.value,
                    category_id: productCategoriesList!.find(
                      (item) => item.name === e.target.value
                    )!.id,
                  }))
                }
                errorText="Please select category"
                isError={productData.category === "" && isButtonSaveClicked}
              />
              <FormSelect
                titleText="Drug Form"
                defaultValue={
                  productData.drug_form
                    ? productData.drug_form
                    : "Select drug form"
                }
                // value={
                //   productData.drug_form
                //     ? productData.drug_form
                //     : "Select drug form"
                // }
                optionPlaceholderText="Select drug form"
                options={
                  productDrugForms !== null
                    ? productDrugForms.map((item) => item.name)
                    : [""]
                }
                onChange={(e) =>
                  setProductData((prev) => ({
                    ...prev,
                    drug_form: e.target.value,
                    drug_form_id: productDrugForms!.find(
                      (item) => item.name === e.target.value
                    )!.id,
                  }))
                }
                errorText="Please select drug form"
                isError={productData.drug_form === "" && isButtonSaveClicked}
              />
              <FormSelect
                titleText="Manufacturer"
                defaultValue={
                  productData.manufacture
                    ? productData.manufacture
                    : "Select manufacturer"
                }
                // value={
                //   productData.manufacture
                //     ? productData.manufacture
                //     : "Select manufacturer"
                // }
                optionPlaceholderText="Select manufacturer"
                options={
                  productManufacturers !== null
                    ? productManufacturers.map((item) => item.name)
                    : [""]
                }
                onChange={(e) =>
                  setProductData((prev) => ({
                    ...prev,
                    manufacture: e.target.value,
                    manufacture_id: productManufacturers!.find(
                      (item) => item.name === e.target.value
                    )!.id,
                  }))
                }
                errorText="Please select manufacturer"
                isError={productData.manufacture === "" && isButtonSaveClicked}
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              <FormInput
                type="text"
                placeholder="Input weight.."
                withSuffix={"gr"}
                titleText="Weight"
                value={productData.weight === 0 ? "" : productData.weight}
                onChange={(e) => {
                  if (
                    e.target.value.length >
                    V.maxProductWeight.toString().length + 1
                  ) {
                    return;
                  }
                  setProductData((prev) => ({
                    ...prev,
                    weight: numberOnlyFormat(e.target.value),
                  }));
                }}
                handleError={V.handleError(
                  "Weight",
                  productData.weight!,
                  isButtonSaveClicked,
                  "gr"
                )}
              />
              <FormInput
                type="text"
                placeholder="Input length.."
                withSuffix={"cm"}
                titleText="Length"
                value={productData.length === 0 ? "" : productData.length}
                onChange={(e) => {
                  if (
                    e.target.value.length >
                    V.maxProductDimensionVal.toString().length + 1
                  ) {
                    return;
                  }
                  setProductData((prev) => ({
                    ...prev,
                    length: numberOnlyFormat(e.target.value),
                  }));
                }}
                handleError={V.handleError(
                  "Length",
                  productData.length!,
                  isButtonSaveClicked,
                  "cm"
                )}
              />
              <FormInput
                type="text"
                placeholder="Input height.."
                withSuffix={"cm"}
                titleText="Height"
                value={productData.height === 0 ? "" : productData.height}
                onChange={(e) => {
                  if (
                    e.target.value.length >
                    V.maxProductDimensionVal.toString().length + 1
                  ) {
                    return;
                  }
                  setProductData((prev) => ({
                    ...prev,
                    height: numberOnlyFormat(e.target.value),
                  }));
                }}
                handleError={V.handleError(
                  "Height",
                  productData.height!,
                  isButtonSaveClicked,
                  "cm"
                )}
              />
              <FormInput
                type="text"
                placeholder="Input width.."
                withSuffix={"cm"}
                titleText="Width"
                value={productData.width === 0 ? "" : productData.width}
                onChange={(e) => {
                  if (
                    e.target.value.length >
                    V.maxProductDimensionVal.toString().length + 1
                  ) {
                    return;
                  }
                  setProductData((prev) => ({
                    ...prev,
                    width: numberOnlyFormat(e.target.value),
                  }));
                }}
                handleError={V.handleError(
                  "Width",
                  productData.width!,
                  isButtonSaveClicked,
                  "cm"
                )}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <FormInput
                type="text"
                placeholder="Input unit in pack.."
                titleText="Unit in Pack"
                value={productData.unit_in_pack}
                onChange={(e) =>
                  setProductData((prev) => ({
                    ...prev,
                    unit_in_pack: e.target.value,
                  }))
                }
                handleError={V.handleError(
                  "any",
                  productData.unit_in_pack!,
                  isButtonSaveClicked
                )}
              />
              <>
                <FormInput
                  type="text"
                  titleText="Price"
                  placeholder="Leave this field empty"
                  value={
                    type === "EDIT"
                      ? productPriceFormat(productData as IProductMaster)
                      : ""
                  }
                  isDisabled={true}
                />
                <FormInput
                  type="text"
                  titleText="Total Stock"
                  placeholder="Leave this field empty"
                  value={type === "EDIT" ? productData.total_stock : ""}
                  isDisabled={true}
                />
              </>
            </div>
          </div>
          <div className="flex flex-col gap-8">
            <ImageInput
              titleText="Product Image"
              initialImage={
                productData.image && uploadedImage === null
                  ? gcpURL(productData.image as string)
                  : undefined
              }
              setUploadedImage={setUploadedImage}
              maxHeightDisplay="h-full"
              maxImageSize={V.maxImageSize}
              handleError={V.handleError(
                "image",
                [productData.image!, uploadedImage],
                isButtonSaveClicked
              )}
            />
            <div className="h-full">
              <FormInputTextArea
                placeholder="Input description.."
                titleText="Description"
                maxLength={500}
                value={productData.description}
                onChange={(e) =>
                  setProductData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                handleError={V.handleError(
                  "name",
                  productData.description!,
                  isButtonSaveClicked,
                  "Description"
                )}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-row self-end gap-2">
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
              isDisabled={
                !V.isProductMasterDataValid(productData, uploadedImage)
              }
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

export default ProductMaster;
