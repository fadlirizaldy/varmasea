import { RoomsType } from "@/hooks/CRUD/useChatRooms";
import useChats, { ChatsType } from "@/hooks/CRUD/useChats";
import { TRole } from "@/types/role";
import { GCP_PUBLIC_IMG } from "@/utils/api/apiURL";
import { dateChatFormat, dateFormat } from "@/utils/formatting/dateFormat";
import { chatTimeFormat } from "@/utils/formatting/timestampFormat";
import { gcpURL } from "@/utils/gcpURL";
import { wsUrl } from "@/utils/wsUrl";
import React, { useEffect, useRef, useState } from "react";
import { FiPaperclip } from "react-icons/fi";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import useWebSocket from "react-use-websocket";
import { toast } from "sonner";

type ChatRoomType = {
  getChatRooms: (isDoctor: boolean) => void;
  role: TRole | null;
  token: string;
  userId: number | null;
  selectedRoom: RoomsType | null;
};

const ChatRoom = (props: ChatRoomType) => {
  const { getChatRooms, role, token, userId, selectedRoom } = props;

  const chatRef = useRef<HTMLDivElement>(null);
  const { chats: dataChatsInitial, getChats } = useChats();
  const [chats, setChats] = useState<ChatsType[] | null>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  // const []= useState("")
  const WS_URL = wsUrl(`/chat/${selectedRoom?.id}?token=${token}`);
  const { sendJsonMessage, sendMessage, lastJsonMessage, readyState } =
    useWebSocket<ChatsType>(WS_URL, {
      share: false,
      shouldReconnect: () => true,
    });

  useEffect(() => {
    if (role !== null && selectedRoom !== null) {
      getChats(selectedRoom.id);
    }
  }, [selectedRoom]);

  useEffect(() => {
    setChats(dataChatsInitial === null ? [] : dataChatsInitial);
  }, [dataChatsInitial]);

  useEffect(() => {
    if (lastJsonMessage !== null) {
      if (lastJsonMessage.is_typing as any) {
        setIsTyping(true);
      } else {
        setIsTyping(false);
        setChats((prev) => prev?.concat(lastJsonMessage as ChatsType)!);
      }
    }
  }, [lastJsonMessage]);

  useEffect(() => {
    if (chats?.length) {
      chatRef.current?.scrollIntoView({ block: "end", behavior: "smooth" });
    }
  }, [chats?.length]);

  const handleSendMessage = () => {
    if (newMessage === "") return;
    sendJsonMessage({
      is_typing: false,
      message: newMessage,
      send_time: new Date().toISOString(),
    });
    setChats(
      (prev) =>
        prev?.concat({
          sender_id: userId,
          message: newMessage,
          send_time: new Date().toISOString(),
        } as ChatsType)!
    );
    setNewMessage("");
  };

  const handleIsTyping = () => {
    if (newMessage === "") {
      // setIsTyping(false);
      return;
    }
    sendJsonMessage({
      is_typing: true,
      message: newMessage,
      send_time: new Date().toISOString(),
    });
    // setChats((prev) => prev?.concat({ sender_id: userId, message: newMessage } as ChatType)!);
    // setNewMessage("");
  };

  return (
    <div className="w-3/4 xs:w-2/3 flex flex-col">
      <div className="flex items-center gap-3 bg-slate-100 p-3">
        <img
          src={gcpURL(
            role === "Doctor"
              ? selectedRoom!.user_photo
              : selectedRoom!.doctor_photo
          )}
          alt={
            "Photo of " +
            (role === "Doctor"
              ? selectedRoom!.user_name
              : selectedRoom!.doctor_name)
          }
          className="w-10 h-10 text-xs rounded-full object-cover border border-slate-200"
        />
        <h5 className="font-semibold">
          {role === "Doctor"
            ? selectedRoom!.user_name
            : selectedRoom!.doctor_name}
        </h5>
      </div>

      <div className="overflow-y-scroll w-full h-full p-2">
        {chats !== null && chats !== undefined ? (
          chats.map((chat, idx) => {
            const todayDate = new Date().toISOString();
            const timeDiffCat = [60000, 120000];
            const timeDiff =
              new Date(todayDate).getTime() -
              new Date(chat.send_time).getTime();
            return (
              <>
                {(idx === 0 ||
                  (idx > 0 &&
                    dateFormat(chats[idx - 1].send_time) !==
                      dateFormat(chat.send_time))) && (
                  <div className="w-full bg-white sticky top-0">
                    <p className=" py-[1px] px-2 rounded-full mx-auto w-fit bg-gray-400 text-white text-sm sticky top-0 ">
                      {dateChatFormat(chat.send_time) ===
                      dateChatFormat(todayDate)
                        ? "Today"
                        : dateChatFormat(chat.send_time)}
                    </p>
                  </div>
                )}
                <div
                  key={idx}
                  className={`chat ${
                    chat.sender_id === userId ? "chat-end " : "chat-start"
                  }`}
                >
                  <div className="chat-image avatar">
                    <div className="w-10 rounded-full">
                      <img
                        src={gcpURL(
                          chat.sender_id === selectedRoom?.doctor_user_id
                            ? selectedRoom!.doctor_photo
                            : selectedRoom!.user_photo
                        )}
                        alt={`Photo of ${
                          chat.sender_id === selectedRoom?.doctor_user_id
                            ? selectedRoom?.doctor_name
                            : selectedRoom?.user_name
                        }`}
                      />
                    </div>
                  </div>
                  <div
                    className={`text-wrap chat-bubble ${
                      chat.sender_id === userId
                        ? "bg-primary_orange  brightness-100 text-primary_blue"
                        : "bg-[#0C718C] text-white "
                    }`}
                  >
                    <p className="">{chat.message}</p>
                  </div>
                  <div className="chat-footer opacity-50">
                    <time className="text-xs">
                      {timeDiff < timeDiffCat[0]
                        ? "Just now"
                        : timeDiff < timeDiffCat[1]
                        ? `Less than ${Math.round(
                            timeDiffCat[1] / 1000 / 60
                          )} minutes ago `
                        : chatTimeFormat(chat.send_time)}
                    </time>
                  </div>
                </div>
              </>
            );
          })
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-4">
            <img
              src={`${GCP_PUBLIC_IMG}/no-chat.png`}
              alt="no-data"
              className="w-36 sm:w-40"
            />
            <p className="text-slate-400 font-medium">
              Send and receive message here
            </p>
          </div>
        )}
        <div ref={chatRef} />
      </div>
      {isTyping && <div>User is typing...</div>}

      <div className="p-3 pl-4 bg-slate-100 w-full flex items-center gap-3">
        <input
          type="text"
          placeholder="Type something..."
          className="p-2 border border-slate-400 rounded-xl w-10/12"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => (e.key === "Enter" ? handleSendMessage() : null)}
          onKeyDownCapture={() => handleIsTyping()}
        />
        <button
          className="p-3 w-10 rounded-full hover:bg-slate-300"
          onClick={() => {
            toast.warning(
              "This feature is still in development, please stay tune!",
              { duration: 1500 }
            );
          }}
        >
          <FiPaperclip />
        </button>
        <button
          className="p-1 text-white rounded-full bg-secondary_blue hover:bg-primary_blue"
          onClick={handleSendMessage}
        >
          <MdOutlineKeyboardArrowRight size={29} />
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;
