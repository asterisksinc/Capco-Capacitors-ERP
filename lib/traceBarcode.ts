export type EntityType = "WO" | "PO" | "RM" | "MC" | "PM" | "WD" | "SP" | "Unknown";

export interface TraceEntity {
  id: string;
  type: EntityType;
  label: string;
  details: { label: string; value: string }[];
  status: string;
}

export interface TraceResult {
  scanned: TraceEntity;
  parentChain: TraceEntity[];
  children: TraceEntity[];
  workOrder?: TraceEntity;
  productOrder?: TraceEntity;
  rawMaterial?: TraceEntity & {
    rollId?: string;
    supplier?: string;
  };
}

interface RawMaterialRow {
  rollNo: string;
  weight: string;
  thickness: string;
  supplier: string;
  stage: string;
  status: string;
}

interface MetallisationRow {
  coilNo: string;
  rmId: string;
  machineNo: string;
  weight: string;
  opticalDensity: string;
  resistance: string;
  timestamp: string;
  nextStage: string;
  status: string;
}

interface SlittingRow {
  productNo: string;
  rmId: string;
  weight: string;
  thickness: string;
  grade: string;
  remarks?: string;
  timestampAdded: string;
  stage: string;
  status: string;
}

interface WindingRow {
  wdId: string;
  linkedPmId: string;
  filmWidth: string;
  windingTension: string;
  turnsCount: string;
  quantityWound: string;
  stage: string;
  timestamp: string;
  status: string;
}

interface SprayRow {
  spId: string;
  linkedWdId: string;
  sprayType: string;
  feedRate: string;
  pressureSitting: string;
  stage: string;
  timestamp: string;
  status: string;
}

interface WorkOrderFlowData {
  overview: { wordCount: string; micron: string; width: string; quantity: string; date: string; stage: string; status: string };
  rawMaterialRows: RawMaterialRow[];
  metallisationRows: MetallisationRow[];
  slittingRows: SlittingRow[];
  windingRows: WindingRow[];
  sprayRows: SprayRow[];
}

interface WorkOrderSummary {
  id: string;
  micron: string;
  width: string;
  qty: string;
  date: string;
}

interface ProductOrderSummary {
  id: string;
  code: string;
  type: string;
  grade: string;
  batchSize: string;
  status: string;
  stage: string;
  timestamp: string;
}

interface InventoryItem {
  rawMaterialId: string;
  rollId: string;
  micron: string;
  width: string;
  weight: string;
  supplier: string;
  date: string;
  status: string;
}

interface AssignedStock {
  stockId: string;
  linkedWoId: string;
  weight: string;
  width: string;
  micron: string;
  grade: string;
  stage: string;
  assignedAt: string;
}

export interface StoreSnapshot {
  workOrders: WorkOrderSummary[];
  flowDataMap: Record<string, WorkOrderFlowData>;
  inventoryItems: InventoryItem[];
  productOrders: ProductOrderSummary[];
  assignments: Record<string, AssignedStock[]>;
}

function findRM(store: StoreSnapshot, rmId: string) {
  const inv = store.inventoryItems.find((i) => i.rawMaterialId === rmId);
  for (const [woId, flow] of Object.entries(store.flowDataMap)) {
    const row = flow.rawMaterialRows.find((r) => r.rollNo === rmId);
    if (row) return { inv, flow: { woId, row } };
  }
  return inv ? { inv, flow: null as { woId: string; row: RawMaterialRow } | null } : null;
}

function findMC(store: StoreSnapshot, mcId: string) {
  for (const [woId, flow] of Object.entries(store.flowDataMap)) {
    const row = flow.metallisationRows.find((r) => r.coilNo === mcId);
    if (row) return { ...row, woId };
  }
  return null;
}

function findPM(store: StoreSnapshot, pmId: string) {
  for (const [woId, flow] of Object.entries(store.flowDataMap)) {
    const row = flow.slittingRows.find((r) => r.productNo === pmId);
    if (row) return { ...row, woId };
  }
  return null;
}

function findWD(store: StoreSnapshot, wdId: string) {
  for (const [woId, flow] of Object.entries(store.flowDataMap)) {
    const row = flow.windingRows.find((r) => r.wdId === wdId);
    if (row) return { ...row, woId };
  }
  return null;
}

function findSP(store: StoreSnapshot, spId: string) {
  for (const [woId, flow] of Object.entries(store.flowDataMap)) {
    const row = flow.sprayRows.find((r) => r.spId === spId);
    if (row) return { ...row, woId };
  }
  return null;
}

