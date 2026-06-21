"use client";

import { useState, useRef, useCallback } from "react";
import { QrCode, X } from "lucide-react";
import { Scanner, type IDetectedBarcode, type IScannerError } from "@yudiel/react-qr-scanner";

interface ScannerInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onScanData?: (data: string) => void;
  containerClassName?: string;
}

export function ScannerInput({ onScanData, containerClassName = "", className = "", ...props }: ScannerInputProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const scanLockRef = useRef(false);

  const handleScan = useCallback((detectedCodes: IDetectedBarcode[]) => {
    if (scanLockRef.current) return;
    const rawValue = detectedCodes[0]?.rawValue;
    if (!rawValue) return;

    scanLockRef.current = true;
    setIsScanning(false);
    
    // Simulate an onChange event or call onScanData directly
    if (onScanData) {
      onScanData(rawValue);
    } else if (props.onChange) {
      // Create a synthetic event
      const syntheticEvent = {
        target: { value: rawValue, name: props.name },
        currentTarget: { value: rawValue, name: props.name }
      } as any;
      props.onChange(syntheticEvent);
    }
    
    setTimeout(() => { scanLockRef.current = false; }, 1500);
  }, [onScanData, props]);

  const handleError = useCallback((err: IScannerError) => {
    const msg = err?.message || "";
    if (msg.includes("Permission") || msg.includes("permission") || msg.includes("denied")) {
      setScanError("Camera permission denied.");
    } else if (msg.includes("NotFoundError") || msg.includes("not found") || msg.includes("NotFound")) {
      setScanError("No camera found on this device.");
    } else if (err.kind === "in-use") {
      setScanError("Camera is already in use by another application.");
    } else {
      setScanError(msg || "Failed to start camera.");
    }
  }, []);

  return (
    <div className={`relative flex items-center ${containerClassName}`}>
      <input
        {...props}
        className={`w-full pr-10 ${className}`}
      />
      <button
        type="button"
        onClick={() => setIsScanning(true)}
        className="absolute right-3 text-[#A1A1AA] hover:text-[#00B6E2] transition-colors"
        title="Scan Barcode"
      >
        <QrCode className="w-5 h-5" />
      </button>

      {isScanning && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#171717]/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-[12px] p-6 flex flex-col items-center gap-4 shadow-lg max-w-[360px] w-full animate-slide-up">
            <div className="flex items-center justify-between w-full">
              <p className="text-[14px] font-medium text-[#171717]">Scan Barcode</p>
              <button onClick={() => setIsScanning(false)} className="text-[#5C5C5C] hover:text-[#171717] transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="w-full aspect-[4/3] bg-black rounded-[8px] overflow-hidden relative flex items-center justify-center">
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

            <p className="text-[12px] text-[#5C5C5C] text-center">
              Position the barcode within the frame.
            </p>

            <button
              onClick={() => setIsScanning(false)}
              className="w-full h-[40px] bg-white border border-[#EBEBEB] text-[#5C5C5C] rounded-[8px] text-[14px] font-medium hover:bg-[#F5F7FA] transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
