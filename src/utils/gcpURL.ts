import { GCP_API } from "./api/apiURL";

export const gcpURL = (url: string) => {
  if (url === undefined || typeof url !== "string") {
    return "";
  }
  if (url === "dzzxtxrfd/image/upload/v1702065737/2606517_5856_jmj66c.jpg") {
    //for dev only
    return `https://res.cloudinary.com/${url}`;
  }
  if (url === "") {
    url = "public/user_photo/default.jpg";
  } else if (url.includes("/varmasea/")) {
    url = "/" + url.split("/varmasea/")[1];
  }

  return `${GCP_API}/${url}`;
};
