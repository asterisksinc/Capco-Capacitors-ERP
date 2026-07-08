"use client";
import { MobileHeader } from "@/components/MobileHeader";

import { useState, useEffect } from "react";
import { ArrowLeft, Download, FileText, Loader2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { InvoiceViewModal } from "@/components/admin/InvoiceViewModal";
import { PaymentReceiptModal } from "@/components/admin/PaymentReceiptModal";
import type { PaymentHistoryEntry } from "@/lib/data";
import { vendorPurchaseService } from "@/src/services/vendorPurchaseService";

export default function VendorPurchaseDetailPage() {
  const pathname = usePathname();
  const id = pathname.split("/").pop() || "";
  
  const [loading, setLoading] = useState(true);
  const [purchase, setPurchase] = useState<any>(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<(PaymentHistoryEntry & { entryBalance: number; previousPaymentsTotal: number }) | null>(null);

  useEffect(() => {
    async function fetchPurchaseDetails() {
      try {
        const data = await vendorPurchaseService.getById(id) as any;
        if (data) {
          setPurchase({
            id: data.purchase_no || data.id,
            vendorName: data.vendor_name || "-",
            purchaseDate: data.purchase_date ? new Date(data.purchase_date).toLocaleDateString("en-GB") : "-",
            direction: data.direction || "Credit",
            grandTotal: String(data.order_amount || 0),
            amountPaid: String(data.paid_amount || 0),
            status: data.status || "Due",
            // For now, if there is no payment history in the DB, default to empty
            paymentHistory: data.paymentHistory || [] 
          });
        }
      } catch (err) {
        console.error("Failed to load purchase:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPurchaseDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="font-dm-sans min-h-[calc(100vh-72px)] bg-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#00B6E2]" />
      </div>
    );
  }

  if (!purchase) {
    return (
      <div className="font-dm-sans min-h-[calc(100vh-72px)] bg-white flex items-center justify-center">
        <p className="text-[#5C5C5C]">Purchase Order not found.</p>
      </div>
    );
  }

  const totalValue = parseFloat(purchase.grandTotal || "0");
  const paidSoFar = parseFloat(purchase.amountPaid || "0");
  const outstanding = totalValue - paidSoFar;

  return (
    <div className="font-dm-sans min-h-[calc(100vh-72px)] bg-[#FAFAFA] flex flex-col w-full max-w-full pb-10">
      {/* MOBILE TOP NAVIGATION BAR */}
      <MobileHeader title="Purchase Details" />

      {/* MOBILE HEADER SPACER */}
      <div className="h-14 md:hidden"></div>

      {/* HEADER */}
      <section className="bg-white border-b border-[#EBEBEB]">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              href="/admin/vendor-purchases"
              className="w-8 h-8 flex items-center justify-center border border-[#EBEBEB] rounded-[6px] hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 text-[#171717]" />
            </Link>
            <div className="flex flex-col">
              <h1 className="text-[20px] font-semibold text-[#171717]">Vendor Purchase: {purchase.id}</h1>
              <p className="text-[14px] text-[#5C5C5C] mt-0.5">
                {purchase.vendorName} • {purchase.purchaseDate}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsInvoiceModalOpen(true)}
              className="h-[40px] px-4 bg-white border border-[#00B6E2] text-[#00B6E2] rounded-[6px] flex items-center gap-2 text-[14px] font-medium transition-colors hover:bg-[#F0FDFF]"
            >
              <FileText className="w-4 h-4" />
              View Invoice
            </button>
            <button className="h-[40px] px-4 bg-[#00B6E2] text-white rounded-[6px] flex items-center gap-2 text-[14px] font-medium transition-colors hover:bg-[#0092b5]">
              <Download className="w-4 h-4" />
              Download
            </button>
          </div>
        </div>
      </section>

      {/* KPIs */}
      <section className="px-4 md:px-6 py-6">
        <h2 className="text-[16px] font-semibold text-[#171717] mb-4">Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-[#EBEBEB] p-5 rounded-[12px] shadow-sm flex flex-col gap-1">
            <p className="text-[13px] text-[#5C5C5C]">Total Purchase Value</p>
            <p className="text-[24px] font-semibold text-[#171717]">₹{totalValue.toLocaleString()}</p>
          </div>
          <div className="bg-white border border-[#EBEBEB] p-5 rounded-[12px] shadow-sm flex flex-col gap-1">
            <p className="text-[13px] text-[#5C5C5C]">Paid</p>
            <p className="text-[24px] font-semibold text-[#1CB061]">₹{paidSoFar.toLocaleString()}</p>
          </div>
          <div className="bg-white border border-[#EBEBEB] p-5 rounded-[12px] shadow-sm flex flex-col gap-1">
            <p className="text-[13px] text-[#5C5C5C]">Outstanding</p>
            <p className="text-[24px] font-semibold text-[#FB3748]">₹{outstanding.toLocaleString()}</p>
          </div>
          <div className="bg-white border border-[#EBEBEB] p-5 rounded-[12px] shadow-sm flex flex-col justify-center items-start gap-2">
            <p className="text-[13px] text-[#5C5C5C]">Status</p>
            {purchase.status === "Due" && (
              <span className="inline-flex px-3 py-1.5 rounded-full bg-[#FFF0F1] text-[#FB3748] text-[13px] font-medium border border-[#FADCDD]">
                Due
              </span>
            )}
            {purchase.status === "Partial Payment" && (
              <span className="inline-flex px-3 py-1.5 rounded-full bg-[#FFF4ED] text-[#E19242] text-[13px] font-medium border border-[#FDE3CE]">
                Partial Payment
              </span>
            )}
            {purchase.status === "Paid" && (
              <span className="inline-flex px-3 py-1.5 rounded-full bg-[#E8F8F0] text-[#1CB061] text-[13px] font-medium border border-[#B6EACF]">
                Paid in Full
              </span>
            )}
          </div>
        </div>
      </section>

      {/* INVOICE HISTORY TABLE */}
      <section className="px-4 md:px-6 flex-1 flex flex-col">
        <h2 className="text-[16px] font-semibold text-[#171717] mb-4">Transaction History</h2>
        <div className="bg-white border border-[#EBEBEB] rounded-[12px] overflow-hidden shadow-sm flex-1">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-[#EBEBEB] bg-[#F9FAFB]">
                  <th className="px-6 py-4 text-[13px] font-semibold text-[#171717]">Transaction ID</th>
                  <th className="px-6 py-4 text-[13px] font-semibold text-[#171717]">Payment Date</th>
                  <th className="px-6 py-4 text-[13px] font-semibold text-[#171717]">Direction</th>
                  <th className="px-6 py-4 text-[13px] font-semibold text-[#171717]">Paid Amount</th>
                  <th className="px-6 py-4 text-[13px] font-semibold text-[#171717]">Balance Amount</th>
                  <th className="px-6 py-4 text-[13px] font-semibold text-[#171717]">Transaction Type</th>
                  <th className="px-6 py-4 text-[13px] font-semibold text-[#171717]">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EBEBEB]">
                {(!purchase.paymentHistory || purchase.paymentHistory.length === 0) ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-10 text-center text-[#5C5C5C] text-[14px]">
                      No transaction history found.
                    </td>
                  </tr>
                ) : (
                  purchase.paymentHistory.map((ph: any, idx: number, arr: any[]) => {
                    const chronHistory = [...arr].reverse();
                    
                    let runningTotalPaid = 0;
                    const tableRows = chronHistory.map(entry => {
                      const entryAmt = parseFloat(entry.amountPaid || "0");
                      const previousPaymentsTotal = runningTotalPaid;
                      runningTotalPaid += entryAmt;
                      const entryBalance = totalValue - runningTotalPaid;
                      return {
                        ...entry,
                        entryBalance,
                        previousPaymentsTotal
                      };
                    });

                    return tableRows.reverse().map((row, i) => (
                      <tr key={row.id} className="hover:bg-[#F9FAFB] transition-colors">
                        <td className="px-6 py-4 text-[14px] font-medium text-[#171717]">{row.id}</td>
                        <td className="px-6 py-4 text-[14px] text-[#5C5C5C]">{row.date}</td>
                        <td className="px-6 py-4 text-[14px] text-[#5C5C5C]">{purchase.direction}</td>
                        <td className="px-6 py-4 text-[14px] text-[#171717] font-medium">₹{parseFloat(row.amountPaid).toLocaleString()}</td>
                        <td className="px-6 py-4 text-[14px] text-[#5C5C5C]">₹{row.entryBalance.toLocaleString()}</td>
                        <td className="px-6 py-4 text-[14px] text-[#5C5C5C]">
                          <span className="inline-flex px-2.5 py-1 rounded-[6px] bg-[#F5F7FA] border border-[#EBEBEB] text-[#5C5C5C] text-[12px] font-medium">
                            {row.paymentType}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button 
                            onClick={() => setSelectedReceipt(row)}
                            className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#00B6E2] hover:text-[#0092b5] hover:underline"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            Receipt
                          </button>
                        </td>
                      </tr>
                    ));
                  })[0] // Since we mapped inside, we only want the result array once
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {isInvoiceModalOpen && (
        <InvoiceViewModal 
          purchase={purchase} 
          onClose={() => setIsInvoiceModalOpen(false)} 
        />
      )}

      {selectedReceipt && (
        <PaymentReceiptModal
          purchase={purchase}
          payment={selectedReceipt}
          onClose={() => setSelectedReceipt(null)}
        />
      )}
    </div>
  );
}
