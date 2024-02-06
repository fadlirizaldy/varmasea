import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSearchParams } from "next/navigation";
import PaginationButton from "@/features/admin/PaginationButton";
import CardProduct from "@/components/CardProduct";
import Link from "next/link";
import useUserProductMaster from "@/hooks/CRUD/useUserProductMaster";
import useAuth from "@/hooks/useAuth";
import { toast } from "sonner";
import { baseUrl } from "@/utils/baseUrl";
import { IPageInfo, IProductMaster, ISortOption } from "@/types/api";
import useProductMaster from "@/hooks/CRUD/useProductMaster";
import useProductCategoryList from "@/hooks/CRUD/useProductCategoryList";
import { initialPageInfo } from "@/utils/initialData";
import { GCP_PUBLIC_IMG } from "@/utils/api/apiURL";
import FilterTool from "@/features/user/FilterTool";
import CategoryCard from "@/features/user/CategoryCard";
import { paginateArray } from "@/utils/paginateArray";

const ListProductsPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const keyword = searchParams.get("keyword");
  const categorySearch = searchParams.get("cat");
  const { role, token, userId } = useAuth();

  const { productCategoriesList, getProductCategoriesList } =
    useProductCategoryList();
  const {
    productsMasterUser,
    getProductsMasterMessage,
    pageInfo: pageInfoProductsMasterUser,
    isLoading: isLoadingProduct,
    getProductsMasterUser,
  } = useUserProductMaster();
  const {
    productsMaster,
    pageInfo: pageInfoProductsMaster,
    getProductsMaster,
  } = useProductMaster();
  const [productsShown, setProductsShown] = useState<IProductMaster[] | null>(
    null
  );
  const [categoryFilterId, setCategoryFilterId] = useState(-1);
  const [pageInfo, setPageInfo] = useState<IPageInfo>(initialPageInfo);
  const [sortOption, setSortOption] = useState<ISortOption | null>({
    sortBy: "name",
    sortDir: "asc",
  });
  const numOfItemPerPage = 12;

  useEffect(() => {
    if (
      categorySearch !== null &&
      categorySearch !== "" &&
      Number(categorySearch) !== -1
    ) {
      setCategoryFilterId(Number(categorySearch));
    }
  }, [categorySearch]);

  useEffect(() => {
    const queries = {
      search: keyword !== null && keyword !== "" ? keyword : undefined,
      order_by: sortOption !== null ? sortOption.sortBy : undefined,
      sort: sortOption !== null ? sortOption.sortDir : undefined,
      page: categoryFilterId !== -1 ? 1 : pageInfo.pageNum,
      limit: categoryFilterId !== -1 ? 999 : numOfItemPerPage,
    };
    getProductCategoriesList();
    if (role === "User") {
      getProductsMasterUser(undefined, queries);
    } else {
      getProductsMaster(undefined, queries);
    }
  }, [role, keyword, sortOption, pageInfo.pageNum, categoryFilterId]);

  useEffect(() => {
    if (productsMaster !== null && pageInfoProductsMaster !== null) {
      const filteredProductsMaster = productsMaster.filter(
        (prod) => prod.category_id === categoryFilterId
      );
      setProductsShown(
        categoryFilterId !== -1
          ? paginateArray(filteredProductsMaster, {
              currentPage: pageInfo.pageNum,
              numOfItemPerPage,
              maxItems: filteredProductsMaster.length,
            })
          : productsMaster
      );
      setPageInfo(
        categoryFilterId !== -1
          ? (prev) => ({
              ...prev,
              maxItem: filteredProductsMaster.length,
              maxPageNum: Math.ceil(
                filteredProductsMaster.length / numOfItemPerPage
              ),
            })
          : pageInfoProductsMaster
      );
      return;
    }
    if (productsMasterUser !== null && pageInfoProductsMasterUser !== null) {
      const filteredProductsMasterUser = productsMasterUser.filter(
        (prod) => prod.category_id === categoryFilterId
      );
      setProductsShown(
        categoryFilterId !== -1
          ? paginateArray(filteredProductsMasterUser, {
              currentPage: pageInfo.pageNum,
              numOfItemPerPage,
              maxItems: filteredProductsMasterUser.length,
            })
          : productsMasterUser
      );
      setPageInfo(
        categoryFilterId !== -1
          ? (prev) => ({
              ...prev,
              maxItem: filteredProductsMasterUser.length,
              maxPageNum: Math.ceil(
                filteredProductsMasterUser.length / numOfItemPerPage
              ),
            })
          : pageInfoProductsMasterUser
      );
      return;
    }
  }, [productsMaster, productsMasterUser, pageInfo.pageNum]);

  useEffect(() => {
    if (pageInfo.pageNum !== 1) {
      setPageInfo((prev) => ({
        ...prev,
        pageNum: 1,
      }));
    }
  }, [categoryFilterId]);

  const handleAddToCart = async (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    prodId: number
  ) => {
    e.stopPropagation();
    if (!token) {
      toast.info("Please login to add the product to cart", {
        duration: 3000,
        position: "top-center",
      });
      return router.push("/auth/login");
    }

    if (role !== "User") {
      toast.error("You can't add to cart, try another account", {
        duration: 3000,
        position: "top-center",
      });
      return;
    }

    const bodyCart = {
      user_id: userId,
      drug_id: prodId,
      quantity: 1,
    };

    const url = baseUrl("/carts");
    const options: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(bodyCart),
    };
    const response = await fetch(url, options);
    const dataResponse = await response.json();

    if (dataResponse.message)
      return toast.error("Failed add item to cart", { position: "top-center" });
    return toast.success("success add to cart", { position: "top-center" });
  };

  return (
    <div className="max-w-[1200px] w-[90%] mx-auto pt-10">
      <h2 className="font-medium text-2xl mb-5">All Products</h2>
      {keyword && (
        <h4 className="mb-5">
          Showing results for :{" "}
          <span className="font-semibold text-secondary_blue">{keyword}</span>
        </h4>
      )}

      {role !== null &&
      getProductsMasterMessage === "user doesn't have default address" ? (
        <div className="flex flex-col items-center">
          <img
            src={`${GCP_PUBLIC_IMG}/no_data.jpg`}
            alt="no data"
            className="w-56 sm:w-96 mb-3"
          />
          <p className="text-slate-700 font-medium">
            Sorry, there&apos;s no product near you
          </p>
          <p className="text-slate-400 font-medium">
            You can input your address to get the nearest pharmacy
          </p>
        </div>
      ) : (
        <>
          <h5 className="text-lg font-medium">Choose Category</h5>
          <div className="flex items-center gap-4 mb-5 overflow-x-auto p-2">
            {categoryFilterId !== -1 && productCategoriesList !== null && (
              <CategoryCard
                cat={
                  productCategoriesList.find(
                    (cat) => cat.id === categoryFilterId
                  )!
                }
                isActive={true}
                setInactive={() => setCategoryFilterId(-1)}
              />
            )}
            {productCategoriesList
              ?.filter((cat) => cat.id !== categoryFilterId)
              .slice(0, categoryFilterId === -1 ? 5 : 4)
              .map((cat, idx) => (
                <CategoryCard
                  cat={cat}
                  key={idx}
                  onClick={() => setCategoryFilterId(cat.id)}
                />
              ))}
            <Link
              href={"/products/category"}
              className="flex items-center min-w-14 gap-2 text-secondary_blue hover:underline cursor-pointer"
            >
              See all
            </Link>
          </div>

          <div className="flex flex-col xs:flex-row gap-8">
            <div className="flex xs:flex-col w-full xs:w-1/5 bg-white p-3 rounded-md border border-slate-300 sticky top-[120px] h-fit gap-5">
              <FilterTool
                title="Sort By"
                options={[
                  ["Name: A to Z", "name", "asc", undefined],
                  ["Name: Z to A", "name", "desc", undefined],
                ]}
                setSortOption={setSortOption}
                isActive={[
                  sortOption?.sortDir === "asc",
                  sortOption?.sortDir === "desc",
                ]}
              />
            </div>

            {productsShown !== null && productsShown.length > 0 ? (
              <div className="w-4/5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {productsShown.map((prod, idx) => (
                  <CardProduct
                    key={idx}
                    {...prod}
                    handleAddToCart={(e) => handleAddToCart(e, prod.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center mt-5 w-full justify-center">
                <img
                  src={`${GCP_PUBLIC_IMG}/no_data.jpg`}
                  alt="no data"
                  className="w-56 sm:w-96 mb-3"
                />
                <p className="text-slate-400 font-medium">
                  Sorry, there&apos;s no product here
                </p>
              </div>
            )}
          </div>

          {productsShown !== null && productsShown.length > 0 && (
            <div className="flex justify-end">
              <div className="xs:w-[76.5%] gap-5 mt-6">
                <PaginationButton
                  numOfPages={pageInfo.maxPageNum}
                  currentPage={pageInfo.pageNum}
                  maxItem={pageInfo.maxItem}
                  itemPerPage={numOfItemPerPage}
                  setPage={setPageInfo}
                  // leftPageNumShown={pageInfo.leftPageNumShown}
                  // rightPageNumShown={pageInfo.rightPageNumShown}
                />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ListProductsPage;
ListProductsPage.title = "Buy Product You Need";
