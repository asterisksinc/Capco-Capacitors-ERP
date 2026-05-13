import { useState, useEffect } from 'react';
import {
  createEmptyFlowData,
  createSeedInventory,
  createSeedStore,
  computeWorkflowProgress,
  type WorkOrderSummary,
  type WorkOrderFlowData,
  type ProductOrderSummary,
  type WorkflowStatus,
  type InventoryItem,
} from '../lib/data';

interface StoreData {
  workOrders: WorkOrderSummary[];
  flowDataMap: Record<string, WorkOrderFlowData>;
  inventoryItems: InventoryItem[];
  productOrders: ProductOrderSummary[];
}

export type ComputedWorkOrderSummary = WorkOrderSummary & {
  stage: string;
  status: WorkflowStatus;
};

const STORAGE_KEY = 'capcoDataStore';
const EMPTY_STORE: StoreData = { workOrders: [], flowDataMap: {}, inventoryItems: [], productOrders: [] };

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function sanitizeStore(raw: unknown): StoreData {
  if (!isRecord(raw)) return EMPTY_STORE;

  const workOrders: WorkOrderSummary[] = Array.isArray(raw.workOrders)
    ? raw.workOrders
        .filter((row): row is WorkOrderSummary => isRecord(row))
        .map((row) => ({
          id: String(row.id ?? '').toUpperCase(),
          micron: String(row.micron ?? '-'),
          width: String(row.width ?? '-'),
          qty: String(row.qty ?? '-'),
          date: String(row.date ?? '-'),
        }))
        .filter((row) => row.id.length > 0)
    : [];

  const flowDataMap: Record<string, WorkOrderFlowData> = {};
  if (isRecord(raw.flowDataMap)) {
    for (const [key, value] of Object.entries(raw.flowDataMap)) {
      if (!isRecord(value)) continue;

      const fallback = createEmptyFlowData();
      const rawRows = Array.isArray(value.rawMaterialRows) ? value.rawMaterialRows : [];
      const metRows = Array.isArray(value.metallisationRows) ? value.metallisationRows : [];
      const slitRows = Array.isArray(value.slittingRows) ? value.slittingRows : [];
      const overview = isRecord(value.overview) ? value.overview : {};

      const normalizedFlow: WorkOrderFlowData = {
        overview: {
          wordCount: String(overview.wordCount ?? fallback.overview.wordCount),
          micron: String(overview.micron ?? fallback.overview.micron),
          width: String(overview.width ?? fallback.overview.width),
          quantity: String(overview.quantity ?? fallback.overview.quantity),
          date: String(overview.date ?? fallback.overview.date),
          stage: String(overview.stage ?? fallback.overview.stage),
          status: (overview.status as WorkflowStatus) ?? fallback.overview.status,
        },
        rawMaterialRows: rawRows as WorkOrderFlowData['rawMaterialRows'],
        metallisationRows: metRows as WorkOrderFlowData['metallisationRows'],
        slittingRows: slitRows.map((row) => {
          if (isRecord(row) && row.stage === 'Ready for Dispatch') {
            return { ...row, stage: 'Ready for Winding' };
          }
          return row;
        }) as WorkOrderFlowData['slittingRows'],
      };

      const progress = computeWorkflowProgress(normalizedFlow);
      normalizedFlow.overview.stage = progress.stage;
      normalizedFlow.overview.status = progress.status;
      flowDataMap[key.toUpperCase()] = normalizedFlow;
    }
  }

  const inventoryItems: InventoryItem[] = Array.isArray(raw.inventoryItems)
    ? raw.inventoryItems.filter((row): row is InventoryItem => isRecord(row))
    : createSeedInventory();

  const productOrders: ProductOrderSummary[] = Array.isArray(raw.productOrders)
    ? raw.productOrders.filter((row): row is ProductOrderSummary => isRecord(row))
    : [];

  return { workOrders, flowDataMap, inventoryItems, productOrders };
}

export function loadStore(): StoreData {
  if (typeof window === 'undefined') return EMPTY_STORE;
  const stored = localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    const seeded = createSeedStore();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
    return seeded;
  }

  try {
    const parsed = JSON.parse(stored);
    const sanitized = sanitizeStore(parsed);
    if (sanitized.workOrders.length === 0 && sanitized.productOrders.length === 0) {
      const seeded = createSeedStore();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
      if (typeof window !== 'undefined') {
        console.log('[capco] Seeded store with demo data');
      }
      return seeded;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitized));
    return sanitized;
  } catch {
    const seeded = createSeedStore();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
    return seeded;
  }
}

export function saveStore(data: StoreData) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    window.dispatchEvent(new Event('capco-store-change'));
  }
}

