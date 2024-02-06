import { useEffect } from "react";
import { useFetch } from "../useFetch";
import { baseUrl } from "@/utils/baseUrl";
import { DataLoginType } from "@/pages/auth/login";

type ResponseLoginType = {
  data?: { token: string };
  message?: string;
};

function useLogin() {
  const { data, isLoading, fetchData, error } = useFetch<ResponseLoginType>();

  const login = (dataLogin: DataLoginType) => {
    const url = baseUrl("/auth/login");
    const options: RequestInit = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataLogin),
    };
    fetchData(url, options);
  };

  return { data, isLoading, login };
}

export default useLogin;
