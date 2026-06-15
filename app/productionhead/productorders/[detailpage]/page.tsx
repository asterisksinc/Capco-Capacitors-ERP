"use client";

import { use } from "react";
import { 
  ChevronRight, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  ChevronDown,
  AlertCircle,
  Paperclip,
  History,
  Send,
  Layers,
  Package,
  Activity,
  TrendingUp
} from "lucide-react";
import { MobileHeader, MobileSpacer } from "@/components/MobileHeader";

type DetailPageProps = {
  params: Promise<{ detailpage: string }>;
};

function StatusBadge({ status }: { status: string }) {
  if (status === "Yet to Start") {
    return <span className="inline-flex items-center px-2 py-0.5 rounded-xl bg-[#FFF0F1] text-[#FB3748] text-xs font-medium leading-tight">Yet to Start</span>;
  }
  if (status === "In-progress" || status === "Pending") {
    return <span className="inline-flex items-center px-2 py-0.5 rounded-xl bg-[#FFF4ED] text-[#E19242] text-xs font-medium leading-tight">In-progress</span>;
  }
  if (status === "Completed" || status === "Approved") {
    return <span className="inline-flex items-center px-2 py-0.5 rounded-xl bg-[#E8F8F0] text-[#1CB061] text-xs font-medium leading-tight">Completed</span>;
  }
  return <span className="inline-flex items-center px-2 py-0.5 rounded-xl bg-gray-100 text-gray-600 text-xs font-medium leading-tight">{status}</span>;
}

