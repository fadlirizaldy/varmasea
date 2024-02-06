import React from "react";
import { TD, TH, TR } from ".";
import { IProductPharmacy } from "@/types/api";

const ProductBasicDetailTable = ({
  product,
}: {
  product: Partial<IProductPharmacy>;
}) => {
  const productRows = {
    Name: "name",
    "Generic Name": "generic_name",
    Category: "category",
    Content: "content",
    Manufacturer: "manufacture",
    "Drug Form": "drug_form",
    "Unit in Pack": "unit_in_pack",
    Weight: "weight",
    Size: "size",
    Description: "description",
  };
  return (
    <table>
      <tbody>
        {Object.keys(productRows).map((head, idx) => {
          const value =
            product[
              productRows[
                head as keyof typeof productRows
              ] as keyof typeof product
            ]?.toString();

          return (
            <TR key={idx}>
              <TH>{head}</TH>
              {head === "Size" ? (
                <TD>
                  {product.length} cm x {product.width} cm x {product.height} cm
                </TD>
              ) : head === "Weight" ? (
                <TD>{product.weight} gr</TD>
              ) : (
                <TD>{value}</TD>
              )}
            </TR>
          );
        })}
      </tbody>
    </table>
  );
};

export default ProductBasicDetailTable;
