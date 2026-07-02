export type FieldType = "text" | "number" | "select" | "date" | "image";

export interface EntityField {
  key: string;
  label: string;
  type: FieldType;
  options?: string[];
  required?: boolean;
  /** Include in listing tables */
  showInTable?: boolean;
  /** Include in add/edit forms */
  showInForm?: boolean;
  /** Include in QR sticker details */
  showInQR?: boolean;
  /** Include in Excel export */
  showInExport?: boolean;
  sortable?: boolean;
  filterable?: boolean;
  placeholder?: string;
}

export interface EntityConfig {
  type: string;
  typeLabel: string;
  color: string;
  idField: string;
  fields: EntityField[];
}

const RM: EntityConfig = {
  type: "RM",
  typeLabel: "Raw Material",
  color: "#1CB061",
  idField: "rollNo",
  fields: [
    { key: "rollNo", label: "Roll No.", type: "text", showInTable: true, showInForm: true, showInQR: true, showInExport: true, sortable: true, required: true },
    { key: "netWeight", label: "Net Weight", type: "text", showInTable: true, showInForm: true, showInQR: true, showInExport: true, sortable: true },
    { key: "grossWeight", label: "Gross Weight", type: "text", showInTable: false, showInForm: true, showInQR: true, showInExport: true },
    { key: "thickness", label: "Micron", type: "text", showInTable: true, showInForm: true, showInQR: true, showInExport: true, sortable: true },
    { key: "width", label: "Width", type: "text", showInTable: true, showInForm: true, showInQR: true, showInExport: true, sortable: true },
    { key: "temperature", label: "Temperature", type: "text", showInTable: false, showInForm: true, showInQR: true, showInExport: true },
    { key: "supplier", label: "Supplier", type: "text", showInTable: true, showInForm: true, showInQR: true, showInExport: true },
    { key: "status", label: "Status", type: "select", options: ["Yet to Start", "In-progress", "Completed"], showInTable: true, showInQR: true, showInExport: true, filterable: true },
  ],
};

const WO: EntityConfig = {
  type: "WO",
  typeLabel: "Work Order",
  color: "#00B6E2",
  idField: "id",
  fields: [
    { key: "id", label: "Work Order ID", type: "text", showInTable: true, showInForm: false, showInQR: true, showInExport: true, sortable: true },
    { key: "micron", label: "Micron", type: "select", options: ["3.5", "4 HT", "4.5 HT", "5", "5.5", "5.5 HT", "6", "6 HT", "6.5", "6.5 HT", "7", "7.5", "8", "9", "10", "12"], showInTable: true, showInForm: true, showInQR: true, showInExport: true, sortable: true },
    { key: "width", label: "Width", type: "select", options: ["30", "37.5", "45", "50", "60", "75", "100"], showInTable: true, showInForm: true, showInQR: true, showInExport: true, sortable: true },
    { key: "qty", label: "Quantity", type: "number", showInTable: true, showInForm: true, showInQR: true, showInExport: true, sortable: true },
    { key: "date", label: "Date", type: "date", showInTable: true, showInQR: true, showInExport: true, sortable: true },
    { key: "status", label: "Status", type: "select", options: ["Yet to Start", "In-progress", "Completed"], showInTable: true, showInQR: true, showInExport: true, filterable: true },
  ],
};

const PO: EntityConfig = {
  type: "PO",
  typeLabel: "Product Order",
  color: "#7C3AED",
  idField: "id",
  fields: [
    { key: "id", label: "Order ID", type: "text", showInTable: true, showInQR: true, showInExport: true, sortable: true },
    { key: "product", label: "Product", type: "select", options: ["MFD", "PP", "AL", "OIL TYPE", "BOX TYPE", "KVAR", "ROUND"], showInTable: true, showInForm: true, showInQR: true, showInExport: true },
    { key: "type", label: "Type", type: "text", showInTable: true, showInForm: true, showInQR: true, showInExport: true },
    { key: "specifications", label: "Specifications", type: "text", showInTable: false, showInForm: true, showInQR: true, showInExport: true },
    { key: "batchSize", label: "Quantity", type: "number", showInTable: true, showInForm: true, showInQR: true, showInExport: true, sortable: true },
    { key: "customer", label: "Customer", type: "select", options: ["OEM", "NON OEM"], showInTable: false, showInForm: true, showInQR: true, showInExport: true },
    { key: "instructions", label: "Instructions", type: "text", showInTable: false, showInForm: true, showInQR: true, showInExport: true },
    { key: "grade", label: "Grade", type: "select", options: ["AAA", "A", "B", "C", "D"], showInTable: true, showInForm: true, showInQR: true, showInExport: true },
    { key: "status", label: "Status", type: "select", options: ["Yet to Start", "In-progress", "Completed"], showInTable: true, showInQR: true, showInExport: true, filterable: true },
  ],
};

