# Frontend Table Relationships Plan

> Role hierarchy: **ProductionHead** -> **Person A** | **Person B** | **Person C** | **Person D**

---

## 1. Core Data Store (useStore)

All tables live in a single localStorage store keyed by `capcoDataStore`.

```ts
StoreData {
  workOrders: WorkOrderSummary[]           // master list
  flowDataMap: Record<WO_ID, WorkOrderFlowData>  // detail data per WO
}
```

**The `id` (WO-XXXX or PO-XXXX) is the universal linker across all tables.**

---

## 2. Entity Relationship Chain

```
ProductionHead
  ├── creates ──► Work Orders (WO-XXXX)
  │                ├── flowDataMap[WO_ID].overview      ← WorkOrderOverview
  │                ├── flowDataMap[WO_ID].rawMaterialRows ← RawMaterialRow[]
  │                │     (rmId references godown RM-XXXX)
  │                ├── flowDataMap[WO_ID].metallisationRows ← MetallisationRow[]
  │                │     (rmId ← RawMaterialRow.rollNo)
  │                └── flowDataMap[WO_ID].slittingRows ← SlittingRow[]
  │                      (rmId ← MetallisationRow.coilNo)
  │                      └── derived ──► Stock (productNo = stockId, linkedWoId = WO_ID)
  │
  ├── creates ──► Product Orders (PO-XXXX)
  │                (standalone, no FK to work orders)
  │
  └── overview ──► Person Columns (Kanban cards)
                   ├── Person A: raw_material, metallisation, slitting
                   ├── Person B: winding, spray
                   ├── Person C: soldening, epoxy
                   └── Person D: test_print_pack, finished_goods
```

---

## 3. Table Definitions (Frontend Types)

### 3.1 WorkOrderSummary
**Source:** `lib/data.ts:3-9`
**Key:** `id` (format: `WO-XXXX`)

| Column | Type | Notes |
|--------|------|-------|
| id | string | Primary business key. Links `workOrders[]` + `flowDataMap` key |
| micron | string | Shared across all child rows |
| width | string | Shared across all child rows |
| qty | string | Shared across all child rows |
| date | string | Creation date |

### 3.2 ComputedWorkOrderSummary
**Source:** `hooks/useStore.ts:15-18`
**Extends:** WorkOrderSummary

| Column | Type | Notes |
|--------|------|-------|
| ...WorkOrderSummary | - | All fields from WorkOrderSummary |
| stage | string | Computed from flowData: "Raw Material" | "Metallisation" | "Slitting" |
| status | WorkflowStatus | Computed: "Yet to Start" | "In-progress" | "Completed" |

**Used by:** `/productionhead/workorder`, `/person-a/workorder`, `/person-b/workorder`

### 3.3 WorkOrderOverview
**Source:** `lib/data.ts:11-19`
**Stored in:** `flowDataMap[WO_ID].overview`

| Column | Type |
|--------|------|
| wordCount | string |
| micron | string |
| width | string |
| quantity | string |
| stage | string |
| date | string |
| status | WorkflowStatus |

### 3.4 RawMaterialRow
**Source:** `lib/data.ts:21-28`
**Stored in:** `flowDataMap[WO_ID].rawMaterialRows[]`

| Column | Type | Key Link |
|--------|------|----------|
| rollNo | string | Primary key of this row. Referenced by `MetallisationRow.rmId` |
| weight | string | |
| thickness | string | |
| supplier | string | |
| stage | string | Always "Raw Material" |
| status | WorkflowStatus | |

### 3.5 MetallisationRow
**Source:** `lib/data.ts:30-40`
**Stored in:** `flowDataMap[WO_ID].metallisationRows[]`

| Column | Type | Key Link |
|--------|------|----------|
| coilNo | string | Primary key of this row. Referenced by `SlittingRow.rmId` |
| rmId | string | **FK → RawMaterialRow.rollNo** (same WO) |
| machineNo | string | |
| weight | string | |
| opticalDensity | string | |
| resistance | string | |
| timestamp | string | |
| nextStage | string | |
| status | WorkflowStatus | |

### 3.6 SlittingRow
**Source:** `lib/data.ts:42-52`
**Stored in:** `flowDataMap[WO_ID].slittingRows[]`

