import { CHAT_ROOMS } from "@/utils/api/apiURL";
import { baseUrl } from "@/utils/baseUrl";
import useAuth from "../useAuth";
import { useFetch } from "../useFetch";

export type ChatsType = {
  id: number;
  sender_id: number;
  sender_name: string;
  send_time: string;
  sender_photo: string;
  message: string;
  is_typing?: boolean;
};

interface IGetData {
  data: {
    chats: ChatsType[];
    message: string;
  };
}

function useChats() {
  const { token } = useAuth();
  const { data, isLoading, error, fetchData: fetchData } = useFetch<IGetData>();

  const getChats = (idRoom: number) => {
    const url = baseUrl(CHAT_ROOMS + "/" + idRoom);
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
    chats: data !== null && data.data.chats !== null ? (data.data.chats.length > 0 ? data.data.chats : null) : null,
    chatsMessage: data !== null && data.data.message !== undefined ? data.data.message : null,
    isLoading,
    error,
    getChats,
  };
}

export default useChats;