export default function ProductOrderDetail({ params }: DetailPageProps) {
  const { detailpage } = use(params);

  const kpiStats = [
    { label: "Stages done", value: "4 / 6", icon: Layers, valClass: "text-[#171717]" },
    { label: "Units Processed", value: "3,250", icon: Package, valClass: "text-[#1CB061]" },
    { label: "Cycle Variance", value: "+1.2 Hrs", icon: Activity, valClass: "text-[#E19242]" },
    { label: "Dispatch Readiness", value: "68%", icon: TrendingUp, valClass: "text-[#171717]" },
  ];

  return (
    <div className="font-dm-sans min-h-[calc(100vh-72px)] bg-white flex flex-col w-full pb-12">
      <MobileHeader title="Product Order Detail" />

      {/* KPI Stats - Mobile 2x2 grid */}
      <section className="grid grid-cols-2 gap-0 md:hidden mx-4 mt-[72px] bg-white border border-[#EBEBEB] rounded-[12px]">
        {kpiStats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className={`p-3 ${i % 2 === 0 ? 'border-r border-b border-[#EBEBEB]' : 'border-b border-[#EBEBEB]'} ${i >= 2 ? 'border-b-0' : ''}`}>
              <div className="flex items-start gap-2">
                <div className="w-8 h-8 rounded-full bg-[#E6F8FD] flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-[#00B6E2]" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <p className="text-[11px] font-medium text-[#5C5C5C]">{stat.label}</p>
                  <span className={`text-[16px] font-semibold ${stat.valClass}`}>{stat.value}</span>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* KPI Stats - Desktop row */}
      <section className="hidden md:grid grid-cols-1 lg:grid-cols-4 mx-4 md:mx-6 mt-6 bg-white border border-[#EBEBEB] rounded-[12px] items-center p-5">
        {kpiStats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="flex items-center gap-4 px-4 py-2">
              <div className="w-10 h-10 rounded-full bg-[#E6F8FD] flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-[#00B6E2]" />
              </div>
              <div className="flex flex-col gap-[2px]">
                <p className="text-[12px] font-medium text-[#5C5C5C] leading-tight">{stat.label}</p>
                <span className={`text-[14px] font-semibold ${stat.valClass}`}>{stat.value}</span>
              </div>
              {i < kpiStats.length - 1 && (
                <div className="hidden lg:block w-[1px] h-[37px] bg-[#EAECF0] ml-auto" />
              )}
            </div>
          );
        })}
      </section>

      <div className="flex flex-col xl:flex-row gap-6 px-4 md:px-6 pb-6">
        {/* Main Content Area */}
        <div className="flex flex-col gap-6 flex-1 min-w-0">
          
          {/* Detail Cards Row */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            {/* Left Card: Product Order Details */}
            <div className="bg-white border border-[#EBEBEB] rounded-xl p-6 shadow-sm flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-[#EBEBEB] pb-4">
                <h2 className="text-base font-semibold text-[#171717]">Product Order Details</h2>
                <div className="flex gap-2">
                   <span className="bg-[#FFF4ED] text-[#E19242] text-xs font-semibold px-2 py-1 rounded-md uppercase tracking-wide">High Priority</span>
                   <span className="bg-[#E6F8FD] text-[#00B6E2] text-xs font-semibold px-2 py-1 rounded-md tracking-wide">Epoxy Filling</span>
                </div>
              </div>
              
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center py-1">
                  <span className="text-sm text-[#5C5C5C]">Capacitor Type</span>
                  <span className="text-sm font-medium text-[#171717]">Film (MKT Series)</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-sm text-[#5C5C5C]">Capacitance</span>
                  <span className="text-sm font-medium text-[#171717]">10μF</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-sm text-[#5C5C5C]">Voltage rating</span>
                  <span className="text-sm font-medium text-[#171717]">63V DC</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-sm text-[#5C5C5C]">Grade</span>
                  <span className="text-sm font-medium text-[#171717]">A — Premium</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-sm text-[#5C5C5C]">Tolerance</span>
                  <span className="text-sm font-medium text-[#171717]">±5%</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-sm text-[#5C5C5C]">Batch quantity</span>
                  <span className="text-sm font-medium text-[#171717]">5,000 Units</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-sm text-[#5C5C5C]">Winding requirement</span>
                  <span className="text-sm font-medium text-[#171717]">120 turns/layer, 3-layer</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-sm text-[#5C5C5C]">Spray requirement</span>
                  <span className="text-sm font-medium text-[#171717]">Zinc-spray, Batch ZS-447</span>
                </div>
               
                <div className="flex justify-between items-center py-1">
                  <span className="text-sm text-[#5C5C5C]">Delivery commitment</span>
                  <span className="text-sm font-medium text-[#171717]">31 Jan 2025, 09:00 IST</span>
                </div>

                <div className="mt-2 bg-[#FAFAFA] border border-[#EBEBEB] p-3 rounded-lg flex items-start gap-3">
                  <p className="text-sm text-[#5C5C5C] font-medium">Priority order — aviation-grade QC</p>
                </div>
              </div>
            </div>

            {/* Right Card: Execution Summary */}
            <div className="bg-white border border-[#EBEBEB] rounded-xl p-6 shadow-sm flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-[#EBEBEB] pb-4">
                <h2 className="text-base font-semibold text-[#171717]">Execution Summary</h2>
                <button className="text-sm text-[#00B6E2] font-medium hover:underline flex items-center gap-1">
                  View full history <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center py-1">
                  <span className="text-sm text-[#5C5C5C]">Planned start</span>
                  <span className="text-sm font-medium text-[#171717]">02 Jan 2025</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-sm text-[#5C5C5C]">Actual start</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-[#171717]">03 Jan 2025</span>
                    <span className="bg-[#FFF4ED] text-[#E19242] text-[10px] font-bold px-1.5 py-0.5 rounded">+1 day</span>
                  </div>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-sm text-[#5C5C5C]">Current owner</span>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-[#00B6E2] text-white flex items-center justify-center text-[10px] font-bold">RK</div>
                    <span className="text-sm font-medium text-[#171717]">Rajesh Kumar</span>
                  </div>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-sm text-[#5C5C5C]">Workstation / line</span>
                  <span className="text-sm font-medium text-[#171717]">Line 4 — Bay B</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-sm text-[#5C5C5C]">Material issued</span>
                  <span className="text-sm font-medium text-[#1CB061] flex items-center gap-1">Issued — Full <CheckCircle2 className="w-3.5 h-3.5"/></span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-sm text-[#5C5C5C]">Shift allocation</span>
                  <div className="flex gap-2">
                    <span className="text-[10px] uppercase font-bold text-[#00B6E2] bg-[#E6F8FD] px-1.5 py-0.5 rounded">Morning</span>
                    <span className="text-[10px] uppercase font-bold text-[#00B6E2] bg-[#E6F8FD] px-1.5 py-0.5 rounded">Afternoon</span>
                  </div>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-sm text-[#5C5C5C]">Last updated by</span>
                  <span className="text-sm font-medium text-[#171717]">Priya M.</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-sm text-[#5C5C5C]">Last updated</span>
                  <span className="text-sm font-medium text-[#171717]">16 Jan 2025, 14:32 IST</span>
                </div>
                
                <div className="mt-2 flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2 text-[#FB3748]">
                     <AlertCircle className="w-4 h-4"/>
                     <span className="text-xs font-semibold">Stage delay detected</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Stage execution metrics */}
          <section className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold text-[#171717] mb-2 mt-2">Stage execution matrix</h2>

            {/* Winding - Completed */}
            <div className="bg-white border border-[#1CB061]/20 rounded-xl shadow-sm overflow-hidden mb-2">
              <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-[#EBEBEB] cursor-pointer hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <ChevronDown className="w-5 h-5 text-[#5C5C5C]" />
                  <h3 className="text-base font-semibold text-[#171717]">Winding</h3>
                  <StatusBadge status="Completed" />
                </div>
                <span className="text-sm text-[#5C5C5C]">03 Jan → 07 Jan</span>
              </div>
              
              <div className="p-6">
                <div className="overflow-x-auto border border-[#EBEBEB] rounded-lg">
                  <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                      <tr className="bg-[#F5F7FA] border-b border-[#EBEBEB]">
                        <th className="px-4 py-3 text-xs font-semibold text-[#5C5C5C] uppercase">Product Material ID</th>
                        <th className="px-4 py-3 text-xs font-semibold text-[#5C5C5C] uppercase">Material Name</th>
                        <th className="px-4 py-3 text-xs font-semibold text-[#5C5C5C] uppercase">Roll Width</th>
                        <th className="px-4 py-3 text-xs font-semibold text-[#5C5C5C] uppercase">Turns/Layer</th>
                        <th className="px-4 py-3 text-xs font-semibold text-[#5C5C5C] uppercase">Layer Count</th>
                        <th className="px-4 py-3 text-xs font-semibold text-[#5C5C5C] uppercase">Qty Wound</th>
                        <th className="px-4 py-3 text-xs font-semibold text-[#5C5C5C] uppercase">Machine</th>
                        <th className="px-4 py-3 text-xs font-semibold text-[#5C5C5C] uppercase">Rejected</th>
                        <th className="px-4 py-3 text-xs font-semibold text-[#5C5C5C] uppercase">Remarks</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EBEBEB]">
                      <tr className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 text-sm font-medium text-[#00B6E2]">PM-001</td>
                        <td className="px-4 py-3 text-sm text-[#171717]">Polypropylene Film</td>
                        <td className="px-4 py-3 text-sm text-[#5C5C5C]">40mm</td>
                        <td className="px-4 py-3 text-sm text-[#5C5C5C]">120</td>
                        <td className="px-4 py-3 text-sm text-[#5C5C5C]">3</td>
                        <td className="px-4 py-3 text-sm text-[#5C5C5C]">5050</td>
                        <td className="px-4 py-3 text-sm text-[#5C5C5C]">WM-04</td>
                        <td className="px-4 py-3 text-sm font-medium text-[#FB3748]">12</td>
                        <td className="px-4 py-3 text-sm text-[#5C5C5C]">Minor tension issue</td>
                      </tr>
                      <tr className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 text-sm font-medium text-[#00B6E2]">PM-002</td>
                        <td className="px-4 py-3 text-sm text-[#171717]">Aluminum Foil</td>
                        <td className="px-4 py-3 text-sm text-[#5C5C5C]">38mm</td>
                        <td className="px-4 py-3 text-sm text-[#5C5C5C]">120</td>
                        <td className="px-4 py-3 text-sm text-[#5C5C5C]">3</td>
                        <td className="px-4 py-3 text-sm text-[#5C5C5C]">5045</td>
                        <td className="px-4 py-3 text-sm text-[#5C5C5C]">WM-04</td>
                        <td className="px-4 py-3 text-sm font-medium text-[#FB3748]">5</td>
                        <td className="px-4 py-3 text-sm text-[#5C5C5C]">Within tolerance</td>
                      </tr>
                      <tr className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 text-sm font-medium text-[#00B6E2]">PM-003</td>
                        <td className="px-4 py-3 text-sm text-[#171717]">Contact Wire</td>
                        <td className="px-4 py-3 text-sm text-[#5C5C5C]">2mm</td>
                        <td className="px-4 py-3 text-sm text-[#5C5C5C]">N/A</td>
                        <td className="px-4 py-3 text-sm text-[#5C5C5C]">N/A</td>
                        <td className="px-4 py-3 text-sm text-[#5C5C5C]">10100</td>
                        <td className="px-4 py-3 text-sm text-[#5C5C5C]">WM-04</td>
                        <td className="px-4 py-3 text-sm font-medium text-[#1CB061]">0</td>
                        <td className="px-4 py-3 text-sm text-[#5C5C5C]">Good</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <div className="flex items-center gap-4 text-sm text-[#5C5C5C] font-medium">
                    <button className="flex items-center gap-1 hover:text-[#171717]"><Paperclip className="w-4 h-4"/> 2 attachments</button>
                    <span className="flex items-center gap-1"><AlertCircle className="w-4 h-4"/> 0 delays</span>
                    <button className="flex items-center gap-1 hover:text-[#171717]"><History className="w-4 h-4"/> View history</button>
                  </div>
                  <div className="flex gap-3">
                    {/* Approve and Send Back removed */}
                  </div>
                </div>
              </div>
            </div>

            {/* Spray - Completed */}
            <div className="bg-white border border-[#1CB061]/20 rounded-xl shadow-sm overflow-hidden mb-2">
              <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-[#EBEBEB] cursor-pointer hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <ChevronDown className="w-5 h-5 text-[#5C5C5C]" />
                  <h3 className="text-base font-semibold text-[#171717]">Spray</h3>
                  <StatusBadge status="Completed" />
                </div>
                <span className="text-sm text-[#5C5C5C]">08 Jan → 10 Jan</span>
              </div>
              
              <div className="p-6">
                <div className="overflow-x-auto border border-[#EBEBEB] rounded-lg">
                  <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                      <tr className="bg-[#F5F7FA] border-b border-[#EBEBEB]">
                        <th className="px-4 py-3 text-xs font-semibold text-[#5C5C5C] uppercase">Product Material ID</th>
                        <th className="px-4 py-3 text-xs font-semibold text-[#5C5C5C] uppercase">Material Name</th>
                        <th className="px-4 py-3 text-xs font-semibold text-[#5C5C5C] uppercase">Spray Type</th>
                        <th className="px-4 py-3 text-xs font-semibold text-[#5C5C5C] uppercase">Batch Code</th>
                        <th className="px-4 py-3 text-xs font-semibold text-[#5C5C5C] uppercase">Coating Thickness (μm)</th>
                        <th className="px-4 py-3 text-xs font-semibold text-[#5C5C5C] uppercase">Qty Sprayed</th>
                        <th className="px-4 py-3 text-xs font-semibold text-[#5C5C5C] uppercase">Booth ID</th>
                        <th className="px-4 py-3 text-xs font-semibold text-[#5C5C5C] uppercase">Rejected</th>
                        <th className="px-4 py-3 text-xs font-semibold text-[#5C5C5C] uppercase">Remarks</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EBEBEB]">
                      <tr className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 text-sm font-medium text-[#00B6E2]">PM-001</td>
                        <td className="px-4 py-3 text-sm text-[#171717]">Polypropylene Film</td>
                        <td className="px-4 py-3 text-sm text-[#5C5C5C]">Zinc-spray</td>
                        <td className="px-4 py-3 text-sm text-[#5C5C5C]">ZS-447</td>
                        <td className="px-4 py-3 text-sm text-[#5C5C5C]">12</td>
                        <td className="px-4 py-3 text-sm text-[#5C5C5C]">5050</td>
                        <td className="px-4 py-3 text-sm text-[#5C5C5C]">SB-02</td>
                        <td className="px-4 py-3 text-sm font-medium text-[#1CB061]">8</td>
                        <td className="px-4 py-3 text-sm text-[#5C5C5C]">Good coverage</td>
                      </tr>
                      <tr className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 text-sm font-medium text-[#00B6E2]">PM-002</td>
                        <td className="px-4 py-3 text-sm text-[#171717]">Aluminum Foil</td>
                        <td className="px-4 py-3 text-sm text-[#5C5C5C]">Zinc-spray</td>
                        <td className="px-4 py-3 text-sm text-[#5C5C5C]">ZS-447</td>
                        <td className="px-4 py-3 text-sm text-[#5C5C5C]">11</td>
                        <td className="px-4 py-3 text-sm text-[#5C5C5C]">5045</td>
                        <td className="px-4 py-3 text-sm text-[#5C5C5C]">SB-02</td>
                        <td className="px-4 py-3 text-sm font-medium text-[#1CB061]">3</td>
                        <td className="px-4 py-3 text-sm text-[#5C5C5C]">Uniform coating</td>
                      </tr>
                      <tr className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 text-sm font-medium text-[#00B6E2]">PM-003</td>
                        <td className="px-4 py-3 text-sm text-[#171717]">Contact Wire</td>
                        <td className="px-4 py-3 text-sm text-[#5C5C5C]">N/A</td>
                        <td className="px-4 py-3 text-sm text-[#5C5C5C]">N/A</td>
                        <td className="px-4 py-3 text-sm text-[#5C5C5C]">N/A</td>
                        <td className="px-4 py-3 text-sm text-[#5C5C5C]">10100</td>
                        <td className="px-4 py-3 text-sm text-[#5C5C5C]">N/A</td>
                        <td className="px-4 py-3 text-sm font-medium text-[#1CB061]">0</td>
                        <td className="px-4 py-3 text-sm text-[#5C5C5C]">No spray required</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="flex justify-end items-center mt-4 gap-3">
                  
                  
                </div>
              </div>
            </div>

            {/* Soldering - Completed */}
            <div className="bg-white border border-[#1CB061]/20 rounded-xl shadow-sm overflow-hidden mb-2">
              <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-[#EBEBEB] cursor-pointer hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <ChevronDown className="w-5 h-5 text-[#5C5C5C]" />
                  <h3 className="text-base font-semibold text-[#171717]">Soldering</h3>
                  <StatusBadge status="Completed" />
                </div>
                <span className="text-sm text-[#5C5C5C]">10 Jan → 12 Jan</span>
              </div>
              
              <div className="p-6">
                <div className="overflow-x-auto border border-[#EBEBEB] rounded-lg">
                  <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                      <tr className="bg-[#F5F7FA] border-b border-[#EBEBEB]">
                        <th className="px-4 py-3 text-xs font-semibold text-[#5C5C5C] uppercase">Product Material ID</th>
                        <th className="px-4 py-3 text-xs font-semibold text-[#5C5C5C] uppercase">Material Name</th>
                        <th className="px-4 py-3 text-xs font-semibold text-[#5C5C5C] uppercase">Solder Type</th>
                        <th className="px-4 py-3 text-xs font-semibold text-[#5C5C5C] uppercase">Temperature °C</th>
                        <th className="px-4 py-3 text-xs font-semibold text-[#5C5C5C] uppercase">Joint Quality</th>
                        <th className="px-4 py-3 text-xs font-semibold text-[#5C5C5C] uppercase">Qty Soldered</th>
                        <th className="px-4 py-3 text-xs font-semibold text-[#5C5C5C] uppercase">Station ID</th>
                        <th className="px-4 py-3 text-xs font-semibold text-[#5C5C5C] uppercase">Rejected</th>
                        <th className="px-4 py-3 text-xs font-semibold text-[#5C5C5C] uppercase">Remarks</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EBEBEB]">
                      <tr className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 text-sm font-medium text-[#00B6E2]">PM-001</td>
                        <td className="px-4 py-3 text-sm text-[#171717]">Polypropylene Film</td>
                        <td className="px-4 py-3 text-sm text-[#5C5C5C]">Lead-free</td>
                        <td className="px-4 py-3 text-sm text-[#5C5C5C]">245</td>
                        <td className="px-4 py-3 text-sm font-medium text-[#1CB061]">Excellent</td>
                        <td className="px-4 py-3 text-sm text-[#5C5C5C]">5042</td>
                        <td className="px-4 py-3 text-sm text-[#5C5C5C]">SO-01</td>
                        <td className="px-4 py-3 text-sm font-medium text-[#1CB061]">5</td>
                        <td className="px-4 py-3 text-sm text-[#5C5C5C]">All joints inspected</td>
                      </tr>
                      <tr className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 text-sm font-medium text-[#00B6E2]">PM-002</td>
                        <td className="px-4 py-3 text-sm text-[#171717]">Aluminum Foil</td>
                        <td className="px-4 py-3 text-sm text-[#5C5C5C]">Lead-free</td>
                        <td className="px-4 py-3 text-sm text-[#5C5C5C]">245</td>
                        <td className="px-4 py-3 text-sm font-medium text-[#1CB061]">Excellent</td>
                        <td className="px-4 py-3 text-sm text-[#5C5C5C]">5042</td>
                        <td className="px-4 py-3 text-sm text-[#5C5C5C]">SO-01</td>
                        <td className="px-4 py-3 text-sm font-medium text-[#1CB061]">2</td>
                        <td className="px-4 py-3 text-sm text-[#5C5C5C]">Good adhesion</td>
                      </tr>
                      <tr className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 text-sm font-medium text-[#00B6E2]">PM-003</td>
                        <td className="px-4 py-3 text-sm text-[#171717]">Contact Wire</td>
                        <td className="px-4 py-3 text-sm text-[#5C5C5C]">Lead-free</td>
                        <td className="px-4 py-3 text-sm text-[#5C5C5C]">245</td>
                        <td className="px-4 py-3 text-sm font-medium text-[#1CB061]">Excellent</td>
                        <td className="px-4 py-3 text-sm text-[#5C5C5C]">10100</td>
                        <td className="px-4 py-3 text-sm text-[#5C5C5C]">SO-01</td>
                        <td className="px-4 py-3 text-sm font-medium text-[#1CB061]">0</td>
                        <td className="px-4 py-3 text-sm text-[#5C5C5C]">Perfect joints</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="flex justify-end items-center mt-4 gap-3">
                  
                  
                </div>
              </div>
            </div>

            {/* Epoxy - In Progress */}
            <div className="bg-white border border-[#EBEBEB] rounded-xl shadow-sm overflow-hidden mb-4 border-l-4 border-l-[#E19242]">
              <div className="flex items-center justify-between px-6 py-4 bg-[#FFF9F5] border-b border-[#EBEBEB] cursor-pointer hover:bg-[#FFF4ED] transition-colors">
                <div className="flex items-center gap-3">
                  <ChevronDown className="w-5 h-5 text-[#5C5C5C]" />
                  <h3 className="text-base font-semibold text-[#171717]">Epoxy</h3>
                  <StatusBadge status="In-progress" />
                </div>
                <span className="text-sm text-[#5C5C5C]">Started: 13 Jan 2025</span>
              </div>
              
              <div className="p-6">
                <div className="mb-4 bg-[#FFF0F1] border border-[#FDC2C8] p-3 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-[#E19242] shrink-0" />
                  <p className="text-sm text-[#E19242] font-medium">Cure oven temp variance detected — monitoring all materials</p>
                </div>

                <div className="overflow-x-auto border border-[#EBEBEB] rounded-lg">
                  <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                      <tr className="bg-[#F5F7FA] border-b border-[#EBEBEB]">
                        <th className="px-4 py-3 text-xs font-semibold text-[#5C5C5C] uppercase">Product Material ID</th>
                        <th className="px-4 py-3 text-xs font-semibold text-[#5C5C5C] uppercase">Material Name</th>
                        <th className="px-4 py-3 text-xs font-semibold text-[#5C5C5C] uppercase">Epoxy Type</th>
                        <th className="px-4 py-3 text-xs font-semibold text-[#5C5C5C] uppercase">Fill %</th>
                        <th className="px-4 py-3 text-xs font-semibold text-[#5C5C5C] uppercase">Cure Status</th>
                        <th className="px-4 py-3 text-xs font-semibold text-[#5C5C5C] uppercase">Qty Completed</th>
                        <th className="px-4 py-3 text-xs font-semibold text-[#5C5C5C] uppercase">Oven Temp °C</th>
                        <th className="px-4 py-3 text-xs font-semibold text-[#5C5C5C] uppercase">Rejected</th>
                        <th className="px-4 py-3 text-xs font-semibold text-[#5C5C5C] uppercase">Remarks</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EBEBEB]">
                      <tr className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 text-sm font-medium text-[#00B6E2]">PM-001</td>
                        <td className="px-4 py-3 text-sm text-[#171717]">Polypropylene Film</td>
                        <td className="px-4 py-3 text-sm text-[#5C5C5C]">Araldite 2011</td>
                        <td className="px-4 py-3 text-sm text-[#5C5C5C]">72%</td>
                        <td className="px-4 py-3 text-sm text-[#E19242] font-medium">Pending</td>
                        <td className="px-4 py-3 text-sm text-[#5C5C5C]">3250</td>
                        <td className="px-4 py-3 text-sm font-medium text-[#E19242]">158</td>
                        <td className="px-4 py-3 text-sm font-medium text-[#E19242]">18</td>
                        <td className="px-4 py-3 text-sm font-medium text-[#E19242]">Temp variance +2°C</td>
                      </tr>
                      <tr className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 text-sm font-medium text-[#00B6E2]">PM-002</td>
                        <td className="px-4 py-3 text-sm text-[#171717]">Aluminum Foil</td>
                        <td className="px-4 py-3 text-sm text-[#5C5C5C]">Araldite 2011</td>
                        <td className="px-4 py-3 text-sm text-[#5C5C5C]">70%</td>
                        <td className="px-4 py-3 text-sm text-[#E19242] font-medium">Pending</td>
                        <td className="px-4 py-3 text-sm text-[#5C5C5C]">3240</td>
                        <td className="px-4 py-3 text-sm font-medium text-[#E19242]">158</td>
                        <td className="px-4 py-3 text-sm font-medium text-[#E19242]">12</td>
                        <td className="px-4 py-3 text-sm font-medium text-[#E19242]">Monitoring</td>
                      </tr>
                      <tr className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 text-sm font-medium text-[#00B6E2]">PM-003</td>
                        <td className="px-4 py-3 text-sm text-[#171717]">Contact Wire</td>
                        <td className="px-4 py-3 text-sm text-[#5C5C5C]">N/A</td>
                        <td className="px-4 py-3 text-sm text-[#5C5C5C]">N/A</td>
                        <td className="px-4 py-3 text-sm text-[#5C5C5C]">N/A</td>
                        <td className="px-4 py-3 text-sm text-[#5C5C5C]">6500</td>
                        <td className="px-4 py-3 text-sm font-medium text-[#E19242]">N/A</td>
                        <td className="px-4 py-3 text-sm font-medium text-[#E19242]">0</td>
                        <td className="px-4 py-3 text-sm font-medium text-[#E19242]">No epoxy required</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-between items-center mt-4">
                   <div className="flex items-center gap-1 text-sm font-medium text-[#E19242]">
                    <AlertTriangle className="w-4 h-4"/> 1 delay flag
                  </div>
                  <div className="flex gap-3">
                    
                    
                  </div>
                </div>
              </div>
            </div>

            {/* Test PV94 & Pack - Not Started */}
            <div className="bg-white border border-[#EBEBEB] rounded-xl shadow-sm overflow-hidden mb-4 opacity-70">
              <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-[#EBEBEB]">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-gray-200" />
                  <h3 className="text-base font-semibold text-[#171717]">Test Print & Pack</h3>
                  <StatusBadge status="Not Started" />
                </div>
                <span className="text-sm text-[#5C5C5C]">Upcoming</span>
              </div>
            </div>

            {/* Finished Goods - Not Started */}
            <div className="bg-white border border-[#EBEBEB] rounded-xl shadow-sm overflow-hidden opacity-70">
              <div className="flex items-center justify-between px-6 py-4 bg-white">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-gray-200" />
                  <h3 className="text-base font-semibold text-[#171717]">Finished Goods</h3>
                  <StatusBadge status="Not Started" />
                </div>
                <span className="text-sm text-[#5C5C5C]">Upcoming</span>
              </div>
            </div>
          </section>
        </div>

        {/* Right Sidebar (Order intelligence) */}
        <div className="w-full xl:w-80 shrink-0 flex flex-col gap-6">
          <div className="bg-white border border-[#EBEBEB] rounded-xl shadow-sm overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#EBEBEB]">
              <h2 className="text-base font-semibold text-[#171717]">Order intelligence</h2>
              <ChevronRight className="w-4 h-4 text-[#5C5C5C]" />
            </div>
            
            <div className="p-5 flex flex-col gap-6">
              <div className="flex items-center justify-around text-[#5C5C5C]">
                <Clock className="w-5 h-5 text-[#1CB061]" />
                <Clock className="w-5 h-5 opacity-70" />
                <Clock className="w-5 h-5 opacity-50" />
                <Clock className="w-5 h-5 opacity-30" />
              </div>

              <div className="relative border-l-2 border-[#EBEBEB] ml-2 mt-2 flex flex-col gap-6 pb-2">
                {/* Winding */}
                <div className="relative pl-5">
                  <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-[#1CB061] ring-4 ring-white" />
                  <h4 className="text-sm font-semibold text-[#171717]">Stage completed: Winding</h4>
                  <p className="text-xs text-[#5C5C5C] mt-0.5">07 Jan 2025 - 16:30</p>
                  <p className="text-xs text-[#5C5C5C] mt-1.5">Amit S. — 5,050 units wound, 12 rejected</p>
                </div>
                
                {/* Spray */}
                <div className="relative pl-5">
                  <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-[#1CB061] ring-4 ring-white" />
                  <h4 className="text-sm font-semibold text-[#171717]">Stage completed: Spray</h4>
                  <p className="text-xs text-[#5C5C5C] mt-0.5">10 Jan 2025 - 11:45</p>
                </div>

                {/* Soldering */}
                <div className="relative pl-5">
                  <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-[#1CB061] ring-4 ring-white" />
                  <h4 className="text-sm font-semibold text-[#171717]">Stage completed: Soldering</h4>
                  <p className="text-xs text-[#5C5C5C] mt-0.5">12 Jan 2025 - 16:00</p>
                </div>

                {/* Epoxy */}
                <div className="relative pl-5">
                  <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-[#E19242] ring-4 ring-white" />
                  <h4 className="text-sm font-semibold text-[#171717]">Stage started: Epoxy</h4>
                  <p className="text-xs text-[#E19242] mt-0.5 italic">13 Jan 2025 - 09:15</p>
                </div>
              </div>
            </div>

            <div className="p-5 border-t border-[#EBEBEB] bg-[#FAFAFA] flex flex-col gap-3">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Add comment..." 
                  className="w-full text-sm border border-[#EBEBEB] rounded-lg pl-3 pr-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#00B6E2]/20"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 text-[#5C5C5C] hover:text-[#00B6E2]">
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <button className="w-full border border-[#FB3748] text-[#FB3748] text-sm font-medium py-2.5 rounded-lg hover:bg-[#FFF0F1] transition-colors">
                Raise escalation
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