| Column | Type | Key Link |
|--------|------|----------|
| productNo | string | Primary key. Also becomes `StockRow.stockId` |
| rmId | string | **FK → MetallisationRow.coilNo** (same WO) |
| weight | string | Copied to `StockRow.weight` |
| thickness | string | Copied to `StockRow.micron` |
| grade | string | Copied to `StockRow.grade` |
| remarks | string? | |
| timestampAdded | string | Copied to `StockRow.timestamp` |
| stage | string | "Ready for Winding" / "Completed". Copied to `StockRow.stage` |
| status | WorkflowStatus | |

### 3.7 StockRow
**Source:** `app/productionhead/stock/page.tsx:17-26`
**Derived from:** SlittingRow (computed on-the-fly, not stored separately)

| Column | Source | Notes |
|--------|--------|-------|
| stockId | SlittingRow.productNo | |
| linkedWoId | WO ID key | **FK → flowDataMap key** (links stock back to work order) |
| weight | SlittingRow.weight | |
| width | WorkOrderOverview.width | |
| micron | SlittingRow.thickness | |
| grade | SlittingRow.grade | |
| stage | SlittingRow.stage | |
| timestamp | SlittingRow.timestampAdded | |

**Used by:** `/productionhead/stock`, `/person-a/stock`, `/person-b/stock`

### 3.8 ProductOrderRow
**Source:** `app/productionhead/productorders/page.tsx:35-45`
**Standalone entity** — no FK to work orders

| Column | Type |
|--------|------|
| id | string (format: `#PO-CC-XXXX`) |
| code | string |
| type | string |
| grade | string |
| batchSize | string |
| status | string |
| stage | string |
| timestamp | string |

**Used by:** `/productionhead/productorders`, `/person-a/product-orders`, `/person-b/product-orders`

### 3.9 WorkOrderRow (Legacy Component)
**Source:** `components/supervisor/WorkOrderTable.tsx:5-14`, `components/operator/WorkOrderTable.tsx:5-14`, `components/person-b/WorkOrderTable.tsx`

| Column | Type |
|--------|------|
| id | string |
| micron | string |
| width | string |
| qty | string |
| stage | string |
| date | string |
| status | string |
| actionHref | string |

### 3.10 Kanban / PersonColumn + Card
**Source:** `app/productionhead/overview/page.tsx:142-152`

```ts
PersonColumn {
  name: string;   // "Person A" | "Person B" | "Person C" | "Person D"
  cards: Card[];
}

Card {
  id: string;     // WO-XXXX or PO-XXXX
  stage: string;
  date: string;
  status: string;
}
```

### 3.11 Pipeline WorkOrderRow & ProductOrderRow
**Source:** `app/productionhead/pipeline/page.tsx:37-73`

**Pipeline WorkOrderRow:**

| Column | Type |
|--------|------|
| id | string |
| micron | string |
| width | string |
| quantity | string |
| stage | string |
| date | string |
| status | string |
| action | string |

**Pipeline ProductOrderRow:**

| Column | Type |
|--------|------|
| id | string |
| code | string |
| type | string |
| grade | string |
| batchSize | string |
| status | string |
| stage | string |
| timestamp | string |
| action | string |

---

## 4. ID Interrelation Map (What-References-What)

```
WorkOrderSummary.id (WO-XXXX)
  │
  ├── flowDataMap key (same value)
  │     ├── overview.*                    (1:1)
  │     ├── rawMaterialRows[].rollNo      (1:N — raw materials for this WO)
  │     │     └── metallisationRows[].rmId ← references rollNo (intra-WO FK)
  │     ├── metallisationRows[].coilNo    (1:N — metallisation records)
  │     │     └── slittingRows[].rmId ← references coilNo (intra-WO FK)
  │     └── slittingRows[].productNo      (1:N — slit products)
  │           └── StockRow.stockId ← derived from productNo
  │           └── StockRow.linkedWoId ← WO ID (cross-reference back)
  │
  ├── OverviewPage Card.id (Kanban)
  │     └── PersonColumn[].cards[].id → links to WO or PO detail page
  │
  └── Pipeline WorkOrderRow.id

ProductOrderRow.id (PO-XXXX)  ← standalone, no FK links to WO
  ├── OverviewPage Card.id (Kanban)
  └── Pipeline ProductOrderRow.id
```

### Key linkage rules:

