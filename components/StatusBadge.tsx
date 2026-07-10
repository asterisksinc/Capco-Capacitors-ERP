import React from "react";

export type StatusBadgeProps = {
  status: string;
};

export function StatusBadge({ status }: StatusBadgeProps) {
  // Red
  if (["Yet to Start", "Cancelled", "Rejected", "Due"].includes(status)) {
    return <span className="inline-flex items-center px-2 py-0.5 rounded-[12px] bg-[#FFF0F1] text-[#FB3748] text-[12px] font-medium leading-tight whitespace-nowrap">{status}</span>;
  }
  // Orange
  if (["In-progress", "Pending", "Partially Issued", "Partial Payment", "Being Used", "Quality Check Pending"].includes(status)) {
    return <span className="inline-flex items-center px-2 py-0.5 rounded-[12px] bg-[#FFF4ED] text-[#E19242] text-[12px] font-medium leading-tight whitespace-nowrap">{status}</span>;
  }
  // Green
  if (["Completed", "Accepted", "Paid", "In Inventory", "Used Completely", "Dispatch Ready"].includes(status)) {
    return <span className="inline-flex items-center px-2 py-0.5 rounded-[12px] bg-[#E8F8F0] text-[#1CB061] text-[12px] font-medium leading-tight whitespace-nowrap">{status}</span>;
  }
  // Blue
  if (["Issued"].includes(status)) {
    return <span className="inline-flex items-center px-2 py-0.5 rounded-[12px] bg-[#E6F8FD] text-[#00B6E2] text-[12px] font-medium leading-tight whitespace-nowrap">{status}</span>;
  }

  // Fallback (Gray)
  return <span className="inline-flex items-center px-2 py-0.5 rounded-[12px] bg-[#F2F4F7] text-[#667085] text-[12px] font-medium leading-tight whitespace-nowrap">{status}</span>;
}
