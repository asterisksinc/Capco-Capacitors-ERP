"use client";

import { Search, Download, ChevronDown } from "lucide-react";

function StatusBadge({ status }: { status: string }) {
  let bg = "bg-[#F5F7FA]";
  let text = "text-[#5C5C5C]";

  if (status === "Under Review") {
    bg = "bg-[#F0F9FF]";
    text = "text-[#0061FF]";
  } else if (status === "Action Required") {
    bg = "bg-[#FEF9C3]";
    text = "text-[#CA8A04]";
  } else if (status === "Rejected") {
    bg = "bg-[#FFF0F1]";
    text = "text-[#FB3748]";
  } else if (status === "Approved") {
    bg = "bg-[#E8F8F0]";
    text = "text-[#1CB061]";
  }

  return (
    <span className={`px-3 py-1 rounded-full text-[12px] font-medium ${bg} ${text}`}>
      {status}
    </span>
  );
}

function SeverityBadge({ severity }: { severity: string }) {
  let bg = "bg-[#F5F7FA]";
  let text = "text-[#5C5C5C]";

  if (severity === "High") {
    bg = "bg-[#FFF0F1]";
    text = "text-[#FB3748]";
  } else if (severity === "Medium") {
    bg = "bg-[#FEF9C3]";
    text = "text-[#CA8A04]";
  } else if (severity === "Low") {
    bg = "bg-[#F0F9FF]";
    text = "text-[#0061FF]";
  }

  return (
    <span className={`px-3 py-1 rounded-full text-[12px] font-medium ${bg} ${text}`}>
      {severity}
    </span>
  );
}

export default function WarrantyClaimsPage() {
  const claims = [
    { id: "CLM-2023-8841", customer: "Jerome Bell", product: "Lorem ipsum dolor", serial: "SN-2023-A991", issue: "Not Working", severity: "High", date: "Oct 14, 2026", status: "Under Review" },
    { id: "CLM-2023-8839", customer: "Darrell Steward", product: "Lorem ipsum dolor", serial: "SN-2021-2002", issue: "Bulging", severity: "Medium", date: "Nov 02, 2024", status: "Action Required" },
    { id: "CLM-2023-8832", customer: "Ralph Edwards", product: "Lorem ipsum dolor", serial: "SN-2019-V332", issue: "Leakage", severity: "Low", date: "Aug 20, 2023", status: "Rejected" },
    { id: "CLM-2023-8830", customer: "Jenny Wilson", product: "Lorem ipsum dolor", serial: "SN-2023-4998", issue: "Overheating", severity: "High", date: "Dec 12, 2026", status: "Approved" },
    { id: "CLM-2023-8828", customer: "Savannah Nguyen", product: "Lorem ipsum dolor", serial: "SN-2022-P014", issue: "Wrong Spec", severity: "High", date: "Jan 15, 2027", status: "Under Review" },
    { id: "CLM-2023-8821", customer: "Ronald Richards", product: "Lorem ipsum dolor", serial: "SN-2021-2055", issue: "Early Failure", severity: "Medium", date: "Nov 28, 2024", status: "Approved" },
  ];

  return (
    <div className="flex flex-col gap-8 w-full max-w-[1400px]">
      <div className="flex flex-col gap-1">
        <h1 className="text-[20px] font-semibold text-[#171717] leading-tight">Warranty Claims</h1>
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
        <div className="flex items-center gap-3 w-full sm:w-auto flex-wrap sm:flex-nowrap">
          <div className="relative w-[calc(50%-6px)] sm:w-[140px]">
            <select className="w-full appearance-none px-4 py-2 h-[44px] border border-[#EBEBEB] rounded-[8px] text-[14px] text-[#171717] bg-white shadow-sm focus:outline-none focus:border-[#00B6E2]">
              <option>All Statuses</option>
              <option>Under Review</option>
              <option>Approved</option>
              <option>Rejected</option>
            </select>
            <ChevronDown className="w-4 h-4 text-[#5C5C5C] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
          <div className="relative w-[calc(50%-6px)] sm:w-[140px]">
            <select className="w-full appearance-none px-4 py-2 h-[44px] border border-[#EBEBEB] rounded-[8px] text-[14px] text-[#171717] bg-white shadow-sm focus:outline-none focus:border-[#00B6E2]">
              <option>All Severities</option>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
            <ChevronDown className="w-4 h-4 text-[#5C5C5C] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 h-[44px] px-6 bg-[#00B6E2] text-white rounded-[8px] font-medium text-[14px] hover:bg-[#0092b5] transition-colors shadow-sm w-full sm:w-auto mt-2 sm:mt-0">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      <div className="bg-white border border-[#EBEBEB] rounded-[12px] shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1100px]">
            <thead>
              <tr className="bg-[#F9FAFB] border-b border-[#EBEBEB]">
                <th className="px-6 py-4 text-[14px] font-semibold text-[#171717]">Claim ID</th>
                <th className="px-6 py-4 text-[14px] font-semibold text-[#171717]">Customer Name</th>
                <th className="px-6 py-4 text-[14px] font-semibold text-[#171717]">Product</th>
                <th className="px-6 py-4 text-[14px] font-semibold text-[#171717]">Serial Number</th>
                <th className="px-6 py-4 text-[14px] font-semibold text-[#171717]">Issue Category</th>
                <th className="px-6 py-4 text-[14px] font-semibold text-[#171717]">Severity</th>
                <th className="px-6 py-4 text-[14px] font-semibold text-[#171717]">Date Filed</th>
                <th className="px-6 py-4 text-[14px] font-semibold text-[#171717]">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EBEBEB]">
              {claims.map((claim, i) => (
                <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-5 text-[14px] text-[#5C5C5C]">{claim.id}</td>
                  <td className="px-6 py-5 text-[14px] text-[#5C5C5C]">{claim.customer}</td>
                  <td className="px-6 py-5 text-[14px] text-[#5C5C5C]">{claim.product}</td>
                  <td className="px-6 py-5 text-[14px] text-[#5C5C5C]">{claim.serial}</td>
                  <td className="px-6 py-5 text-[14px] text-[#5C5C5C]">{claim.issue}</td>
                  <td className="px-6 py-5">
                    <SeverityBadge severity={claim.severity} />
                  </td>
                  <td className="px-6 py-5 text-[14px] text-[#5C5C5C]">{claim.date}</td>
                  <td className="px-6 py-5">
                    <StatusBadge status={claim.status} />
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
