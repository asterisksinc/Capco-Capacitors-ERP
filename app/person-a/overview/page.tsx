"use client";

import { useStore } from "@/hooks/useStore";
import Link from "next/link";
import { useMemo } from "react";

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

export default function OperatorOverviewPage() {
  const { store, mounted, workOrders } = useStore();

  const stockCount = useMemo(() => {
    if (!mounted) return 0;
    let count = 0;
    for (const flow of Object.values(store.flowDataMap)) {
      count += flow.slittingRows.length;
    }
    return count;
  }, [store.flowDataMap, mounted]);

  if (!mounted) return null;

  const totalWO = workOrders.length;
  const woInProgress = workOrders.filter((w) => w.status === "In-progress").length;
  const woCompleted = workOrders.filter((w) => w.status === "Completed").length;
  const metCount = workOrders.filter((w) => w.stage === "Metallisation").length;
  const slitCount = workOrders.filter((w) => w.stage === "Slitting").length;

  const activeWOs = workOrders.filter((w) => w.status !== "Completed").slice(0, 5);

  return (
    <div className="font-dm-sans min-h-[calc(100vh-72px)] bg-[#FAFAFA] flex flex-col p-6 gap-6">
      <h1 className="text-[18px] font-semibold text-[#171717] leading-tight">Person A Overview</h1>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#EBEBEB] rounded-[12px] p-5 flex flex-col gap-2">
          <p className="text-[12px] font-medium text-[#5C5C5C]">Active Work Orders</p>
          <p className="text-[24px] font-bold text-[#171717]">{totalWO}</p>
          <p className="text-[12px] text-[#5C5C5C]">{woInProgress} in-progress</p>
        </div>
        <div className="bg-white border border-[#EBEBEB] rounded-[12px] p-5 flex flex-col gap-2">
          <p className="text-[12px] font-medium text-[#5C5C5C]">Metallisation Stage</p>
          <p className="text-[24px] font-bold text-[#00B6E2]">{metCount}</p>
          <p className="text-[12px] text-[#5C5C5C]">Work orders in metallisation</p>
        </div>
        <div className="bg-white border border-[#EBEBEB] rounded-[12px] p-5 flex flex-col gap-2">
          <p className="text-[12px] font-medium text-[#5C5C5C]">Slitting Stage</p>
          <p className="text-[24px] font-bold text-[#E19242]">{slitCount}</p>
          <p className="text-[12px] text-[#5C5C5C]">Work orders in slitting</p>
        </div>
        <div className="bg-white border border-[#EBEBEB] rounded-[12px] p-5 flex flex-col gap-2">
          <p className="text-[12px] font-medium text-[#5C5C5C]">Stock Generated</p>
          <p className="text-[24px] font-bold text-[#1CB061]">{stockCount}</p>
          <p className="text-[12px] text-[#5C5C5C]">Product lots from slitting</p>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-[#EBEBEB] rounded-[12px] p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[15px] font-semibold text-[#171717]">Active Work Orders</h2>
            <Link href="/person-a/workorder" className="text-[12px] text-[#00B6E2] font-medium hover:underline">View All</Link>
          </div>
          {activeWOs.length === 0 ? (
            <p className="text-[13px] text-[#5C5C5C]">No active work orders.</p>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#EBEBEB] text-[12px] text-[#5C5C5C] font-medium">
                  <th className="py-2">ID</th>
                  <th className="py-2">Stage</th>
                  <th className="py-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F0F0]">
                {activeWOs.map((wo) => (
                  <tr key={wo.id}>
                    <td className="py-2.5 text-[13px] text-[#00B6E2] font-medium">
                      <Link href={`/person-a/workorder/${wo.id}`} className="hover:underline">{wo.id}</Link>
                    </td>
                    <td className="py-2.5 text-[13px] text-[#5C5C5C]">{wo.stage}</td>
                    <td className="py-2.5"><StatusBadge status={wo.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="bg-white border border-[#EBEBEB] rounded-[12px] p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[15px] font-semibold text-[#171717]">Completed Work Orders</h2>
            <Link href="/person-a/workorder" className="text-[12px] text-[#00B6E2] font-medium hover:underline">View All</Link>
          </div>
          {woCompleted === 0 ? (
            <p className="text-[13px] text-[#5C5C5C]">No completed work orders yet.</p>
          ) : (
            <p className="text-[13px] text-[#1CB061] font-medium">{woCompleted} work order(s) fully completed.</p>
          )}
        </div>
      </section>
    </div>
  );
}
