import React from "react";

const StatusBadge = ({ status, scale }: { status: string; scale?: string }) => {
  const statusColorMap = {
    "Waiting for Payment": "bg-[#f8f8f8]",
    "Waiting for Confirmation": "bg-[#FEC33B]",
    Processed: "bg-[#FEC33B]",
    Sent: "bg-[#024768] text-white",
    "Order Confirmed": "bg-[#1DC009] text-white",
    canceled: "bg-[#5B595A] text-white",
    accepted: "bg-[#1DC009] text-white",
    pending: "bg-[#FEC33B]",
    rejected: "bg-primary_red text-white",
    active: "bg-[#1DC009] text-white",
    inactive: "bg-[#5B595A] text-white",

    "Waiting Approval": "bg-[#FEC33B]",
    Rejected: "bg-primary_red text-white",
    Approved: "bg-[#1DC009] text-white",
  };
  const color = statusColorMap[status as keyof typeof statusColorMap];

  return (
    <div className={`badge badge-lg ${scale ? scale : ""} ${color} capitalize`}>
      {status}
    </div>
  );
};

export default StatusBadge;
