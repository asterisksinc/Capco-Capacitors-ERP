"use client";

import type { VendorPurchase, PaymentHistoryEntry } from "@/lib/data";
import { X, Printer } from "lucide-react";

interface PaymentReceiptModalProps {
  purchase: VendorPurchase;
  payment: PaymentHistoryEntry & { entryBalance: number; previousPaymentsTotal: number };
  onClose: () => void;
}

export function PaymentReceiptModal({ purchase, payment, onClose }: PaymentReceiptModalProps) {
  const totalValue = parseFloat(purchase.grandTotal || "0");
  
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 font-dm-sans overflow-y-auto">
      {/* Modal Container */}
      <div className="bg-white w-full max-w-2xl shadow-2xl relative my-auto mt-10 md:mt-auto flex flex-col">
        
        {/* Actions Header (Not printed) */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#EBEBEB] bg-[#F9FAFB] print:hidden shrink-0">
          <h2 className="text-[16px] font-semibold text-[#171717]">Payment Receipt</h2>
          <div className="flex items-center gap-3">
            <button 
              onClick={handlePrint}
              className="h-[36px] px-4 bg-white border border-[#EBEBEB] text-[#171717] rounded-[6px] flex items-center gap-2 text-[13px] font-medium transition-colors hover:bg-gray-50"
            >
              <Printer className="w-4 h-4 text-[#5C5C5C]" />
              Print
            </button>
            <button 
              onClick={onClose}
              className="h-[36px] w-[36px] flex items-center justify-center bg-white border border-[#EBEBEB] rounded-[6px] hover:bg-gray-50 transition-colors"
            >
              <X className="w-4 h-4 text-[#171717]" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Body */}
        <div className="p-8 md:p-12 overflow-y-auto bg-white print:p-0">
          <div className="print:block" id="printable-receipt">
            
            {/* Header */}
            <div className="flex justify-between items-start mb-10 border-b border-[#EBEBEB] pb-6">
              <div>
                <h1 className="text-2xl font-bold text-[#171717] tracking-tight">CAPCO CAPACITORS</h1>
                <p className="text-[14px] text-[#5C5C5C] mt-1">123 Industrial Phase II</p>
                <p className="text-[14px] text-[#5C5C5C]">Tech City, State, 12345</p>
              </div>
              <div className="text-right">
                <h2 className="text-2xl font-bold text-[#00B6E2] tracking-widest uppercase">Payment Receipt</h2>
                <p className="text-[14px] font-medium text-[#171717] mt-2">Receipt #: {payment.id}</p>
                <p className="text-[14px] text-[#5C5C5C]">Date: {payment.date}</p>
              </div>
            </div>

            {/* Vendor & Invoice Info */}
            <div className="flex justify-between items-start mb-10">
              <div>
                <p className="text-[12px] font-bold text-[#5C5C5C] uppercase tracking-wider mb-1">Received From / Vendor:</p>
                <p className="text-[16px] font-bold text-[#171717]">{purchase.vendorName}</p>
                <p className="text-[14px] text-[#5C5C5C]">Account: {purchase.vendorName.replace(/\s+/g, '-').toUpperCase()}-01</p>
              </div>
              <div className="text-right">
                <p className="text-[12px] font-bold text-[#5C5C5C] uppercase tracking-wider mb-1">Applied To Invoice:</p>
                <p className="text-[16px] font-bold text-[#171717]">{purchase.id}</p>
                <p className="text-[14px] text-[#5C5C5C]">Direction: {purchase.direction}</p>
              </div>
            </div>

            {/* Payment Details Table */}
            <div className="mb-10">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#FAFAFA] border-y border-[#EBEBEB]">
                    <th className="px-4 py-3 text-[13px] font-bold text-[#5C5C5C] uppercase">Description</th>
                    <th className="px-4 py-3 text-[13px] font-bold text-[#5C5C5C] uppercase text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-[#EBEBEB]">
                    <td className="px-4 py-4 text-[14px] text-[#171717]">Original Invoice Amount</td>
                    <td className="px-4 py-4 text-[14px] text-[#171717] text-right">₹{totalValue.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                  </tr>
                  <tr className="border-b border-[#EBEBEB]">
                    <td className="px-4 py-4 text-[14px] text-[#171717]">Previous Payments</td>
                    <td className="px-4 py-4 text-[14px] text-[#171717] text-right text-[#FB3748]">- ₹{payment.previousPaymentsTotal.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                  </tr>
                  <tr className="border-b border-[#EBEBEB] bg-[#F0FDFF]">
                    <td className="px-4 py-4 text-[14px] font-bold text-[#00B6E2]">Payment Received ({payment.paymentType})</td>
                    <td className="px-4 py-4 text-[14px] font-bold text-[#00B6E2] text-right">- ₹{parseFloat(payment.amountPaid).toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                  </tr>
                  <tr className="border-b-[2px] border-black bg-[#EAEFF4]">
                    <td className="px-4 py-4 text-[16px] font-bold text-[#171717]">Remaining Balance (Pending)</td>
                    <td className="px-4 py-4 text-[16px] font-bold text-[#171717] text-right">₹{payment.entryBalance.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {payment.notes && (
              <div className="mb-10">
                <p className="text-[12px] font-bold text-[#5C5C5C] uppercase tracking-wider mb-1">Notes / Remarks:</p>
                <p className="text-[14px] text-[#171717] bg-[#FAFAFA] p-3 rounded-[6px] border border-[#EBEBEB]">{payment.notes}</p>
              </div>
            )}

            {/* Footer */}
            <div className="mt-12 text-center text-[14px] font-bold italic text-[#171717]">
              Thank You For Your Business!
            </div>
            
          </div>
        </div>
      </div>

      {/* Print styles */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-receipt, #printable-receipt * {
            visibility: visible;
          }
          #printable-receipt {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 20px;
          }
        }
      `}} />
    </div>
  );
}
