"use client";

import { useState, useMemo } from "react";
import { useStore } from "@/hooks/useStore";

export function UpdatePaymentForm() {
  const { vendorPurchases, updateVendorPurchase } = useStore();
  const [selectedVendor, setSelectedVendor] = useState("");
  const [selectedPO, setSelectedPO] = useState("");
  
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split("T")[0]);
  const [direction, setDirection] = useState<"Credit" | "Debit">("Credit");
  const [amountPaid, setAmountPaid] = useState("");
  const [paymentType, setPaymentType] = useState("Bank Transfer");
  const [notes, setNotes] = useState("");

  const uniqueVendors = useMemo(() => {
    const vendors = new Set(vendorPurchases.map(p => p.vendorName));
    return Array.from(vendors);
  }, [vendorPurchases]);

  const availablePOs = useMemo(() => {
    if (!selectedVendor) return [];
    return vendorPurchases.filter(p => p.vendorName === selectedVendor);
  }, [selectedVendor, vendorPurchases]);

  useMemo(() => {
    if (availablePOs.length === 1 && selectedPO !== availablePOs[0].id) {
      setSelectedPO(availablePOs[0].id);
    } else if (availablePOs.length === 0) {
      setSelectedPO("");
    }
  }, [availablePOs, selectedPO]);

  const purchaseRecord = useMemo(() => {
    if (!selectedPO) return null;
    return vendorPurchases.find(p => p.id === selectedPO) || null;
  }, [selectedPO, vendorPurchases]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPO || !amountPaid) return;
    
    updateVendorPurchase(selectedPO, parseFloat(amountPaid), paymentType, notes);
    setAmountPaid("");
    setNotes("");
    alert("Payment Record Updated Successfully!");
  };

  const inputClasses = "w-full h-[44px] bg-[#FAFAFA] border border-[#EBEBEB] rounded-[8px] px-3 text-[14px] text-[#5C5C5C] placeholder:text-[#A1A1AA] focus:outline-none focus:border-[#00B6E2] transition-colors disabled:bg-gray-100 disabled:opacity-70";
  const selectClasses = "w-full h-[44px] bg-white border border-[#EBEBEB] rounded-[8px] px-3 text-[14px] text-[#5C5C5C] appearance-none focus:outline-none focus:border-[#00B6E2] transition-colors disabled:bg-gray-100 disabled:opacity-70";
  const readOnlyClasses = "w-full h-[44px] bg-[#EAEFF4] border border-[#EBEBEB] rounded-[8px] px-3 text-[14px] font-medium text-[#171717] focus:outline-none text-center uppercase";

  const renderHistory = () => {
    if (!purchaseRecord) return null;

    const grandTotal = parseFloat(purchaseRecord.grandTotal || "0");
    const paidSoFar = parseFloat(purchaseRecord.amountPaid || "0");
    const due = grandTotal - paidSoFar;
    const isClosed = due <= 0;

    return (
      <div className="w-full md:w-50 shrink-0 md:border-l border-[#EBEBEB] md:pl-6 space-y-6 pt-6 md:pt-0 text-[14px] text-[#5C5C5C]">
        <div className="bg-[#FAFAFA] p-4 rounded-[8px] border border-[#EBEBEB]">
          <p className="font-semibold mb-2 text-[12px] text-[#171717] uppercase tracking-wider">Upon Creating New Record:</p>
          <div className="space-y-1">
            <p className="flex justify-between"><span>Grand total:</span> <span className="font-medium text-[#171717]">₹{grandTotal.toLocaleString()}</span></p>
            {purchaseRecord.paymentHistory && purchaseRecord.paymentHistory.length > 0 && (
              <>
                <p className="flex justify-between"><span>Paid on first:</span> <span>₹{parseFloat(purchaseRecord.paymentHistory[purchaseRecord.paymentHistory.length - 1].amountPaid).toLocaleString()}</span></p>
                <p className="flex justify-between"><span>Due:</span> <span>₹{(grandTotal - parseFloat(purchaseRecord.paymentHistory[purchaseRecord.paymentHistory.length - 1].amountPaid)).toLocaleString()}</span></p>
              </>
            )}
          </div>
        </div>

        {purchaseRecord.paymentHistory && purchaseRecord.paymentHistory.slice().reverse().map((ph, idx, arr) => {
          if (idx === 0 && arr.length > 1) return null; 
          
          return (
            <div key={ph.id} className="pt-4 border-t border-[#EBEBEB]">
              <p className="font-semibold mb-2 text-[12px] text-[#171717] uppercase tracking-wider">{idx === 0 ? "Initial Record:" : `${idx}st Update Record:`}</p>
              <div className="space-y-1">
                <p className="flex justify-between"><span>Paid:</span> <span>₹{parseFloat(ph.amountPaid).toLocaleString()}</span></p>
                <p className="flex justify-between"><span>Type:</span> <span>{ph.paymentType}</span></p>
                <p className="text-[#A1A1AA] text-[12px] mt-2">{ph.date}</p>
              </div>
            </div>
          );
        })}

        <div className="pt-4 border-t border-[#EBEBEB] font-medium text-[#171717] space-y-1">
          <p className="flex justify-between"><span>Current Total Paid:</span> <span>₹{paidSoFar.toLocaleString()}</span></p>
          <p className="flex justify-between text-[#FB3748]"><span>Current Due:</span> <span>₹{due.toLocaleString()} Pending</span></p>
        </div>

        {isClosed && (
          <div className="pt-4 text-center">
            <span className="inline-block px-4 py-1.5 bg-[#E8F8F0] text-[#1CB061] text-[12px] font-bold rounded-full uppercase tracking-widest border border-[#B6EACF]">
              Invoice Closed
            </span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row gap-8 items-start bg-white border border-[#EBEBEB] rounded-[12px] p-6 shadow-sm">
        <div className="flex-1 w-full min-w-0">
          <h1 className="text-[18px] font-semibold text-[#171717] leading-tight mb-6 tracking-wide uppercase">Update Payment Record</h1>

          <form onSubmit={handleSubmit} className="space-y-6">

            <div className="space-y-3">
              <select
                value={selectedVendor}
                onChange={(e) => setSelectedVendor(e.target.value)}
                className={selectClasses}
              >
                <option value="">Select Vendor Name </option>
                {uniqueVendors.map(v => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>

              <select
                required
                value={selectedPO}
                onChange={(e) => setSelectedPO(e.target.value)}
                disabled={!selectedVendor}
                className={selectClasses}
              >
                <option value="">Purchase Order ID </option>
                {availablePOs.map(po => (
                  <option key={po.id} value={po.id}>{po.id}</option>
                ))}
              </select>

              <input
                type="date"
                required
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                className={inputClasses}
              />

              <select
                value={direction}
                onChange={(e) => setDirection(e.target.value as "Credit" | "Debit")}
                className={selectClasses}
              >
                <option value="Credit">Direction: Credit [ Incoming ]</option>
                <option value="Debit">Direction: Debit [ Outgoing ]</option>
              </select>
            </div>

            <div className="space-y-3 pt-4 border-t border-[#EBEBEB]">
              <input
                type="text"
                readOnly
                value={`GRAND TOTAL: ₹${purchaseRecord ? parseFloat(purchaseRecord.grandTotal || "0").toLocaleString() : "0.00"}`}
                className={readOnlyClasses}
              />
              <input
                type="text"
                readOnly
                value={`TOTAL PAID : ₹${purchaseRecord ? parseFloat(purchaseRecord.amountPaid || "0").toLocaleString() : "0.00"}`}
                className={readOnlyClasses}
              />
            </div>

            <div className="space-y-3 pt-6 border-t border-[#EBEBEB]">
              <input
                type="number"
                placeholder="Rate: ₹ new payment amount"
                required
                min="0.01"
                step="0.01"
                value={amountPaid}
                onChange={(e) => setAmountPaid(e.target.value)}
                disabled={!purchaseRecord || parseFloat(purchaseRecord.amountPaid || "0") >= parseFloat(purchaseRecord.grandTotal || "0")}
                className={inputClasses}
              />
              <select
                value={paymentType}
                onChange={(e) => setPaymentType(e.target.value)}
                disabled={!purchaseRecord}
                className={selectClasses}
              >
                <option value="Bank Transfer">Payment Type: Bank Transfer</option>
                <option value="UPI">Payment Type: UPI</option>
                <option value="Cash">Payment Type: Cash</option>
              </select>
              <textarea
                placeholder="Add Notes"
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                disabled={!purchaseRecord}
                className="w-full bg-[#FAFAFA] border border-[#EBEBEB] rounded-[8px] px-3 py-2.5 text-[14px] text-[#5C5C5C] placeholder:text-[#A1A1AA] focus:outline-none focus:border-[#00B6E2] transition-colors resize-none disabled:bg-gray-100 disabled:opacity-70"
              />
            </div>

            <button
              type="submit"
              disabled={!purchaseRecord || parseFloat(purchaseRecord.amountPaid || "0") >= parseFloat(purchaseRecord.grandTotal || "0")}
              className="h-[44px] w-full bg-[#00B6E2] text-white text-[14px] font-medium rounded-[8px] hover:bg-[#0092b5] transition-colors uppercase mt-6 disabled:bg-[#A1A1AA] disabled:cursor-not-allowed"
            >
              UPDATE PAYMENT RECORD
            </button>
          </form>
        </div>

        {renderHistory()}
      </div>
    </div>
  );
}
