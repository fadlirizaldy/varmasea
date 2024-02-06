import { Button, ButtonBorderOnly } from "@/components/Button";
import { Form, FormInput, FormSelect, ImageInput } from "@/components/Form";
import { adminManageProductCategoriesRoute } from "@/routes";
import { IProductCategory } from "@/types/api";
import { useRouter } from "next/router";
import * as V from "@/utils/formFieldValidation";
import React, { useEffect, useState } from "react";
import { MdSave } from "react-icons/md";
import { gcpURL } from "@/utils/gcpURL";
import useProductCategory from "@/hooks/CRUD/useProductCategory";
import { formData } from "@/utils/formData";
import { toast } from "sonner";

const ProductCategory = ({
  type,
  initialData,
  productCategoryId,
}: {
  type: "ADD" | "EDIT";
  initialData: Partial<IProductCategory>;
  productCategoryId?: number;
}) => {
  const router = useRouter();
  const [isButtonSaveClicked, setIsButtonSaveClicked] = useState(false);
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [dataUpdateCategory, setDataUpdateCategory] = useState(initialData);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const { productCategoryUpdated, updateProductCategory } =
    useProductCategory();
  const [isProductNameDuplicate, setIsProductNameDuplicate] = useState(false);

  useEffect(() => {
    setDataUpdateCategory((prev) => ({
      ...prev,
      icon:
        uploadedImage !== null
          ? uploadedImage
          : initialData.icon
          ? initialData.icon
          : "",
    }));
  }, [uploadedImage]);

  const handleErrorMessages = (inputType: "category" | "image") => {
    switch (inputType) {
      case "category":
        if (V.isFormFieldEmpty(dataUpdateCategory.name!)) {
          return "Please enter name of category";
        }
        if (isProductNameDuplicate) {
          return "The same product category is already exists";
        }
        break;
      case "image":
        if (
          V.isFileFieldEmpty(uploadedImage!) &&
          dataUpdateCategory.icon === ""
        ) {
          return "Please input an image";
        }
    }

    return "This error is not shown";
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsButtonSaveClicked(true);
    setIsButtonLoading(true);
    if (
      V.isFormFieldEmpty(dataUpdateCategory.name!) ||
      (V.isFileFieldEmpty(uploadedImage!) && dataUpdateCategory.icon === "")
    ) {
      setIsButtonLoading(false);
      return;
    }

    let dataCategorySent = { ...dataUpdateCategory };
    if (typeof dataUpdateCategory.icon === "string") {
      delete dataCategorySent.icon;
    }
    updateProductCategory(type, formData(dataCategorySent), productCategoryId);

    return;
  };

  useEffect(() => {
    if (productCategoryUpdated !== null && productCategoryUpdated.data) {
      toast.success(
        type === "ADD"
          ? "New product category has been created"
          : "Edit product category data successful",
        { duration: 1500 }
      );
      router.back();
      return;
    }
    if (productCategoryUpdated !== null && productCategoryUpdated.message) {
      if (productCategoryUpdated.message.toLowerCase().includes("duplicate")) {
        setIsProductNameDuplicate(true);
      } else {
        alert(productCategoryUpdated.message);
      }
      setIsButtonLoading(false);
      return;
    }
  }, [productCategoryUpdated]);

  return (
    <div className="max-w-3xl w-[90%]">
      <h1 className="mb-5 text-3xl font-bold">
        {`${type === "ADD" ? "Add New" : "Edit"} Product Category`}
      </h1>

      <Form formnovalidate={true} onSubmit={handleFormSubmit} gap="gap-4">
        <FormInput
          type="text"
          placeholder="Input category's name.."
          titleText="Category"
          value={dataUpdateCategory.name}
          onChange={(e) =>
            setDataUpdateCategory((prev) => ({
              ...prev,
              name: e.target.value,
            }))
          }
          errorText={handleErrorMessages("category")}
          isError={
            (V.isFormFieldEmpty(dataUpdateCategory.name!) &&
              isButtonSaveClicked) ||
            isProductNameDuplicate
          }
        />

        <ImageInput
          titleText="Category Image"
          initialImage={
            dataUpdateCategory.icon &&
            (dataUpdateCategory.icon as string).length > 1
              ? gcpURL(dataUpdateCategory.icon as string)
              : ""
          }
          setUploadedImage={setUploadedImage}
          maxHeightDisplay="h-full"
          errorText={handleErrorMessages("image")}
          isError={
            V.isFileFieldEmpty(uploadedImage!) &&
            dataUpdateCategory.icon === "" &&
            isButtonSaveClicked
          }
        />

        <div className="flex flex-row self-end gap-2 mt-6">
          <div>
            <ButtonBorderOnly
              onClick={() => {
                if (isButtonLoading) {
                  return;
                }
                router.replace(adminManageProductCategoriesRoute);
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
            >
              Save Category
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

export default ProductCategory;
