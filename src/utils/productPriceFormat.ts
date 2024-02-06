import { IProductMaster } from "@/types/api";
import { currencyFormat } from "./formatting/currencyFormat";

export const productPriceFormat = (product: IProductMaster) => {
  if (product.min_selling_unit === product.max_selling_unit) {
    return currencyFormat(product.min_selling_unit);
  }
  return `${currencyFormat(product.min_selling_unit)} - ${currencyFormat(
    product.max_selling_unit
  )}`;
};
