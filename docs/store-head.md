# Store Head

## Overview

Warehouse/inventory manager handling stock receipt from suppliers and raw material inventory. Uses `StoreHeadShell` with mobile drawer and `StoreHeadTopbar`.

## Pages & Data

### `/store-head` (Overview)
- **Data**: Inventory items + work orders from store.
- **Content**: KPI cards (Total Items, Low Stock, etc.). Lists for recent inventory and work orders.
- **How**: Reads from `store.inventoryItems`, `store.workOrders`.

### `/store-head/inventory`
- **Data**: `InventoryItem[]` from store.
- **Columns**: Stock ID, Product Name, Quantity, Unit, Status.
- **How**: Sortable/filterable table. "Add Inventory" button opens a modal to add new stock items (full-width on mobile).
- **Modal**: Form with Product Name, Quantity, Unit fields. Submits via `addInventoryItem()`.

### `/store-head/workorder`
- **Data**: Work orders relevant to store (raw material stage).
- **Columns**: ID, Micron, Width, Qty, Date, Status.
- **How**: Filterable table. Links to detail page.

### `/store-head/workorder/[detailpage]`
- **Data**: Single work order detail from store perspective.
- **Content**: Breadcrumb, detail sections, material tracking.

### `/store-head/pipeline`
- **Data**: Work orders grouped by stage.
- **Content**: Kanban board.
- **How**: Groups by stage, filtered for store-relevant orders.

## Key Flows
- Manage inventory items (add new stock)
- View work orders in raw material stage
- Track inventory levels
