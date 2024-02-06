import { Button, ButtonBorderOnly } from "@/components/Button";
import { Form, FormInput, FormSelect } from "@/components/Form";
import { Modal } from "@/components/Modal";
import useDoctor from "@/hooks/CRUD/useDoctor";
import { adminManageDoctorsRoute } from "@/routes";
import { IDoctor } from "@/types/api";
import { gcpURL } from "@/utils/gcpURL";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { toast } from "sonner";

const Doctor = ({
  initialData,
  doctorId,
}: {
  initialData: Partial<IDoctor>;
  doctorId?: number;
}) => {
  const router = useRouter();
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [doctorData, setDoctorData] = useState(initialData);
  const [isModalShown, setIsModalShown] = useState(false);
  const {
    doctor,
    doctorUpdated,
    error: errorUpdateDoctor,
    isLoading,
    getDoctor,
    updateDoctor,
  } = useDoctor();

  const handleConfirmVerify = () => {
    setIsButtonLoading(true);
    updateDoctor("EDIT", { is_verify: true }, doctorId);
    return;
  };

  useEffect(() => {
    if (
      doctorUpdated !== null &&
      (doctorUpdated.data ||
        doctorUpdated.message ===
          "Successfully update verify value for the doctor")
    ) {
      getDoctor(doctorId!);
      toast.success("Verify doctor successful", { duration: 1500 });
      setIsModalShown(false);
      return;
    }
    if (errorUpdateDoctor) {
      setIsButtonLoading(false);
      return;
    }
  }, [doctorUpdated, errorUpdateDoctor]);

  useEffect(() => {
    if (doctor !== null) {
      setDoctorData(doctor);
    }
  }, [doctor]);

  return (
    <>
      <div className="w-full">
        <h1 className="mb-3 text-3xl font-bold">{`Detail Doctor`}</h1>

        <div className="flex gap-10 mt-7">
          <div className="w-56 h-56 rounded-full">
            {initialData.photo && (
              <Image
                src={gcpURL(initialData.photo as string)}
                alt={`Photo of ${initialData.name}`}
                width={100}
                height={100}
                className="object-cover w-full h-full rounded-full"
              />
            )}
          </div>
          <div className="w-[80%]">
            <div className="px-4 sm:px-0">
              <h3 className="text-base font-semibold leading-7 text-gray-900">
                Doctor Information
              </h3>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
                Personal details and contact
              </p>
            </div>
            <div className="mt-6 border-t border-gray-100">
              <dl className="divide-y divide-gray-100">
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-sm font-medium leading-6 text-gray-900">
                    Full name
                  </dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    {doctorData.name}
                  </dd>
                </div>
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-sm font-medium leading-6 text-gray-900">
                    Specialization
                  </dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    {doctorData.specialization}
                  </dd>
                </div>
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-sm font-medium leading-6 text-gray-900">
                    Years of Experience
                  </dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    {doctorData.years_of_experience}
                  </dd>
                </div>
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-sm font-medium leading-6 text-gray-900">
                    Phone Number
                  </dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    {doctorData.phone_number}
                  </dd>
                </div>
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-sm font-medium leading-6 text-gray-900">
                    Status
                  </dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    {doctorData.is_verify ? (
                      <h2 className="text-green-600 italic font-medium">
                        Verified
                      </h2>
                    ) : (
                      <div className="flex items-center gap-4">
                        <h1 className="text-red-600 font-medium">
                          Not Verified
                        </h1>
                        <button
                          className="px-2 py-1 rounded-lg bg-slate-200 hover:bg-slate-300"
                          onClick={() => setIsModalShown(true)}
                        >
                          Verify this account
                        </button>
                      </div>
                    )}
                  </dd>
                </div>
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-sm font-medium leading-6 text-gray-900">
                    Attachments
                  </dt>
                  <dd className="mt-2 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                    {doctorData.certificate !== undefined && (
                      <embed
                        src={gcpURL(doctorData.certificate)}
                        height="600px"
                        className="w-full"
                      />
                    )}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        <div className="flex flex-row self-end gap-2 mt-6">
          <div>
            <ButtonBorderOnly
              onClick={() => {
                if (isButtonLoading) {
                  return;
                }
                router.replace(adminManageDoctorsRoute);
              }}
            >
              Back
            </ButtonBorderOnly>
          </div>
        </div>
      </div>

      {isModalShown && (
        <Modal isModalShown={isModalShown} setIsModalShown={setIsModalShown}>
          <div className="p-4 md:p-5 text-center">
            <FaCheckCircle className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to verify this doctor?
            </h3>

            <div className="flex flex-row justify-center gap-2">
              <div>
                <ButtonBorderOnly
                  type="button"
                  withoutHoverEffect
                  onClick={() => setIsModalShown(false)}
                >
                  Cancel
                </ButtonBorderOnly>
              </div>
              <div>
                <Button
                  type="button"
                  withoutHoverEffect
                  onClick={() => handleConfirmVerify()}
                  isLoading={isButtonLoading || isLoading}
                >
                  Confirm
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default Doctor;
