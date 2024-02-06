{
  /* <div className="w-1/2">
<FormSelect
  titleText="Assigned Pharmacies"
  defaultValue={""}
  options={filterPharmacy()}
  value={filterPharmacy()}
  onChange={(e) => {
    if (customPharmacies !== null) {
      setDataUpdateAdmin((prev) => {
        const targetPharmacy = customPharmacies.filter(
          (item) => item.name === e.target.value
        )[0];
        const newPharmacies = [
          ...prev.pharmacies!,
          targetPharmacy,
        ];

        return { ...prev, pharmacies: newPharmacies };
      });
    }
  }}
  errorText={handleErrorMessages("pharmacies")}
  isError={
    dataUpdateAdmin.pharmacies!.length < 1 && isButtonSaveClicked
  }
/>
</div>
<section className="flex flex-col gap-3 w-1/2">
{dataUpdateAdmin?.pharmacies?.map((pharmacy) => (
  <div key={pharmacy.id} className="relative">
    <p className="rounded-lg bg-gray-200 p-2">{pharmacy.name}</p>
    <IoMdClose
      size={25}
      className="absolute right-2 top-2 cursor-pointer"
      onClick={() => {
        setDataUpdateAdmin((prev) => {
          const filteredPharmacy = prev.pharmacies?.filter(
            (item) => item.id !== pharmacy.id
          );
          return { ...prev, pharmacies: filteredPharmacy };
        });
      }}
    />
  </div>
))}
</section> */
}
