"use client";
 
import { X, Search, Fingerprint, Package, Info, AlertTriangle, Eye, ArrowDown, Lock, SwitchCamera, Image as ImageIcon } from "lucide-react";
import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { detectEntityType, getLineageChain, type LineageNode, type StoreSnapshot } from "@/lib/traceBarcode";
import { Scanner, type IDetectedBarcode, type IScannerError } from "@yudiel/react-qr-scanner";
import { RowImagesModal } from "./RowImagesModal";
 
const typeLabels: Record<string, string> = {
  RM: "Raw Material",
  MC: "Metallisation Coil",
  PM: "Slit Roll",
  WD: "Winding Roll",
  SP: "Spray Roll",
  WO: "Work Order",
  PO: "Product Order",
};
 
const nodeStyles: Record<string, { border: string; bg: string; text: string; iconBg: string; badge: string }> = {
  RM: { border: "border-[#A3E635]", bg: "bg-[#F7FEE7]", text: "text-[#3F6212]", iconBg: "bg-[#D9F99D]", badge: "bg-[#E2F9B8] text-[#3F6212]" },
  WO: { border: "border-[#94A3B8]", bg: "bg-[#F8FAFC]", text: "text-[#334155]", iconBg: "bg-[#E2E8F0]", badge: "bg-[#E2E8F0] text-[#334155]" },
  MC: { border: "border-[#FDBA74]", bg: "bg-[#FFF7ED]", text: "text-[#C2410C]", iconBg: "bg-[#FFEDD5]", badge: "bg-[#FFEDD5] text-[#C2410C]" },
  PM: { border: "border-[#7DD3FC]", bg: "bg-[#F0F9FF]", text: "text-[#0369A1]", iconBg: "bg-[#E0F2FE]", badge: "bg-[#E0F2FE] text-[#0369A1]" },
  PO: { border: "border-[#86EFAC]", bg: "bg-[#F0FDF4]", text: "text-[#166534]", iconBg: "bg-[#DCFCE7]", badge: "bg-[#DCFCE7] text-[#166534]" },
  WD: { border: "border-[#C084FC]", bg: "bg-[#FAF5FF]", text: "text-[#6B21A8]", iconBg: "bg-[#F3E8FF]", badge: "bg-[#F3E8FF] text-[#6B21A8]" },
  SP: { border: "border-[#FDA4AF]", bg: "bg-[#FFF1F2]", text: "text-[#9F1239]", iconBg: "bg-[#FFE4E6]", badge: "bg-[#FFE4E6] text-[#9F1239]" },
};
 
const allowedStages: Record<string, string[]> = {
  admin: ["RM", "WO", "MC", "PM", "PO", "WD", "SP"],
  productionhead: ["RM", "WO", "MC", "PM", "PO", "WD", "SP"],
  "store-head": ["RM", "WO"],
  "person-a": ["RM", "WO", "MC", "PM", "PO"],
  "person-b": ["RM", "WO", "MC", "PM", "PO", "WD", "SP"],
};

