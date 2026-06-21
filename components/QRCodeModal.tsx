"use client";

import { X, Download } from "lucide-react";
import { useRef, useCallback, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";

export function QRCodeModal({ id, onClose }: { id: string; onClose: () => void }) {
  const svgRef = useRef<HTMLDivElement>(null);

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

  const handleDownload = useCallback(() => {
    const svgEl = svgRef.current?.querySelector("svg");
    if (!svgEl) return;
    const clone = svgEl.cloneNode(true) as SVGSVGElement;
    clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    const serializer = new XMLSerializer();
    const svgStr = serializer.serializeToString(clone);
    const canvas = document.createElement("canvas");
    const size = 360;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const img = new Image();
    const blob = new Blob([svgStr], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    img.onload = () => {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, size, size);
      ctx.drawImage(img, 0, 0, size, size);
      URL.revokeObjectURL(url);
      canvas.toBlob((pngBlob) => {
        if (!pngBlob) return;
        const pngUrl = URL.createObjectURL(pngBlob);
        const a = document.createElement("a");
        a.href = pngUrl;
        a.download = `${id.replace(/[^a-zA-Z0-9-_]/g, "_")}-qr.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(pngUrl);
      }, "image/png");
    };
    img.src = url;
  }, [id]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#171717]/40 backdrop-blur-sm px-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-[12px] p-6 flex flex-col items-center gap-4 shadow-lg max-w-[280px] w-full">
        <div className="flex items-center justify-between w-full">
          <p className="text-[14px] font-medium text-[#171717]">QR Code</p>
          <button onClick={onClose} className="text-[#5C5C5C] hover:text-[#171717] transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div ref={svgRef} className="bg-white p-3 rounded-[8px] border border-[#EBEBEB]">
          <QRCodeSVG value={id} size={180} level="M" />
        </div>
        <p className="text-[13px] text-[#5C5C5C] text-center break-all max-w-full">{id}</p>
        <div className="flex flex-col gap-2 w-full">
          <button
            onClick={handleDownload}
            className="w-full h-[40px] bg-white border border-[#EBEBEB] text-[#5C5C5C] rounded-[8px] text-[14px] font-medium hover:bg-[#F5F7FA] transition-colors flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download QR
          </button>
          <button
            onClick={onClose}
            className="w-full h-[40px] bg-[#00B6E2] text-white rounded-[8px] text-[14px] font-medium hover:bg-[#009DC4] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
