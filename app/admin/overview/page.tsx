"use client";

import { useEffect, useState } from "react";
import { MobileHeader } from "@/components/MobileHeader";
import { workOrderService } from "@/src/services/workOrderService";
import { productOrderService } from "@/src/services/productOrderService";
import { Package, Layers, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import Link from "next/link";

export default function AdminOverviewPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    workOrdersOpen: 0,
    productOrdersOpen: 0,
    delayed: 0,
    completed: 0,
  });

  useEffect(() => {
    async function loadStats() {
      try {
        const [woCounts, poCounts] = await Promise.all([
          workOrderService.counts(),
          productOrderService.counts()
        ]);
        
        setStats({
          workOrdersOpen: woCounts.yetToStart + woCounts.inProgress,
          productOrdersOpen: poCounts.pendingOrders + poCounts.inProgressOrders,
          delayed: 0, // Mocked for now, schema doesn't support due dates easily
          completed: woCounts.completed + poCounts.completed,
        });
      } catch (err) {
        console.error("Failed to load overview stats", err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  const kpis = [
    { label: "Work Orders Open", value: stats.workOrdersOpen, icon: Layers, color: "text-[#00B6E2]", bg: "bg-[#E6F8FD]" },
    { label: "Product Orders Open", value: stats.productOrdersOpen, icon: Package, color: "text-[#E19242]", bg: "bg-[#FFF4ED]" },
    { label: "Orders Delayed", value: stats.delayed, icon: AlertCircle, color: "text-[#FB3748]", bg: "bg-[#FFF0F1]" },
    { label: "Completed (Total)", value: stats.completed, icon: CheckCircle2, color: "text-[#1CB061]", bg: "bg-[#E8F8F0]" },
  ];

  return (
    <div className="font-dm-sans min-h-[calc(100vh-72px)] bg-white flex flex-col w-full max-w-full">
      {/* MOBILE TOP NAVIGATION BAR */}
      <MobileHeader title="Overview" />

      {/* MOBILE HEADER SPACER */}
      <div className="h-14 md:hidden"></div>

      {/* DESKTOP HEADER */}
      <section className="bg-white border-b border-[#EBEBEB] hidden md:block">
        <div className="px-6 py-6 flex flex-col">
          <h1 className="text-[20px] font-semibold text-[#171717]">Overview</h1>
          <p className="text-[14px] text-[#5C5C5C] mt-1">
            Top-level view of operations and manufacturing pipeline.
          </p>
        </div>
      </section>

      {/* MOBILE PAGE TITLE */}
      <section className="px-4 pt-4 sm:hidden">
        <h1 className="text-[16px] font-medium text-[#171717]">Overview</h1>
        <p className="text-[12px] text-[#5C5C5C] mt-1">
          Top-level view of operations and manufacturing pipeline.
        </p>
      </section>
      
      <section className="px-4 md:px-6 py-6">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[#00B6E2]" />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {kpis.map((kpi, idx) => {
              const Icon = kpi.icon;
              return (
                <div key={idx} className="bg-white border border-[#EBEBEB] rounded-[12px] p-4 flex flex-col gap-3 shadow-sm">
                  <div className={`w-10 h-10 rounded-full ${kpi.bg} flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${kpi.color}`} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[13px] font-medium text-[#5C5C5C]">{kpi.label}</span>
                    <span className="text-[24px] font-semibold text-[#171717]">{kpi.value}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
      
      {!loading && (
        <section className="px-4 md:px-6 pb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <Link href="/admin/pipeline" className="group border border-[#EBEBEB] rounded-[12px] p-6 hover:shadow-md transition-shadow">
              <h3 className="text-[16px] font-semibold text-[#171717] mb-2">View Pipeline</h3>
              <p className="text-[13px] text-[#5C5C5C] mb-4">Track progress across all production stages in a Kanban view.</p>
              <span className="text-[14px] font-medium text-[#00B6E2] group-hover:underline">Go to Pipeline &rarr;</span>
            </Link>
            
            <Link href="/admin/workorders" className="group border border-[#EBEBEB] rounded-[12px] p-6 hover:shadow-md transition-shadow">
              <h3 className="text-[16px] font-semibold text-[#171717] mb-2">Manage Work Orders</h3>
              <p className="text-[13px] text-[#5C5C5C] mb-4">View and update metallisation and slitting work orders.</p>
              <span className="text-[14px] font-medium text-[#00B6E2] group-hover:underline">Go to Work Orders &rarr;</span>
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
