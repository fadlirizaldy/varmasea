import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSearchParams } from "next/navigation";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import PaginationButton from "@/features/admin/PaginationButton";
import CardDoctor from "@/components/CardDoctor";
import useDoctor from "@/hooks/CRUD/useDoctor";
import { GCP_PUBLIC_IMG } from "@/utils/api/apiURL";
import { IDoctor, IPageInfo, ISortOption } from "@/types/api";
import { initialPageInfo } from "@/utils/initialData";
import FilterTool from "@/features/user/FilterTool";
import useSpecialization from "@/hooks/CRUD/useSpecialization";
import { paginateArray } from "@/utils/paginateArray";

// const handleAddToCart = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
//   alert("ADD TO CART");
//   e.stopPropagation();
// };

const ListDoctors = () => {
  const searchParams = useSearchParams();
  const keyword = searchParams.get("keyword");
  const { doctors, pageInfo: pageInfoDoctor, getDoctors, isLoading } = useDoctor();
  const [doctorsShown, setDoctorsShown] = useState<IDoctor[] | null>(null);
  const { specializations, getSpecializations } = useSpecialization();
  const [pageInfo, setPageInfo] = useState<IPageInfo>(initialPageInfo);
  const [specializationFilterSelect, setSpecializationFilterSelect] = useState("All");
  const [sortOption, setSortOption] = useState<ISortOption | null>({
    sortBy: "name",
    sortDir: "asc",
  });
  const [isAllSpecializationsShown, setIsAllSpecializationsShown] = useState(false);
  const numOfItemPerPage = 12;

  useEffect(() => {
    const queries = {
      search: keyword !== null && keyword !== "" ? keyword : undefined,
      order_by: sortOption !== null ? sortOption.sortBy : undefined,
      sort: sortOption !== null ? sortOption.sortDir : undefined,
      page: pageInfo.pageNum,
      limit: numOfItemPerPage,
    };
    getDoctors(undefined, queries);
    getSpecializations();
  }, [keyword, sortOption, pageInfo.pageNum, specializationFilterSelect]);

  useEffect(() => {
    if (doctors !== null && pageInfoDoctor !== null) {
      const filteredDoctors = doctors.filter((doctor) => doctor.specialization === specializationFilterSelect);
      setDoctorsShown(
        specializationFilterSelect !== "All"
          ? paginateArray(filteredDoctors, {
              currentPage: pageInfo.pageNum,
              numOfItemPerPage,
              maxItems: filteredDoctors.length,
            })
          : doctors
      );
      setPageInfo(
        specializationFilterSelect !== "All"
          ? (prev) => ({
              ...prev,
              maxItem: filteredDoctors.length,
              maxPageNum: Math.ceil(filteredDoctors.length / numOfItemPerPage),
            })
          : pageInfoDoctor
      );
      return;
    }
  }, [doctors, pageInfo.pageNum]);

  useEffect(() => {
    if (pageInfo.pageNum !== 1) {
      setPageInfo((prev) => ({
        ...prev,
        pageNum: 1,
      }));
    }
  }, [specializationFilterSelect]);

  const specializationsFilter = () => {
    const limit = 5;
    if (specializations === null) {
      return [""];
    }
    if (limit !== undefined && !isAllSpecializationsShown) return ["All", ...specializations.slice(0, limit - 1)];
    return ["All", ...specializations];
  };

  return (
    <div className="max-w-[1200px] w-[90%] mx-auto pt-10">
      <h2 className="font-medium text-2xl mb-5">Choose Doctors</h2>

      <>
        {keyword && (
          <h4 className="mb-5">
            Showing results for : <span className="font-semibold text-secondary_blue">{keyword}</span>
          </h4>
        )}

        <div className="flex flex-col xs:flex-row gap-10">
          <div className="flex xs:flex-col w-full xs:w-[25%] bg-white p-3 rounded-md border border-slate-300 sticky top-[120px] h-fit gap-5">
            <div className="flex flex-col gap-1">
              <FilterTool
                title="Sort By"
                options={[
                  ["Name: A to Z", "name", "asc", undefined],
                  ["Name: Z to A", "name", "desc", undefined],
                ]}
                setSortOption={setSortOption}
                isActive={[sortOption?.sortDir === "asc", sortOption?.sortDir === "desc"]}
              />
            </div>
            <div className="flex flex-col gap-1">
              <FilterTool
                title="Specialization"
                options={specializationsFilter()!.map((item) => [item, undefined, undefined, undefined])}
                setSelectedFilter={setSpecializationFilterSelect}
                setSortOption={setSortOption}
                isActive={specializationsFilter()!.map((item) => item === specializationFilterSelect)}
              />
              <button
                className="font-medium flex items-center gap-3"
                onClick={() => setIsAllSpecializationsShown((prev) => !prev)}
              >
                {!isAllSpecializationsShown ? (
                  <>
                    See more...
                    <IoMdArrowDropdown />
                  </>
                ) : (
                  <>
                    See less...
                    <IoMdArrowDropup />
                  </>
                )}
              </button>
            </div>
          </div>
          {doctorsShown !== null && doctorsShown.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  lg:grid-cols-4 gap-8 w-full">
              {doctorsShown?.map((prod, idx) => (
                <CardDoctor key={idx} {...prod} withMinWidth={false} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 w-full justify-center">
              <img src={`${GCP_PUBLIC_IMG}/no_data.jpg`} alt="no data" className="w-56 sm:w-96" />
              <p className="text-slate-400 font-medium">Sorry, there&apos;s no data here</p>
            </div>
          )}
        </div>

        {doctorsShown !== null && doctorsShown.length > 0 && (
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
    </div>
  );
};

export default ListDoctors;
ListDoctors.title = `Chat With Our Doctor`;
