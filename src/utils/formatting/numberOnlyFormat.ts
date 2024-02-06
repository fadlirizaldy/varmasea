export const numberOnlyFormat = (num: string) => {
  return Number(num.replace(/[^\d]/g, ""));
};
