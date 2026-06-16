"use client";

import { useState } from "react";
import { useStore } from "@/hooks/useStore";
import type { VendorPurchaseItem } from "@/lib/data";
import { Plus, X } from "lucide-react";

export function NewPaymentForm() {
  const { addVendorPurchase } = useStore();
  const [vendorName, setVendorName] = useState("");
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().split("T")[0]);
  const [direction, setDirection] = useState<"Credit" | "Debit">("Credit");
  const [status, setStatus] = useState<"Paid" | "Partial Payment" | "Due">("Due");
  const [amountPaid, setAmountPaid] = useState("");
  const [paymentType, setPaymentType] = useState("Bank Transfer");
  const [notes, setNotes] = useState("");

  const [items, setItems] = useState<VendorPurchaseItem[]>([
    { id: "1", type: "", rate: "", quantity: "", total: "0" }
  ]);

  const [slipNumber] = useState(`PO-${Math.floor(Math.random() * 100000).toString().padStart(5, '0')}`);

  const handleItemChange = (index: number, field: keyof VendorPurchaseItem, value: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    // Auto calculate total
    if (field === "rate" || field === "quantity") {
      const rate = parseFloat(newItems[index].rate || "0");
      const qty = parseFloat(newItems[index].quantity || "0");
      newItems[index].total = (rate * qty).toString();
    }
    
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { id: Date.now().toString(), type: "", rate: "", quantity: "", total: "0" }]);
  };

  const grandTotal = items.reduce((sum, item) => sum + parseFloat(item.total || "0"), 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addVendorPurchase({
      id: slipNumber,
      vendorName,
      purchaseDate,
      direction,
      items,
      grandTotal: grandTotal.toString(),
      status,
      amountPaid,
      paymentType,
      notes,
      paymentHistory: amountPaid && parseFloat(amountPaid) > 0 ? [{
        id: `PH-${Date.now()}`,
        date: purchaseDate,
        amountPaid,
        paymentType,
        notes: "Initial payment"
      }] : []
    });
    alert(`Payment Entry ${slipNumber} recorded successfully!`);
  };

  const inputClasses = "w-full h-[44px] bg-[#FAFAFA] border border-[#EBEBEB] rounded-[8px] px-3 text-[14px] text-[#5C5C5C] placeholder:text-[#A1A1AA] focus:outline-none focus:border-[#00B6E2] transition-colors";
  const selectClasses = "w-full h-[44px] bg-white border border-[#EBEBEB] rounded-[8px] px-3 text-[14px] text-[#5C5C5C] appearance-none focus:outline-none focus:border-[#00B6E2] transition-colors";

  return (
    <div className="max-w-3xl mx-auto bg-white border border-[#EBEBEB] rounded-[12px] shadow-sm p-6">
      <h1 className="text-[18px] font-semibold text-[#171717] leading-tight mb-6 tracking-wide">NEW PAYMENT ENTRY</h1>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="text-[14px] font-medium text-[#5C5C5C] bg-[#FAFAFA] border border-[#EBEBEB] rounded-[8px] px-4 py-3 inline-block">
          SLIP NUMBER: [ {slipNumber} ]
        </div>

        <div className="space-y-3">
          <input
            type="text"
            placeholder="Vendor Name"
            required
            value={vendorName}
            onChange={(e) => setVendorName(e.target.value)}
            className={inputClasses}
          />
          <input
            type="date"
            required
            value={purchaseDate}
            onChange={(e) => setPurchaseDate(e.target.value)}
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

        <div className="space-y-4">
          <div className="flex justify-end">
            <button 
              type="button" 
              onClick={addItem}
              className="flex items-center gap-1 text-[14px] font-medium text-[#00B6E2] hover:text-[#0092b5] transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Item
            </button>
          </div>
          
          {items.map((item, index) => (
            <div key={item.id} className="space-y-3 p-5 bg-[#FAFAFA] border border-[#EBEBEB] rounded-[8px] relative">
              {items.length > 1 && (
                <button 
                  type="button"
                  onClick={() => setItems(items.filter((_, i) => i !== index))}
                  className="absolute top-2 right-2 p-1 text-[#A1A1AA] hover:text-[#FB3748] transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <select
                required
                value={item.type}
                onChange={(e) => handleItemChange(index, "type", e.target.value)}
                className={selectClasses}
              >
                <option value="" disabled>Select Capacitor Type </option>
                <option value="Motor">Motor</option>
                <option value="Power">Power</option>
                <option value="Snubber">Snubber</option>
                <option value="General">General</option>
              </select>
              <input
                type="number"
                placeholder="Rate: ₹"
                required
                min="0"
                step="0.01"
                value={item.rate}
                onChange={(e) => handleItemChange(index, "rate", e.target.value)}
                className={inputClasses}
              />
              <input
                type="number"
                placeholder="Quantity:"
                required
                min="1"
                value={item.quantity}
                onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                className={inputClasses}
              />
              <input
                type="text"
                readOnly
                placeholder="Total: Rate x Quantity"
                value={`Total: ₹${item.total}`}
                className="w-full h-[44px] bg-[#EAEFF4] border border-[#EBEBEB] rounded-[8px] px-3 text-[14px] font-medium text-[#171717] focus:outline-none"
              />
            </div>
          ))}
        </div>

        <div className="pt-4">
          <input
            type="text"
            readOnly
            value={`GRAND TOTAL: ₹${grandTotal.toFixed(2)}`}
            className="w-full h-[52px] bg-[#EAEFF4] border border-[#EBEBEB] rounded-[8px] px-4 text-[16px] font-semibold text-[#171717] focus:outline-none uppercase text-center"
          />
        </div>

        <div className="space-y-3 pt-6 border-t border-[#EBEBEB]">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as "Paid" | "Partial Payment" | "Due")}
            className={selectClasses}
          >
            <option value="Paid">Status: Paid</option>
            <option value="Partial Payment">Status: Partial Payment</option>
            <option value="Due">Status: Due</option>
          </select>
          <input
            type="number"
            placeholder="Amount Paid: ₹"
            min="0"
            step="0.01"
            value={amountPaid}
            onChange={(e) => setAmountPaid(e.target.value)}
            className={inputClasses}
          />
          <select
            value={paymentType}
            onChange={(e) => setPaymentType(e.target.value)}
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
            className="w-full bg-[#FAFAFA] border border-[#EBEBEB] rounded-[8px] px-3 py-2.5 text-[14px] text-[#5C5C5C] placeholder:text-[#A1A1AA] focus:outline-none focus:border-[#00B6E2] transition-colors resize-none"
          />
        </div>

        <button
          type="submit"
          className="h-[44px] w-full bg-[#00B6E2] text-white text-[14px] font-medium rounded-[8px] hover:bg-[#0092b5] transition-colors uppercase mt-6"
        >
          ENTER PAYMENT RECORD
        </button>
      </form>
    </div>
  );
}
