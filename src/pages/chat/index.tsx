import useAuth from "@/hooks/useAuth";
import React, { useEffect, useState } from "react";
import useChatRooms, { RoomsType } from "@/hooks/CRUD/useChatRooms";
import { GCP_PUBLIC_IMG } from "@/utils/api/apiURL";
import ChatRoom from "@/features/user/Chat/ChatRoom";
import { gcpURL } from "@/utils/gcpURL";

const ChatPage = () => {
  const { userId, role, token } = useAuth();
  const { rooms, getChatRooms } = useChatRooms();
  const [selectedRoom, setSelectedRoom] = useState<RoomsType | null>(null);

  useEffect(() => {
    if (role !== null) {
      getChatRooms(role === "Doctor");
    }
  }, [role]);

  return (
    <div className="max-w-[1200px] w-[90%] mx-auto flex mt-10 border rounded-xl border-slate-400 overflow-hidden min-h-[50vh] h-[80vh]">
      {rooms !== null ? (
        <>
          <div className="w-1/3 bg-slate-100 border-r border-slate-300 overflow-y-scroll">
            <div className="flex items-center gap-3 bg-primary_blue p-3 sticky top-0">
              <img
                src={gcpURL(
                  role === "Doctor"
                    ? rooms[0].doctor_photo
                    : rooms[0].user_photo
                )}
                alt={
                  "Photo of " +
                  (role === "Doctor"
                    ? rooms[0].doctor_name
                    : rooms[0].user_name)
                }
                className="w-10 h-10 text-xs rounded-full object-cover border border-slate-200"
              />
              <h5 className="font-semibold text-white">
                {role === "Doctor" ? rooms[0].doctor_name : rooms[0].user_name}
              </h5>
            </div>

            <div className="flex flex-col divide-y">
              {rooms !== null &&
                rooms?.map((room) => (
                  <div
                    key={room.id}
                    className={`${
                      selectedRoom !== null &&
                      room.id === selectedRoom.id &&
                      "bg-slate-200"
                    } flex items-center gap-3 p-3 hover:bg-slate-200 cursor-pointer`}
                    onClick={() => setSelectedRoom(room)}
                  >
                    <img
                      src={gcpURL(
                        role === "Doctor" ? room.user_photo : room.doctor_photo
                      )}
                      alt={
                        "Photo of " +
                        (role === "Doctor" ? room.user_name : room.doctor_name)
                      }
                      className={`w-10 h-10 text-xs rounded-full object-cover border border-slate-200`}
                    />
                    <h2 className="hidden xs:block">
                      {role === "Doctor" ? room.user_name : room.doctor_name}
                    </h2>
                  </div>
                ))}
            </div>
          </div>
          {selectedRoom !== null ? (
            <ChatRoom
              selectedRoom={selectedRoom}
              getChatRooms={getChatRooms}
              role={role}
              token={token}
              userId={userId}
            />
          ) : (
            <div className="w-3/4 xs:w-2/3 flex flex-col items-center justify-center gap-4">
              <img
                src={`${GCP_PUBLIC_IMG}/choose-chat.jpg`}
                alt="no-data"
                className="w-56 sm:w-96"
              />
              <p className="text-slate-400 font-medium">
                Send and receive messages here
              </p>
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center gap-4 w-full">
          <img
            src={`${GCP_PUBLIC_IMG}/no_data.jpg`}
            alt="no-data"
            className="w-56 sm:w-96"
          />
          <p className="text-slate-400 font-medium">
            Sorry, there&apos;s no chat in here
          </p>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
ChatPage.title = "Chat | Varmasea";
