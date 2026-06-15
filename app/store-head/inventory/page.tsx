"use client";

import { Plus, Search, X, Check, Package, Warehouse, Activity, Archive } from "lucide-react";
import { useState } from "react";
import { useStore } from "@/hooks/useStore";
import type { InventoryItem } from "@/lib/data";
import { MobileHeader } from "@/components/MobileHeader";

type ModalStep = 1 | 2 | 3;

type InventoryForm = {
  rawMaterialId: string;
  rollId: string;
  micron: string;
  width: string;
  weight: string;
  supplier: string;
};

const micronOptions = ["2", "2.5", "3", "3.5", "4", "4.5", "4.5HT", "5", "5.5", "6", "6.5", "7", "7.5"];
const supplierOptions = ["VedaCap Industries", "ElectroForge Capacitors", "NextGen Metallic Pvt Ltd"];

function StatusBadge({ status }: { status: string }) {
  if (status === "In Inventory") {
    return <span className="inline-flex items-center px-2 py-0.5 rounded-[12px] bg-[#E8F8F0] text-[#1CB061] text-[12px] font-medium leading-tight">In Inventory</span>;
  }
  if (status === "Being Used") {
    return <span className="inline-flex items-center px-2 py-0.5 rounded-[12px] bg-[#FFF4ED] text-[#E19242] text-[12px] font-medium leading-tight">Being Used</span>;
  }
  return <span className="inline-flex items-center px-2 py-0.5 rounded-[12px] bg-[#F2F4F7] text-[#667085] text-[12px] font-medium leading-tight">Used Completely</span>;
}

function getDateString() {
  const today = new Date();
  return `${String(today.getDate()).padStart(2, "0")}/${String(today.getMonth() + 1).padStart(2, "0")}/${today.getFullYear()}`;
}

function generateId(prefix: string) {
  return `${prefix}-${Math.floor(Math.random() * 10000).toString().padStart(4, "0")}`;
}

function hasPositiveNumber(value: string) {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) && parsed > 0;
}

const defaultForm: InventoryForm = {
  rawMaterialId: "",
  rollId: "",
  micron: "4.5",
  width: "1.0",
  weight: "",
  supplier: supplierOptions[0],
};

