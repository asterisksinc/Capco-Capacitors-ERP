"use client";

import { useStore } from "@/hooks/useStore";
import Link from "next/link";

function StatusBadge({ status }: { status: string }) {
  if (status === "Yet to Start") {
    return <span className="inline-flex items-center px-2 py-0.5 rounded-[12px] bg-[#FFF0F1] text-[#FB3748] text-[11px] font-medium">Yet to Start</span>;
  }
  if (status === "In-progress") {
    return <span className="inline-flex items-center px-2 py-0.5 rounded-[12px] bg-[#FFF4ED] text-[#E19242] text-[11px] font-medium">In-progress</span>;
  }
  if (status === "Completed") {
    return <span className="inline-flex items-center px-2 py-0.5 rounded-[12px] bg-[#E8F8F0] text-[#1CB061] text-[11px] font-medium">Completed</span>;
  }
  return null;
}

export default function PersonBPipelinePage() {
  const { store, mounted } = useStore();

  if (!mounted) return null;

  const yetToStart = store.productOrders.filter((p) => p.status === "Yet to Start");
  const inProgress = store.productOrders.filter((p) => p.status === "In-progress");
  const completed = store.productOrders.filter((p) => p.status === "Completed");

  const columns = [
    { title: "Yet to Start", items: yetToStart, color: "bg-[#FFF0F1]" },
    { title: "In Progress", items: inProgress, color: "bg-[#FFF4ED]" },
    { title: "Completed", items: completed, color: "bg-[#F0FDF4]" },
  ];

  return (
    <div className="font-dm-sans min-h-[calc(100vh-72px)] bg-[#FAFAFA] flex flex-col p-6 gap-6">
      <h1 className="text-[18px] font-semibold text-[#171717] leading-tight">Person B Pipeline</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {columns.map((col) => (
          <div key={col.title} className="bg-white border border-[#EBEBEB] rounded-[12px] p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="text-[13px] font-semibold text-[#171717]">{col.title}</h2>
              <span className="text-[11px] text-[#5C5C5C] bg-[#EBEBEB] px-2 py-0.5 rounded-full">{col.items.length}</span>
            </div>
            <div className="flex flex-col gap-2">
              {col.items.length === 0 ? (
                <p className="text-[12px] text-[#5C5C5C] py-2">None</p>
              ) : (
                col.items.map((po) => (
                  <Link key={po.id} href={`/person-b/product-orders/${po.id.replace("#", "")}`}
                    className="block p-3 rounded-[8px] border border-[#EBEBEB] hover:border-[#00B6E2] transition-colors bg-white">
                    <p className="text-[13px] font-medium text-[#00B6E2]">{po.id}</p>
                    <p className="text-[11px] text-[#5C5C5C] mt-1">{po.code}</p>
                    <p className="text-[11px] text-[#5C5C5C]">{po.type} &bull; {po.grade}</p>
                    <div className="mt-1.5"><StatusBadge status={po.status} /></div>
                  </Link>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
