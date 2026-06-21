# QR Code Scanning: Roles & Visibility

This document breaks down how different personas within the Capco application interact with the QR Code system, including what they are physically scanning, what actions it triggers, and what information they are authorized to see.

---

## 1. Store Head (Inventory & Dispatch)
The Store Head is primarily responsible for the **generation** of QR codes and the initial tracking of raw materials.

* **What they do:** 
  - Generates and prints physical QR labels for newly arrived **Raw Materials (RM)** and newly created **Work Orders (WO)**.
* **What they scan:** 
  - Incoming pallets, raw material rolls, and finished goods preparing for dispatch.
* **What they see (Visibility):**
  - Scanning a barcode opens the **Material Trace Modal**, giving them a top-down view of where a material came from (Supplier/Roll ID) and where it is currently stored. They do not need to execute manufacturing tasks, so they only see the traceability lineage.

---

## 2. Production Head (Floor Management)
The Production Head oversees the entire manufacturing floor and uses QR scanning for quick audits and progress checks.

* **What they scan:**
  - Active Work Orders (`WO-xxxx`) traveling with physical bins across the factory floor.
  - Product Orders (`PO-xxxx`) to check the status of a bulk client request.
* **What they see (Visibility):**
  - Scanning a **Work Order** intelligently routes them to the `/productionhead/workorder/[id]` details page. Here they see:
    - Overall completion percentage.
    - Which operators (Person A or B) are currently assigned.
    - Defect logs and machine statuses.
  - Scanning a **Raw Material** opens the Trace Modal to help them identify if a defective material caused a production halt.

---

## 3. Floor Operators (Person-A / Person-B)
The operators are the primary *consumers* of the QR scanning feature. They use mounted or handheld devices to scan items at their specific workstations (e.g., Slitting, Winding, Metallisation).

* **What they scan:**
  - **Work Orders (`WO-xxxx`)**: Scanned when they receive a physical bin at their machine to begin their specific manufacturing stage.
  - **Raw Materials (`RM-xxxx`)**: Scanned before feeding a material roll into the machine to ensure it matches the Work Order requirements.
* **What they see (Visibility):**
  - Scanning a **Work Order** intelligently routes them to their specific execution page (`/person-a/workorder/[id]` or `/person-b/workorder/[id]`). 
    - They **only** see the technical specs relevant to their machine (e.g., Micron, Width, required Qty) and input fields to mark their stage as "Completed".
  - Scanning a **Raw Material** opens the Trace Modal, acting as a verification step to confirm they picked the correct batch from the warehouse.

---

## 4. Sales & Admin
These roles operate mostly at the macro level and rarely interact with the physical QR scanning on the floor.

* **What they see (Visibility):**
  - If an Admin or Sales rep uses the system to trace an ID manually, they receive a financial and high-level overview. They can see the lineage of an item to verify warranty claims (e.g., tracing a defective finished good back to a specific raw material supplier roll) but they do not see the execution-level machine metrics that an Operator sees.

---

## Summary Matrix

| Persona | Primary Interaction | Scans Work Order (WO) | Scans Material (RM) | Scans Product Order (PO) |
| :--- | :--- | :--- | :--- | :--- |
| **Store Head** | Generation & Auditing | Trace Modal | Trace Modal | Trace Modal |
| **Production Head** | Progress Monitoring | Routes to Prod Details | Trace Modal | Routes to PO Details |
| **Operators (A/B)** | Execution & Verification | Routes to Stage Execution | Trace Modal (Verification) | Routes to PO Summary |
| **Sales/Admin** | Warranty & Claims | Trace Modal | Trace Modal | Trace Modal |
