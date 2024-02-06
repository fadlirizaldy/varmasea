import useChatRooms, { RoomsType } from "@/hooks/CRUD/useChatRooms";
import { IUser } from "@/types/api";
import React, { useEffect, useState } from "react";
import { MdKeyboardArrowUp } from "react-icons/md";
import ChatRoom from "./Chat/ChatRoom";
import { GCP_PUBLIC_IMG } from "@/utils/api/apiURL";
import { TRole } from "@/types/role";
import { gcpURL } from "@/utils/gcpURL";

const ChatSection = ({ user, token, role }: { user: IUser; token: string; role: string }) => {
  const [showChat, setShowChat] = useState(false);
  const { rooms, getChatRooms } = useChatRooms();
  const [selectedRoom, setSelectedRoom] = useState<RoomsType | null>(null);

  useEffect(() => {
    if (role !== null) {
      getChatRooms(role === "Doctor");
    }
  }, [role]);

  return (
    <div
      className={`hidden sm:flex flex-col items-end fixed right-8 transition-all ${
        showChat ? "bottom-0" : "-bottom-[500px]"
      } `}
    >
      <div
        className={`${token ? "block" : "hidden"} px-5 ${
          showChat ? "w-full" : "w-[250px]"
        } py-1 flex justify-between items-center bg-slate-100 border border-slate-300 rounded-t-lg cursor-pointer`}
        onClick={() => setShowChat(!showChat)}
      >
        <div className="flex items-center gap-3">
          <img
            src={gcpURL(user?.photo)}
            alt={`Photo of ${user?.name}`}
            className="w-10 h-10 text-xs rounded-full object-cover border border-slate-200"
          />
          <h5 className="font-semibold">Chat</h5>
        </div>
        <div className="p-1 rounded-full hover:bg-slate-200 cursor-pointer">
          <MdKeyboardArrowUp size={25} className={`${showChat ? "rotate-180" : ""}`} />
        </div>
      </div>
      <div className={`${showChat ? "w-[600px]" : "w-[250px]"} h-[500px] border boder-slate-300 bg-white flex`}>
        <div className="flex flex-col divide-y-2 w-1/3 bg-gray-100 overflow-y-scroll">
          {rooms !== null &&
            rooms.map((room) => (
              <div
                key={room.id}
                className={`${
                  selectedRoom !== null && room.id === selectedRoom.id && "bg-slate-200"
                } flex items-center gap-3 p-3 hover:bg-slate-200 cursor-pointer`}
                onClick={() => setSelectedRoom(room)}
              >
                <img
                  src={gcpURL(role === "Doctor" ? room.user_photo : room.doctor_photo)}
                  alt={`Photo of ${role === "Doctor" ? room.user_photo : room.doctor_photo}`}
                  className={`w-10 h-10 text-xs rounded-full object-cover border border-slate-200`}
                />
                <h2>{role === "Doctor" ? room.user_name : room.doctor_name}</h2>
              </div>
            ))}
        </div>

        {selectedRoom !== null ? (
          <ChatRoom
            selectedRoom={selectedRoom}
            getChatRooms={getChatRooms}
            role={role as TRole | null}
            token={token}
            userId={user.id}
          />
        ) : (
          <div className="w-2/3 flex flex-col items-center justify-center gap-4">
            <img src={`${GCP_PUBLIC_IMG}/choose-chat.jpg`} alt="no-data" className="w-56 sm:w-96" />
            <p className="text-slate-400 font-medium">Send and receive messages here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatSection;
