-- Run this file by itself if schema.sql previously failed after partially
-- creating workflow_status or workflow_stage enum types.
--
-- Important: run this as a separate SQL Editor execution, then run schema.sql
-- in a second execution. PostgreSQL cannot use newly added enum values in
-- table defaults until the transaction that added them has committed.

alter type public.workflow_status add value if not exists 'Yet to Start';
alter type public.workflow_status add value if not exists 'In-progress';
alter type public.workflow_status add value if not exists 'Completed';
alter type public.workflow_status add value if not exists 'Cancelled';
alter type public.workflow_status add value if not exists 'Pending';
alter type public.workflow_status add value if not exists 'Issued';
alter type public.workflow_status add value if not exists 'Accepted';
alter type public.workflow_status add value if not exists 'Rejected';
alter type public.workflow_status add value if not exists 'Partially Issued';
alter type public.workflow_status add value if not exists 'Paid';
alter type public.workflow_status add value if not exists 'Partial Payment';
alter type public.workflow_status add value if not exists 'Due';
alter type public.workflow_status add value if not exists 'In Inventory';
alter type public.workflow_status add value if not exists 'Being Used';
alter type public.workflow_status add value if not exists 'Used Completely';
alter type public.workflow_status add value if not exists 'Quality Check Pending';
alter type public.workflow_status add value if not exists 'Dispatch Ready';

alter type public.workflow_stage add value if not exists 'Inventory';
alter type public.workflow_stage add value if not exists 'Raw Material';
alter type public.workflow_stage add value if not exists 'Ready for Metallisation';
alter type public.workflow_stage add value if not exists 'Metallisation';
alter type public.workflow_stage add value if not exists 'Slitting';
alter type public.workflow_stage add value if not exists 'Stock';
alter type public.workflow_stage add value if not exists 'Ready for Winding';
alter type public.workflow_stage add value if not exists 'Winding';
alter type public.workflow_stage add value if not exists 'Spray';
alter type public.workflow_stage add value if not exists 'Finished Goods';
alter type public.workflow_stage add value if not exists 'Completed';
alter type public.workflow_stage add value if not exists 'Dispatch Ready';
