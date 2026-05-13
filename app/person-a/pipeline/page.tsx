"use client";

import { useStore } from "@/hooks/useStore";
import Link from "next/link";

export default function OperatorPipelinePage() {
  const { store, mounted } = useStore();

  if (!mounted) return null;

  const readyForMet = store.workOrders.filter((wo) => {
    const flow = store.flowDataMap[wo.id];
    if (!flow) return false;
    const hasRm = flow.rawMaterialRows.length > 0;
    const noMet = flow.metallisationRows.length === 0;
    return hasRm && noMet;
  });

  const inMet = store.workOrders.filter((wo) => {
    const flow = store.flowDataMap[wo.id];
    return flow && flow.metallisationRows.length > 0 && flow.slittingRows.length === 0;
  });

  const inSlit = store.workOrders.filter((wo) => {
    const flow = store.flowDataMap[wo.id];
    return flow && flow.slittingRows.length > 0 && flow.slittingRows.some((s) => s.status !== "Completed");
  });

  const completed = store.workOrders.filter((wo) => {
    const flow = store.flowDataMap[wo.id];
    if (!flow || flow.slittingRows.length === 0) return false;
    return flow.slittingRows.every((s) => s.status === "Completed");
  });

  const columns = [
    { title: "Ready for Metallisation", wos: readyForMet, color: "bg-[#FFF4ED]" },
    { title: "Metallisation", wos: inMet, color: "bg-[#F0F6FF]" },
    { title: "Slitting", wos: inSlit, color: "bg-[#FEF3F2]" },
    { title: "Completed", wos: completed, color: "bg-[#F0FDF4]" },
  ];

  return (
    <div className="font-dm-sans min-h-[calc(100vh-72px)] bg-[#FAFAFA] flex flex-col p-6 gap-6">
      <h1 className="text-[18px] font-semibold text-[#171717] leading-tight">Person A Pipeline</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                  const metCount = flow?.metallisationRows.length ?? 0;
                  const slitCount = flow?.slittingRows.length ?? 0;
                  return (
                    <Link key={wo.id} href={`/person-a/workorder/${wo.id}`}
                      className="block p-3 rounded-[8px] border border-[#EBEBEB] hover:border-[#00B6E2] transition-colors bg-white">
                      <p className="text-[13px] font-medium text-[#00B6E2]">{wo.id}</p>
                      <p className="text-[11px] text-[#5C5C5C] mt-1">{wo.micron}µ x {wo.width}mm</p>
                      {metCount > 0 && <p className="text-[11px] text-[#5C5C5C]">{metCount} met coil(s)</p>}
                      {slitCount > 0 && <p className="text-[11px] text-[#5C5C5C]">{slitCount} slit product(s)</p>}
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
