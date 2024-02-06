import useDoctor from "@/hooks/CRUD/useDoctor";
import useAuth from "@/hooks/useAuth";
import { GCP_PUBLIC_IMG } from "@/utils/api/apiURL";
import { baseUrl } from "@/utils/baseUrl";
import { gcpURL } from "@/utils/gcpURL";
import { getIdFromPath } from "@/utils/getIdFromPath";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { IoIosChatbubbles } from "react-icons/io";
import { toast } from "sonner";

const DetailDoctor = () => {
  const router = useRouter();
  const { doctor, getDoctor, isLoading } = useDoctor();
  const { token, role } = useAuth();
  const doctorId = getIdFromPath(router);

  useEffect(() => {
    getDoctor(Number(doctorId));
  }, [role, doctorId]);

  const handleChatDoctor = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.stopPropagation();

    if (token === null || role !== "User") {
      toast.error("Please login or use another account to chat", {
        position: "top-center",
        duration: 3000,
      });
      return;
    }

    const url = baseUrl(`/user/telemedicines`);
    const options: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ doctor_id: Number(doctorId) }),
    };
    const response = await fetch(url, options);
    const dataResponse = await response.json();
    if (dataResponse.message) {
      toast.error("Cant be able to chat this doctor", {
        duration: 3000,
        position: "top-center",
      });
      return;
    }

    toast.success(`Success create room chat with ${dataResponse.doctor_name}`, {
      duration: 3000,
      position: "top-center",
    });
    return router.push("/chat");
  };

  return (
    <div className="max-w-[1200px] w-[90%] mx-auto pt-10 flex gap-3">
      {doctor ? (
        <>
          <div className="flex items-start gap-8 w-3/4">
            <img
              src={gcpURL(doctor?.photo as string)}
              alt={`Photo of ${doctor.name}`}
              className="w-32 h-32 rounded-full object-cover border border-slate-200"
            />
            <div className="w-[80%]">
              <div className="px-4 sm:px-0">
                <h3 className="text-xl font-semibold leading-7 text-gray-900">
                  Doctor Information
                </h3>
                <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
                  Personal details and contact
                </p>
              </div>
              <div className="mt-6 border-t border-gray-100">
                <dl className="divide-y divide-gray-100">
                  <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-base font-medium leading-6 text-gray-900">
                      Full name
                    </dt>
                    <dd className="mt-1 text-base leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                      {doctor?.name}
                    </dd>
                  </div>
                  <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-base font-medium leading-6 text-gray-900">
                      Specialization
                    </dt>
                    <dd className="mt-1 text-base leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                      {doctor?.specialization ?? "-"}
                    </dd>
                  </div>
                  <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-base font-medium leading-6 text-gray-900">
                      Years of Experience
                    </dt>
                    <dd className="mt-1 text-base leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                      {doctor?.years_of_experience}{" "}
                      {doctor?.years_of_experience! > 1 ? "Years" : "Year"}
                    </dd>
                  </div>
                  <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-base font-medium leading-6 text-gray-900">
                      Phone Number
                    </dt>
                    <dd className="mt-1 text-base leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                      {doctor?.phone_number ?? "-"}
                    </dd>
                  </div>
                  <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-base font-medium leading-6 text-gray-900">
                      Status
                    </dt>
                    <dd
                      className={`mt-1 text-base leading-6 text-gray-700 sm:col-span-2 sm:mt-0 italic ${
                        doctor?.is_verify
                          ? "text-primary_green"
                          : "text-primary_red"
                      }`}
                    >
                      {doctor?.is_verify ? "Verify" : "Unverify"}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
          <div className="w-1/4 h-fit p-3 rounded-lg border border-slate-200 sticky top-[120px]">
            <h3 className="text-xl font-semibold mb-2">{doctor?.name}</h3>
            <button
              className="btn w-full flex items-center text-white text-lg bg-secondary_blue hover:bg-primary_blue"
              onClick={(e) => handleChatDoctor(e)}
            >
              <IoIosChatbubbles />
              Chat
            </button>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center w-full gap-4">
          <img
            src={`${GCP_PUBLIC_IMG}/no_data.jpg`}
            alt="no data"
            className="w-56 sm:w-96"
          />
          <p className="text-slate-400 font-medium">
            Sorry, there&apos;s no doctor with id {doctorId}
          </p>
        </div>
      )}
    </div>
  );
};

export default DetailDoctor;
DetailDoctor.title = `Varmasea | Doctor Detail`;
