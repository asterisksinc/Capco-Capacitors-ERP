# Production Head

## Overview

Supervisor role overseeing production across Person A, Person B, Person C, and Person D. Uses `SupervisorShell` with sidebar, `SupervisorTopbar`, and mobile drawer.

## Pages & Data

### `/productionhead` (Overview)
- **Data**: All work orders + product orders.
- **Content**: Kanban board with 4 columns (Person A, Person B, Person C, Person D). Each column shows cards grouped by person with ID, stage, date, status badge, and View link.
- **How**: Person A cards from non-completed work orders. Person B cards from product orders. Person C/D cards from completed work orders (sample).
- **Filters**: Search, sort (A-Z), stage filter, status filter. Export to Excel.
- **Create Order Dropdown**: "Work Order" opens a modal with Micron/Width/Qty fields. "Product Order" opens a modal with full spec (Product Code, Capacitance, Voltage, Type, Grade, Tolerance, Dielectric, Batch Size, Priority, Instructions). Both create via `addWorkOrder()` / `addProductOrder()`.

### `/productionhead/workorder`
- **Data**: All `WorkOrderSummary` entries.
- **Columns**: ID, Micron, Width, Qty, Date, Status, Options.
- **How**: Sortable/filterable table. Actions: Edit (opens modal), Delete.
- **Create**: Modal with Micron (5-15), Width (0.5-2), Qty.

### `/productionhead/workorder/[detailpage]`
- **Data**: Single work order detail.
- **Content**: Breadcrumb, tabs, detail sections. Full flow tracking.

### `/productionhead/productorders`
- **Data**: All `ProductOrderSummary` entries.
- **Columns**: ID, Product Code, Type, Grade, Batch Size, Status.
- **How**: Table with stage chips. "Add Product Order" opens full spec modal (13 fields including Product Code, Capacitance, Voltage, Type, Grade, Tolerance, Dielectric, Batch Size, Priority, Instructions).

### `/productionhead/productorders/[detailpage]`
- **Data**: Single product order detail.
- **Content**: Breadcrumb, tabs, detail sections.

### `/productionhead/pipeline`
- **Data**: Work orders grouped by production stage.
- **Content**: Kanban board (Raw Material → QC).
- **How**: Groups work orders by `wo.stage`.

### `/productionhead/stock`
- **Data**: Inventory/stock view.
- **Columns**: Stock ID, Product Name, Qty, Unit, Status.
- **How**: Table with search.

### `/productionhead/stocks`
- **Data**: Another stock listing view.
- **Content**: Alternative stock table layout.

## Key Flows
- Create work orders and product orders from overview or listing pages
- Edit/delete work orders
- Pipeline kanban across all stages
- Overview kanban grouped by person (Person A-D)
- Export overview data to Excel
