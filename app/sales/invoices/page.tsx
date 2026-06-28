"use client";

import { Search, Download, ChevronDown } from "lucide-react";
import { MobileHeader } from "@/components/MobileHeader";
import { exportToExcel } from "@/lib/exportExcel";

function ChannelBadge({ channel }: { channel: string }) {
  let bg = "bg-[#F5F7FA]";
  let text = "text-[#5C5C5C]";

  if (channel === "Online Store") {
    bg = "bg-[#F0F9FF]";
    text = "text-[#0061FF]";
  } else if (channel === "Direct Sales") {
    bg = "bg-[#FEF9C3]";
    text = "text-[#CA8A04]";
  } else if (channel === "In-Store") {
    bg = "bg-[#E8F8F0]";
    text = "text-[#1CB061]";
  }

  return (
    <span className={`px-3 py-1 rounded-full text-[12px] font-medium ${bg} ${text}`}>
      {channel}
    </span>
  );
}

export default function InvoicesPage() {
  const invoices = [
    { id: "#INV-88291", customer: "Jerome Bell", email: "example@gmail.com", phone: "(303) 555-0105", vendor: "Lorem ipsum dolor", channel: "Online Store", date: "Oct 14, 2026", amount: "₹1,240.00" },
    { id: "#INV-88292", customer: "Darrell Steward", email: "example@gmail.com", phone: "(208) 555-0112", vendor: "Lorem ipsum dolor", channel: "Direct Sales", date: "Nov 02, 2024", amount: "₹1,240.00" },
    { id: "#INV-88293", customer: "Ralph Edwards", email: "example@gmail.com", phone: "(406) 555-0120", vendor: "Lorem ipsum dolor", channel: "In-Store", date: "Aug 20, 2023", amount: "₹1,240.00" },
    { id: "#INV-88294", customer: "Jenny Wilson", email: "example@gmail.com", phone: "(229) 555-0109", vendor: "Lorem ipsum dolor", channel: "Online Store", date: "Dec 12, 2026", amount: "₹1,240.00" },
    { id: "#INV-88295", customer: "Savannah Nguyen", email: "example@gmail.com", phone: "(302) 555-0107", vendor: "Lorem ipsum dolor", channel: "In-Store", date: "Jan 15, 2027", amount: "₹1,240.00" },
    { id: "#INV-88296", customer: "Ronald Richards", email: "example@gmail.com", phone: "(316) 555-0116", vendor: "Lorem ipsum dolor", channel: "Online Store", date: "Nov 28, 2024", amount: "₹1,240.00" },
    { id: "#INV-88297", customer: "Ronald Richards", email: "example@gmail.com", phone: "(201) 555-0124", vendor: "Lorem ipsum dolor", channel: "In-Store", date: "Nov 28, 2024", amount: "₹1,240.00" },
    { id: "#INV-88298", customer: "Ronald Richards", email: "example@gmail.com", phone: "(205) 555-0100", vendor: "Lorem ipsum dolor", channel: "Direct Sales", date: "Nov 28, 2024", amount: "₹1,240.00" },
  ];

  return (
    <div className="flex flex-col gap-8 w-full max-w-[1400px]">
      <MobileHeader title="Invoices / CRM" />
      <div className="h-14 md:hidden"></div>
      <div className="flex flex-col gap-1">
        <h1 className="text-[20px] font-semibold text-[#171717] leading-tight">Invoices / CRM</h1>
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
              <option>All Channel</option>
              <option>Online Store</option>
              <option>Direct Sales</option>
              <option>In-Store</option>
            </select>
            <ChevronDown className="w-4 h-4 text-[#5C5C5C] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
          <button onClick={() => {
            const exportData = invoices.map((row: any) => ({
              "# Invoice": row.id ?? "",
              "Customer Name": row.customer ?? "",
              "Email Address": row.email ?? "",
              "Mobile Number": row.phone ?? "",
              "Vendor Name": row.vendor ?? "",
              "Channel": row.channel ?? "",
              "Date": row.date ?? "",
              "Amount": row.amount ?? "",
            }));
            exportToExcel(exportData, "invoices", "Invoices");
          }} className="flex-1 sm:flex-none flex items-center justify-center gap-2 h-[44px] px-6 bg-[#00B6E2] text-white rounded-[8px] font-medium text-[14px] hover:bg-[#0092b5] transition-colors shadow-sm">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      <div className="bg-white border border-[#EBEBEB] rounded-[12px] shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1200px]">
            <thead>
              <tr className="bg-[#F9FAFB] border-b border-[#EBEBEB]">
                <th className="px-6 py-4 text-[14px] font-semibold text-[#171717]"># Invoice</th>
                <th className="px-6 py-4 text-[14px] font-semibold text-[#171717]">Customer Name</th>
                <th className="px-6 py-4 text-[14px] font-semibold text-[#171717]">Email Address</th>
                <th className="px-6 py-4 text-[14px] font-semibold text-[#171717]">Mobile Number</th>
                <th className="px-6 py-4 text-[14px] font-semibold text-[#171717]">Vendor Name</th>
                <th className="px-6 py-4 text-[14px] font-semibold text-[#171717]">Channel</th>
                <th className="px-6 py-4 text-[14px] font-semibold text-[#171717]">Date</th>
                <th className="px-6 py-4 text-[14px] font-semibold text-[#171717]">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EBEBEB]">
              {invoices.map((inv, i) => (
                <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-5 text-[14px] text-[#5C5C5C]">{inv.id}</td>
                  <td className="px-6 py-5 text-[14px] text-[#5C5C5C]">{inv.customer}</td>
                  <td className="px-6 py-5 text-[14px] text-[#5C5C5C]">{inv.email}</td>
                  <td className="px-6 py-5 text-[14px] text-[#5C5C5C]">{inv.phone}</td>
                  <td className="px-6 py-5 text-[14px] text-[#5C5C5C]">{inv.vendor}</td>
                  <td className="px-6 py-5">
                    <ChannelBadge channel={inv.channel} />
                  </td>
                  <td className="px-6 py-5 text-[14px] text-[#5C5C5C]">{inv.date}</td>
                  <td className="px-6 py-5 text-[14px] text-[#5C5C5C]">{inv.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
