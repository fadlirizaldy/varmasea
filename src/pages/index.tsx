import CardDoctor from "@/components/CardDoctor";
import CardProduct from "@/components/CardProduct";
import Slider from "@/features/user/Slider/Slider";
import useDoctor from "@/hooks/CRUD/useDoctor";
import useProductMaster from "@/hooks/CRUD/useProductMaster";
import useUserProductMaster from "@/hooks/CRUD/useUserProductMaster";
import useAuth from "@/hooks/useAuth";
import { GCP_PUBLIC_IMG } from "@/utils/api/apiURL";
import { baseUrl } from "@/utils/baseUrl";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import { FaChevronRight } from "react-icons/fa";
import { toast } from "sonner";

Home.title = "Varmasea | Find your health solution";
export default function Home() {
  const router = useRouter();
  const { token, role, userId } = useAuth();

  const {
    productsMasterUser,
    getProductsMasterMessage,
    isLoading,
    getProductsMasterUser,
  } = useUserProductMaster();

  const { productsMaster, getProductsMaster } = useProductMaster();
  const { doctors, getDoctors, isLoading: isLoadingDoctors } = useDoctor();

  const handleAddToCart = async (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    prodId: number
  ) => {
    e.stopPropagation();
    if (!role) {
      toast.info("Please login to add the product to cart", {
        duration: 3000,
        position: "top-center",
      });
      return router.push("/auth/login");
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

  useEffect(() => {
    const queriesProduct = {
      // sort: sortOption !== null ? sortOption.sortDir : undefined,
      page: 1,
      limit: 8,
    };
    const queriesDoctor = {
      // sort: sortOption !== null ? sortOption.sortDir : undefined,
      page: 1,
      limit: 11,
    };
    getDoctors(undefined, queriesDoctor);
    if (role !== null) {
      getProductsMasterUser(undefined, queriesProduct);
      return;
    }
    getProductsMaster(undefined, queriesProduct);
  }, [role]);

  const ref = useRef<HTMLDivElement | null>(null);
  return (
    <main className="">
      <div className="bg-[#F0FFFF] pt-10 pb-4 overflow-x-hidden">
        <Slider />
      </div>
      <div className="mt-8 max-w-[1200px] w-[90%] mx-auto">
        <h2 className="text-primary_blue font-bold text-lg flex items-center gap-2">
          <div className="w-4 h-10 bg-primary_blue rounded-md"></div>
          Telemedicine
        </h2>
        <h3 className="font-bold text-3xl mt-4">Chat with Our Doctors</h3>
        <div className="relative">
          <div
            className="flex gap-8 overflow-x-auto scroll-smooth py-5"
            ref={ref}
          >
            {doctors?.map((prod, idx) => (
              <CardDoctor
                key={idx}
                {...prod}
                isMasked={idx === doctors.length - 1}
                withMinWidth={true}
              />
            ))}
          </div>
          <div
            className="absolute -right-7 top-1/2 -translate-y-1/2 p-5 rounded-full  bg-primary_orange/80 cursor-pointer hover:scale-[115%] active:scale-100"
            onClick={() => {
              if (ref.current !== null) {
                ref.current.scrollLeft += 400;
              }
            }}
          >
            <FaChevronRight />
          </div>
        </div>
      </div>
      <div className="mt-8 max-w-[1200px] w-[90%] mx-auto">
        <h2 className="text-primary_blue font-bold text-lg flex items-center gap-2">
          <div className="w-4 h-10 bg-primary_blue rounded-md"></div>
          Our Products
        </h2>

        <h3 className="font-bold text-3xl mt-4">Explore Our Products</h3>

        {getProductsMasterMessage === "user doesn't have default address" ? (
          <div className="flex flex-col items-center mt-5 ">
            <img
              src={`${GCP_PUBLIC_IMG}/no_data.jpg`}
              alt="no address data"
              className="w-56 sm:w-96 mb-3"
            />
            <p className="text-slate-700 font-medium">
              Sorry, there&apos;s no product near you
            </p>
            <p className="text-slate-400 font-medium">
              You can input your address first to see products from nearest
              pharmacies
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-4">
              {role === null && productsMaster !== null
                ? productsMaster.map((prod1, idx) => (
                    <CardProduct
                      key={idx}
                      {...prod1}
                      handleAddToCart={(e) => handleAddToCart(e, prod1.id)}
                    />
                  ))
                : productsMasterUser !== null &&
                  productsMasterUser.map((prod2, idx) => (
                    <CardProduct
                      key={idx}
                      {...prod2}
                      handleAddToCart={(e) => handleAddToCart(e, prod2.id)}
                    />
                  ))}
            </div>
            <div
              onClick={() => router.push("/products")}
              className="text-center font-semibold text-secondary_blue text-lg cursor-pointer mt-10 mx-auto w-fit hover:underline"
            >
              See more..
            </div>
          </>
        )}
      </div>
    </main>
  );
}
