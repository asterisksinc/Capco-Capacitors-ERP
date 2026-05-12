"use client";

import { useState } from "react";
import { Search, Download, Plus, ChevronDown, Menu, Bell, User as UserIcon, Edit2, Trash2, X } from "lucide-react";
import { useMobileMenu } from "@/components/MobileMenuContext";

export default function UserManagementPage() {
  const { setIsMobileMenuOpen } = useMobileMenu();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);

  const data = [
    { name: "Ronald Richards", email: "felicia.reid@example.com", contact: "(229) 555-0109", role: "Internal Team A", status: "Active", lastLogin: "Today: 01:55:26" },
    { name: "Jenny Wilson", email: "jackson.graham@example.com", contact: "(629) 555-0129", role: "Internal Team B", status: "Active", lastLogin: "19/03/2026: 01:55:26" },
    { name: "Cameron Williamson", email: "nevaeh.simmons@example.com", contact: "(316) 555-0116", role: "Head of Operations", status: "Inactive", lastLogin: "19/03/2026: 01:55:26" },
    { name: "Cody Fisher", email: "nathan.roberts@example.com", contact: "(319) 555-0115", role: "Manager", status: "Active", lastLogin: "19/03/2026: 01:55:26" },
    { name: "Ella Adams", email: "olivia.james@example.com", contact: "(302) 555-0107", role: "Manager", status: "Active", lastLogin: "19/03/2026: 01:55:26" },
    { name: "Liam Smith", email: "michael.brown@example.com", contact: "(209) 555-0104", role: "Internal Team C", status: "Inactive", lastLogin: "19/03/2026: 01:55:26" },
    { name: "Sophia Johnson", email: "emily.white@example.com", contact: "(808) 555-0111", role: "Internal Team D", status: "Inactive", lastLogin: "19/03/2026: 01:55:26" },
  ];

  return (
    <div className="font-dm-sans min-h-[calc(100vh-72px)] bg-white flex flex-col w-full max-w-full relative">
      {/* MOBILE TOP NAVIGATION BAR */}
      <section className="fixed top-0 left-0 right-0 h-14 bg-white border-b border-[#EBEBEB] px-4 flex items-center justify-between z-40 md:hidden">
        <button className="p-2 -ml-2" onClick={() => setIsMobileMenuOpen(true)}>
          <Menu className="w-5 h-5 text-[#171717]" />
        </button>
        <h1 className="text-[16px] font-medium text-[#171717]">User Management</h1>
        <div className="flex items-center gap-3">
          <button className="p-2">
            <Bell className="w-5 h-5 text-[#171717]" />
          </button>
          <div className="w-8 h-8 rounded-full bg-[#F5F7FA] flex items-center justify-center">
            <UserIcon className="w-4 h-4 text-[#5C5C5C]" />
          </div>
        </div>
      </section>

      {/* MOBILE HEADER SPACER */}
      <div className="h-14 md:hidden"></div>

      {/* DESKTOP HEADER */}
      <section className="bg-white border-b border-[#EBEBEB] hidden md:block">
        <div className="px-6 py-6 flex flex-col">
          <h1 className="text-[20px] font-semibold text-[#171717]">User Management</h1>
          <p className="text-[14px] text-[#5C5C5C] mt-1">
            Manage permissions and oversee access for internal teams and sales representatives.
          </p>
        </div>
      </section>

      {/* MOBILE PAGE TITLE */}
      <section className="px-4 pt-4 sm:hidden">
        <h1 className="text-[16px] font-medium text-[#171717]">User Management</h1>
        <p className="text-[12px] text-[#5C5C5C] mt-1">
          Manage permissions and oversee access.
        </p>
      </section>

      {/* STATS SECTION */}
      <section className="px-4 md:px-6 py-4 md:py-6">
        <div className="bg-white border border-[#EBEBEB] rounded-[12px] p-4 md:p-6 flex flex-col md:flex-row md:items-center gap-4 md:gap-0">
          {[
            { label: "Total User", value: "52" },
            { label: "Internal Teams", value: "38" },
            { label: "Manager", value: "8" },
            { label: "Head of Operations", value: "6" },
          ].map((item, i) => (
            <div key={i} className="flex-1 flex flex-row md:flex-col justify-between md:justify-start items-center md:items-start border-b md:border-b-0 md:border-r border-[#EBEBEB] last:border-0 pb-3 md:pb-0 md:pl-6 first:pl-0">
              <div className="flex flex-col gap-1">
                <p className="text-[13px] text-[#5C5C5C]">{item.label}</p>
                <span className="text-[24px] font-semibold text-[#171717]">{item.value}</span>
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
            <div className="relative w-[130px] hidden md:block">
              <select className="h-[44px] w-full appearance-none bg-white border border-[#EBEBEB] rounded-[8px] px-4 pr-10 text-[14px] text-[#171717] focus:outline-none focus:border-[#00B6E2]">
                <option value="all">All Role</option>
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
              onClick={() => setIsAddUserModalOpen(true)}
              className="h-[44px] px-4 bg-[#00B6E2] border border-[#00B6E2] text-white rounded-[8px] flex items-center gap-2 text-[14px] font-medium transition-colors hover:bg-[#00A0E3]"
            >
              <Plus className="w-4 h-4" />
              Add New User
            </button>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white border border-[#EBEBEB] rounded-[12px] overflow-hidden flex-1">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="border-b border-[#EBEBEB] bg-[#F9FAFB]">
                  <th className="px-6 py-4 text-[13px] font-semibold text-[#171717]">Name</th>
                  <th className="px-6 py-4 text-[13px] font-semibold text-[#171717]">Email</th>
                  <th className="px-6 py-4 text-[13px] font-semibold text-[#171717]">Contact No.</th>
                  <th className="px-6 py-4 text-[13px] font-semibold text-[#171717]">Role</th>
                  <th className="px-6 py-4 text-[13px] font-semibold text-[#171717]">Status</th>
                  <th className="px-6 py-4 text-[13px] font-semibold text-[#171717]">Last Login</th>
                  <th className="px-6 py-4 text-[13px] font-semibold text-[#171717]">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EBEBEB]">
                {data.map((row, idx) => (
                  <tr key={idx} className="hover:bg-[#F9FAFB] transition-colors">
                    <td className="px-6 py-4 text-[14px] font-medium text-[#171717]">{row.name}</td>
                    <td className="px-6 py-4 text-[14px] text-[#5C5C5C]">{row.email}</td>
                    <td className="px-6 py-4 text-[14px] text-[#5C5C5C]">{row.contact}</td>
                    <td className="px-6 py-4 text-[14px] text-[#5C5C5C]">{row.role}</td>
                    <td className="px-6 py-4">
                      {row.status === "Active" ? (
                        <span className="inline-flex px-2.5 py-1 rounded-[12px] bg-[#E8F8F0] text-[#1CB061] text-[12px] font-medium whitespace-nowrap">
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex px-2.5 py-1 rounded-[12px] bg-[#FFF0F1] text-[#FB3748] text-[12px] font-medium whitespace-nowrap">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-[14px] text-[#5C5C5C]">{row.lastLogin}</td>
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
              Showing <span className="font-semibold text-[#171717]">6</span> of <span className="font-semibold text-[#171717]">12</span> user
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

      {/* ADD USER MODAL */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-[#171717]/40 backdrop-blur-sm"
            onClick={() => setIsAddUserModalOpen(false)}
          />
          <div className="relative w-full max-w-[600px] bg-white rounded-[12px] shadow-lg flex flex-col animate-slide-up">
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#EBEBEB]">
              <div>
                <h2 className="text-[18px] font-semibold text-[#171717]">Add New User</h2>
                <p className="text-[14px] text-[#5C5C5C] mt-1">Configure identity and access levels for a new team member.</p>
              </div>
              <button 
                onClick={() => setIsAddUserModalOpen(false)}
                className="p-2 hover:bg-[#F5F7FA] rounded-[8px] transition-colors"
              >
                <X className="w-5 h-5 text-[#5C5C5C]" />
              </button>
            </div>
            
            <div className="p-6 flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-[14px] font-medium text-[#171717]">Full Name</label>
                <input 
                  type="text" 
                  placeholder="Enter full name"
                  className="h-[44px] w-full px-4 border border-[#EBEBEB] rounded-[8px] text-[14px] focus:outline-none focus:border-[#00B6E2]"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[14px] font-medium text-[#171717]">Email Address</label>
                <input 
                  type="email" 
                  placeholder="Enter email address"
                  className="h-[44px] w-full px-4 border border-[#EBEBEB] rounded-[8px] text-[14px] focus:outline-none focus:border-[#00B6E2]"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[14px] font-medium text-[#171717]">Contact No.</label>
                <input 
                  type="tel" 
                  placeholder="Enter contact no."
                  className="h-[44px] w-full px-4 border border-[#EBEBEB] rounded-[8px] text-[14px] focus:outline-none focus:border-[#00B6E2]"
                />
              </div>
              
              <div className="flex gap-4">
                <div className="flex-1 flex flex-col gap-1.5">
                  <label className="text-[14px] font-medium text-[#171717]">Role</label>
                  <div className="relative">
                    <select className="h-[44px] w-full appearance-none bg-white border border-[#EBEBEB] rounded-[8px] px-4 pr-10 text-[14px] text-[#5C5C5C] focus:outline-none focus:border-[#00B6E2]">
                      <option value="">Select role</option>
                      <option value="internal">Internal Team</option>
                      <option value="manager">Manager</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-[#5C5C5C] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
                <div className="flex-1 flex flex-col gap-1.5">
                  <label className="text-[14px] font-medium text-[#171717]">Status</label>
                  <div className="relative">
                    <select className="h-[44px] w-full appearance-none bg-white border border-[#EBEBEB] rounded-[8px] px-4 pr-10 text-[14px] text-[#5C5C5C] focus:outline-none focus:border-[#00B6E2]">
                      <option value="">Select status</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-[#5C5C5C] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between px-6 py-4 border-t border-[#EBEBEB]">
              <button 
                onClick={() => setIsAddUserModalOpen(false)}
                className="h-[44px] px-6 bg-white border border-[#EBEBEB] text-[#171717] text-[14px] font-medium rounded-[8px] hover:bg-[#F5F7FA] transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => setIsAddUserModalOpen(false)}
                className="h-[44px] px-6 bg-[#00B6E2] text-white text-[14px] font-medium rounded-[8px] hover:bg-[#00A0E3] transition-colors"
              >
                Create User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