| Source Field | Targets | Relationship |
|-------------|---------|-------------|
| `flowDataMap[WO_ID]` | `workOrders[].id` | 1:1 (same WO ID as key) |
| `RawMaterialRow.rollNo` | → `MetallisationRow.rmId` | FK within same WO's `flowData` |
| `MetallisationRow.coilNo` | → `SlittingRow.rmId` | FK within same WO's `flowData` |
| `SlittingRow.productNo` | → `StockRow.stockId` | Derived (1:1) |
| `WO ID` | → `StockRow.linkedWoId` | FK from stock back to parent WO |
| `WO/PO ID` | → `Card.id` (Overview) | Links kanban card to detail page |
| `RawMaterialRow.rmId` | → `godownRawMaterialIds` | References pre-defined inventory IDs |

### What is NOT linked by ID:
- **ProductOrders** (`PO-XXXX`) are standalone — no FK to WorkOrders
- **Profiles** are linked via `created_by_email` and `current_assignee_email`, not by table IDs
- **Stage records** and **Workflow events** exist only in backend schema, not in frontend Phase-1

---

## 5. Table Configurations by Role

| Role | Page | Row Type | Columns |
|------|------|----------|---------|
| **ProductionHead** | Work Orders | ComputedWorkOrderSummary | id, micron, width, qty, stage, date, status, options |
| **ProductionHead** | Product Orders | ProductOrderRow | id, code, type, grade, batchSize, status, stage, timestamp, options |
| **ProductionHead** | Stock | StockRow | stockId, linkedWoId, weight, width, micron, grade, stage, timestamp, options |
| **ProductionHead** | Pipeline (WO) | WorkOrderRow | id, micron, width, quantity, stage, date, status, action |
| **ProductionHead** | Pipeline (PO) | ProductOrderRow | id, code, type, grade, batchSize, status, stage, timestamp, action |
| **ProductionHead** | Overview | PersonColumn + Card | id, stage, date, status (kanban) |
| **ProductionHead** | Detail: Raw Material | RawMaterialRow | rollNo, weight, thickness, supplier, stage, status, options |
| **ProductionHead** | Detail: Metallisation | MetallisationRow | coilNo, rmId, machineNo, weight, opticalDensity, resistance, timestamp, nextStage, status, options |
| **ProductionHead** | Detail: Slitting | SlittingRow | productNo, rmId, weight, thickness, grade, timestampAdded, stage, status, options |
| **Person A** | Work Orders | ComputedWorkOrderSummary | id, micron, width, qty, stage, date, status, options |
| **Person A** | Product Orders | ProductOrderRow | id, code, type, grade, batchSize, status, stage, timestamp, options |
| **Person A** | Stock | StockRow | Same as PH stock |
| **Person B** | Work Orders | ComputedWorkOrderSummary | id, micron, width, qty, stage, date, status, options |
| **Person B** | Product Orders | ProductOrderRow | Same as PH product orders |
| **Person B** | Stock | StockRow | Same as PH stock |

---

## 6. Data Flow: Row Addition Chain

```
1. ProductionHead creates WorkOrderSummary (WO-XXXX)
   → Appears in workOrders[] + flowDataMap[WO-XXXX] created with empty overview

2. Person A adds RawMaterialRow via WO detail page
   → flowDataMap[WO-XXXX].rawMaterialRows.push(row)
   → row.rollNo becomes key for this raw material

3. Person A adds MetallisationRow (references RawMaterialRow via rmId)
   → flowDataMap[WO-XXXX].metallisationRows.push(row)
   → row.rmId = parent RawMaterialRow.rollNo

4. Person A adds SlittingRow (references MetallisationRow via rmId)
   → flowDataMap[WO-XXXX].slittingRows.push(row)
   → row.rmId = parent MetallisationRow.coilNo

5. Stock table auto-derived from all slittingRows across all WO
   → StockRow.stockId = slittingRow.productNo
   → StockRow.linkedWoId = WO-XXXX (the flowDataMap key)
```

---

## 7. Shared UI Table Components

| Component | Location | Purpose |
|-----------|----------|---------|
| `useTableControls` | `hooks/useTableControls.ts` | Sort + filter logic for all config-driven tables |
| `SortableHeader` | `components/table/SortableHeader.tsx` | Sortable column headers with inline filter |
| `TableToolbar` | `components/table/TableToolbar.tsx` | Date range + export + filter button bar |
| `FilterPopover` | `components/table/FilterPopover.tsx` | Dropdown filter panel (enum, text, number range) |
| `OptionsDropdown` | `components/table/OptionsDropdown.tsx` | Row action menu (View/Edit/Delete) |
| `WorkOrderTable` | `components/{supervisor,operator,person-b}/WorkOrderTable.tsx` | Legacy table (used in some person dashboards) |
