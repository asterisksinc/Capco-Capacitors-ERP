# Person B

## Overview

Operational user focused on product orders and requesting materials from Person A. Uses `PersonBShell` with mobile drawer, `PersonBTopbar`, and `MobileHeader` (mobile).

## Pages & Data

### `/person-b` (Overview)
- **Data**: Product orders + material requests from store.
- **Content**: 4 KPI cards. Lists for recent orders and request status.
- **How**: Reads from `store.productOrders`, `store.materialRequests`.

### `/person-b/product-orders`
- **Data**: All `ProductOrderSummary` entries.
- **Columns**: ID, Product Code, Type, Grade, Batch Size, Status.
- **How**: KPI stats computed dynamically (total, open, completed counts). Sortable/filterable table. "Add Product Order" button (full-width on mobile).
- **Create**: Opens modal with Product Code, Capacitance, Voltage, Capacitor Type, Grade, Tolerance, Dielectric, Batch Size, Priority, Special Instructions. Saves via `addProductOrder()`.

### `/person-b/product-orders/[detailpage]`
- **Data**: Single product order detail.
- **Content**: Desktop breadcrumb. Scrollable tabs. Detail sections. Edit/Delete actions.
- **How**: Reads from store by ID.

### `/person-b/stock`
- **Data**: Assigned stock from `store.assignments`.
- **Columns**: Stock ID, Weight, Grade, Qty, Status.
- **How**: Table view of inventory assigned to Person B.

### `/person-b/material-requests`
- **Data**: `MaterialRequest[]` from store.
- **Columns**: Request ID, Weight, Grade, Req Qty, Status, Created At, Issued At, Action.
- **How**: Person B creates requests. Form has **Weight** (text), **Qty** (number), **Grade** (dropdown: A+, AA, A, B). No productNo/stock selection. Submits via `addMaterialRequest()`.
- **Status**: Pending → Issued/Partially Issued/Cancelled (updated by Person A). Issued status visible on Person B's table automatically.
- **Action**: "Cancel" button on pending requests.

### `/person-b/material-returns`
- **Data**: Material return records.
- **Columns**: Return ID, Material, Qty, Reason, Date, Status.
- **How**: Table with return tracking.

### `/person-b/pipeline`
- **Data**: Product orders grouped by stage.
- **Content**: Kanban columns by production stage.
- **How**: Groups by `po.stage`.

### `/person-b/workorder`
- **Data**: Work orders assigned to Person B.
- **Columns**: ID, Micron, Width, Qty, Date, Status, Stage.
- **How**: Filterable table with stage chips.

### `/person-b/workorder/[detailpage]`
- **Data**: Single work order detail.
- **Content**: Desktop breadcrumb. Mobile KPI 2×2 (FileText/Ruler/Maximize2/Package icons) + chips. Desktop overview row. Scrollable tabs. Toolbar with action buttons.
- **How**: Reads from store by route param.

## Key Flows
- Create product orders with full spec form
- Create material requests (weight/qty/grade → Person A issues from stock)
- View issued status on material requests (updated by Person A)
- Track work orders and product orders via detail pages
