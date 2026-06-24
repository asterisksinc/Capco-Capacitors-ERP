"use client";

import { useState } from "react";
import { NewPaymentForm } from "@/components/accountant/NewPaymentForm";
import { UpdatePaymentForm } from "@/components/accountant/UpdatePaymentForm";
import { MobileHeader } from "@/components/MobileHeader";

export default function AccountantPage() {
  const [view, setView] = useState<"menu" | "new" | "update">("menu");

  const renderContent = () => {
    if (view === "new") {
      return (
        <div className="p-6 flex justify-center">
          <div className="w-full max-w-4xl">
            <button 
              onClick={() => setView("menu")}
              className="mb-4 text-[#5C5C5C] hover:text-[#171717] text-sm"
            >
              ← Back to Menu
            </button>
            <NewPaymentForm />
          </div>
        </div>
      );
    }

    if (view === "update") {
      return (
        <div className="p-6 flex justify-center">
          <div className="w-full max-w-4xl">
            <button 
              onClick={() => setView("menu")}
              className="mb-4 text-[#5C5C5C] hover:text-[#171717] text-sm"
            >
              ← Back to Menu
            </button>
            <UpdatePaymentForm />
          </div>
        </div>
      );
    }

    return (
      <div className="flex h-[calc(100vh-72px)] items-center justify-center bg-[#FAFAFA]">
        <div className="flex flex-col gap-4 w-[400px] px-4">
          <button
            onClick={() => setView("new")}
            className="w-full h-[44px] bg-[#00B6E2] text-white rounded-[6px] text-[14px] font-medium shadow-sm hover:bg-[#0092b5] transition-colors"
          >
            ADD NEW PAYMENT ENTRY
          </button>
          <button
            onClick={() => setView("update")}
            className="w-full h-[44px] bg-white text-[#171717] border border-[#EBEBEB] rounded-[6px] text-[14px] font-medium shadow-sm hover:bg-gray-50 transition-colors"
          >
            UPDATE PAYMENT RECORD
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col w-full">
      <MobileHeader 
        title={view === "new" ? "New Payment" : view === "update" ? "Update Payment" : "Accountant"} 
        showMenu={false} 
      />
      <div className="h-14 md:hidden"></div>
      <div className="flex-1 w-full">
        {renderContent()}
      </div>
    </div>
  );
}
