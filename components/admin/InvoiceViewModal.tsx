"use client";

import type { VendorPurchase } from "@/lib/data";
import { X, Printer } from "lucide-react";

interface InvoiceViewModalProps {
  purchase: VendorPurchase;
  onClose: () => void;
}

export function InvoiceViewModal({ purchase, onClose }: InvoiceViewModalProps) {
  const totalValue = parseFloat(purchase.grandTotal || "0");
  const paidSoFar = parseFloat(purchase.amountPaid || "0");
  const outstanding = totalValue - paidSoFar;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 font-dm-sans overflow-y-auto">
      {/* Modal Container */}
      <div className="bg-white w-full max-w-4xl shadow-2xl relative my-auto mt-10 md:mt-auto flex flex-col max-h-[90vh]">
        
        {/* Actions Header (Not printed) */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#EBEBEB] bg-[#F9FAFB] print:hidden shrink-0">
          <h2 className="text-[16px] font-semibold text-[#171717]">View Invoice</h2>
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

        {/* Printable Invoice Body */}
        <div className="p-8 md:p-12 overflow-y-auto bg-white print:p-0">
          <div className="print:block" id="printable-invoice">
            
            {/* Header */}
            <div className="flex justify-between items-start mb-12">
              <div>
                <h1 className="text-3xl font-bold text-[#171717] tracking-tight">CAPCO CAPACITORS</h1>
                <p className="text-[14px] text-[#5C5C5C] mt-1">123 Industrial Phase II</p>
                <p className="text-[14px] text-[#5C5C5C]">Tech City, State, 12345</p>
                <p className="text-[14px] text-[#5C5C5C]">Phone: (555) 123-4567</p>
              </div>
              <div className="text-right">
                <h2 className="text-4xl font-bold text-[#00B6E2] tracking-widest uppercase">Invoice</h2>
                <div className="mt-4 flex flex-col items-end gap-1 text-[14px]">
                  <div className="flex gap-4">
                    <span className="text-[#5C5C5C] font-medium w-24">DATE:</span>
                    <span className="text-[#171717] w-32 text-right">{purchase.purchaseDate}</span>
                  </div>
                  <div className="flex gap-4">
                    <span className="text-[#5C5C5C] font-medium w-24">INVOICE #:</span>
                    <span className="text-[#171717] w-32 text-right">{purchase.id}</span>
                  </div>
                  <div className="flex gap-4">
                    <span className="text-[#5C5C5C] font-medium w-24">DIRECTION:</span>
                    <span className="text-[#171717] w-32 text-right">{purchase.direction}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bill To */}
            <div className="mb-10">
              <div className="bg-[#00B6E2] text-white px-4 py-1.5 font-bold uppercase tracking-wider text-[13px] inline-block w-64 mb-2">
                VENDOR / BILL TO:
              </div>
              <div className="px-4">
                <p className="text-[16px] font-bold text-[#171717]">{purchase.vendorName}</p>
                <p className="text-[14px] text-[#5C5C5C] mt-1">Account ID: {purchase.vendorName.replace(/\s+/g, '-').toUpperCase()}-01</p>
              </div>
            </div>

            {/* Items Table */}
            <div className="mb-8">
              <table className="w-full text-left border-collapse border border-[#171717]">
                <thead>
                  <tr className="bg-[#00B6E2] text-white">
                    <th className="px-4 py-2 text-[13px] font-bold uppercase border-r border-white/20">Item #</th>
                    <th className="px-4 py-2 text-[13px] font-bold uppercase border-r border-white/20 w-1/2">Description</th>
                    <th className="px-4 py-2 text-[13px] font-bold uppercase border-r border-white/20 text-right">Rate</th>
                    <th className="px-4 py-2 text-[13px] font-bold uppercase border-r border-white/20 text-center">Qty</th>
                    <th className="px-4 py-2 text-[13px] font-bold uppercase text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {purchase.items && purchase.items.length > 0 ? (
                    purchase.items.map((item, idx) => (
                      <tr key={item.id} className="border-b border-[#EBEBEB]">
                        <td className="px-4 py-3 text-[14px] text-[#171717] border-r border-[#EBEBEB]">{(idx + 1).toString().padStart(2, '0')}</td>
                        <td className="px-4 py-3 text-[14px] text-[#171717] border-r border-[#EBEBEB]">{item.type} Capacitor</td>
                        <td className="px-4 py-3 text-[14px] text-[#171717] border-r border-[#EBEBEB] text-right">₹{parseFloat(item.rate || "0").toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                        <td className="px-4 py-3 text-[14px] text-[#171717] border-r border-[#EBEBEB] text-center">{item.quantity}</td>
                        <td className="px-4 py-3 text-[14px] text-[#171717] text-right">₹{parseFloat(item.total || "0").toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                      </tr>
                    ))
                  ) : (
                    <tr className="border-b border-[#EBEBEB]">
                      <td colSpan={5} className="px-4 py-6 text-center text-[14px] text-[#5C5C5C]">No items available.</td>
                    </tr>
                  )}
                  {/* Empty rows to fill space */}
                  {Array.from({ length: Math.max(0, 5 - (purchase.items?.length || 0)) }).map((_, i) => (
                    <tr key={`empty-${i}`} className="border-b border-[#EBEBEB]">
                      <td className="px-4 py-4 border-r border-[#EBEBEB]"></td>
                      <td className="px-4 py-4 border-r border-[#EBEBEB]"></td>
                      <td className="px-4 py-4 border-r border-[#EBEBEB]"></td>
                      <td className="px-4 py-4 border-r border-[#EBEBEB]"></td>
                      <td className="px-4 py-4"></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals & Notes */}
            <div className="flex justify-between items-start">
              <div className="w-1/2 pr-8">
                <div className="bg-[#F9FAFB] border border-[#EBEBEB] p-4 text-[13px] text-[#5C5C5C]">
                  <p className="font-bold text-[#171717] mb-2 uppercase">Other Comments or Special Instructions</p>
                  <p>1. Status: {purchase.status}</p>
                  {purchase.notes && <p>2. {purchase.notes}</p>}
                </div>
                
                <div className="mt-12 text-center text-[14px] font-bold italic text-[#171717]">
                  Thank You For Your Business!
                </div>
              </div>

              <div className="w-1/2">
                <table className="w-full text-right border-collapse">
                  <tbody>
                    <tr className="bg-[#EAEFF4] border-t border-[#EBEBEB]">
                      <td className="py-3 text-[16px] font-bold text-[#171717] pr-4">GRAND TOTAL</td>
                      <td className="py-3 text-[16px] font-bold text-[#171717]">₹{totalValue.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                    </tr>
                    <tr>
                      <td className="py-3 text-[14px] text-[#1CB061] font-bold pr-4">AMOUNT PAID</td>
                      <td className="py-3 text-[14px] text-[#1CB061] font-bold border-b border-[#EBEBEB]">₹{paidSoFar.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                    </tr>
                    <tr>
                      <td className="py-3 text-[16px] text-[#FB3748] font-bold pr-4">BALANCE DUE</td>
                      <td className="py-3 text-[16px] text-[#FB3748] font-bold">₹{outstanding.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-16 text-center text-[12px] text-[#A1A1AA] pt-4 border-t border-[#EBEBEB] print:hidden">
              This is a digital view of the invoice. Formatting may vary slightly when printed.
            </div>

          </div>
        </div>
      </div>

      {/* Print styles injected directly to ensure it works nicely */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-invoice, #printable-invoice * {
            visibility: visible;
          }
          #printable-invoice {
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
