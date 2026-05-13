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

  return (
    <div className="font-dm-sans min-h-[calc(100vh-72px)] bg-[#FAFAFA] flex flex-col p-6 gap-6">
      <h1 className="text-[18px] font-semibold text-[#171717] leading-tight">Store Head Overview</h1>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#EBEBEB] rounded-[12px] p-5 flex flex-col gap-2">
          <p className="text-[12px] font-medium text-[#5C5C5C]">Inventory In Stock</p>
          <p className="text-[24px] font-bold text-[#1CB061]">{inStock}</p>
          <p className="text-[12px] text-[#5C5C5C]">{beingUsed} being used &bull; {usedUp} depleted</p>
        </div>
        <div className="bg-white border border-[#EBEBEB] rounded-[12px] p-5 flex flex-col gap-2">
          <p className="text-[12px] font-medium text-[#5C5C5C]">Total Work Orders</p>
          <p className="text-[24px] font-bold text-[#171717]">{totalWO}</p>
          <p className="text-[12px] text-[#5C5C5C]">{woInProgress} in-progress &bull; {woCompleted} completed</p>
        </div>
        <div className="bg-white border border-[#EBEBEB] rounded-[12px] p-5 flex flex-col gap-2">
          <p className="text-[12px] font-medium text-[#5C5C5C]">Pending Assignment</p>
          <p className="text-[24px] font-bold text-[#E19242]">{woYetToStart}</p>
          <p className="text-[12px] text-[#5C5C5C]">Work orders yet to start</p>
        </div>
        <div className="bg-white border border-[#EBEBEB] rounded-[12px] p-5 flex flex-col gap-2">
          <p className="text-[12px] font-medium text-[#5C5C5C]">RM Being Used</p>
          <p className="text-[24px] font-bold text-[#00B6E2]">{beingUsed}</p>
          <p className="text-[12px] text-[#5C5C5C]">Raw materials in process</p>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
