const IDRFormat = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  minimumFractionDigits: 0,
});

export function currencyFormat(value: number) {
  return IDRFormat.format(value);
}
