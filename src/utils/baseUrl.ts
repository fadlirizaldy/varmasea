export const baseUrl = (url: string) => {
  const isProd = process.env.NODE_ENV === "production";
  if (isProd) {
    return `${process.env.NEXT_PUBLIC_API_URL_PROD}${url}`;
  }
  return `${process.env.NEXT_PUBLIC_API_URL_DEV}${url}`;
};
