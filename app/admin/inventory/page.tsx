"use client";

import { useState } from "react";
import { Search, Download, Plus, ChevronDown, Menu, Bell, User, Edit2, Trash2, X, FileText } from "lucide-react";
import { useMobileMenu } from "@/components/MobileMenuContext";

export default function InventoryPage() {
  const { setIsMobileMenuOpen } = useMobileMenu();
  const [searchQuery, setSearchQuery] = useState("");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const data = [
    { id: "MTL-4092-A", name: "Aluminum Alloy 6061", desc: "T6 Temper / Structural", category: "Metals", stock: "4,200", unit: "kg", supplier: "Hydro Extrusions Ltd.", status: "In Stock", date: "19/03/2026:01:55:26" },
    { id: "MTL-8821-C", name: "Polyamide 66 (Nylon)", desc: "Heat Stabilized / Pellets", category: "Polymers", stock: "80", unit: "kg", supplier: "DuPont Performance", status: "Low Stock", date: "19/03/2026:01:55:26" },
    { id: "MTL-1029-E", name: "Micro-controller IC X9", desc: "ARM Cortex-M4 / 32-bit", category: "Electronics", stock: "0", unit: "units", supplier: "Silico Supply Corp", status: "Out of Stock", date: "19/03/2026:01:55:26" },
    { id: "MTL-5540-B", name: "Industrial Adhesive Z-9", desc: "Fast-Cure Cyanoacrylate", category: "Chemicals", stock: "840", unit: "L", supplier: "3M Industrial", status: "In Stock", date: "19/03/2026:01:55:26" },
  ];

  return (
    <div className="font-dm-sans min-h-[calc(100vh-72px)] bg-white flex flex-col w-full max-w-full relative">
      {/* MOBILE TOP NAVIGATION BAR */}
      <section className="fixed top-0 left-0 right-0 h-14 bg-white border-b border-[#EBEBEB] px-4 flex items-center justify-between z-40 md:hidden">
        <button className="p-2 -ml-2" onClick={() => setIsMobileMenuOpen(true)}>
          <Menu className="w-5 h-5 text-[#171717]" />
        </button>
        <h1 className="text-[16px] font-medium text-[#171717]">Inventory</h1>
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
          <h1 className="text-[20px] font-semibold text-[#171717]">Raw Materials Inventory</h1>
          <p className="text-[14px] text-[#5C5C5C] mt-1">
            Manage and track your global production inputs and stock levels.
          </p>
        </div>
      </section>

      {/* MOBILE PAGE TITLE */}
      <section className="px-4 pt-4 sm:hidden">
        <h1 className="text-[16px] font-medium text-[#171717]">Raw Materials Inventory</h1>
        <p className="text-[12px] text-[#5C5C5C] mt-1">
          Manage and track your global production inputs and stock levels.
        </p>
      </section>

      {/* STATS SECTION */}
      <section className="px-4 md:px-6 py-4 md:py-6">
        <div className="bg-white border border-[#EBEBEB] rounded-[12px] p-4 md:p-6 flex flex-col md:flex-row md:items-center gap-4 md:gap-0">
          {[
            { label: "Total Materials", value: "1,284", subtext: "5% vs Last Month", subColor: "text-[#1CB061]" },
            { label: "Low Stock Alerts", value: "12", subtext: "Reorder required", subColor: "text-[#5C5C5C]" },
            { label: "Out of Stock", value: "3", subtext: "Urgent", subColor: "text-[#FB3748]" },
            { label: "Suppliers Active", value: "42", subtext: "Global regions", subColor: "text-[#5C5C5C]" },
          ].map((item, i) => (
            <div key={i} className="flex-1 flex flex-row md:flex-col justify-between md:justify-start items-center md:items-start border-b md:border-b-0 md:border-r border-[#EBEBEB] last:border-0 pb-3 md:pb-0 md:pl-6 first:pl-0">
              <div className="flex flex-col gap-1">
                <p className="text-[13px] text-[#5C5C5C]">{item.label}</p>
                <span className="text-[24px] font-semibold text-[#171717]">{item.value}</span>
              </div>
              <span className={`text-[12px] font-medium ${item.subColor} md:mt-1`}>
                {item.subtext}
              </span>
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
              placeholder="Filter by material ID, name or supplier..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-[44px] w-full pl-10 pr-4 bg-white border border-[#EBEBEB] rounded-[8px] text-[14px] focus:outline-none focus:border-[#00B6E2]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative w-[150px] hidden md:block">
              <select className="h-[44px] w-full appearance-none bg-white border border-[#EBEBEB] rounded-[8px] px-4 pr-10 text-[14px] text-[#171717] focus:outline-none focus:border-[#00B6E2]">
                <option value="all">All Categories</option>
              </select>
              <ChevronDown className="w-4 h-4 text-[#5C5C5C] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            <div className="relative w-[130px] hidden md:block">
              <select className="h-[44px] w-full appearance-none bg-white border border-[#EBEBEB] rounded-[8px] px-4 pr-10 text-[14px] text-[#171717] focus:outline-none focus:border-[#00B6E2]">
                <option value="all">All Status</option>
              </select>
              <ChevronDown className="w-4 h-4 text-[#5C5C5C] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            
            <button className="h-[44px] px-4 bg-white border border-[#00B6E2] text-[#00B6E2] rounded-[8px] flex items-center gap-2 text-[14px] font-medium transition-colors hover:bg-[#F0FDFF]">
              <Download className="w-4 h-4" />
              Export
            </button>
            <button 
              onClick={() => setIsUploadModalOpen(true)}
              className="h-[44px] px-4 bg-[#00B6E2] border border-[#00B6E2] text-white rounded-[8px] flex items-center gap-2 text-[14px] font-medium transition-colors hover:bg-[#00A0E3]"
            >
              <Plus className="w-4 h-4" />
              Upload Material List
            </button>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white border border-[#EBEBEB] rounded-[12px] overflow-hidden flex-1">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="border-b border-[#EBEBEB] bg-[#F9FAFB]">
                  <th className="px-6 py-4 text-[13px] font-semibold text-[#171717]">Material ID</th>
                  <th className="px-6 py-4 text-[13px] font-semibold text-[#171717]">Name</th>
                  <th className="px-6 py-4 text-[13px] font-semibold text-[#171717]">Category</th>
                  <th className="px-6 py-4 text-[13px] font-semibold text-[#171717]">Stock Level</th>
                  <th className="px-6 py-4 text-[13px] font-semibold text-[#171717]">Unit</th>
                  <th className="px-6 py-4 text-[13px] font-semibold text-[#171717]">Supplier</th>
                  <th className="px-6 py-4 text-[13px] font-semibold text-[#171717]">Status</th>
                  <th className="px-6 py-4 text-[13px] font-semibold text-[#171717]">Last Updated</th>
                  <th className="px-6 py-4 text-[13px] font-semibold text-[#171717]">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EBEBEB]">
                {data.map((row, idx) => (
                  <tr key={idx} className="hover:bg-[#F9FAFB] transition-colors">
                    <td className="px-6 py-4 text-[14px] text-[#5C5C5C]">{row.id}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-[14px] font-medium text-[#171717]">{row.name}</span>
                        <span className="text-[12px] text-[#5C5C5C] mt-0.5">{row.desc}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[14px] text-[#5C5C5C]">{row.category}</td>
                    <td className="px-6 py-4">
                      <span className={`text-[14px] ${row.status === "Out of Stock" || row.status === "Low Stock" ? "text-[#E19242] font-medium" : "text-[#5C5C5C]"}`}>
                        {row.status === "Out of Stock" ? <span className="text-[#FB3748]">{row.stock}</span> : row.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[14px] text-[#5C5C5C]">{row.unit}</td>
                    <td className="px-6 py-4 text-[14px] text-[#5C5C5C]">{row.supplier}</td>
                    <td className="px-6 py-4">
                      {row.status === "In Stock" && (
                        <span className="inline-flex px-2.5 py-1 rounded-[12px] bg-[#E8F8F0] text-[#1CB061] text-[12px] font-medium whitespace-nowrap">
                          In Stock
                        </span>
                      )}
                      {row.status === "Low Stock" && (
                        <span className="inline-flex px-2.5 py-1 rounded-[12px] bg-[#FFF4ED] text-[#E19242] text-[12px] font-medium whitespace-nowrap">
                          Low Stock
                        </span>
                      )}
                      {row.status === "Out of Stock" && (
                        <span className="inline-flex px-2.5 py-1 rounded-[12px] bg-[#FFF0F1] text-[#FB3748] text-[12px] font-medium whitespace-nowrap">
                          Out of Stock
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-[14px] text-[#5C5C5C]">{row.date}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <button className="text-[#5C5C5C] hover:text-[#171717] transition-colors">
                          <Edit2 className="w-[18px] h-[18px]" />
                        </button>
                        <button className="text-[#5C5C5C] hover:text-[#FB3748] transition-colors">
                          <Trash2 className="w-[18px] h-[18px]" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination Footer */}
          <div className="px-6 py-4 border-t border-[#EBEBEB] flex items-center justify-between">
            <span className="text-[14px] text-[#5C5C5C]">
              Showing <span className="font-semibold text-[#171717]">6</span> of <span className="font-semibold text-[#171717]">12</span> documents
            </span>
            <div className="flex items-center gap-1">
              <button className="w-8 h-8 flex items-center justify-center border border-[#EBEBEB] rounded-[6px] text-[#5C5C5C] hover:bg-[#F9FAFB]">
                &lt;
              </button>
              <button className="w-8 h-8 flex items-center justify-center border border-[#00B6E2] bg-[#00B6E2] text-white rounded-[6px] text-[14px] font-medium">
                1
              </button>
              <button className="w-8 h-8 flex items-center justify-center border border-[#EBEBEB] bg-white text-[#171717] rounded-[6px] text-[14px] font-medium hover:bg-[#F9FAFB]">
                2
              </button>
              <button className="w-8 h-8 flex items-center justify-center border border-[#EBEBEB] rounded-[6px] text-[#5C5C5C] hover:bg-[#F9FAFB]">
                &gt;
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* UPLOAD MODAL */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-[#171717]/40 backdrop-blur-sm"
            onClick={() => setIsUploadModalOpen(false)}
          />
          <div className="relative w-full max-w-[600px] bg-white rounded-[12px] shadow-lg flex flex-col animate-slide-up">
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#EBEBEB]">
              <div>
                <h2 className="text-[18px] font-semibold text-[#171717]">Upload Material List</h2>
                <p className="text-[14px] text-[#5C5C5C] mt-1">Import your inventory data to sync with enterprise global logistics.</p>
              </div>
              <button 
                onClick={() => setIsUploadModalOpen(false)}
                className="p-2 hover:bg-[#F5F7FA] rounded-[8px] transition-colors"
              >
                <X className="w-5 h-5 text-[#5C5C5C]" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="border-2 border-dashed border-[#00B6E2] bg-[#F0FDFF] rounded-[12px] flex flex-col items-center justify-center py-12 px-4 cursor-pointer hover:bg-[#E6F8FC] transition-colors">
                <FileText className="w-8 h-8 text-[#00B6E2] mb-3" />
                <span className="text-[16px] font-medium text-[#171717]">Drag or Click to Upload</span>
                <span className="text-[14px] text-[#5C5C5C] mt-1">PDF Format only (Max 50MB)</span>
              </div>
            </div>

            <div className="flex items-center justify-between px-6 py-4 border-t border-[#EBEBEB]">
              <button 
                onClick={() => setIsUploadModalOpen(false)}
                className="h-[44px] px-6 bg-white border border-[#EBEBEB] text-[#171717] text-[14px] font-medium rounded-[8px] hover:bg-[#F5F7FA] transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => setIsUploadModalOpen(false)}
                className="h-[44px] px-6 bg-[#00B6E2] text-white text-[14px] font-medium rounded-[8px] hover:bg-[#00A0E3] transition-colors"
              >
                Confirm & Import
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
