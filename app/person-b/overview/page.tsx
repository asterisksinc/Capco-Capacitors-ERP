"use client";

import { useStore } from "@/hooks/useStore";
import Link from "next/link";

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

export default function PersonBOverviewPage() {
  const { store, mounted } = useStore();

  if (!mounted) return null;

  const productOrders = store.productOrders;
  const totalPO = productOrders.length;
  const poInProgress = productOrders.filter((p) => p.status === "In-progress").length;
  const poYetToStart = productOrders.filter((p) => p.status === "Yet to Start").length;
  const poCompleted = productOrders.filter((p) => p.status === "Completed").length;

  const recentPOs = productOrders.slice(0, 5);

  return (
    <div className="font-dm-sans min-h-[calc(100vh-72px)] bg-[#FAFAFA] flex flex-col p-6 gap-6">
      <h1 className="text-[18px] font-semibold text-[#171717] leading-tight">Person B Overview</h1>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#EBEBEB] rounded-[12px] p-5 flex flex-col gap-2">
          <p className="text-[12px] font-medium text-[#5C5C5C]">Total Product Orders</p>
          <p className="text-[24px] font-bold text-[#171717]">{totalPO}</p>
          <p className="text-[12px] text-[#5C5C5C]">{poInProgress} in-progress</p>
        </div>
        <div className="bg-white border border-[#EBEBEB] rounded-[12px] p-5 flex flex-col gap-2">
          <p className="text-[12px] font-medium text-[#5C5C5C]">Yet to Start</p>
          <p className="text-[24px] font-bold text-[#FB3748]">{poYetToStart}</p>
          <p className="text-[12px] text-[#5C5C5C]">Pending processing</p>
        </div>
        <div className="bg-white border border-[#EBEBEB] rounded-[12px] p-5 flex flex-col gap-2">
          <p className="text-[12px] font-medium text-[#5C5C5C]">In Progress</p>
          <p className="text-[24px] font-bold text-[#E19242]">{poInProgress}</p>
          <p className="text-[12px] text-[#5C5C5C]">Active production</p>
        </div>
        <div className="bg-white border border-[#EBEBEB] rounded-[12px] p-5 flex flex-col gap-2">
          <p className="text-[12px] font-medium text-[#5C5C5C]">Completed</p>
          <p className="text-[24px] font-bold text-[#1CB061]">{poCompleted}</p>
          <p className="text-[12px] text-[#5C5C5C]">Ready for next stage</p>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-[#EBEBEB] rounded-[12px] p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[15px] font-semibold text-[#171717]">Recent Product Orders</h2>
            <Link href="/person-b/product-orders" className="text-[12px] text-[#00B6E2] font-medium hover:underline">View All</Link>
          </div>
          {recentPOs.length === 0 ? (
            <p className="text-[13px] text-[#5C5C5C]">No product orders yet.</p>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#EBEBEB] text-[12px] text-[#5C5C5C] font-medium">
                  <th className="py-2">Order ID</th>
                  <th className="py-2">Product Code</th>
                  <th className="py-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F0F0]">
                {recentPOs.map((po) => (
                  <tr key={po.id}>
                    <td className="py-2.5 text-[13px] text-[#00B6E2] font-medium">
                      <Link href={`/person-b/product-orders/${po.id.replace('#', '')}`} className="hover:underline">{po.id}</Link>
                    </td>
                    <td className="py-2.5 text-[13px] text-[#5C5C5C]">{po.code}</td>
                    <td className="py-2.5"><StatusBadge status={po.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="bg-white border border-[#EBEBEB] rounded-[12px] p-5 flex flex-col gap-4">
          <h2 className="text-[15px] font-semibold text-[#171717]">Stage Summary</h2>
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between text-[13px]">
              <span className="text-[#5C5C5C]">Winding</span>
              <span className="font-medium text-[#171717]">{productOrders.filter(p => p.stage === "Yet to Start" || p.stage === "Raw Material").length} pending</span>
            </div>
            <div className="flex items-center justify-between text-[13px]">
              <span className="text-[#5C5C5C]">Spray</span>
              <span className="font-medium text-[#171717]">{productOrders.filter(p => p.stage === "Metallisation" || p.stage === "Slitting").length} pending</span>
            </div>
            <div className="flex items-center justify-between text-[13px]">
              <span className="text-[#5C5C5C]">Completed</span>
              <span className="font-medium text-[#1CB061]">{poCompleted}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
