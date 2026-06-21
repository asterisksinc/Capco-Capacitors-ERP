"use client";

import { X, Search, Fingerprint, Layers, Package, Box, ArrowRight, ChevronRight, Info } from "lucide-react";
import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { traceBarcode, type TraceResult, type TraceEntity } from "@/lib/traceBarcode";
import type { StoreSnapshot } from "@/lib/traceBarcode";
import { Scanner, type IDetectedBarcode, type IScannerError } from "@yudiel/react-qr-scanner";

const typeColors: Record<string, string> = {
  RM: "bg-[#E8F8F0] text-[#1CB061]",
  MC: "bg-[#FFF4ED] text-[#E19242]",
  PM: "bg-[#E6F8FD] text-[#00B6E2]",
  WD: "bg-[#F0E6FD] text-[#8B5CF6]",
  SP: "bg-[#FFF0F1] text-[#FB3748]",
  WO: "bg-[#F5F7FA] text-[#171717]",
  PO: "bg-[#E8F8F0] text-[#1CB061]",
};

const typeLabels: Record<string, string> = {
  RM: "Raw Material",
  MC: "Metallisation",
  PM: "Product",
  WD: "Winding",
  SP: "Spray",
  WO: "Work Order",
  PO: "Product Order",
};

function EntityCard({ entity, depth = 0 }: { entity: TraceEntity; depth?: number }) {
  return (
    <div className="flex flex-col" style={{ marginLeft: depth * 20 }}>
      <div className="flex items-center gap-2 mb-1">
        <span className={`inline-flex items-center px-2 py-0.5 rounded-[6px] text-[11px] font-semibold ${typeColors[entity.type] ?? "bg-[#F5F7FA] text-[#5C5C5C]"}`}>
          {entity.type}
        </span>
        <span className="text-[13px] font-medium text-[#171717]">{entity.id}</span>
        <span className="text-[11px] text-[#5C5C5C]">{entity.label}</span>
        <span className={`ml-auto text-[11px] font-medium ${
          entity.status === "Completed" ? "text-[#1CB061]" :
          entity.status === "In-progress" ? "text-[#E19242]" :
          entity.status === "Yet to Start" ? "text-[#FB3748]" :
          "text-[#5C5C5C]"
        }`}>{entity.status}</span>
      </div>
      {entity.details.length > 0 && (
        <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 ml-7 mb-2">
          {entity.details.map((d, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <span className="text-[11px] text-[#A1A1AA]">{d.label}:</span>
              <span className="text-[11px] text-[#171717] font-medium">{d.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function UniversalTraceModal({
  store,
  initialId,
  onClose,
}: {
  store: StoreSnapshot;
  initialId?: string;
  onClose: () => void;
}) {
  const [searchValue, setSearchValue] = useState(initialId ?? "");
  const [result, setResult] = useState<TraceResult | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const scanLockRef = useRef(false);
  const router = useRouter();
  const pathname = usePathname();
  const role = pathname.split('/')[1] || "admin";

  const getGuide = () => {
    switch (role) {
      case "productionhead":
        return {
          title: "Production Head Guide",
          items: [
            { code: "WO-xxxx", desc: "Auto-routes to Work Order Creation / Execution." },
            { code: "PO-xxxx", desc: "Traces Product Order lineage." }
          ]
        };
      case "store-head":
        return {
          title: "Store Head Guide",
          items: [
            { code: "WO-xxxx", desc: "Auto-routes to Raw Material Dispatch." },
            { code: "RM-xxxx", desc: "Traces Raw Material lineage." }
          ]
        };
      case "person-a":
        return {
          title: "Operator A Guide",
          items: [
            { code: "WO-xxxx", desc: "Auto-routes to Work Order Execution." },
            { code: "RM-xxxx | MC-xxxx | PM-xxxx", desc: "Auto-routes to corresponding Work Order." }
          ]
        };
      case "person-b":
        return {
          title: "Operator B Guide",
          items: [
            { code: "PO-xxxx", desc: "Auto-routes to Product Order Execution." },
            { code: "PM-xxxx | WD-xxxx | SP-xxxx", desc: "Auto-routes to corresponding Product Order." }
          ]
        };
      case "admin":
      default:
        return {
          title: "Admin Guide",
          items: [
            { code: "WO-xxxx", desc: "Auto-routes to Work Order details." },
            { code: "PO-xxxx", desc: "Auto-routes to Product Order details." },
            { code: "Any Barcode", desc: "Traces global lineage." }
          ]
        };
    }
  };
  const guide = getGuide();

  const handleSearch = useCallback((value: string) => {
    setSearchValue(value);
    if (!value.trim()) {
      setResult(null);
      setNotFound(false);
      return;
    }
    const r = traceBarcode(store, value.trim());
    setResult(r);
    setNotFound(!r);
  }, [store]);

  const handleScan = useCallback((detectedCodes: IDetectedBarcode[]) => {
    if (scanLockRef.current) return;
    const rawValue = detectedCodes[0]?.rawValue;
    if (!rawValue) return;

    scanLockRef.current = true;
    
    // Trace the barcode to find its lineage
    const r = traceBarcode(store, rawValue.trim());
    
    // Auto-routing logic
    const isWO = rawValue.startsWith("WO-");
    const isPO = rawValue.startsWith("PO-");
    const woId = r?.workOrder?.id || (isWO ? rawValue : null);
    const poId = r?.productOrder?.id || (isPO ? rawValue : null);
    let routed = false;

    if (woId && ["productionhead", "store-head", "person-a", "admin"].includes(role)) {
      if (role === "productionhead") { router.push(`/productionhead/workorder/${woId}`); routed = true; }
      else if (role === "store-head") { router.push(`/store-head/workorder/${woId}`); routed = true; }
      else if (role === "person-a") { router.push(`/person-a/workorder/${woId}`); routed = true; }
      else if (role === "admin") { router.push(`/admin/workorders/${woId}`); routed = true; }
    } else if (poId && ["person-b", "admin"].includes(role)) {
      if (role === "person-b") { router.push(`/person-b/product-orders/${poId}`); routed = true; }
      else if (role === "admin") { router.push(`/admin/productorders/${poId}`); routed = true; }
    }

    if (routed) {
      onClose();
      return;
    }

    handleSearch(rawValue);
    setTimeout(() => { scanLockRef.current = false; }, 1500);
  }, [store, handleSearch, role, router, onClose]);

  const handleError = useCallback((err: IScannerError) => {
    const msg = err?.message || "";
    if (msg.includes("Permission") || msg.includes("permission") || msg.includes("denied")) {
      setScanError("Camera permission denied.");
    } else if (msg.includes("NotFoundError") || msg.includes("not found") || msg.includes("NotFound")) {
      setScanError("No camera found on this device.");
    } else if (err.kind === "in-use") {
      setScanError("Camera is already in use by another application.");
    } else {
      setScanError(msg || "Failed to start camera. Please try again.");
    }
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") onClose();
  }, [onClose]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [handleKeyDown]);

  useEffect(() => {
    if (initialId) {
      handleSearch(initialId);
    }
    inputRef.current?.focus();
  }, [initialId, handleSearch]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#171717]/40 backdrop-blur-sm px-2 sm:px-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-[12px] flex flex-col shadow-lg max-w-[520px] w-full max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#EBEBEB]">
          <div className="flex items-center gap-2">
            <Fingerprint className="w-4 h-4 text-[#00B6E2]" />
            <p className="text-[14px] font-medium text-[#171717]">Material Trace</p>
          </div>
          <button onClick={onClose} className="text-[#5C5C5C] hover:text-[#171717] transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 pb-0">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-[#A1A1AA] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              ref={inputRef}
              type="text"
              value={searchValue}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Enter or scan barcode ID..."
              className="h-[40px] w-full pl-9 pr-3 bg-white border border-[#EBEBEB] rounded-[8px] text-[13px] text-[#171717] placeholder:text-[#A1A1AA] focus:outline-none focus:border-[#00B6E2]"
            />
          </div>
        </div>

        {/* Result */}
        <div className="p-4 overflow-y-auto flex-1 min-h-[200px]">
          {notFound && (
            <div className="flex flex-col items-center justify-center py-8 gap-2">
              <Package className="w-8 h-8 text-[#A1A1AA]" />
              <p className="text-[13px] text-[#5C5C5C]">No data found for &quot;{searchValue}&quot;</p>
              <p className="text-[11px] text-[#A1A1AA]">Please verify the barcode ID and try again.</p>
            </div>
          )}

          {result && (
            <div className="flex flex-col gap-3">
              {/* Scanned entity */}
              <div className="bg-[#F5F7FA] rounded-[8px] p-3 border border-[#EBEBEB]">
                <p className="text-[11px] font-medium text-[#A1A1AA] uppercase tracking-wide mb-2">Scanned</p>
                <EntityCard entity={result.scanned} />
              </div>

              {/* Parent chain (if any) */}
              {result.parentChain.length > 0 && (
                <div className="bg-white rounded-[8px] p-3 border border-[#EBEBEB]">
                  <p className="text-[11px] font-medium text-[#A1A1AA] uppercase tracking-wide mb-2">Parent Chain</p>
                  <div className="flex flex-col">
                    {result.parentChain.map((entity, i) => (
                      <div key={entity.id}>
                        {i > 0 && (
                          <div className="flex items-center gap-1 ml-2 my-0.5">
                            <ArrowRight className="w-3 h-3 text-[#A1A1AA]" />
                          </div>
                        )}
                        <EntityCard entity={entity} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Product Order (if found) */}
              {result.productOrder && (
                <div className="bg-[#E8F8F0] rounded-[8px] p-3 border border-[#1CB061]/20">
                  <p className="text-[11px] font-medium text-[#A1A1AA] uppercase tracking-wide mb-2">Product Order</p>
                  <EntityCard entity={result.productOrder} />
                </div>
              )}

              {/* Raw Material detail */}
              {result.rawMaterial && result.scanned.type !== "RM" && (
                <div className="bg-[#E8F8F0] rounded-[8px] p-3 border border-[#EBEBEB]">
                  <p className="text-[11px] font-medium text-[#A1A1AA] uppercase tracking-wide mb-2">Raw Material</p>
                  <EntityCard entity={result.rawMaterial} />
                  {result.rawMaterial.supplier && (
                    <div className="ml-7 text-[11px] text-[#5C5C5C]">
                      {result.rawMaterial.rollId && <span>Roll ID: {result.rawMaterial.rollId}</span>}
                    </div>
                  )}
                </div>
              )}

              {/* Children (if any) */}
              {result.children.length > 0 && (
                <div className="bg-white rounded-[8px] p-3 border border-[#EBEBEB]">
                  <p className="text-[11px] font-medium text-[#A1A1AA] uppercase tracking-wide mb-2">
                    Children ({result.children.length})
                  </p>
                  <div className="flex flex-col gap-2">
                    {result.children.map((child) => (
                      <EntityCard key={child.id} entity={child} />
                    ))}
                  </div>
                </div>
              )}

              {/* Work Order summary */}
              {result.workOrder && result.scanned.type !== "WO" && result.scanned.type !== "RM" && (
                <div className="bg-[#F5F7FA] rounded-[8px] p-3 border border-[#EBEBEB]">
                  <p className="text-[11px] font-medium text-[#A1A1AA] uppercase tracking-wide mb-2">Work Order</p>
                  <EntityCard entity={result.workOrder} />
                </div>
              )}

              {!result.parentChain.length && !result.children.length && !result.productOrder && !result.rawMaterial && (
                <div className="flex items-center justify-center py-4 text-[12px] text-[#A1A1AA]">
                  No linked data found for this entity
                </div>
              )}
            </div>
          )}

          {!result && !notFound && !searchValue.trim() && (
            <div className="flex flex-col items-center justify-center py-4 gap-4 w-full h-full">
              <div className="w-full max-w-[320px] aspect-[4/3] bg-black rounded-[8px] overflow-hidden relative flex items-center justify-center">
                {scanError && (
                  <div className="absolute inset-0 flex items-center justify-center z-10 bg-[#171717] flex-col gap-3 p-4 text-center">
                    <p className="text-white text-[13px]">{scanError}</p>
                    <button
                      onClick={() => { setScanError(null); scanLockRef.current = false; }}
                      className="px-4 h-[36px] bg-[#00B6E2] text-white rounded-[8px] text-[13px] font-medium hover:bg-[#009DC4] transition-colors"
                    >
                      Retry
                    </button>
                  </div>
                )}
                <Scanner
                  onScan={handleScan}
                  onError={handleError}
                  allowMultiple={false}
                  constraints={{ facingMode: "environment", width: { ideal: 480 }, height: { ideal: 360 } }}
                  styles={{ container: { width: "100%", height: "100%" }, video: { objectFit: "cover" } }}
                />
              </div>
              <p className="text-[13px] text-[#5C5C5C]">Point your camera at a barcode to trace or navigate</p>
              
              {/* GUIDE UI */}
              <div className="mt-2 w-full max-w-[320px] bg-[#F8FAFC] border border-[#EBEBEB] rounded-[8px] p-3 flex flex-col gap-2.5">
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-[#00B6E2]" />
                  <p className="text-[12px] font-semibold text-[#171717]">{guide.title}</p>
                </div>
                <div className="flex flex-col gap-2">
                  {guide.items.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="inline-flex px-1.5 py-0.5 rounded-[4px] bg-white border border-[#DDE1E8] text-[10px] font-bold text-[#49526A] whitespace-nowrap shadow-sm mt-0.5">
                        {item.code}
                      </span>
                      <p className="text-[11px] text-[#5C5C5C] leading-tight mt-0.5">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-[#EBEBEB]">
          <p className="text-[11px] text-[#A1A1AA]">
            {result ? `${result.scanned.type}: ${result.scanned.id}` : "No scan"}
          </p>
          <button
            onClick={onClose}
            className="h-[36px] px-4 bg-[#00B6E2] text-white rounded-[8px] text-[13px] font-medium hover:bg-[#009DC4] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