const ALL_STAGES = [
  { type: "RM", label: "Raw Material ID", short: "RM" },
  { type: "WO", label: "Work Order ID", short: "WO" },
  { type: "MC", label: "Metallisation ID", short: "MC" },
  { type: "PM", label: "Slitting ID", short: "SL" },
  { type: "PO", label: "Product Order ID", short: "PO" },
  { type: "WD", label: "Winding ID", short: "WD" },
  { type: "SP", label: "Spray ID", short: "SP" }
];
 
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
  const [lineage, setLineage] = useState<LineageNode[]>([]);
  const [notFound, setNotFound] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
  const inputRef = useRef<HTMLInputElement>(null);
  const scanLockRef = useRef(false);
  const router = useRouter();
  const pathname = usePathname();
  const role = pathname.split('/')[1] || "admin";
 
  const allowed = allowedStages[role] || allowedStages["admin"];
  const scannedType = detectEntityType(searchValue);
  
  // Custom access deniability check
  const accessCheck = (() => {
    if (!searchValue.trim() || scannedType === "Unknown") return { denied: false };
    if (role === "store-head" && scannedType === "PO") {
      return { denied: true, message: `Your role (STORE-HEAD) does not have permission to view ${typeLabels[scannedType] || scannedType} details.` };
    }
    if (pathname.includes("/person-a-metallisation") && scannedType === "PM") {
      return { denied: true, message: "You don't have access to slitting material." };
    }
    return { denied: false };
  })();
  const isAccessDenied = accessCheck.denied;
 
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
 
  const [isTracing, setIsTracing] = useState(false);
  const [downstream, setDownstream] = useState<any>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [imagesRow, setImagesRow] = useState<any>(null);

  const handleSearch = useCallback(async (value: string) => {
    setSearchValue(value);
    if (!value.trim()) {
      setLineage([]);
      setDownstream(null);
      setIsExpanded(false);
      setNotFound(false);
      return;
    }
    
    setIsTracing(true);
    setNotFound(false);
    
    try {
      const { resolveLineageChainAsync } = await import("@/lib/traceBarcodeAsync");
      const result = await resolveLineageChainAsync(value.trim());
      
      if (result) {
        setLineage(result.nodes);
        setDownstream(result.downstream);
        setIsExpanded(false);
        setNotFound(false);
      } else {
        setLineage([]);
        setDownstream(null);
        setNotFound(true);
      }
    } catch (err) {
      console.error(err);
      setLineage([]);
      setDownstream(null);
      setNotFound(true);
    } finally {
      setIsTracing(false);
    }
  }, []);
 
  const handleOpenScreen = (type: string, id: string) => {
    let path = "";
    if (type === "WO") {
      const woId = id.toUpperCase();
      if (role === "admin") path = `/admin/workorders/${woId}`;
      else if (role === "productionhead") path = `/productionhead/workorder/${woId}`;
      else if (role === "store-head") path = `/store-head/workorder/${woId}`;
      else if (role === "person-a") path = `/person-a/workorder/${woId}`;
    } else if (type === "PO") {
      const poId = id.toUpperCase().replace('#', '');
      if (role === "admin") path = `/admin/productorders/${poId}`;
      else if (role === "person-b") path = `/person-b/product-orders/${poId}`;
      else if (role === "person-a") path = `/person-a/product-orders/${poId}`;
      else if (role === "productionhead") path = `/productionhead/productorders/${poId}`;
    }
    if (path) {
      router.push(path);
      onClose();
    }
  };
 
  const handleScan = useCallback((detectedCodes: IDetectedBarcode[]) => {
    if (scanLockRef.current) return;
    const rawValue = detectedCodes[0]?.rawValue;
    if (!rawValue) return;
 
    scanLockRef.current = true;
    
    const cleanValue = rawValue.trim();
    const type = detectEntityType(cleanValue);
    
    // Check permission rules for auto-routing
    const isAllowed = allowed.includes(type);
    
    if (isAllowed) {
      const isWO = type === "WO";
      const isPO = type === "PO";
      let routed = false;
 
      if (isWO && ["productionhead", "store-head", "person-a", "admin"].includes(role)) {
        handleOpenScreen("WO", cleanValue);
        routed = true;
      } else if (isPO && ["person-b", "person-a", "admin", "productionhead"].includes(role)) {
        handleOpenScreen("PO", cleanValue);
        routed = true;
      }
 
      if (routed) {
        onClose();
        return;
      }
    }
 
    handleSearch(rawValue);
    setTimeout(() => { scanLockRef.current = false; }, 1500);
  }, [store, handleSearch, role, router, onClose, allowed]);
 
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
 
  const scannedIndex = ALL_STAGES.findIndex(s => s.type === scannedType);
  const filteredLineage = lineage.filter(node => {
    if (!allowed.includes(node.type)) return false;
    if (scannedIndex !== -1) {
      const nodeIndex = ALL_STAGES.findIndex(s => s.type === node.type);
      if (nodeIndex > scannedIndex) return false;
    }
    return true;
  });
 
  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-[#171717]/40 backdrop-blur-sm px-2 sm:px-4"
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <div className="bg-white rounded-[12px] flex flex-col shadow-lg max-w-[560px] w-full max-h-[85vh]">
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
 
          {/* Visual Lineage Diagram */}
          {!isAccessDenied && filteredLineage.length > 0 && (
            <div className="w-full overflow-x-auto py-3 select-none shrink-0 border-b border-[#EBEBEB] bg-[#FAFAFA] scrollbar-thin">
              <div className="w-[522px] mx-auto relative h-[88px]">
                <svg className="absolute inset-0 w-[522px] h-[88px] pointer-events-none">
                  {(() => {
                    const scannedIndex = ALL_STAGES.findIndex(s => s.type === scannedType);
                    if (scannedIndex > 0) {
                      const sourceX = 36 + scannedIndex * 75;
                      const sourceY = 32;
                      let arcColor = "#A1A1AA";
                      if (scannedType === "SP") arcColor = "#10B981"; // Green
                      else if (scannedType === "WD") arcColor = "#EF4444"; // Red
                      else if (scannedType === "PO") arcColor = "#3B82F6"; // Blue
                      else if (scannedType === "PM") arcColor = "#EC4899"; // Pink
                      else if (scannedType === "MC") arcColor = "#06B6D4"; // Cyan
                      else if (scannedType === "WO") arcColor = "#6366F1"; // Indigo/Blue
  
                      return ALL_STAGES.slice(0, scannedIndex).map((stage, j) => {
                        const targetX = 36 + j * 75;
                        const distance = Math.abs(sourceX - targetX);
                        const cpY = sourceY + distance * 0.42;
                        return (
                          <path
                            key={j}
                            d={`M ${sourceX} ${sourceY} Q ${(sourceX + targetX) / 2} ${cpY} ${targetX} ${sourceY}`}
                            fill="none"
                            stroke={arcColor}
                            strokeWidth="2.5"
                            strokeDasharray="2,2"
                            className="opacity-75 transition-all duration-300"
                          />
                        );
                      });
                    }
                    return null;
                  })()}
                </svg>
  
                {ALL_STAGES.map((stage, i) => {
                  const scannedIndex = ALL_STAGES.findIndex(s => s.type === scannedType);
                  const isActive = i <= scannedIndex;
                  const isScanned = i === scannedIndex;
                  const isAllowed = allowed.includes(stage.type);
  
                  let nodeStyle = "border-[#E4E4E7] bg-white text-[#A1A1AA]";
                  if (isActive) {
                    if (isScanned) {
                      nodeStyle = "border-[#00B6E2] bg-[#E6F8FD] text-[#00B6E2] ring-4 ring-[#00B6E2]/20 font-bold scale-110";
                    } else if (isAllowed) {
                      nodeStyle = "border-[#A3E635] bg-[#F7FEE7] text-[#3F6212] font-semibold";
                    } else {
                      nodeStyle = "border-gray-200 bg-gray-50 text-gray-400";
                    }
                  }
  
                  return (
                    <div
                      key={stage.type}
                      style={{ left: `${20 + i * 75}px` }}
                      className="absolute top-[16px] flex flex-col items-center w-[32px] transition-all duration-300"
                    >
                      <div
                        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center bg-white shadow-sm transition-all duration-300 z-10 ${nodeStyle}`}
                      >
                        {!isAllowed && isActive ? (
                          <Lock className="w-3 h-3 text-[#EF4444]" />
                        ) : (
                          stage.short
                        )}
                      </div>
                      <span className={`text-[10px] mt-1.5 whitespace-nowrap transition-colors duration-300 ${isScanned ? "font-bold text-[#00B6E2]" : isActive ? "font-semibold text-[#171717]" : "font-medium text-[#A1A1AA]"}`}>
                        {stage.short}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {/* Result */}
          <div className="p-4 overflow-y-auto flex-1 min-h-[220px]">
            {isAccessDenied && (
              <div className="flex flex-col items-center justify-center py-8 gap-3 text-center bg-[#FFF0F1] rounded-[12px] border border-[#FDA4AF] p-4">
                <AlertTriangle className="w-10 h-10 text-[#FB3748]" />
                <p className="text-[14px] font-bold text-[#FB3748]">Access Denied</p>
                <p className="text-[12px] text-[#FB3748] max-w-[360px] font-medium leading-relaxed">
                  {accessCheck.message}
                </p>
              </div>
            )}
  
            {!isAccessDenied && isTracing && (
              <div className="flex flex-col items-center justify-center py-8 gap-3 text-center">
                <div className="w-6 h-6 border-2 border-[#EBEBEB] border-t-[#00B6E2] rounded-full animate-spin"></div>
                <p className="text-[13px] text-[#5C5C5C]">Resolving lineage chain...</p>
              </div>
            )}
  
            {!isAccessDenied && !isTracing && notFound && (
              <div className="flex flex-col items-center justify-center py-8 gap-2">
                <Package className="w-8 h-8 text-[#A1A1AA]" />
                <p className="text-[13px] text-[#5C5C5C]">No data found for &quot;{searchValue}&quot;</p>
                <p className="text-[11px] text-[#A1A1AA]">Please verify the barcode ID and try again.</p>
              </div>
            )}
   
            {!isAccessDenied && !isTracing && filteredLineage.length > 0 && (
              <div className="flex flex-col gap-4 py-2">
                <p className="text-[11px] font-bold text-[#A1A1AA] uppercase tracking-wider mb-1">
                  Lineage Chain ({filteredLineage.length} stages resolved)
                </p>
                
                {filteredLineage.map((node, index) => {
                  const style = nodeStyles[node.type] || nodeStyles.WO;
                  const canNavigate = (node.type === "WO" && ["admin", "productionhead", "store-head", "person-a"].includes(role)) ||
                                      (node.type === "PO" && ["admin", "person-b", "person-a", "productionhead"].includes(role));
                  
                  return (
                    <div key={node.id} className="flex flex-col items-center w-full">
                      {index > 0 && (
                        <div className="flex flex-col items-center my-1">
                          <ArrowDown className="w-4 h-4 text-[#A1A1AA]" />
                        </div>
                      )}
                      
                      <div className={`w-full rounded-[12px] border p-4 bg-white shadow-sm transition-all border-[#EBEBEB] hover:border-[#00B6E2]`}>
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-[6px] text-[10px] font-bold uppercase tracking-wider ${style.badge}`}>
                            {typeLabels[node.type] || node.type}
                          </span>
                          <span className="text-[13px] font-bold text-[#171717]">{node.id}</span>
                          <span className={`ml-auto text-[11px] font-semibold ${
                            node.status === "Completed" ? "text-[#1CB061]" :
                            node.status === "In-progress" ? "text-[#E19242]" :
                            node.status === "Yet to Start" ? "text-[#FB3748]" :
                            "text-[#5C5C5C]"
                          }`}>{node.status}</span>
                          {/* {canNavigate && (
                            <button
                              onClick={() => handleOpenScreen(node.type, node.id)}
                              className="p-1 text-[#5C5C5C] hover:text-[#00B6E2] hover:bg-gray-50 rounded-[4px] transition-colors ml-1"
                              title="Go to Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          )} */}
                          {node.type === "MC" && node.rawRecord && (
                            <button
                              onClick={() => setImagesRow(node.rawRecord)}
                              className="p-1 text-[#5C5C5C] hover:text-[#00B6E2] hover:bg-gray-50 rounded-[4px] transition-colors ml-1"
                              title="View Images"
                            >
                              <ImageIcon className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                        
                        {node.details.length > 0 && (
                          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 bg-[#FAFBFD] p-2.5 rounded-[8px] border border-[#F2F4F7]">
                            {node.details.map((d, i) => (
                              <div key={i} className="flex flex-col gap-0.5">
                                <span className="text-[10px] text-[#8B8BA2] font-medium uppercase tracking-wider">{d.label}</span>
                                <span className="text-[12px] text-[#171717] font-semibold">{d.value}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
  
                {downstream && downstream.count > 0 && ["admin", "productionhead"].includes(role) && (
                  <div className="flex flex-col items-center w-full mt-2">
                    <div className="flex flex-col items-center my-1">
                      <ArrowDown className="w-4 h-4 text-[#A1A1AA]" />
                    </div>
                    <button 
                      onClick={() => setIsExpanded(!isExpanded)}
                      className="w-full flex items-center justify-between p-3 bg-[#FAFAFA] border border-[#EBEBEB] hover:border-[#00B6E2] transition-colors rounded-[8px]"
                    >
                      <span className="text-[13px] font-semibold text-[#171717]">
                        {downstream.count} {downstream.label} (Downstream)
                      </span>
                      <span className="text-[12px] text-[#00B6E2] font-medium">
                        {isExpanded ? "Collapse" : "Expand"}
                      </span>
                    </button>
  
                    {isExpanded && downstream.nodes.map((node: any, index: number) => {
                      const style = nodeStyles[node.type] || nodeStyles.WO;
                      return (
                        <div key={node.id} className={`w-full rounded-[12px] border p-4 bg-white shadow-sm transition-all border-[#EBEBEB] mt-3 ml-4 opacity-90`}>
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-[6px] text-[10px] font-bold uppercase tracking-wider ${style.badge}`}>
                              {typeLabels[node.type] || node.type}
                            </span>
                            <span className="text-[13px] font-bold text-[#171717]">{node.id}</span>
                            <span className={`ml-auto text-[11px] font-semibold ${
                              node.status === "Completed" ? "text-[#1CB061]" :
                              node.status === "In-progress" ? "text-[#E19242]" :
                              node.status === "Yet to Start" ? "text-[#FB3748]" :
                              "text-[#5C5C5C]"
                            }`}>{node.status}</span>
                          </div>
                          {node.details.length > 0 && (
                            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 bg-[#FAFBFD] p-2.5 rounded-[8px] border border-[#F2F4F7]">
                              {node.details.map((d: any, i: number) => (
                                <div key={i} className="flex flex-col gap-0.5">
                                  <span className="text-[10px] text-[#8B8BA2] font-medium uppercase tracking-wider">{d.label}</span>
                                  <span className="text-[12px] text-[#171717] font-semibold">{d.value}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
   
            {!isAccessDenied && !isTracing && !lineage.length && !notFound && !searchValue.trim() && (
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
                    constraints={{ facingMode, width: { ideal: 480 }, height: { ideal: 360 } }}
                    styles={{ container: { width: "100%", height: "100%" }, video: { objectFit: "cover" } }}
                  />
                  <button
                    type="button"
                    onClick={() => setFacingMode((prev) => (prev === "environment" ? "user" : "environment"))}
                    className="absolute bottom-3 right-3 z-20 p-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200/50 shadow-md text-[#171717] hover:bg-white transition-colors flex items-center justify-center"
                    title="Switch Camera"
                  >
                    <SwitchCamera className="w-4 h-4" />
                  </button>
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
              {lineage.length ? `${typeLabels[scannedType] || scannedType}: ${searchValue}` : "No scan"}
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
      
      <RowImagesModal 
        isOpen={!!imagesRow} 
        onClose={() => setImagesRow(null)} 
        rowData={imagesRow} 
      />
    </>
  );
}
