import { RoleEnum, TRole } from "@/types/role";
import { getCookie } from "@/utils/cookies";
import { parseJwt } from "@/utils/parseJwt";
import { useEffect, useState } from "react";

export interface IParsedJWT {
  Email: string;
  Role: TRole;
  UserID: number;
}

const useAuth = () => {
  const [token, setToken] = useState("");
  const [role, setRole] = useState<TRole | null>(null);
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    setToken(getCookie("token"));
    // setRole(RoleEnum[Number(getCookie("role"))] as TRole); //temporary
  }, []);

  useEffect(() => {
    if (token !== "") {
      const parsedJWT: IParsedJWT = parseJwt(token);
      setRole(parsedJWT.Role);
      setUserId(parsedJWT.UserID);
    }
  }, [token]);

  return { token, role, userId };
};

export default useAuth;
