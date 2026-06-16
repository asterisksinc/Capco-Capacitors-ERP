# Person A (Operator)

## Overview

Operational user focused on executing work orders and managing material issuance. Uses `OperatorShell` with mobile drawer, `OperatorTopbar`, and `MobileHeader` (mobile).

## Pages & Data

### `/person-a` (Overview)
- **Data**: Work orders + product orders from store.
- **Content**: 4 KPI cards (Work Orders Open, Product Orders Open, Pending Material Requests, Completed). Lists for recent work orders and product orders.
- **How**: Reads from `store.workOrders`, `store.productOrders`, `store.materialRequests`.

### `/person-a/workorder`
- **Data**: All `WorkOrderSummary` entries.
- **Columns**: ID, Micron, Width, Qty, Date, Status, Stage.
- **How**: Sortable/filterable table. Stage shown as chips. Links to detail page.

### `/person-a/workorder/[detailpage]`
- **Data**: Single work order detail.
- **Content**: Desktop breadcrumb. Mobile KPI 2×2 grid + chips. Desktop overview row with Micron/Width/Qty/Status. Scrollable tabs (Details, Production Flow, Materials, Timeline). Action button toolbar.
- **How**: Reads order from `store.workOrders` by ID from route param.

### `/person-a/product-orders`
- **Data**: All `ProductOrderSummary` entries.
- **Columns**: ID, Product Code, Type, Grade, Batch Size, Status.
- **How**: Table with KPI stats (calculated from store). Stages as chips.

### `/person-a/product-orders/[detailpage]`
- **Data**: Single product order detail.
- **Content**: Breadcrumb, tabs, detail sections. "Edit" and "Delete" buttons.
- **How**: Reads from store by route param.

### `/person-a/stock`
- **Data**: Assigned stock from `store.assignments`.
- **Columns**: Stock ID, Weight, Grade, Qty, Status.
- **How**: Table view of inventory assigned to Person A.

### `/person-a/material-requests`
- **Data**: `MaterialRequest[]` from store.
- **Columns**: Request ID, Weight, Grade, Req Qty, Status, Created At, Issued At, Action.
- **How**: Shows requests created by Person B. Person A can **Issue** (opens modal to enter issued qty) or **Reject** (cancels). Issued status persists to Person B's view (same store).
- **Issue Modal**: Shows item details (Weight, Grade, Requested Qty) + Issued Qty input. Submits via `issueMaterialRequest()`.

### `/person-a/material-returns`
- **Data**: Material return records.
- **Columns**: Return ID, Material, Qty, Reason, Date, Status.
- **How**: Table with return tracking.

### `/person-a/pipeline`
- **Data**: Work orders grouped by stage into a kanban board.
- **Content**: 4 columns: Yet to Start, In-progress, Completed, On Hold. Cards show ID/date with View link.

## Key Flows
- View/execute work orders from detail page
- Issue materials requested by Person B (mark as Issued → visible on both sides)
- Reject material requests
- Track work order pipeline stages