export default function StoreHeadInventoryPage() {
  const { store, mounted, addInventoryItem, updateInventoryStatus } = useStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState<ModalStep>(1);
  const [form, setForm] = useState<InventoryForm>({ ...defaultForm });
  const [showHint, setShowHint] = useState(false);

  const inventoryItems = store.inventoryItems;

  const filteredData = inventoryItems.filter((row) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      row.rawMaterialId.toLowerCase().includes(q) ||
      row.rollId.toLowerCase().includes(q) ||
      row.supplier.toLowerCase().includes(q)
    );
  });

  const totalItems = inventoryItems.length;
  const inInventory = inventoryItems.filter((r) => r.status === "In Inventory").length;
  const beingUsed = inventoryItems.filter((r) => r.status === "Being Used").length;
  const usedUp = inventoryItems.filter((r) => r.status === "Used Completely").length;

  const kpiStats = [
    { label: "Total Raw Materials", value: String(totalItems), icon: Package, valClass: "text-[#171717]", subtext: "Lots in stock" },
    { label: "In Inventory", value: String(inInventory), icon: Warehouse, valClass: "text-[#1CB061]", subtext: "Available" },
    { label: "Being Used", value: String(beingUsed), icon: Activity, valClass: "text-[#E19242]", subtext: "In process" },
    { label: "Used Completely", value: String(usedUp), icon: Archive, valClass: "text-[#667085]", subtext: "Depleted" },
  ];

  const isFormValid = () => {
    return Boolean(
      form.rawMaterialId.trim() &&
      form.rollId.trim() &&
      micronOptions.includes(form.micron) &&
      form.width.trim() &&
      hasPositiveNumber(form.weight) &&
      form.supplier.trim(),
    );
  };

  const resetForm = () => {
    setForm({ ...defaultForm, rawMaterialId: generateId("RM"), rollId: `RL-${generateId("")}` });
    setModalStep(1);
    setShowHint(false);
  };

  const openModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleSubmit = () => {
    if (!isFormValid()) {
      setShowHint(true);
      return;
    }
    addInventoryItem({
      rawMaterialId: form.rawMaterialId,
      rollId: form.rollId,
      micron: form.micron,
      width: form.width,
      weight: `${form.weight}kgs`,
      supplier: form.supplier,
      date: getDateString(),
      status: "In Inventory",
    });
    setModalStep(3);
  };

  if (!mounted) return null;

  const renderModalBody = () => {
    if (modalStep === 2) {
      return (
        <div className="px-6 py-6 flex flex-col gap-5">
          <div className="rounded-[10px] border border-[#DDE1E8] bg-[#FAFCFF] p-4">
            <p className="text-[15px] font-semibold text-[#1F2937] mb-1">Review</p>
            <p className="text-[13px] text-[#6B7280]">Confirm the inventory item details before adding.</p>
          </div>
          <div className="rounded-[12px] border border-[#78CFFA] bg-[#F4FBFF] p-4 grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-6 text-[14px] text-[#49526A]">
            <p>RM ID: {form.rawMaterialId}</p>
            <p>Roll ID: {form.rollId}</p>
            <p>Micron: {form.micron}</p>
            <p>Width: {form.width}</p>
            <p>Weight: {form.weight}kgs</p>
            <p>Supplier: {form.supplier}</p>
          </div>
        </div>
      );
    }
    if (modalStep === 3) {
      return (
        <div className="px-6 py-8">
          <div className="rounded-[16px] border border-[#D6EEF9] bg-[radial-gradient(circle_at_center,_#ECF8FD_0%,_#F8FCFF_45%,_#FFFFFF_100%)] p-8 md:p-10 flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#E6F7FF] border border-[#9DDBF6] flex items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-[#00B6E2] flex items-center justify-center">
                <Check className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-[27px] leading-tight text-[#171717] font-semibold">Inventory item added successfully.</p>
          </div>
        </div>
      );
    }
    return (
      <div className="px-6 py-6 flex flex-col gap-5">
        <div className="rounded-[12px] border border-[#DDE1E8] p-4 bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-medium text-[#171717]">Raw Material ID</label>
              <input value={form.rawMaterialId} onChange={(e) => setForm({ ...form, rawMaterialId: e.target.value })} placeholder="Auto or enter" className="h-[42px] rounded-[8px] border border-[#DDE1E8] px-3 text-[14px]" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-medium text-[#171717]">Roll ID</label>
              <input value={form.rollId} onChange={(e) => setForm({ ...form, rollId: e.target.value })} placeholder="Auto or enter" className="h-[42px] rounded-[8px] border border-[#DDE1E8] px-3 text-[14px]" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-medium text-[#171717]">Micron</label>
              <select value={form.micron} onChange={(e) => setForm({ ...form, micron: e.target.value })} className="h-[42px] rounded-[8px] border border-[#DDE1E8] px-3 text-[14px]">
                {micronOptions.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-medium text-[#171717]">Width</label>
              <input type="number" step="0.1" value={form.width} onChange={(e) => setForm({ ...form, width: e.target.value })} placeholder="Enter width" className="h-[42px] rounded-[8px] border border-[#DDE1E8] px-3 text-[14px]" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-medium text-[#171717]">Weight (Kgs)</label>
              <div className="relative">
                <input type="number" min="0.1" step="0.1" value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} placeholder="Enter weight" className="h-[42px] w-full rounded-[8px] border border-[#DDE1E8] pl-3 pr-12 text-[14px]" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[12px] font-medium text-[#5C5C5C]">Kgs</span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-medium text-[#171717]">Supplier</label>
              <select value={form.supplier} onChange={(e) => setForm({ ...form, supplier: e.target.value })} className="h-[42px] rounded-[8px] border border-[#DDE1E8] px-3 text-[14px]">
                {supplierOptions.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          </div>
        </div>
        {showHint && !isFormValid() && (
          <p className="text-[12px] text-[#D92D20]">All fields are mandatory.</p>
        )}
      </div>
    );
  };

  return (
    <div className="font-dm-sans min-h-[calc(100vh-72px)] bg-white flex flex-col overflow-x-hidden">
      <MobileHeader title="Inventory" />

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#171717]/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-[16px] w-full max-w-[660px] shadow-lg flex flex-col overflow-hidden">
            <div className="flex items-start justify-between px-6 py-5 border-b border-[#EBEBEB]">
              <div className="flex flex-col gap-1">
                <h2 className="text-[28px] leading-tight font-semibold text-[#171717]">Add Inventory Item</h2>
                <p className="text-[15px] text-[#5C5C5C]">Record a new raw material received from supplier</p>
              </div>
              <button onClick={closeModal} className="text-[#5C5C5C] hover:text-[#171717] transition-colors p-1"><X className="w-5 h-5" /></button>
            </div>
            <div className="max-h-[58vh] overflow-y-auto">{renderModalBody()}</div>
            <div className="flex items-center justify-between px-6 py-5 bg-[#FAFAFA] border-t border-[#EBEBEB]">
              {modalStep === 1 && (
                <>
                  <button onClick={closeModal} className="h-[40px] px-4 bg-white border border-[#EBEBEB] text-[#171717] text-[14px] font-medium rounded-[6px] hover:bg-gray-50">Cancel</button>
                  <button onClick={() => { if (!isFormValid()) { setShowHint(true); return; } setShowHint(false); setModalStep(2); }}
                    className={`h-[40px] px-5 text-[14px] font-medium rounded-[6px] ${isFormValid() ? "bg-[#00B6E2] text-white hover:bg-[#0092b5]" : "bg-[#A7DDEB] text-white cursor-not-allowed"}`}>Next</button>
                </>
              )}
              {modalStep === 2 && (
                <>
                  <button onClick={() => setModalStep(1)} className="h-[40px] px-4 bg-white border border-[#EBEBEB] text-[#171717] text-[14px] font-medium rounded-[6px] hover:bg-gray-50">Back</button>
                  <button onClick={handleSubmit}
                    className={`h-[40px] px-5 text-[14px] font-medium rounded-[6px] ${isFormValid() ? "bg-[#00B6E2] text-white hover:bg-[#0092b5]" : "bg-[#A7DDEB] text-white cursor-not-allowed"}`}>Add to Inventory</button>
                </>
              )}
              {modalStep === 3 && (
                <button onClick={closeModal} className="h-[40px] px-5 bg-[#00B6E2] text-white text-[14px] font-medium rounded-[6px] hover:bg-[#0092b5]">Done</button>
              )}
            </div>
          </div>
        </div>
      )}

      <section className="bg-white w-full flex justify-start border-b border-[#EBEBEB]">
        <div className="w-full px-4 md:px-6 pt-[72px] md:pt-6 pb-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 h-auto">
          <div className="flex flex-col gap-1">
            <h1 className="text-[16px] font-medium text-[#171717] leading-tight">Inventory</h1>
            <p className="text-[14px] font-normal text-[#5C5C5C] leading-tight hidden md:block">Raw material stock received from suppliers</p>
          </div>
          <button onClick={openModal} className="flex items-center justify-center gap-2 bg-[#00B6E2] text-white text-[14px] font-medium rounded-[6px] h-[40px] px-[18px] hover:bg-[#0092b5] transition-colors shrink-0 w-full sm:w-auto">
            <Plus className="w-5 h-5 shrink-0" strokeWidth={2.5} />
            <span className="leading-tight">Add Inventory</span>
          </button>
        </div>
      </section>

      <div className="w-full px-4 md:px-6 py-6 flex flex-col gap-6">
        {/* KPI Stats - Mobile 2x2 grid */}
        <section className="grid grid-cols-2 gap-0 md:hidden bg-white border border-[#EBEBEB] rounded-[12px]">
          {kpiStats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className={`p-3 ${i % 2 === 0 ? 'border-r border-b border-[#EBEBEB]' : 'border-b border-[#EBEBEB]'} ${i >= 2 ? 'border-b-0' : ''}`}>
                <div className="flex items-start gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#E6F8FD] flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-[#00B6E2]" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <p className="text-[11px] font-medium text-[#5C5C5C]">{stat.label}</p>
                    <span className={`text-[16px] font-semibold ${stat.valClass}`}>{stat.value}</span>
                    <span className="text-[10px] text-[#5C5C5C]">{stat.subtext}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </section>

        {/* KPI Stats - Desktop row */}
        <section className="hidden md:grid grid-cols-1 lg:grid-cols-4 bg-white border border-[#EBEBEB] rounded-[12px] items-center p-5">
          {kpiStats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="flex items-center gap-4 px-4 py-2">
                <div className="w-10 h-10 rounded-full bg-[#E6F8FD] flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-[#00B6E2]" />
                </div>
                <div className="flex flex-col gap-[2px]">
                  <p className="text-[12px] font-medium text-[#5C5C5C] leading-tight">{stat.label}</p>
                  <div className="flex items-baseline gap-2">
                    <span className={`text-[14px] font-semibold ${stat.valClass}`}>{stat.value}</span>
                    <span className="text-[12px] text-[#5C5C5C]">{stat.subtext}</span>
                  </div>
                </div>
                {i < kpiStats.length - 1 && (
                  <div className="hidden lg:block w-[1px] h-[37px] bg-[#EAECF0] ml-auto" />
                )}
              </div>
            );
          })}
        </section>

        <section className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:max-w-[400px]">
            <Search className="w-4 h-4 text-[#A1A1AA] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search by RM ID, Roll ID, or Supplier..." className="h-[40px] w-full pl-9 pr-3 bg-white border border-[#EBEBEB] rounded-[8px] text-[14px] text-[#171717] placeholder:text-[#A1A1AA] focus:outline-none focus:border-[#00B6E2]" />
          </div>
        </section>

        <section className="bg-white rounded-[12px] flex flex-col gap-4 overflow-hidden">
          <div className="border border-[#EAECF0] rounded-[8px] overflow-x-auto min-h-[300px]">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-[#F5F7FA] border-b border-[#EBEBEB]">
                  <th className="px-4 py-[11px] text-[13px] font-semibold text-[#667085]">Raw Material ID</th>
                  <th className="px-4 py-[11px] text-[13px] font-semibold text-[#667085]">Roll ID</th>
                  <th className="px-4 py-[11px] text-[13px] font-semibold text-[#667085]">Micron</th>
                  <th className="px-4 py-[11px] text-[13px] font-semibold text-[#667085]">Width</th>
                  <th className="px-4 py-[11px] text-[13px] font-semibold text-[#667085]">Weight</th>
                  <th className="px-4 py-[11px] text-[13px] font-semibold text-[#667085]">Supplier</th>
                  <th className="px-4 py-[11px] text-[13px] font-semibold text-[#667085]">Date</th>
                  <th className="px-4 py-[11px] text-[13px] font-semibold text-[#667085]">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAECF0]">
                {filteredData.length > 0 ? filteredData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-4 text-[14px] text-[#00B6E2] font-semibold whitespace-nowrap">{row.rawMaterialId}</td>
                    <td className="px-4 py-4 text-[14px] text-[#5C5C5C] whitespace-nowrap">{row.rollId}</td>
                    <td className="px-4 py-4 text-[14px] text-[#5C5C5C] whitespace-nowrap">{row.micron}</td>
                    <td className="px-4 py-4 text-[14px] text-[#5C5C5C] whitespace-nowrap">{row.width}</td>
                    <td className="px-4 py-4 text-[14px] text-[#5C5C5C] whitespace-nowrap">{row.weight}</td>
                    <td className="px-4 py-4 text-[14px] text-[#5C5C5C] whitespace-nowrap">{row.supplier}</td>
                    <td className="px-4 py-4 text-[14px] text-[#5C5C5C] whitespace-nowrap">{row.date}</td>
                    <td className="px-4 py-4 whitespace-nowrap"><StatusBadge status={row.status} /></td>
                  </tr>
                )) : (
                  <tr><td colSpan={8} className="px-4 py-8 text-center text-[#5C5C5C] text-[14px]">No inventory items found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
