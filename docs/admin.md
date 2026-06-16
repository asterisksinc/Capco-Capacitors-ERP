# Admin

## Overview

Full administrative dashboard with visibility across all operations. Has its own shell (`AdminShell`) with sidebar navigation and sticky topbar (`AdminTopbar`) including search, notifications, and user switcher.

## Pages & Data

### `/admin/overview`
- **Data**: Work orders + product order counts from store.
- **Content**: 4 KPI stats (Work Orders Open, Product Orders Open, Orders Delayed, Completed). Kanban-style cards grouped by stage with view links.
- **How**: Fetches from `store.workOrders` and `store.productOrders`.

### `/admin/workorders`
- **Data**: All `WorkOrderSummary` entries.
- **Columns**: ID, Micron, Width, Qty, Date, Status, Options.
- **How**: Sortable/filterable table via `useTableControls`. Actions include Edit (opens modal with micron/width/qty form) and Delete.
- **Create**: "Add Work Order" button opens a modal with Micron (select 5-15), Width (select 0.5-2), Qty (number input). Generates `WO-NNNN` ID.

### `/admin/productorders`
- **Data**: All `ProductOrderSummary` entries.
- **Columns**: ID, Product Code, Type, Grade, Batch Size, Status, Actions.
- **How**: Sortable/filterable table. Stages shown as clickable chips (Yet to Start, Raw Material, ..., QC).

### `/admin/inventory`
- **Data**: `InventoryItem[]` from store.
- **Columns**: Stock ID, Product Name, Quantity, Unit, Status.
- **How**: Table with search/filter.

### `/admin/pipeline`
- **Data**: Work orders grouped by production stage.
- **Content**: Kanban board showing cards in columns: Raw Material, Metallisation, Slitting, Winding, Spray, Epoxy, Soldering, Packaging, QC.
- **How**: Groups `store.workOrders` by `wo.stage`.

### `/admin/users`
- **Data**: Static user management UI.
- **Content**: Table with Name, Email, Role, Status columns.

### `/admin/workorders/[id]` / `/admin/productorders/[id]`
- **Data**: Detail page for a single order.
- **How**: Reads order from store by route param, renders full details + flow data.

### `/admin/finishedgoods`
- **Data**: Completed work orders display.
- **Content**: Table of finished/dispatch-ready goods.

### `/admin/invoices`
- **Data**: Static invoice management UI.
- **Content**: Table with Invoice ID, Customer, Amount, Status.

## Key Flows
- Create work orders and product orders via modals
- Edit/delete work orders
- Pipeline kanban for stage tracking
- Full CRUD across all entities
