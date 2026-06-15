"use client";

import { useStore } from "@/hooks/useStore";
import Link from "next/link";
import { useMemo } from "react";
import { MobileHeader } from "@/components/MobileHeader";

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

export default function StoreHeadPipelinePage() {
  const { store, mounted, workOrders } = useStore();

  if (!mounted) return null;

  const columns = useMemo(() => {
    const rawMat = workOrders.filter((wo) => {
      const flow = store.flowDataMap[wo.id];
      return flow && flow.rawMaterialRows.length > 0 && flow.metallisationRows.length === 0;
    });

    const inProgress = workOrders.filter((wo) => {
      const flow = store.flowDataMap[wo.id];
      return flow && flow.metallisationRows.length > 0;
    });

    const completed = workOrders.filter((wo) => {
      const flow = store.flowDataMap[wo.id];
      return flow && flow.slittingRows.length > 0 && flow.slittingRows.every((s) => s.status === "Completed");
    });

    const noRm = workOrders.filter((wo) => {
      const flow = store.flowDataMap[wo.id];
      return !flow || flow.rawMaterialRows.length === 0;
    });

    return [
      { title: "No RMs Assigned", wos: noRm, color: "bg-[#FFF0F1]" },
      { title: "Raw Material Stage", wos: rawMat, color: "bg-[#FFF4ED]" },
      { title: "In Progress", wos: inProgress, color: "bg-[#F0F6FF]" },
      { title: "Completed", wos: completed, color: "bg-[#F0FDF4]" },
    ];
  }, [workOrders, store.flowDataMap]);

  return (
    <div className="font-dm-sans min-h-[calc(100vh-72px)] bg-[#FAFAFA] flex flex-col w-full pb-12 overflow-x-hidden">
      <MobileHeader title="Pipeline" />

      <h1 className="text-[18px] font-semibold text-[#171717] leading-tight px-4 md:px-6 pt-[72px] md:pt-6">Store Head Pipeline</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-4 md:px-6 mt-6">
        {columns.map((col) => (
          <div key={col.title} className="bg-white border border-[#EBEBEB] rounded-[12px] p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="text-[13px] font-semibold text-[#171717]">{col.title}</h2>
              <span className="text-[11px] text-[#5C5C5C] bg-[#EBEBEB] px-2 py-0.5 rounded-full">{col.wos.length}</span>
            </div>
            <div className="flex flex-col gap-2">
              {col.wos.length === 0 ? (
                <p className="text-[12px] text-[#5C5C5C] py-2">None</p>
              ) : (
                col.wos.map((wo) => {
                  const flow = store.flowDataMap[wo.id];
                  const rmCount = flow?.rawMaterialRows.length ?? 0;
                  return (
                    <Link key={wo.id} href={`/store-head/workorder/${wo.id}`}
                      className="block p-3 rounded-[8px] border border-[#EBEBEB] hover:border-[#00B6E2] transition-colors bg-white">
                      <p className="text-[13px] font-medium text-[#00B6E2]">{wo.id}</p>
                      <p className="text-[11px] text-[#5C5C5C] mt-1">{wo.micron}µ x {wo.width}mm</p>
                      <p className="text-[11px] text-[#5C5C5C]">{rmCount} RM(s) &bull; <StatusBadge status={wo.status} /></p>
                    </Link>
                  );
                })
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
