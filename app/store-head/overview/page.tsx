"use client";

import { useStore } from "@/hooks/useStore";
import Link from "next/link";
import { Layers, ClipboardList, Clock, Package } from "lucide-react";
import { MobileHeader } from "@/components/MobileHeader";

function StatusBadge({ status }: { status: string }) {
  if (status === "Yet to Start") {
    return <span className="inline-flex items-center px-2 py-0.5 rounded-[12px] bg-[#FFF0F1] text-[#FB3748] text-[12px] font-medium leading-tight">Yet to Start</span>;
  }
  if (status === "In-progress") {
    return <span className="inline-flex items-center px-2 py-0.5 rounded-[12px] bg-[#FFF4ED] text-[#E19242] text-[12px] font-medium leading-tight">In-progress</span>;
  }
  if (status === "Completed") {
    return <span className="inline-flex items-center px-2 py-0.5 rounded-[12px] bg-[#E8F8F0] text-[#1CB061] text-[12px] font-medium leading-tight">Completed</span>;
  }
  return null;
}

export default function StoreHeadOverviewPage() {
  const { store, mounted, workOrders } = useStore();

  if (!mounted) return null;

  const inventory = store.inventoryItems;
  const inStock = inventory.filter((r) => r.status === "In Inventory").length;
  const beingUsed = inventory.filter((r) => r.status === "Being Used").length;
  const usedUp = inventory.filter((r) => r.status === "Used Completely").length;

  const totalWO = workOrders.length;
  const woInProgress = workOrders.filter((w) => w.status === "In-progress").length;
  const woCompleted = workOrders.filter((w) => w.status === "Completed").length;
  const woYetToStart = workOrders.filter((w) => w.status === "Yet to Start").length;

  const recentWOs = workOrders.slice(0, 5);
  const lowStock = inventory.filter((r) => r.status === "In Inventory").slice(0, 5);

  const kpiStats = [
    { label: "Inventory In Stock", value: String(inStock), icon: Package, valClass: "text-[#1CB061]", subtext: `${beingUsed} being used · ${usedUp} depleted` },
    { label: "Total Work Orders", value: String(totalWO), icon: Layers, valClass: "text-[#171717]", subtext: `${woInProgress} in-progress · ${woCompleted} completed` },
    { label: "Pending Assignment", value: String(woYetToStart), icon: Clock, valClass: "text-[#E19242]", subtext: "Work orders yet to start" },
    { label: "RM Being Used", value: String(beingUsed), icon: ClipboardList, valClass: "text-[#00B6E2]", subtext: "Raw materials in process" },
  ];

  return (
    <div className="font-dm-sans min-h-[calc(100vh-72px)] bg-[#FAFAFA] flex flex-col w-full pb-12 overflow-x-hidden">
      <MobileHeader title="Store Head Overview" />

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
                  <span className="text-[10px] text-[#5C5C5C]">{stat.subtext}</span>
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
                <div className="flex items-baseline gap-2">
                  <span className={`text-[14px] font-semibold ${stat.valClass}`}>{stat.value}</span>
                  <span className="text-[12px] text-[#5C5C5C]">{stat.subtext}</span>
                </div>
              </div>
              {i < kpiStats.length - 1 && (
                <div className="hidden lg:block w-[1px] h-[37px] bg-[#EAECF0] ml-auto" />
              )}
            </div>
          );
        })}
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 px-4 md:px-6 mt-6">
        <div className="bg-white border border-[#EBEBEB] rounded-[12px] p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[15px] font-semibold text-[#171717]">Recent Work Orders</h2>
            <Link href="/store-head/workorder" className="text-[12px] text-[#00B6E2] font-medium hover:underline">View All</Link>
          </div>
          {recentWOs.length === 0 ? (
            <p className="text-[13px] text-[#5C5C5C]">No work orders yet.</p>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#EBEBEB] text-[12px] text-[#5C5C5C] font-medium">
                  <th className="py-2">ID</th>
                  <th className="py-2">Micron</th>
                  <th className="py-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F0F0]">
                {recentWOs.map((wo) => (
                  <tr key={wo.id}>
                    <td className="py-2.5 text-[13px] text-[#00B6E2] font-medium">
                      <Link href={`/store-head/workorder/${wo.id}`} className="hover:underline">{wo.id}</Link>
                    </td>
                    <td className="py-2.5 text-[13px] text-[#5C5C5C]">{wo.micron}</td>
                    <td className="py-2.5"><StatusBadge status={wo.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="bg-white border border-[#EBEBEB] rounded-[12px] p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[15px] font-semibold text-[#171717]">Available Inventory</h2>
            <Link href="/store-head/inventory" className="text-[12px] text-[#00B6E2] font-medium hover:underline">View All</Link>
          </div>
          {lowStock.length === 0 ? (
            <p className="text-[13px] text-[#5C5C5C]">No inventory items.</p>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#EBEBEB] text-[12px] text-[#5C5C5C] font-medium">
                  <th className="py-2">RM ID</th>
                  <th className="py-2">Supplier</th>
                  <th className="py-2">Weight</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F0F0]">
                {lowStock.map((item) => (
                  <tr key={item.rawMaterialId}>
                    <td className="py-2.5 text-[13px] text-[#00B6E2] font-medium">{item.rawMaterialId}</td>
                    <td className="py-2.5 text-[13px] text-[#5C5C5C]">{item.supplier}</td>
                    <td className="py-2.5 text-[13px] text-[#5C5C5C]">{item.weight}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  );
}
