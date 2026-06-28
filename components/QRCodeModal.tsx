"use client";

import { X, Download } from "lucide-react";
import { useRef, useCallback, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";

const TYPE_LABELS: Record<string, string> = {
  RM: "Raw Material",
  WO: "Work Order",
  PO: "Product Order",
  MC: "Metallisation Coil",
  PM: "Product Metallisation",
  WD: "Winding",
  SP: "Spray",
};

const TYPE_COLORS: Record<string, string> = {
  RM: "#1CB061",
  WO: "#00B6E2",
  PO: "#7C3AED",
  MC: "#E19242",
  PM: "#FB3748",
  WD: "#6366F1",
  SP: "#EC4899",
};

export type QRModalData = {
  id: string;
  type: string;
  details: Record<string, string>;
};

export function QRCodeModal({
  id,
  type,
  details,
  onClose,
}: {
  id: string;
  type?: string;
  details?: Record<string, string>;
  onClose: () => void;
}) {
  const stickerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [handleKeyDown]);

  const handleDownload = useCallback(() => {
    const size = 400;
    const lineH = 22;
    const detailCount = details ? Object.keys(details).length : 0;
    const stickerH = 520 + detailCount * lineH;

    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = stickerH;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, size, stickerH);

    const logoImg = new Image();
    logoImg.crossOrigin = "anonymous";
    logoImg.src = "/logo%20(2).svg";
    logoImg.onload = () => {
      // Header
      ctx.fillStyle = "#00B6E2";
      ctx.fillRect(0, 0, size, 56);
      ctx.filter = "brightness(0) invert(1)";
      ctx.drawImage(logoImg, 16, 8, 120, 40);
      ctx.filter = "none";

      // QR code
      const svgEl = svgRef.current?.querySelector("svg");
      if (!svgEl) return;
      const clone = svgEl.cloneNode(true) as SVGSVGElement;
      clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
      const serializer = new XMLSerializer();
      const svgStr = serializer.serializeToString(clone);
      const img = new Image();
      const blob = new Blob([svgStr], {
        type: "image/svg+xml;charset=utf-8",
      });
      const url = URL.createObjectURL(blob);
      img.onload = () => {
        const qrSize = 170;
        const qrX = (size - qrSize) / 2;
        const qrY = 72;
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(qrX - 8, qrY - 8, qrSize + 16, qrSize + 16);
        ctx.drawImage(img, qrX, qrY, qrSize, qrSize);
        URL.revokeObjectURL(url);

        // Type badge
        if (type) {
          const label = TYPE_LABELS[type] || type;
          const badgeX = size / 2;
          const badgeY = qrY + qrSize + 28;
          ctx.font = "bold 11px Inter, system-ui, sans-serif";
          const tw = ctx.measureText(label).width;
          const bx = badgeX - tw / 2 - 12;
          const by = badgeY - 8;
          const bw = tw + 24;
          const bh = 24;
          ctx.fillStyle = TYPE_COLORS[type] || "#00B6E2";
          ctx.beginPath();
          ctx.roundRect(bx, by, bw, bh, 12);
          ctx.fill();
          ctx.fillStyle = "#ffffff";
          ctx.textAlign = "center";
          ctx.fillText(label, badgeX, badgeY + 5);
        }

        // Entity ID
        const idY = 276 + (type ? 14 : -10);
        ctx.font = "bold 16px Inter, system-ui, sans-serif";
        ctx.fillStyle = "#171717";
        ctx.textAlign = "center";
        ctx.fillText(id, size / 2, idY);

        // Separator
        const sepY = idY + 18;
        ctx.strokeStyle = "#E5E7EB";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(40, sepY);
        ctx.lineTo(size - 40, sepY);
        ctx.stroke();

        // Details
        if (details) {
          let dy = sepY + 14;
          ctx.font = "13px Inter, system-ui, sans-serif";
          const entries = Object.entries(details);
          entries.forEach(([key, value], i) => {
            const isLast = i === entries.length - 1;
            ctx.fillStyle = "#6B7280";
            ctx.textAlign = "left";
            ctx.fillText(key, 48, dy);
            ctx.fillStyle = "#171717";
            ctx.textAlign = "right";
            ctx.fillText(value, size - 48, dy);
            if (!isLast) dy += lineH;
          });
        }

        // Footer
        ctx.fillStyle = "#9CA3AF";
        ctx.font = "11px Inter, system-ui, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("capco-capacitors.com", size / 2, stickerH - 14);

        canvas.toBlob((pngBlob) => {
          if (!pngBlob) return;
          const pngUrl = URL.createObjectURL(pngBlob);
          const a = document.createElement("a");
          a.href = pngUrl;
          a.download = `${id.replace(/[^a-zA-Z0-9-_]/g, "_")}-sticker.png`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(pngUrl);
        }, "image/png");
      };
      img.src = url;
    };
  }, [id, type, details]);

  const typeLabel = type ? TYPE_LABELS[type] || type : null;
  const typeColor = type ? TYPE_COLORS[type] || "#00B6E2" : "#00B6E2";
  const detailEntries = details ? Object.entries(details) : [];
  const isSticker = !!(type && details);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#171717]/40 backdrop-blur-sm px-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={stickerRef}
        className="bg-white rounded-[14px] shadow-xl overflow-hidden max-w-[380px] w-full"
      >
        {/* Sticker content */}
        <div className="p-5 pb-3 flex flex-col items-center">
          {isSticker ? (
            <>
              {/* Header */}
              <div className="w-full bg-[#00B6E2] rounded-[10px] px-4 py-2.5 mb-5">
                <img
                  src="/logo%20(2).svg"
                  alt="Capco Capacitors"
                  className="h-8 w-auto brightness-0 invert"
                />
              </div>

              {/* QR code */}
              <div
                ref={svgRef}
                className="bg-white p-2 rounded-[10px] border border-[#EBEBEB] mb-6"
              >
                <QRCodeSVG value={id} size={160} level="M" />
              </div>

              {/* Type badge */}
              <div
                className="text-white text-[11px] font-semibold px-3 py-1 rounded-full mb-2"
                style={{ backgroundColor: typeColor }}
              >
                {typeLabel}
              </div>

              {/* Entity ID */}
              <p className="text-[#171717] text-[16px] font-bold mb-2 text-center break-all">
                {id}
              </p>

              {/* Separator */}
              <div className="w-full border-t border-[#E5E7EB] my-1" />

              {/* Details */}
              <div className="w-full space-y-1.5 py-2">
                {detailEntries.map(([key, value]) => (
                  <div key={key} className="flex justify-between text-[13px]">
                    <span className="text-[#6B7280]">{key}</span>
                    <span className="text-[#171717] font-medium text-right max-w-[60%] break-words">
                      {value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <p className="text-[#9CA3AF] text-[10px] mt-1">
                capco-capacitors.com
              </p>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between w-full mb-3">
                <p className="text-[14px] font-medium text-[#171717]">
                  QR Code
                </p>
                <button
                  onClick={onClose}
                  className="text-[#5C5C5C] hover:text-[#171717] transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div
                ref={svgRef}
                className="bg-white p-3 rounded-[8px] border border-[#EBEBEB]"
              >
                <QRCodeSVG value={id} size={180} level="M" />
              </div>
              <p className="text-[13px] text-[#5C5C5C] text-center break-all max-w-full mt-3">
                {id}
              </p>
            </>
          )}
        </div>

        {/* Buttons */}
        <div className="px-5 pb-5 flex flex-col gap-2">
          <button
            onClick={handleDownload}
            className="w-full h-[40px] bg-white border border-[#EBEBEB] text-[#5C5C5C] rounded-[8px] text-[14px] font-medium hover:bg-[#F5F7FA] transition-colors flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            {isSticker ? "Download Sticker" : "Download QR"}
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