const MC: EntityConfig = {
  type: "MC",
  typeLabel: "Metallisation Coil",
  color: "#E19242",
  idField: "coilNo",
  fields: [
    { key: "coilNo", label: "Coil No.", type: "text", showInTable: true, showInQR: true, showInExport: true, sortable: true },
    { key: "rmId", label: "RM ID", type: "text", showInTable: true, showInQR: true, showInExport: true },
    { key: "factoryWastage", label: "Factory Wastage", type: "text", showInTable: false, showInForm: true, showInQR: true, showInExport: true },
    { key: "wastageImage", label: "Wastage Image", type: "image", showInForm: true },
    { key: "weightAfterMetallisation", label: "Weight After Metallisation", type: "text", showInTable: true, showInForm: true, showInQR: true, showInExport: true },
    { key: "weightImage", label: "Weight Scale Image", type: "image", showInForm: true },
    { key: "qcImage", label: "Q.C Photo", type: "image", showInForm: true },
    { key: "machineNo", label: "Machine No.", type: "text", showInTable: true, showInQR: true, showInExport: true },
    { key: "status", label: "Status", type: "select", options: ["Yet to Start", "In-progress", "Completed"], showInTable: true, showInQR: true, showInExport: true, filterable: true },
  ],
};

const PM: EntityConfig = {
  type: "PM",
  typeLabel: "Product Metallisation",
  color: "#FB3748",
  idField: "productNo",
  fields: [
    { key: "productNo", label: "Product No.", type: "text", showInTable: true, showInQR: true, showInExport: true, sortable: true },
    { key: "rmId", label: "RM ID", type: "text", showInTable: true, showInQR: true, showInExport: true },
    { key: "bags", label: "No. of Bags", type: "number", showInTable: false, showInForm: true, showInQR: true, showInExport: true },
    { key: "bagGrades", label: "Grade per Bag", type: "text", showInForm: true },
    { key: "bagWeights", label: "Weight per Bag", type: "text", showInForm: true },
    { key: "weight", label: "Weight", type: "text", showInTable: true, showInQR: true, showInExport: true },
    { key: "grade", label: "Grade", type: "select", options: ["AAA", "A", "B", "C", "D"], showInTable: true, showInForm: true, showInQR: true, showInExport: true },
    { key: "date", label: "Date", type: "date", showInTable: true, showInQR: true, showInExport: true },
    { key: "status", label: "Status", type: "select", options: ["Yet to Start", "In-progress", "Completed"], showInTable: true, showInQR: true, showInExport: true, filterable: true },
  ],
};

const WD: EntityConfig = {
  type: "WD",
  typeLabel: "Winding",
  color: "#6366F1",
  idField: "wdId",
  fields: [
    { key: "wdId", label: "WD ID", type: "text", showInTable: true, showInQR: true, showInExport: true, sortable: true },
    { key: "linkedPmId", label: "Linked PM ID", type: "text", showInTable: true, showInQR: true, showInExport: true },
    { key: "mfd", label: "MFD", type: "text", showInTable: true, showInForm: true, showInQR: true, showInExport: true },
    { key: "filmTurns", label: "Film Turns", type: "text", showInTable: true, showInForm: true, showInQR: true, showInExport: true },
    { key: "elementWeight", label: "Weight of Element", type: "text", showInTable: true, showInForm: true, showInQR: true, showInExport: true },
    { key: "quantityWound", label: "Quantity", type: "text", showInTable: true, showInForm: true, showInQR: true, showInExport: true },
    { key: "totalFilmConsumed", label: "Total Film Consumed", type: "text", showInTable: true, showInForm: false, showInQR: true, showInExport: true },
    { key: "status", label: "Status", type: "select", options: ["Yet to Start", "In-progress", "Completed"], showInTable: true, showInQR: true, showInExport: true, filterable: true },
  ],
};

const SP: EntityConfig = {
  type: "SP",
  typeLabel: "Spray",
  color: "#EC4899",
  idField: "spId",
  fields: [
    { key: "spId", label: "SP ID", type: "text", showInTable: true, showInQR: true, showInExport: true, sortable: true },
    { key: "linkedWdId", label: "Linked WD ID", type: "text", showInTable: true, showInQR: true, showInExport: true },
    { key: "mfd", label: "MFD", type: "text", showInTable: true, showInForm: true, showInQR: true, showInExport: true },
    { key: "coats", label: "No. of Coats", type: "select", options: ["2", "3", "4", "5"], showInTable: true, showInForm: true, showInQR: true, showInExport: true },
    { key: "thicknessMaintained", label: "Thickness Maintained", type: "text", showInTable: true, showInForm: true, showInQR: true, showInExport: true },
    { key: "rejectedQty", label: "Rejected Quantity", type: "text", showInTable: true, showInForm: true, showInQR: true, showInExport: true },
    { key: "status", label: "Status", type: "select", options: ["Yet to Start", "In-progress", "Completed"], showInTable: true, showInQR: true, showInExport: true, filterable: true },
  ],
};

export const ENTITY_CONFIGS: Record<string, EntityConfig> = { RM, WO, PO, MC, PM, WD, SP };

export function getEntityConfig(type: string): EntityConfig | undefined {
  return ENTITY_CONFIGS[type];
}

export function getTableFields(type: string) {
  return getEntityConfig(type)?.fields.filter(f => f.showInTable) ?? [];
}

export function getFormFields(type: string) {
  return getEntityConfig(type)?.fields.filter(f => f.showInForm) ?? [];
}

export function getQRFields(type: string) {
  return getEntityConfig(type)?.fields.filter(f => f.showInQR) ?? [];
}

export function getExportFields(type: string) {
  return getEntityConfig(type)?.fields.filter(f => f.showInExport) ?? [];
}