function findPOByPM(store: StoreSnapshot, pmId: string) {
  for (const [poId, stocks] of Object.entries(store.assignments)) {
    if (stocks.some((s) => s.stockId === pmId)) {
      return store.productOrders.find((p) => p.id === poId) ?? null;
    }
  }
  return null;
}

function e(id: string, type: EntityType, label: string, details: { label: string; value: string }[], status: string): TraceEntity {
  return { id, type, label, details, status };
}

export function traceBarcode(store: StoreSnapshot, rawId: string): TraceResult | null {
  const id = rawId.toUpperCase().trim();

  // Try WO
  const wo = store.workOrders.find((w) => w.id === id);
  if (wo) {
    const flow = store.flowDataMap[id];
    const children: TraceEntity[] = [];
    if (flow) {
      for (const rm of flow.rawMaterialRows) {
        children.push(e(rm.rollNo, "RM", `Raw Material ${rm.rollNo}`, [
          { label: "Supplier", value: rm.supplier },
          { label: "Weight", value: rm.weight },
          { label: "Thickness", value: rm.thickness },
        ], rm.status));
      }
    }
    return {
      scanned: e(id, "WO", `Work Order ${id}`, [
        { label: "Micron", value: wo.micron },
        { label: "Width", value: wo.width },
        { label: "Qty", value: wo.qty },
        { label: "Date", value: wo.date },
      ], flow?.overview.status ?? "Yet to Start"),
      parentChain: [],
      children,
    };
  }

  // Try PO
  const po = store.productOrders.find((p) => p.id === id);
  if (po) {
    const stocks = store.assignments[id] ?? [];
    const children = stocks.map((s) =>
      e(s.stockId, "PM", `Product ${s.stockId}`, [
        { label: "Weight", value: s.weight },
        { label: "Grade", value: s.grade },
        { label: "WO", value: s.linkedWoId },
      ], s.stage)
    );
    return {
      scanned: e(id, "PO", `Product Order ${id}`, [
        { label: "Code", value: po.code },
        { label: "Type", value: po.type },
        { label: "Grade", value: po.grade },
        { label: "Batch", value: po.batchSize },
      ], po.status),
      parentChain: [],
      children,
    };
  }

  // Try RM
  const rm = findRM(store, id);
  if (rm) {
    const details: { label: string; value: string }[] = [];
    if (rm.inv) {
      details.push({ label: "Supplier", value: rm.inv.supplier });
      details.push({ label: "Weight", value: rm.inv.weight });
      details.push({ label: "Micron", value: rm.inv.micron });
      details.push({ label: "Width", value: rm.inv.width });
    } else if (rm.flow) {
      details.push({ label: "Supplier", value: rm.flow.row.supplier });
      details.push({ label: "Weight", value: rm.flow.row.weight });
      details.push({ label: "Thickness", value: rm.flow.row.thickness });
    }

    const woEntity = rm.flow
      ? e(rm.flow.woId, "WO", `Work Order ${rm.flow.woId}`, [], store.workOrders.find((w) => w.id === rm.flow!.woId) ? store.flowDataMap[rm.flow.woId]?.overview.status ?? "Yet to Start" : "")
      : undefined;

    const children: TraceEntity[] = [];
    if (rm.flow) {
      const flow = store.flowDataMap[rm.flow.woId];
      if (flow) {
        for (const mc of flow.metallisationRows.filter((m) => m.rmId === id)) {
          children.push(e(mc.coilNo, "MC", `Metallisation ${mc.coilNo}`, [
            { label: "Weight", value: mc.weight },
            { label: "Machine", value: mc.machineNo },
          ], mc.status));
        }
        for (const pm of flow.slittingRows.filter((s) => s.rmId === id)) {
          if (!children.some((c) => c.id === pm.productNo)) {
            children.push(e(pm.productNo, "PM", `Product ${pm.productNo}`, [
              { label: "Weight", value: pm.weight },
              { label: "Grade", value: pm.grade },
            ], pm.status));
          }
        }
      }
    }

    return {
      scanned: e(id, "RM", `Raw Material ${id}`, details, rm.inv?.status ?? rm.flow?.row.status ?? "Unknown"),
      parentChain: woEntity ? [woEntity] : [],
      children,
      workOrder: woEntity,
      rawMaterial: {
        ...e(id, "RM", `Raw Material ${id}`, details, rm.inv?.status ?? rm.flow?.row.status ?? "Unknown"),
        rollId: rm.inv?.rollId,
        supplier: rm.inv?.supplier ?? rm.flow?.row.supplier,
      },
    };
  }

  // Try MC
  const mc = findMC(store, id);
  if (mc) {
    const rawMaterial = findRM(store, mc.rmId);
    const woEntity = e(mc.woId, "WO", `Work Order ${mc.woId}`, [], store.flowDataMap[mc.woId]?.overview.status ?? "");
    const rmEntity = rawMaterial
      ? e(mc.rmId, "RM", `Raw Material ${mc.rmId}`, [
        { label: "Supplier", value: rawMaterial.inv?.supplier ?? rawMaterial.flow?.row.supplier ?? "" },
        { label: "Weight", value: rawMaterial.inv?.weight ?? rawMaterial.flow?.row.weight ?? "" },
      ], rawMaterial.inv?.status ?? rawMaterial.flow?.row.status ?? "Unknown")
      : null;

    const flow = store.flowDataMap[mc.woId];
    const children: TraceEntity[] = [];
    if (flow) {
      for (const pm of flow.slittingRows.filter((s) => s.rmId === mc.rmId)) {
        children.push(e(pm.productNo, "PM", `Product ${pm.productNo}`, [
          { label: "Weight", value: pm.weight },
          { label: "Grade", value: pm.grade },
        ], pm.status));
      }
    }

    return {
      scanned: e(id, "MC", `Metallisation ${id}`, [
        { label: "Weight", value: mc.weight },
        { label: "Machine", value: mc.machineNo },
        { label: "Optical Density", value: mc.opticalDensity },
        { label: "Resistance", value: mc.resistance },
        { label: "Timestamp", value: mc.timestamp },
      ], mc.status),
      parentChain: [rmEntity, woEntity].filter(Boolean) as TraceEntity[],
      children,
      workOrder: woEntity,
      rawMaterial: rawMaterial
        ? {
          ...e(mc.rmId, "RM", `Raw Material ${mc.rmId}`, [], rawMaterial.inv?.status ?? rawMaterial.flow?.row.status ?? "Unknown"),
          rollId: rawMaterial.inv?.rollId,
          supplier: rawMaterial.inv?.supplier ?? rawMaterial.flow?.row.supplier,
        }
        : undefined,
    };
  }

  // Try PM
  const pm = findPM(store, id);
  if (pm) {
    const rawMaterial = findRM(store, pm.rmId);
    const woEntity = e(pm.woId, "WO", `Work Order ${pm.woId}`, [], store.flowDataMap[pm.woId]?.overview.status ?? "");
    const rmEntity = rawMaterial
      ? e(pm.rmId, "RM", `Raw Material ${pm.rmId}`, [
        { label: "Supplier", value: rawMaterial.inv?.supplier ?? rawMaterial.flow?.row.supplier ?? "" },
      ], rawMaterial.inv?.status ?? rawMaterial.flow?.row.status ?? "Unknown")
      : null;

    const poEntity = findPOByPM(store, id);
    const poResult = poEntity
      ? e(poEntity.id, "PO", `Product Order ${poEntity.id}`, [
        { label: "Code", value: poEntity.code },
        { label: "Type", value: poEntity.type },
      ], poEntity.status)
      : undefined;

    const flow = store.flowDataMap[pm.woId];
    const children: TraceEntity[] = [];
    if (flow) {
      for (const wd of flow.windingRows.filter((w) => w.linkedPmId === id)) {
        children.push(e(wd.wdId, "WD", `Winding ${wd.wdId}`, [
          { label: "Film Width", value: wd.filmWidth },
          { label: "Qty Wound", value: wd.quantityWound },
        ], wd.status));
      }
    }

    return {
      scanned: e(id, "PM", `Product ${id}`, [
        { label: "Weight", value: pm.weight },
        { label: "Thickness", value: pm.thickness },
        { label: "Grade", value: pm.grade },
        { label: "Remarks", value: pm.remarks ?? "—" },
      ], pm.status),
      parentChain: [rmEntity, woEntity].filter(Boolean) as TraceEntity[],
      children,
      workOrder: woEntity,
      productOrder: poResult,
      rawMaterial: rawMaterial
        ? {
          ...e(pm.rmId, "RM", `Raw Material ${pm.rmId}`, [], rawMaterial.inv?.status ?? rawMaterial.flow?.row.status ?? "Unknown"),
          rollId: rawMaterial.inv?.rollId,
          supplier: rawMaterial.inv?.supplier ?? rawMaterial.flow?.row.supplier,
        }
        : undefined,
    };
  }

  // Try WD
  const wd = findWD(store, id);
  if (wd) {
    let pmEntity: TraceEntity | null = null;
    let rmEntity: TraceEntity | null = null;
    let woEntity: TraceEntity | null = null;
    let poResult: TraceEntity | undefined;

    const flow = store.flowDataMap[wd.woId];
    if (flow) {
      const pmRow = flow.slittingRows.find((s) => s.productNo === wd.linkedPmId);
      if (pmRow) {
        pmEntity = e(pmRow.productNo, "PM", `Product ${pmRow.productNo}`, [
          { label: "Weight", value: pmRow.weight },
          { label: "Grade", value: pmRow.grade },
        ], pmRow.status);

        const po = findPOByPM(store, pmRow.productNo);
        if (po) poResult = e(po.id, "PO", `Product Order ${po.id}`, [{ label: "Code", value: po.code }], po.status);

        const rawMaterial = findRM(store, pmRow.rmId);
        if (rawMaterial) {
          rmEntity = e(pmRow.rmId, "RM", `Raw Material ${pmRow.rmId}`, [
            { label: "Supplier", value: rawMaterial.inv?.supplier ?? rawMaterial.flow?.row.supplier ?? "" },
          ], rawMaterial.inv?.status ?? rawMaterial.flow?.row.status ?? "Unknown");
        }

        woEntity = e(wd.woId, "WO", `Work Order ${wd.woId}`, [], store.flowDataMap[wd.woId]?.overview.status ?? "");
      }
    }

    const children: TraceEntity[] = [];
    if (flow) {
      for (const sp of flow.sprayRows.filter((s) => s.linkedWdId === id)) {
        children.push(e(sp.spId, "SP", `Spray ${sp.spId}`, [
          { label: "Type", value: sp.sprayType },
          { label: "Feed Rate", value: sp.feedRate },
          { label: "Pressure", value: sp.pressureSitting },
        ], sp.status));
      }
    }

    return {
      scanned: e(id, "WD", `Winding ${id}`, [
        { label: "Film Width", value: wd.filmWidth },
        { label: "Tension", value: wd.windingTension },
        { label: "Turns", value: wd.turnsCount },
        { label: "Qty Wound", value: wd.quantityWound },
        { label: "Timestamp", value: wd.timestamp },
      ], wd.status),
      parentChain: [pmEntity, rmEntity, woEntity].filter(Boolean) as TraceEntity[],
      children,
      workOrder: woEntity ?? undefined,
      productOrder: poResult,
    };
  }

  // Try SP
  const sp = findSP(store, id);
  if (sp) {
    let wdEntity: TraceEntity | null = null;
    let pmEntity: TraceEntity | null = null;
    let rmEntity: TraceEntity | null = null;
    let woEntity: TraceEntity | null = null;
    let poResult: TraceEntity | undefined;

    const flow = store.flowDataMap[sp.woId];
    if (flow) {
      const wdRow = flow.windingRows.find((w) => w.wdId === sp.linkedWdId);
      if (wdRow) {
        wdEntity = e(wdRow.wdId, "WD", `Winding ${wdRow.wdId}`, [{ label: "Qty Wound", value: wdRow.quantityWound }], wdRow.status);

        const pmRow = flow.slittingRows.find((s) => s.productNo === wdRow.linkedPmId);
        if (pmRow) {
          pmEntity = e(pmRow.productNo, "PM", `Product ${pmRow.productNo}`, [
            { label: "Weight", value: pmRow.weight },
            { label: "Grade", value: pmRow.grade },
          ], pmRow.status);

          const po = findPOByPM(store, pmRow.productNo);
          if (po) poResult = e(po.id, "PO", `Product Order ${po.id}`, [{ label: "Code", value: po.code }], po.status);

          const rawMaterial = findRM(store, pmRow.rmId);
          if (rawMaterial) {
            rmEntity = e(pmRow.rmId, "RM", `Raw Material ${pmRow.rmId}`, [
              { label: "Supplier", value: rawMaterial.inv?.supplier ?? rawMaterial.flow?.row.supplier ?? "" },
            ], rawMaterial.inv?.status ?? rawMaterial.flow?.row.status ?? "Unknown");
          }

          woEntity = e(sp.woId, "WO", `Work Order ${sp.woId}`, [], store.flowDataMap[sp.woId]?.overview.status ?? "");
        }
      }
    }

    return {
      scanned: e(id, "SP", `Spray ${id}`, [
        { label: "Type", value: sp.sprayType },
        { label: "Feed Rate", value: sp.feedRate },
        { label: "Pressure", value: sp.pressureSitting },
        { label: "Timestamp", value: sp.timestamp },
      ], sp.status),
      parentChain: [wdEntity, pmEntity, rmEntity, woEntity].filter(Boolean) as TraceEntity[],
      children: [],
      workOrder: woEntity ?? undefined,
      productOrder: poResult,
    };
  }

  return null;
}
