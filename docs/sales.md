# Sales

## Overview

Customer-facing role managing sales, warranties, and invoices. Uses `SalesShell` with sidebar and `SalesTopbar` (search + notifications).

## Pages & Data

### `/sales` (Overview)
- **Data**: Aggregate sales data.
- **Content**: KPI cards (Total Sales, Active Warranties, Pending Claims, etc.). Lists for recent activity.
- **How**: Reads from store.

### `/sales/overview`
- **Data**: Same as `/sales` (redirect/alias).
- **Content**: KPI dashboard with sales metrics.

### `/sales/warranties`
- **Data**: Registered warranty records.
- **Columns**: Warranty ID, Customer, Product, Expiry Date, Status.
- **How**: Table with search/filter. Status badges (Active, Expiring, Expired).

### `/sales/claims`
- **Data**: Warranty claim records.
- **Columns**: Claim ID, Warranty ID, Customer, Issue, Status, Date.
- **How**: Sortable/filterable table. Status badges (Open, In Progress, Approved, Rejected).

### `/sales/invoices`
- **Data**: Invoice/CRM records.
- **Columns**: Invoice ID, Customer, Amount, Date, Status.
- **How**: Table with sales invoice data.

## Key Flows
- Track registered warranties and expiry dates
- Process warranty claims (create, update status)
- Manage invoices and customer records
- View sales overview KPIs