export function useStore() {
  const [store, setStore] = useState<StoreData>({ workOrders: [], flowDataMap: {}, inventoryItems: [], productOrders: [] });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setStore(loadStore());
    setMounted(true);
    const listener = () => {
      setStore(loadStore());
    };
    window.addEventListener('capco-store-change', listener);
    return () => window.removeEventListener('capco-store-change', listener);
  }, []);

  const workOrders: ComputedWorkOrderSummary[] = store.workOrders.map((workOrder) => {
    const flow = store.flowDataMap[workOrder.id];
    const progress = computeWorkflowProgress(flow);
    return {
      ...workOrder,
      stage: progress.stage,
      status: progress.status,
    };
  });

  const addWorkOrder = (wo: WorkOrderSummary) => {
    const nextStore = loadStore();

    if (nextStore.workOrders.some((row) => row.id === wo.id)) {
      return;
    }

    nextStore.workOrders = [wo, ...nextStore.workOrders];
    nextStore.flowDataMap[wo.id] = createEmptyFlowData({
      micron: wo.micron,
      width: wo.width,
      quantity: wo.qty,
      date: wo.date,
    });

    saveStore(nextStore);
  };

  const deleteWorkOrder = (woId: string) => {
    const normalizedId = woId.toUpperCase();
    const nextStore = loadStore();

    nextStore.workOrders = nextStore.workOrders.filter((row) => row.id !== normalizedId);
    delete nextStore.flowDataMap[normalizedId];

    saveStore(nextStore);
  };

  const addFlowRow = (woId: string, tab: string, rowData: any) => {
    const nextStore = loadStore();
    let flow = nextStore.flowDataMap[woId];
    if (!flow) {
      const workOrder = nextStore.workOrders.find((row) => row.id === woId);
      flow = createEmptyFlowData({
        micron: workOrder?.micron,
        width: workOrder?.width,
        quantity: workOrder?.qty,
        date: workOrder?.date ?? new Date().toLocaleDateString(),
      });
    }
    
    if (tab === "Raw Material") flow.rawMaterialRows.push(rowData);
    if (tab === "Metallisation") flow.metallisationRows.push(rowData);
    if (tab === "Slitting") {
      const row =
        rowData?.stage === "Ready for Dispatch"
          ? { ...rowData, stage: "Ready for Winding" }
          : rowData;
      flow.slittingRows.push(row);
    }

    const progress = computeWorkflowProgress(flow);
    flow.overview.stage = progress.stage;
    flow.overview.status = progress.status;
    
    nextStore.flowDataMap[woId] = flow;
    saveStore(nextStore);
  };

  const updateFlowRowField = (woId: string, tab: string, rowIndex: number, field: string, value: any) => {
    const nextStore = loadStore();
    const flow = nextStore.flowDataMap[woId];
    if (!flow) return;

    let rows: any[];
    if (tab === "Raw Material") rows = flow.rawMaterialRows;
    else if (tab === "Metallisation") rows = flow.metallisationRows;
    else rows = flow.slittingRows;

    if (rowIndex >= 0 && rowIndex < rows.length) {
      rows[rowIndex][field] = value;
    }

    const progress = computeWorkflowProgress(flow);
    flow.overview.stage = progress.stage;
    flow.overview.status = progress.status;
    nextStore.flowDataMap[woId] = flow;
    saveStore(nextStore);
  };

  const updateInventoryStatus = (rawMaterialId: string, newStatus: InventoryItem["status"]) => {
    const nextStore = loadStore();
    const idx = nextStore.inventoryItems.findIndex((item) => item.rawMaterialId === rawMaterialId);
    if (idx === -1) return false;
    nextStore.inventoryItems[idx].status = newStatus;
    saveStore(nextStore);
    return true;
  };

  const addInventoryItem = (item: InventoryItem) => {
    const nextStore = loadStore();
    if (nextStore.inventoryItems.some((i) => i.rawMaterialId === item.rawMaterialId)) return false;
    nextStore.inventoryItems.push(item);
    saveStore(nextStore);
    return true;
  };

  const getAvailableInventory = () => {
    return store.inventoryItems.filter((item) => item.status === "In Inventory");
  };

  const addProductOrder = (po: ProductOrderSummary) => {
    const nextStore = loadStore();
    if (nextStore.productOrders.some((row) => row.id === po.id)) return;
    nextStore.productOrders = [po, ...nextStore.productOrders];
    saveStore(nextStore);
  };

  const deleteProductOrder = (poId: string) => {
    const nextStore = loadStore();
    nextStore.productOrders = nextStore.productOrders.filter((row) => row.id !== poId);
    saveStore(nextStore);
  };

  return { store, mounted, workOrders, addWorkOrder, deleteWorkOrder, addFlowRow, updateFlowRowField, updateInventoryStatus, addInventoryItem, getAvailableInventory, addProductOrder, deleteProductOrder };
}
