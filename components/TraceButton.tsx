"use client";

import { Fingerprint } from "lucide-react";
import { useState } from "react";
import { useStore } from "@/hooks/useStore";
import { UniversalTraceModal } from "@/components/UniversalTraceModal";

export function TraceButton({ className = "" }: { className?: string }) {
  const { store } = useStore();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`w-[40px] h-[40px] flex items-center justify-center border border-[#EBEBEB] rounded-[6px] bg-white transition-colors hover:bg-gray-50 ${className}`}
        title="Trace Material"
      >
        <Fingerprint className="w-[18px] h-[18px] text-[#171717]" />
      </button>
      {isOpen && (
        <UniversalTraceModal
          store={store}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
