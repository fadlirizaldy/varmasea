import { CHAT_ROOMS } from "@/utils/api/apiURL";
import { baseUrl } from "@/utils/baseUrl";
import useAuth from "../useAuth";
import { useFetch } from "../useFetch";

export type RoomsType = {
  id: number;
  doctor_id: number;
  doctor_user_id: number;
  doctor_name: string;
  doctor_photo: string;
  user_id: number;
  user_name: string;
  user_photo: string;
  room_status_id: number;
};

interface IGetData {
  data: {
    rooms: RoomsType[];
    message: string;
  };
}

function useChatRooms() {
  const { token } = useAuth();
  const { data, isLoading, error, fetchData: fetchData } = useFetch<IGetData>();

  const getChatRooms = (isDoctor: boolean) => {
    const url = baseUrl((isDoctor ? "/doctor" : "/user") + CHAT_ROOMS);
    const options: RequestInit = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    fetchData(url, options);
  };

  return {
    rooms: data !== null && data.data.rooms !== null ? (data.data.rooms.length > 0 ? data.data.rooms : null) : null,
    roomsMessage: data !== null && data.data.message !== undefined ? data.data.message : null,
    isLoading,
    error,
    getChatRooms,
  };
}

export default useChatRooms;
