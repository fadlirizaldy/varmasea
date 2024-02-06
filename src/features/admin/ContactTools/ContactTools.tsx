import { WHATSAPP_API_URL } from "@/utils/api/apiURL";
import Link from "next/link";
import React from "react";
import { FaWhatsapp } from "react-icons/fa";
import { MdOutlineMail } from "react-icons/md";

const ContactTools = ({
  phoneNumber,
  email,
}: {
  phoneNumber: string;
  email?: string;
}) => {
  return (
    <div className={`flex flex-row gap-2`}>
      <Link href={`${WHATSAPP_API_URL}/${phoneNumber}`} target="_blank">
        <FaWhatsapp size={20} />
      </Link>
      {email && (
        <Link href={`mailto:${email}`}>
          <MdOutlineMail size={20} />
        </Link>
      )}
    </div>
  );
};

export default ContactTools;
