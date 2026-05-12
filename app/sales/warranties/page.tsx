"use client";

import { Search, Download, ChevronDown } from "lucide-react";

function StatusBadge({ status }: { status: string }) {
  let bg = "bg-[#F5F7FA]";
  let text = "text-[#5C5C5C]";

  if (status === "Active") {
    bg = "bg-[#E8F8F0]";
    text = "text-[#1CB061]";
  } else if (status === "Expiring Soon") {
    bg = "bg-[#FEF9C3]";
    text = "text-[#CA8A04]";
  } else if (status === "Expired") {
    bg = "bg-[#FFF0F1]";
    text = "text-[#FB3748]";
  }

  return (
    <span className={`px-3 py-1 rounded-full text-[12px] font-medium ${bg} ${text}`}>
      {status}
    </span>
  );
}

export default function RegisteredWarrantiesPage() {
  const warranties = [
    { id: "#WAR-882910", customer: "Jerome Bell", product: "Lorem ipsum dolor", serial: "SN-2023-A991", period: "36 Months", expiry: "Oct 14, 2026", status: "Active" },
    { id: "#WAR-882944", customer: "Darrell Steward", product: "Lorem ipsum dolor", serial: "SN-2021-2002", period: "24 Months", expiry: "Nov 02, 2024", status: "Expiring Soon" },
    { id: "#WAR-881005", customer: "Ralph Edwards", product: "Lorem ipsum dolor", serial: "SN-2019-V332", period: "12 Months", expiry: "Aug 20, 2023", status: "Expired" },
    { id: "#WAR-883012", customer: "Jenny Wilson", product: "Lorem ipsum dolor", serial: "SN-2023-4998", period: "36 Months", expiry: "Dec 12, 2026", status: "Active" },
    { id: "#WAR-883045", customer: "Savannah Nguyen", product: "Lorem ipsum dolor", serial: "SN-2022-P014", period: "48 Months", expiry: "Jan 15, 2027", status: "Active" },
    { id: "#WAR-883099", customer: "Ronald Richards", product: "Lorem ipsum dolor", serial: "SN-2021-2055", period: "24 Months", expiry: "Nov 28, 2024", status: "Expiring Soon" },
  ];

  return (
    <div className="flex flex-col gap-8 w-full max-w-[1400px]">
      <div className="flex flex-col gap-1">
        <h1 className="text-[20px] font-semibold text-[#171717] leading-tight">Registered Warranties</h1>
        <p className="text-[14px] text-[#5C5C5C] leading-tight">Lorem ipsum dolor sit amet, consectetur adipiscing elit</p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-[400px]">
          <Search className="w-5 h-5 text-[#A1A1AA] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-10 pr-4 py-2 h-[44px] border border-[#EBEBEB] rounded-[8px] text-[14px] focus:outline-none focus:border-[#00B6E2] shadow-sm"
          />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-[160px]">
            <select className="w-full appearance-none px-4 py-2 h-[44px] border border-[#EBEBEB] rounded-[8px] text-[14px] text-[#171717] bg-white shadow-sm focus:outline-none focus:border-[#00B6E2]">
              <option>All Statuses</option>
              <option>Active</option>
              <option>Expiring Soon</option>
              <option>Expired</option>
            </select>
            <ChevronDown className="w-4 h-4 text-[#5C5C5C] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 h-[44px] px-6 bg-[#00B6E2] text-white rounded-[8px] font-medium text-[14px] hover:bg-[#0092b5] transition-colors shadow-sm">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      <div className="bg-white border border-[#EBEBEB] rounded-[12px] shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-[#F9FAFB] border-b border-[#EBEBEB]">
                <th className="px-6 py-4 text-[14px] font-semibold text-[#171717]">Warranty ID</th>
                <th className="px-6 py-4 text-[14px] font-semibold text-[#171717]">Customer Name</th>
                <th className="px-6 py-4 text-[14px] font-semibold text-[#171717]">Product</th>
                <th className="px-6 py-4 text-[14px] font-semibold text-[#171717]">Serial Number</th>
                <th className="px-6 py-4 text-[14px] font-semibold text-[#171717]">Warranty Period</th>
                <th className="px-6 py-4 text-[14px] font-semibold text-[#171717]">Expiry Date</th>
                <th className="px-6 py-4 text-[14px] font-semibold text-[#171717]">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EBEBEB]">
              {warranties.map((war, i) => (
                <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-5 text-[14px] text-[#5C5C5C]">{war.id}</td>
                  <td className="px-6 py-5 text-[14px] text-[#5C5C5C]">{war.customer}</td>
                  <td className="px-6 py-5 text-[14px] text-[#5C5C5C]">{war.product}</td>
                  <td className="px-6 py-5 text-[14px] text-[#5C5C5C]">{war.serial}</td>
                  <td className="px-6 py-5 text-[14px] text-[#5C5C5C]">{war.period}</td>
                  <td className="px-6 py-5 text-[14px] text-[#5C5C5C]">{war.expiry}</td>
                  <td className="px-6 py-5">
                    <StatusBadge status={war.status} />
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
