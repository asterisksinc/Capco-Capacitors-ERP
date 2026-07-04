import { supabaseRest, toCsv } from "./supabaseClient";

export const importExportService = {
  createJob(payload: {
    module: string;
    job_type: "import" | "export";
    file_name?: string;
    file_url?: string;
    total_rows?: number;
  }) {
    return supabaseRest.create("import_export_jobs", { ...payload, status: "pending" });
  },
  completeJob(id: string, processedRows: number, errorRows = 0, errors: unknown[] = []) {
    return supabaseRest.update("import_export_jobs", id, {
      status: errorRows > 0 ? "completed_with_errors" : "completed",
      processed_rows: processedRows,
      error_rows: errorRows,
      errors,
      completed_at: new Date().toISOString(),
    });
  },
  toCsv,
};
