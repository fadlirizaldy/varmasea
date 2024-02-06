import CategoryCard from "@/features/user/CategoryCard";
import useProductCategoryList from "@/hooks/CRUD/useProductCategoryList";
import { IProductCategory } from "@/types/api";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

export interface IGetDataCategories {
  data: {
    categories: IProductCategory[];
  };
  message: string;
}

const CategoryProductPage = () => {
  const router = useRouter();
  const { productCategoriesList, getProductCategoriesList } =
    useProductCategoryList();

  useEffect(() => {
    getProductCategoriesList();
  }, []);

  return (
    <div className="max-w-[1200px] w-[90%] mx-auto pt-10">
      <h2 className="font-medium text-2xl">Choose Category Product</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-5  p-2">
        {productCategoriesList?.map((cat, idx) => (
          <CategoryCard
            cat={cat}
            key={idx}
            onClick={() => router.replace(`/products?cat=${cat.id}`)}
          />
        ))}
      </div>
    </div>
  );
};

export default CategoryProductPage;
CategoryProductPage.title = `Category | Product`;
