"use client";

import { useState } from "react";
import { Search, Download, Filter, Menu, Bell, User } from "lucide-react";
import Link from "next/link";
import { useMobileMenu } from "@/components/MobileMenuContext";
import { useStore } from "@/hooks/useStore";

export default function VendorPurchasesPage() {
  const { setIsMobileMenuOpen } = useMobileMenu();
  const [searchQuery, setSearchQuery] = useState("");
  const { vendorPurchases } = useStore();

  const filteredPurchases = vendorPurchases.filter(p => 
    p.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.vendorName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="font-dm-sans min-h-[calc(100vh-72px)] bg-white flex flex-col w-full max-w-full">
      {/* MOBILE TOP NAVIGATION BAR */}
      <section className="fixed top-0 left-0 right-0 h-14 bg-white border-b border-[#EBEBEB] px-4 flex items-center justify-between z-40 md:hidden">
        <button className="p-2 -ml-2" onClick={() => setIsMobileMenuOpen(true)}>
          <Menu className="w-5 h-5 text-[#171717]" />
        </button>
        <h1 className="text-[16px] font-medium text-[#171717]">Vendor Purchases</h1>
        <div className="flex items-center gap-3">
          <button className="p-2">
            <Bell className="w-5 h-5 text-[#171717]" />
          </button>
          <div className="w-8 h-8 rounded-full bg-[#F5F7FA] flex items-center justify-center">
            <User className="w-4 h-4 text-[#5C5C5C]" />
          </div>
        </div>
      </section>

      {/* MOBILE HEADER SPACER */}
      <div className="h-14 md:hidden"></div>

      {/* DESKTOP HEADER */}
      <section className="bg-white border-b border-[#EBEBEB] hidden md:block">
        <div className="px-6 py-6 flex flex-col">
          <h1 className="text-[20px] font-semibold text-[#171717]">Vendor Purchases</h1>
          <p className="text-[14px] text-[#5C5C5C] mt-1">
            Manage incoming credit and outgoing debit payments for vendors.
          </p>
        </div>
      </section>

      {/* MOBILE PAGE TITLE */}
      <section className="px-4 pt-4 sm:hidden">
        <h1 className="text-[16px] font-medium text-[#171717]">Vendor Purchases</h1>
        <p className="text-[12px] text-[#5C5C5C] mt-1">
          Manage incoming credit and outgoing debit payments for vendors.
        </p>
      </section>

      {/* STATS SECTION */}
      <section className="px-4 md:px-6 py-4 md:py-6">
        <div className="bg-white border border-[#EBEBEB] rounded-[12px] p-4 md:p-6 flex flex-col md:flex-row md:items-center gap-4 md:gap-0">
          <div className="flex-1 flex flex-col gap-1 border-b md:border-b-0 md:border-r border-[#EBEBEB] last:border-0 pb-3 md:pb-0">
            <p className="text-[13px] text-[#5C5C5C]">Total Purchases</p>
            <span className="text-[24px] font-semibold text-[#171717]">{vendorPurchases.length}</span>
          </div>
          <div className="flex-1 flex flex-col gap-1 border-b md:border-b-0 md:border-r border-[#EBEBEB] last:border-0 pb-3 md:pb-0 md:pl-6">
            <p className="text-[13px] text-[#5C5C5C]">Total Value (₹)</p>
            <span className="text-[24px] font-semibold text-[#171717]">
              {vendorPurchases.reduce((acc, curr) => acc + parseFloat(curr.grandTotal || "0"), 0).toLocaleString()}
            </span>
          </div>
          <div className="flex-1 flex flex-col gap-1 border-b md:border-b-0 md:border-r border-[#EBEBEB] last:border-0 pb-3 md:pb-0 md:pl-6">
            <p className="text-[13px] text-[#5C5C5C]">Total Paid (₹)</p>
            <span className="text-[24px] font-semibold text-[#1CB061]">
              {vendorPurchases.reduce((acc, curr) => acc + parseFloat(curr.amountPaid || "0"), 0).toLocaleString()}
            </span>
          </div>
          <div className="flex-1 flex flex-col gap-1 md:pl-6">
            <p className="text-[13px] text-[#5C5C5C]">Outstanding (₹)</p>
            <span className="text-[24px] font-semibold text-[#FB3748]">
              {vendorPurchases.reduce((acc, curr) => acc + (parseFloat(curr.grandTotal || "0") - parseFloat(curr.amountPaid || "0")), 0).toLocaleString()}
            </span>
          </div>
        </div>
      </section>

      <section className="px-4 md:px-6 pb-6 flex-1 flex flex-col">
        {/* TOOLBAR */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div className="relative w-full md:w-[400px]">
            <Search className="w-5 h-5 text-[#A1A1AA] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              placeholder="Search by ID or Vendor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-[44px] w-full pl-10 pr-4 bg-white border border-[#EBEBEB] rounded-[8px] text-[14px] focus:outline-none focus:border-[#00B6E2]"
            />
          </div>

          <div className="flex items-center gap-3">
            <button className="h-[44px] px-4 bg-white border border-[#00B6E2] text-[#00B6E2] rounded-[8px] flex items-center gap-2 text-[14px] font-medium transition-colors hover:bg-[#F0FDFF]">
              <Download className="w-4 h-4" />
              Export
            </button>
            <button className="h-[44px] px-4 bg-[#00B6E2] border border-[#00B6E2] text-white rounded-[8px] flex items-center gap-2 text-[14px] font-medium transition-colors hover:bg-[#00A0E3]">
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white border border-[#EBEBEB] rounded-[12px] overflow-hidden flex-1">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="border-b border-[#EBEBEB] bg-[#F9FAFB]">
                  <th className="px-6 py-4 text-[13px] font-semibold text-[#171717]">UNIQUE ID</th>
                  <th className="px-6 py-4 text-[13px] font-semibold text-[#171717]">Vendor Name</th>
                  <th className="px-6 py-4 text-[13px] font-semibold text-[#171717]">Purchase Date</th>
                  <th className="px-6 py-4 text-[13px] font-semibold text-[#171717]">Direction</th>
                  <th className="px-6 py-4 text-[13px] font-semibold text-[#171717]">Order Amount</th>
                  <th className="px-6 py-4 text-[13px] font-semibold text-[#171717]">Paid Amount</th>
                  <th className="px-6 py-4 text-[13px] font-semibold text-[#171717]">Status</th>
                  <th className="px-6 py-4 text-[13px] font-semibold text-[#171717]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EBEBEB]">
                {filteredPurchases.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-10 text-center text-[#5C5C5C] text-[14px]">
                      No vendor purchases found. Check Accountant dashboard to add some.
                    </td>
                  </tr>
                ) : (
                  filteredPurchases.map((row, idx) => (
                    <tr key={idx} className="hover:bg-[#F9FAFB] transition-colors">
                      <td className="px-6 py-4 text-[14px] font-medium text-[#171717]">{row.id}</td>
                      <td className="px-6 py-4 text-[14px] text-[#5C5C5C]">{row.vendorName}</td>
                      <td className="px-6 py-4 text-[14px] text-[#5C5C5C]">{row.purchaseDate}</td>
                      <td className="px-6 py-4 text-[14px] text-[#5C5C5C]">{row.direction}</td>
                      <td className="px-6 py-4 text-[14px] text-[#5C5C5C]">₹{parseFloat(row.grandTotal || "0").toLocaleString()}</td>
                      <td className="px-6 py-4 text-[14px] text-[#5C5C5C]">₹{parseFloat(row.amountPaid || "0").toLocaleString()}</td>
                      <td className="px-6 py-4">
                        {row.status === "Due" && (
                          <span className="inline-flex px-2.5 py-1 rounded-[12px] bg-[#FFF0F1] text-[#FB3748] text-[12px] font-medium whitespace-nowrap">
                            Due
                          </span>
                        )}
                        {row.status === "Partial Payment" && (
                          <span className="inline-flex px-2.5 py-1 rounded-[12px] bg-[#FFF4ED] text-[#E19242] text-[12px] font-medium whitespace-nowrap">
                            Partial
                          </span>
                        )}
                        {row.status === "Paid" && (
                          <span className="inline-flex px-2.5 py-1 rounded-[12px] bg-[#E8F8F0] text-[#1CB061] text-[12px] font-medium whitespace-nowrap">
                            Paid
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Link
                            href={`/admin/vendor-purchases/${row.id}`}
                            className="text-[13px] font-medium text-[#00B6E2] hover:underline"
                          >
                            View
                          </Link>
                          <Link
                            href={`/admin/vendor-purchases/${row.id}?edit=true`}
                            className="text-[13px] font-medium text-[#5C5C5C] hover:text-[#171717] hover:underline"
                          >
                            Edit
                          </Link>
                          <button className="text-[13px] font-medium text-[#5C5C5C] hover:text-[#171717] hover:underline">
                            Download
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
