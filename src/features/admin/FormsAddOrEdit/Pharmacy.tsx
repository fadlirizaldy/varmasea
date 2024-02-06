import { Button, ButtonBorderOnly } from "@/components/Button";
import { Form, FormInput, FormSelect } from "@/components/Form";
import { adminManagePharmaciesRoute } from "@/routes";
import { IAddress, IPharmacy, IPharmacyRequest } from "@/types/api";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { MdSave } from "react-icons/md";
import * as V from "@/utils/formFieldValidation";
import { provinceMap } from "@/utils/location/provinceMap";
import dynamic from "next/dynamic";
import { LatLng } from "leaflet";
import { numberOnlyFormat } from "@/utils/formatting/numberOnlyFormat";
import useCity from "@/hooks/CRUD/useCity";
import usePharmacy from "@/hooks/CRUD/usePharmacy";
import { toast } from "sonner";

const initialZoom = 15;

const Pharmacy = ({
  type,
  initialData,
  pharmacyId,
}: {
  type: "ADD" | "EDIT" | "DETAIL";
  initialData: Partial<IPharmacy>;
  pharmacyId?: number;
}) => {
  const router = useRouter();
  const [isButtonSaveClicked, setIsButtonSaveClicked] = useState(false);
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [pharmacyData, setPharmacyData] = useState(initialData);
  const [pharmacyAddressInput, setPharmacyAddressInput] = useState(
    initialData.address as IAddress
  );
  const [mapPinPoint, setMapPinPoint] = useState<Partial<LatLng>>({
    lat: initialData.address!.latitude,
    lng: initialData.address!.longitude,
  });
  const [mapZoom, setMapZoom] = useState(initialZoom);
  const PharmacyMap = dynamic(() => import("@/components/MapView"), {
    ssr: false,
  });

  const { cities, getCities } = useCity();
  const { pharmacyUpdated, updatePharmacy } = usePharmacy();

  useEffect(() => {
    if (mapPinPoint.lat !== undefined && mapPinPoint.lng !== undefined) {
      setPharmacyAddressInput((prev) => ({
        ...prev,
        latitude: mapPinPoint.lat!,
        longitude: mapPinPoint.lng!,
      }));
    }
  }, [mapPinPoint]);

  useEffect(() => {
    setPharmacyData((prev) => ({ ...prev, address: pharmacyAddressInput }));
  }, [pharmacyAddressInput]);

  useEffect(() => {
    if (pharmacyAddressInput.province !== initialData.address?.province) {
      setPharmacyAddressInput((prev) => ({ ...prev, city: "", city_id: -1 }));

      getCities(
        provinceMap[pharmacyAddressInput.province as keyof typeof provinceMap]
      );
    }
  }, [pharmacyAddressInput.province]);

  useEffect(() => {
    if (
      pharmacyAddressInput.province !== initialData.address?.province &&
      pharmacyAddressInput.city === "" &&
      pharmacyAddressInput.city_id === -1 &&
      cities !== null
    ) {
      setPharmacyAddressInput((prev) => ({
        ...prev,
        city: cities.map((city) => city.name)[0],
        city_id: cities.map((city) => city.id)[0],
      }));
    }
  }, [cities]);

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsButtonSaveClicked(true);
    setIsButtonLoading(true);
    if (
      !V.isAllFieldFilled2(pharmacyData, 0) ||
      !V.isPharmacyDataValid(pharmacyData)
    ) {
      setIsButtonLoading(false);
      return;
    }
    if (type === "ADD" || type === "EDIT") {
      let pharmacyDataSent: IPharmacyRequest = {
        name: pharmacyData.name!,
        pharmacist_name: pharmacyData.pharmacist_name!,
        pharmacist_license_number: pharmacyData.license_number!,
        pharmacist_phone_number: pharmacyData.phone_number!,
        address: {
          province_id: pharmacyData.address!.province_id!,
          city_id: pharmacyData.address!.city_id!,
          detail: pharmacyData.address!.detail,
          latitude: pharmacyData.address!.latitude,
          longitude: pharmacyData.address!.longitude,
        },
      };
      updatePharmacy(type, pharmacyDataSent as IPharmacyRequest, pharmacyId);
      return;
    }
  };

  useEffect(() => {
    if (pharmacyUpdated !== null && pharmacyUpdated.message) {
      setIsButtonLoading(false);
      return;
    }
    if (pharmacyUpdated !== null && pharmacyUpdated.data) {
      toast.success(
        type === "ADD"
          ? "New pharmacy has been created"
          : "Edit pharmacy data successful",
        { duration: 1500 }
      );
      router.replace(adminManagePharmaciesRoute);
      return;
    }
  }, [pharmacyUpdated]);
  return (
    <div className="">
      <h1 className="mt-4  mb-3 text-lg font-bold">
        {`${
          type === "ADD" ? "Add New" : type === "EDIT" ? "Edit" : "View"
        } Pharmacy`}
      </h1>

      <Form formnovalidate={true} onSubmit={handleFormSubmit}>
        <div className="grid grid-cols-2 gap-8">
          <div className="flex flex-col gap-4">
            <FormInput
              type="text"
              placeholder="Input pharmacy name.."
              titleText="Pharmacy Name"
              value={pharmacyData.name}
              onChange={(e) =>
                setPharmacyData((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
              handleError={V.handleError(
                "name",
                pharmacyData.name!,
                isButtonSaveClicked,
                "Pharmacy name"
              )}
              isDisabled={type === "DETAIL"}
            />
            <FormInput
              type="text"
              placeholder="Input pharmacist name.."
              titleText="Pharmacist"
              value={pharmacyData.pharmacist_name}
              onChange={(e) =>
                setPharmacyData((prev) => ({
                  ...prev,
                  pharmacist_name: e.target.value,
                }))
              }
              handleError={V.handleError(
                "name",
                pharmacyData.pharmacist_name!,
                isButtonSaveClicked,
                "Pharmacist name"
              )}
              isDisabled={type === "DETAIL"}
            />
            <FormInput
              type="text"
              placeholder="Input license number.."
              titleText="License Number"
              value={pharmacyData.license_number}
              onChange={(e) =>
                setPharmacyData((prev) => ({
                  ...prev,
                  license_number: e.target.value,
                }))
              }
              handleError={V.handleError(
                "license_number",
                pharmacyData.license_number,
                isButtonSaveClicked
              )}
              isDisabled={type === "DETAIL"}
            />
            <FormInput
              type="text"
              placeholder="Input phone number.."
              titleText="Phone Number"
              value={
                Number(pharmacyData.phone_number) === 0
                  ? ""
                  : pharmacyData.phone_number?.startsWith("+62")
                  ? pharmacyData.phone_number.slice(3)
                  : pharmacyData.phone_number
              }
              onChange={(e) => {
                if (e.target.value.length > V.maxPhoneNumDigit - 3) {
                  return;
                }
                setPharmacyData((prev) => {
                  return {
                    ...prev,
                    phone_number: `+62${numberOnlyFormat(
                      e.target.value
                    ).toString()}`,
                  };
                });
              }}
              withPrefix={<div className="-ml-1">+62</div>}
              handleError={V.handleError(
                "phone_number",
                pharmacyData.phone_number,
                isButtonSaveClicked
              )}
              isDisabled={type === "DETAIL"}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormSelect
                titleText="Province"
                defaultValue={
                  pharmacyData.address?.province
                    ? pharmacyData.address?.province
                    : ""
                }
                optionPlaceholderText="Select province"
                options={Object.keys(provinceMap)}
                onChange={(e) =>
                  setPharmacyAddressInput((prev) => ({
                    ...prev,
                    province: e.target.value,
                    province_id: Number(
                      provinceMap[e.target.value as keyof typeof provinceMap]
                    ),
                  }))
                }
                errorText="Please select province"
                isError={
                  V.isFormFieldEmpty(pharmacyData.address!.province!) &&
                  isButtonSaveClicked
                }
                isDisabled={type === "DETAIL"}
              />
              <FormSelect
                titleText="City"
                defaultValue={
                  pharmacyData.address?.city ? pharmacyData.address.city : ""
                }
                optionPlaceholderText="Select city"
                options={
                  cities !== null
                    ? cities.map((city) => city.name)
                    : pharmacyData.address?.city
                    ? [pharmacyData.address?.city]
                    : [""]
                }
                onChange={(e) =>
                  setPharmacyAddressInput((prev) => ({
                    ...prev,
                    city: e.target.value,
                    city_id: cities!.find(
                      (city) => city.name === e.target.value
                    )!.id,
                  }))
                }
                errorText="Please select city"
                isError={
                  V.isFormFieldEmpty(pharmacyData.address!.city!) &&
                  isButtonSaveClicked
                }
                isDisabled={
                  type === "DETAIL" || pharmacyAddressInput.province === ""
                }
              />
            </div>
            <FormInput
              type="text"
              placeholder="Input address detail.."
              titleText="Street Name"
              value={pharmacyData.address?.detail}
              onChange={(e) =>
                setPharmacyAddressInput((prev) => ({
                  ...prev,
                  detail: e.target.value,
                }))
              }
              handleError={V.handleError(
                "name",
                pharmacyAddressInput.detail,
                isButtonSaveClicked,
                "Street name"
              )}
              isDisabled={type === "DETAIL"}
            />
          </div>
          <div className="flex flex-col">
            {pharmacyData.address?.latitude !== undefined &&
              pharmacyData.address.longitude !== undefined && (
                <PharmacyMap
                  titleText="Address Pin Point"
                  center={mapPinPoint}
                  zoom={mapZoom}
                  setMapCenter={setMapPinPoint}
                  setMapZoom={setMapZoom}
                  isLocationDetailShown={true}
                  isDisabled={type === "DETAIL"}
                />
              )}
          </div>
        </div>

        {type !== "DETAIL" && (
          <div className="flex flex-row self-end gap-2 mt-6">
            <div>
              <ButtonBorderOnly
                type="button"
                onClick={() => {
                  if (isButtonLoading) {
                    return;
                  }
                  router.replace(adminManagePharmaciesRoute);
                }}
              >
                Cancel
              </ButtonBorderOnly>
            </div>
            <div className="flex flex-row">
              <Button
                withoutHoverEffect={true}
                type="submit"
                isLoading={isButtonLoading}
                isDisabled={!V.isPharmacyDataValid(pharmacyData)}
              >
                Save Pharmacy
                <div className={`${isButtonLoading ? "invisible" : "block"}`}>
                  <MdSave size={20} />
                </div>
              </Button>
            </div>
          </div>
        )}
      </Form>
    </div>
  );
};

export default Pharmacy;
