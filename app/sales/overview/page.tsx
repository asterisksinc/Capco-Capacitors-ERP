"use client";

import { MobileHeader } from "@/components/MobileHeader";

function StatusBadge({ status }: { status: string }) {
  let bg = "bg-[#F5F7FA]";
  let text = "text-[#5C5C5C]";

  if (status === "Under Review") {
    bg = "bg-[#F0F9FF]";
    text = "text-[#0061FF]";
  } else if (status === "Active") {
    bg = "bg-[#E8F8F0]";
    text = "text-[#1CB061]";
  } else if (status === "Rejected") {
    bg = "bg-[#FFF0F1]";
    text = "text-[#FB3748]";
  } else if (status === "Action Required") {
    bg = "bg-[#FEF9C3]";
    text = "text-[#CA8A04]";
  }

  return (
    <span className={`px-3 py-1 rounded-full text-[12px] font-medium ${bg} ${text}`}>
      {status}
    </span>
  );
}

export default function SalesOverviewPage() {
  const stats = [
    { title: "Total Registered", value: "24,592", change: "5% vs Last Month", isPositive: true },
    { title: "Active Warranties", value: "18,201", change: "+0.2% vs Last Month", isPositive: true },
    { title: "Expired Warranties", value: "6,391", change: "+0.2% vs Last Month", isPositive: true },
    { title: "Total Claims", value: "1,204", change: "+0.2% vs Last Month", isPositive: true },
    { title: "Under Review", value: "158", change: "+0.2% vs Last Month", isPositive: true },
    { title: "Claims Resolved", value: "942", change: "+0.2% vs Last Month", isPositive: true },
  ];

  const workOrders = [
    { date: "10/01/2025", customer: "Jerome Bell", action: "Filed Claim", product: "Lorem ipsum dolor", status: "Under Review" },
    { date: "10/01/2025", customer: "Darrell Steward", action: "Registered", product: "Lorem ipsum dolor", status: "Active" },
    { date: "10/01/2025", customer: "Ralph Edwards", action: "Registered", product: "Lorem ipsum dolor", status: "Rejected" },
    { date: "10/01/2025", customer: "Jenny Wilson", action: "Registered", product: "Lorem ipsum dolor", status: "Active" },
    { date: "10/01/2025", customer: "Savannah Nguyen", action: "Registered", product: "Lorem ipsum dolor", status: "Action Required" },
    { date: "10/01/2025", customer: "Ronald Richards", action: "Filed Claim", product: "Lorem ipsum dolor", status: "Rejected" },
    { date: "10/01/2025", customer: "Guy Hawkins", action: "Filed Claim", product: "Lorem ipsum dolor", status: "Active" },
    { date: "10/01/2025", customer: "Leslie Alexander", action: "Registered", product: "Lorem ipsum dolor", status: "Under Review" },
  ];

  return (
    <div className="flex flex-col gap-8 w-full max-w-[1400px]">
      <MobileHeader title="Overview" />
      <div className="h-14 md:hidden"></div>
      <div className="flex flex-col gap-1">
        <h1 className="text-[20px] font-semibold text-[#171717] leading-tight">Overview</h1>
        <p className="text-[14px] text-[#5C5C5C] leading-tight">Lorem ipsum dolor sit amet, consectetur adipiscing elit</p>
      </div>

      <div className="bg-white border border-[#EBEBEB] rounded-[12px] p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-6 divide-x divide-[#EBEBEB]">
          {stats.map((stat, i) => (
            <div key={i} className={`flex flex-col gap-2 ${i !== 0 ? 'pl-6' : ''}`}>
              <span className="text-[13px] text-[#5C5C5C]">{stat.title}</span>
              <span className="text-[24px] font-bold text-[#171717] leading-none">{stat.value}</span>
              <span className={`text-[12px] font-medium ${stat.isPositive ? 'text-[#1CB061]' : 'text-[#FB3748]'}`}>
                {stat.change}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white border border-[#EBEBEB] rounded-[12px] shadow-sm flex flex-col">
        <div className="px-6 py-5 border-b border-[#EBEBEB]">
          <h2 className="text-[18px] font-semibold text-[#171717]">Work Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F9FAFB] border-b border-[#EBEBEB]">
                <th className="px-6 py-4 text-[14px] font-semibold text-[#171717]">Date</th>
                <th className="px-6 py-4 text-[14px] font-semibold text-[#171717]">Customer Name</th>
                <th className="px-6 py-4 text-[14px] font-semibold text-[#171717]">Action</th>
                <th className="px-6 py-4 text-[14px] font-semibold text-[#171717]">Product</th>
                <th className="px-6 py-4 text-[14px] font-semibold text-[#171717]">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EBEBEB]">
              {workOrders.map((order, i) => (
                <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-5 text-[14px] text-[#5C5C5C]">{order.date}</td>
                  <td className="px-6 py-5 text-[14px] text-[#5C5C5C]">{order.customer}</td>
                  <td className="px-6 py-5 text-[14px] text-[#5C5C5C]">{order.action}</td>
                  <td className="px-6 py-5 text-[14px] text-[#5C5C5C]">{order.product}</td>
                  <td className="px-6 py-5">
                    <StatusBadge status={order.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
