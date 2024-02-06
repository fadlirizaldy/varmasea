import { IProductDrugForm } from "@/types/api";
import { PRODUCT_DRUG_FORMS_ENDPOINT } from "@/utils/api/apiURL";
import useCRUD from "./useCRUD";

function useProductDrugForm() {
  const { datas, isLoading, error, getDatas } = useCRUD<IProductDrugForm>(
    PRODUCT_DRUG_FORMS_ENDPOINT
  );

  return {
    productDrugForms:
      datas !== null && datas.drug_forms !== null
        ? datas.drug_forms.length > 0
          ? datas.drug_forms
          : null
        : null,
    isLoading,
    error,
    getProductDrugForms: getDatas,
  };
}

export default useProductDrugForm;
