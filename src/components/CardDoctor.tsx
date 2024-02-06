import useAuth from "@/hooks/useAuth";
import { IDoctor } from "@/types/api";
import { availableRoles } from "@/types/role";
import { baseUrl } from "@/utils/baseUrl";
import { gcpURL } from "@/utils/gcpURL";
import { useRouter } from "next/router";
import { MouseEvent } from "react";
import { IoIosChatbubbles } from "react-icons/io";
import { toast } from "sonner";

interface DoctorCardPropsType extends IDoctor {
  handle?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  withMinWidth?: boolean;
  isMasked?: boolean;
}

const CardDoctor = (props: DoctorCardPropsType) => {
  const router = useRouter();
  const { token, role } = useAuth();

  const handleChatDoctor = async (
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => {
    e.stopPropagation();

    if (token === null || role !== "User") {
      toast.error("Please login or use another account to chat", {
        position: "top-center",
        duration: 3000,
      });
      return;
    }

    const url = baseUrl(`/user/telemedicines`);
    const options: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ doctor_id: props.id }),
    };
    const response = await fetch(url, options);
    const dataResponse = await response.json();
    if (dataResponse.message) {
      toast.error("Cant be able to chat this doctor", {
        duration: 3000,
        position: "top-center",
      });
      return;
    }

    toast.success(`Success create room chat with ${dataResponse.doctor_name}`, {
      duration: 3000,
      position: "top-center",
    });
    return router.push("/chat");
  };

  return (
    <div className="relative group">
      <div
        key={props.id}
        className={`rounded-xl border border-slate-200 shadow-md pb-3 cursor-pointer group-hover:shadow-lg h-96 ${
          props.withMinWidth ? "min-w-52" : ""
        } ${props.isMasked ? "bg-white/50 blur-[2px] contrast-75" : ""}`}
        onClick={() => {
          if (props.isMasked) {
            router.push("/doctors");
            return;
          }
          router.push(`/doctors/detail/${props.id}`);
        }}
      >
        <img
          src={gcpURL(props.photo as string)}
          alt={`Photo of ${props.name}`}
          className="w-full rounded-t-xl h-3/4 object-cover"
        />
        <div className="pl-5 pr-4 pt-2 border-t border-slate-200">
          <h2 className="text-lg font-medium truncate">{props.name}</h2>
          <p className="text-gray-400 truncate">
            {props.specialization ?? "-"}
          </p>
          <div className={`flex justify-end text-white`}>
            <button
              className="w-fit border flex items-center border-slate-300 py-1 px-3 rounded-md bg-secondary_blue hover:bg-primary_blue"
              onClick={(e) => handleChatDoctor(e)}
            >
              <IoIosChatbubbles /> Chat
            </button>
          </div>
        </div>
      </div>
      {props.isMasked && (
        <p
          className="absolute top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2 capitalize bg-primary_blue text-white px-2 py-1 w-28 text-center rounded-full cursor-pointer text-xl border-2 border-white"
          onClick={() => {
            if (props.isMasked) {
              router.push("/doctors");
              return;
            }
          }}
        >
          See more
        </p>
      )}
    </div>
  );
};

export default CardDoctor;
