import { Form, FormInput, FormSelect } from "@/components/Form";
import { Modal } from "@/components/Modal";
import { IAddressUser } from "@/types/api";
import { initialAddress } from "@/utils/initialData";
import { provinceMap } from "@/utils/location/provinceMap";
import * as V from "@/utils/formFieldValidation";
import React, { useEffect, useState } from "react";
import useCity from "@/hooks/CRUD/useCity";
import { LatLng } from "leaflet";
import dynamic from "next/dynamic";
import { Button, ButtonBorderOnly } from "@/components/Button";
import { MdSave } from "react-icons/md";
import useUserAddress from "@/hooks/CRUD/useUserAddress";
import { toast } from "sonner";
type TModalAddress = {
  type: "ADD" | "EDIT";
  isModalShown: boolean;
  setIsModalShown: React.Dispatch<React.SetStateAction<boolean>>;
  initialData?: Partial<IAddressUser>;
  rerenderPage: () => void;
};
const initialZoom = 15;

const ModalAddress = ({
  type,
  isModalShown,
  setIsModalShown,
  initialData = initialAddress,
  rerenderPage,
}: TModalAddress) => {
  const [addressData, setAddressData] = useState(initialData);
  const [isButtonSaveClicked, setIsButtonSaveClicked] = useState(false);
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [mapPinPoint, setMapPinPoint] = useState<Partial<LatLng>>({
    lat: initialData.latitude,
    lng: initialData.longitude,
  });
  const [mapZoom, setMapZoom] = useState(initialZoom);
  const PharmacyMap = dynamic(() => import("@/components/MapView"), {
    ssr: false,
  });
  const { cities, getCities } = useCity();
  const { addressUserUpdated, updateAddressUser, isLoading } = useUserAddress();
  useEffect(() => {
    if (mapPinPoint.lat !== undefined && mapPinPoint.lng !== undefined) {
      setAddressData((prev) => ({
        ...prev,
        latitude: mapPinPoint.lat!,
        longitude: mapPinPoint.lng!,
      }));
    }
  }, [mapPinPoint]);

  useEffect(() => {
    if (addressData.province !== initialData.province) {
      setAddressData((prev) => ({ ...prev, city: "", city_id: -1 }));
      getCities(provinceMap[addressData.province as keyof typeof provinceMap]);
    }
  }, [addressData.province]);

  useEffect(() => {
    if (
      addressData.province !== initialData.province &&
      addressData.city === "" &&
      addressData.city_id === -1 &&
      cities !== null
    ) {
      setAddressData((prev) => ({
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
      !V.isAllFieldFilled2(addressData, 0) ||
      !V.isUserAddressDataValid(addressData)
    ) {
      setIsButtonLoading(false);
      return;
    }
    updateAddressUser(type, addressData);
    return;
  };

  useEffect(() => {
    if (addressUserUpdated !== null && addressUserUpdated.message) {
      alert(addressUserUpdated.message);
      setIsButtonLoading(false);
      return;
    }
    if (addressUserUpdated !== null && addressUserUpdated.data) {
      rerenderPage();
      toast.success(
        type === "ADD"
          ? "New address has been created"
          : "Edit address data successful",
        { duration: 1500 }
      );
      setIsModalShown(false);
      return;
    }
  }, [addressUserUpdated]);

  return (
    <Modal
      isModalShown={isModalShown}
      setIsModalShown={setIsModalShown}
      padding="p-8"
      maxWidth="w-full md:w-4/5  max-w-[800px]"
      height="h-fit"
    >
      <h1 className="mb-3 text-lg font-bold">
        {`${type === "ADD" ? "Add New" : "Edit"} Address`}
      </h1>

      <Form formnovalidate={true} onSubmit={handleFormSubmit} gap="gap-4">
        <div className="grid grid-cols-1 gap-2">
          <div className="grid grid-cols-2 gap-4">
            <FormSelect
              titleText="Province"
              defaultValue={addressData.province ? addressData.province : ""}
              optionPlaceholderText="Select province"
              options={Object.keys(provinceMap)}
              onChange={(e) =>
                setAddressData((prev) => ({
                  ...prev,
                  province: e.target.value,
                  province_id: Number(
                    provinceMap[e.target.value as keyof typeof provinceMap]
                  ),
                }))
              }
              errorText="Please select province"
              isError={
                V.isFormFieldEmpty(addressData.province!) && isButtonSaveClicked
              }
            />
            <FormSelect
              titleText="City"
              defaultValue={addressData.city ? addressData.city : ""}
              optionPlaceholderText="Select city"
              options={
                cities !== null
                  ? cities.map((city) => city.name)
                  : addressData.city
                  ? [addressData.city]
                  : [""]
              }
              onChange={(e) =>
                setAddressData((prev) => ({
                  ...prev,
                  city: e.target.value,
                  city_id: cities!.find((city) => city.name === e.target.value)!
                    .id,
                }))
              }
              errorText="Please select city"
              isError={
                V.isFormFieldEmpty(addressData.city!) && isButtonSaveClicked
              }
              isDisabled={addressData.province === ""}
            />
          </div>
          <FormInput
            type="text"
            placeholder="Input address detail.."
            titleText="Street Name"
            value={addressData?.detail}
            onChange={(e) =>
              setAddressData((prev) => ({
                ...prev,
                detail: e.target.value,
              }))
            }
            handleError={V.handleError(
              "name",
              addressData.detail,
              isButtonSaveClicked,
              "Street name"
            )}
          />
          <div className="flex flex-col h-80">
            {addressData?.latitude !== undefined &&
              addressData.longitude !== undefined && (
                <PharmacyMap
                  titleText="Address Pin Point"
                  center={mapPinPoint}
                  zoom={mapZoom}
                  setMapCenter={setMapPinPoint}
                  setMapZoom={setMapZoom}
                  isLocationDetailShown={true}
                />
              )}
          </div>
        </div>

        <div className="flex flex-row self-end gap-2">
          <div>
            <ButtonBorderOnly
              type="button"
              onClick={() => {
                if (isButtonLoading) {
                  return;
                }
                setIsModalShown(false);
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
              //   isDisabled={!V.isPharmacyDataValid(pharmacyData)}
            >
              Save Address
              <div className={`${isButtonLoading ? "invisible" : "block"}`}>
                <MdSave size={20} />
              </div>
            </Button>
          </div>
        </div>
      </Form>
    </Modal>
  );
};

export default ModalAddress;
