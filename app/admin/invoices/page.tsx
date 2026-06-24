"use client";
import { MobileHeader } from "@/components/MobileHeader";

import { useState } from "react";
import { Search, Download, ChevronDown, Menu, Bell, User as UserIcon } from "lucide-react";
import { useMobileMenu } from "@/components/MobileMenuContext";

export default function InvoicesPage() {
  const { setIsMobileMenuOpen } = useMobileMenu();
  const [searchQuery, setSearchQuery] = useState("");

  const data = [
    { invoice: "#INV-88291", customer: "Jerome Bell", email: "eaxmple@gmail.com", mobile: "(303) 555-0105", vendor: "Lorem ipsum", channel: "Online Store", date: "Oct 14, 2026", amount: "₹1,240.00", channelColor: "text-[#2563EB]", channelBg: "bg-[#EFF6FF]" },
    { invoice: "#INV-88292", customer: "Darrell Steward", email: "eaxmple@gmail.com", mobile: "(208) 555-0112", vendor: "Lorem ipsum", channel: "Direct Sales", date: "Nov 02, 2024", amount: "₹1,240.00", channelColor: "text-[#D97706]", channelBg: "bg-[#FEF3C7]" },
    { invoice: "#INV-88293", customer: "Ralph Edwards", email: "eaxmple@gmail.com", mobile: "(406) 555-0120", vendor: "Lorem ipsum", channel: "In-Store", date: "Aug 20, 2023", amount: "₹1,240.00", channelColor: "text-[#059669]", channelBg: "bg-[#D1FAE5]" },
    { invoice: "#INV-88294", customer: "Jenny Wilson", email: "eaxmple@gmail.com", mobile: "(229) 555-0109", vendor: "Lorem ipsum", channel: "Online Store", date: "Dec 12, 2026", amount: "₹1,240.00", channelColor: "text-[#2563EB]", channelBg: "bg-[#EFF6FF]" },
    { invoice: "#INV-88295", customer: "Savannah Nguyen", email: "eaxmple@gmail.com", mobile: "(302) 555-0107", vendor: "Lorem ipsum", channel: "In-Store", date: "Jan 15, 2027", amount: "₹1,240.00", channelColor: "text-[#059669]", channelBg: "bg-[#D1FAE5]" },
    { invoice: "#INV-88296", customer: "Ronald Richards", email: "eaxmple@gmail.com", mobile: "(316) 555-0116", vendor: "Lorem ipsum", channel: "Online Store", date: "Nov 28, 2024", amount: "₹1,240.00", channelColor: "text-[#2563EB]", channelBg: "bg-[#EFF6FF]" },
    { invoice: "#INV-88297", customer: "Ronald Richards", email: "eaxmple@gmail.com", mobile: "(201) 555-0124", vendor: "Lorem ipsum", channel: "In-Store", date: "Nov 28, 2024", amount: "₹1,240.00", channelColor: "text-[#059669]", channelBg: "bg-[#D1FAE5]" },
    { invoice: "#INV-88298", customer: "Ronald Richards", email: "eaxmple@gmail.com", mobile: "(205) 555-0100", vendor: "Lorem ipsum", channel: "Direct Sales", date: "Nov 28, 2024", amount: "₹1,240.00", channelColor: "text-[#D97706]", channelBg: "bg-[#FEF3C7]" },
  ];

  return (
    <div className="font-dm-sans min-h-[calc(100vh-72px)] bg-white flex flex-col w-full max-w-full relative">
      {/* MOBILE TOP NAVIGATION BAR */}
      <MobileHeader title="Invoices" />

      {/* MOBILE HEADER SPACER */}
      <div className="h-14 md:hidden"></div>

      {/* DESKTOP HEADER */}
      <section className="bg-white border-b border-[#EBEBEB] hidden md:block">
        <div className="px-6 py-6 flex flex-col">
          <h1 className="text-[20px] font-semibold text-[#171717]">Invoices</h1>
          <p className="text-[14px] text-[#5C5C5C] mt-1">
            Manage and track all customer purchase documentation for warranty verification.
          </p>
        </div>
      </section>

      {/* MOBILE PAGE TITLE */}
      <section className="px-4 pt-4 sm:hidden">
        <h1 className="text-[16px] font-medium text-[#171717]">Invoices</h1>
        <p className="text-[12px] text-[#5C5C5C] mt-1">
          Manage and track all customer purchase documentation.
        </p>
      </section>

      {/* STATS SECTION */}
      <section className="px-4 md:px-6 py-4 md:py-6">
        <div className="bg-white border border-[#EBEBEB] rounded-[12px] p-4 md:p-6 flex flex-col md:flex-row md:items-center gap-4 md:gap-0">
          {[
            { label: "Lorem ipsum dolor", value: "Lorem ipsum" },
            { label: "Lorem ipsum dolor", value: "Lorem ipsum" },
            { label: "Lorem ipsum dolor", value: "Lorem ipsum" },
            { label: "Lorem ipsum dolor", value: "Lorem ipsum" },
          ].map((item, i) => (
            <div key={i} className="flex-1 flex flex-row md:flex-col justify-between md:justify-start items-center md:items-start border-b md:border-b-0 md:border-r border-[#EBEBEB] last:border-0 pb-3 md:pb-0 md:pl-6 first:pl-0">
              <div className="flex flex-col gap-1">
                <p className="text-[13px] text-[#5C5C5C]">{item.label}</p>
                <span className="text-[16px] font-semibold text-[#171717]">{item.value}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 md:px-6 pb-6 flex-1 flex flex-col">
        {/* TOOLBAR */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div className="relative w-full md:w-[400px]">
            <Search className="w-5 h-5 text-[#A1A1AA] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-[44px] w-full pl-10 pr-4 bg-white border border-[#EBEBEB] rounded-[8px] text-[14px] focus:outline-none focus:border-[#00B6E2]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative w-[150px] hidden md:block">
              <select className="h-[44px] w-full appearance-none bg-white border border-[#EBEBEB] rounded-[8px] px-4 pr-10 text-[14px] text-[#171717] focus:outline-none focus:border-[#00B6E2]">
                <option value="all">All Channel</option>
              </select>
              <ChevronDown className="w-4 h-4 text-[#5C5C5C] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            
            <button className="h-[44px] px-4 bg-[#00B6E2] border border-[#00B6E2] text-white rounded-[8px] flex items-center gap-2 text-[14px] font-medium transition-colors hover:bg-[#00A0E3]">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white border border-[#EBEBEB] rounded-[12px] overflow-hidden flex-1">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1100px]">
              <thead>
                <tr className="border-b border-[#EBEBEB] bg-[#F9FAFB]">
                  <th className="px-6 py-4 text-[13px] font-semibold text-[#171717]"># Invoice</th>
                  <th className="px-6 py-4 text-[13px] font-semibold text-[#171717]">Customer Name</th>
                  <th className="px-6 py-4 text-[13px] font-semibold text-[#171717]">Email Address</th>
                  <th className="px-6 py-4 text-[13px] font-semibold text-[#171717]">Mobile Number</th>
                  <th className="px-6 py-4 text-[13px] font-semibold text-[#171717]">Vendor Name</th>
                  <th className="px-6 py-4 text-[13px] font-semibold text-[#171717]">Channel</th>
                  <th className="px-6 py-4 text-[13px] font-semibold text-[#171717]">Date</th>
                  <th className="px-6 py-4 text-[13px] font-semibold text-[#171717]">Amount</th>
                  <th className="px-6 py-4 text-[13px] font-semibold text-[#171717]">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EBEBEB]">
                {data.map((row, idx) => (
                  <tr key={idx} className="hover:bg-[#F9FAFB] transition-colors">
                    <td className="px-6 py-4 text-[14px] text-[#5C5C5C]">{row.invoice}</td>
                    <td className="px-6 py-4 text-[14px] text-[#5C5C5C]">{row.customer}</td>
                    <td className="px-6 py-4 text-[14px] text-[#5C5C5C]">{row.email}</td>
                    <td className="px-6 py-4 text-[14px] text-[#5C5C5C]">{row.mobile}</td>
                    <td className="px-6 py-4 text-[14px] text-[#5C5C5C]">{row.vendor}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-[12px] text-[12px] font-medium whitespace-nowrap ${row.channelBg} ${row.channelColor}`}>
                        {row.channel}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[14px] text-[#5C5C5C]">{row.date}</td>
                    <td className="px-6 py-4 text-[14px] text-[#5C5C5C]">{row.amount}</td>
                    <td className="px-6 py-4">
                      <button className="text-[#5C5C5C] hover:text-[#171717] transition-colors">
                        <Download className="w-[18px] h-[18px]" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
