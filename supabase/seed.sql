-- Capco Manufacturing ERP seed data
-- Run after schema.sql. Auth users for OTP/password can be created in Supabase Auth;
-- profiles are pre-seeded here and can be linked later through auth_user_id.

insert into public.roles (id, code, name, description, permissions) values
('10000000-0000-0000-0000-000000000001','super_admin','Super Admin','Full platform access','{"modules":["*"],"actions":["*"]}'),
('10000000-0000-0000-0000-000000000002','production_head','Production Head','Creates work and product orders','{"modules":["dashboard","work_orders","product_orders","stock","pipeline"],"actions":["read","create","update","export"]}'),
('10000000-0000-0000-0000-000000000003','store_head','Store Head','Inventory and raw material assignments','{"modules":["inventory","work_orders","material_requests","material_returns"],"actions":["read","create","update","export"]}'),
('10000000-0000-0000-0000-000000000004','person_a','Person A','Coordinates metallisation and slitting','{"modules":["work_orders","stock","material_requests","material_returns","pipeline"],"actions":["read","create","update"]}'),
('10000000-0000-0000-0000-000000000005','operator_1_metallisation','Operator 1 - Metallisation','Performs metallisation','{"modules":["metallisation","work_orders"],"actions":["read","create","update"]}'),
('10000000-0000-0000-0000-000000000006','operator_2_slitting','Operator 2 - Slitting','Performs slitting and assigns stock','{"modules":["slitting","stock","product_orders"],"actions":["read","create","update"]}'),
('10000000-0000-0000-0000-000000000007','person_b','Person B','Coordinates winding and spray','{"modules":["product_orders","stock","material_requests","material_returns","pipeline"],"actions":["read","create","update"]}'),
('10000000-0000-0000-0000-000000000008','operator_3_winding','Operator 3 - Winding','Performs winding','{"modules":["winding","product_orders"],"actions":["read","create","update"]}'),
('10000000-0000-0000-0000-000000000009','operator_4_spray','Operator 4 - Spray','Performs spray and moves goods to finished goods','{"modules":["spray","finished_goods"],"actions":["read","create","update"]}'),
('10000000-0000-0000-0000-000000000010','sales','Sales','Reads product and finished goods data','{"modules":["product_orders","finished_goods"],"actions":["read","export"]}'),
('10000000-0000-0000-0000-000000000011','accountant','Accountant','Vendor purchases and payments','{"modules":["vendor_purchases","finished_goods"],"actions":["read","create","update","export"]}')
on conflict (code) do update set name = excluded.name, permissions = excluded.permissions, updated_at = now();

insert into public.profiles (id, role_id, reports_to, team_name, worker_label, full_name, email, phone, status, metadata) values
('20000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000001',null,'Administration','Super Admin','Aarav Mehta','superadmin@capco.local','+919900000001','active','{"password_seed":"Capco@123","login_note":"Create matching Supabase Auth user for password login or OTP testing."}'),
('20000000-0000-0000-0000-000000000002','10000000-0000-0000-0000-000000000002',null,'Production','Production Head','Priya Menon','production@capco.local','+919900000002','active','{"password_seed":"Capco@123"}'),
('20000000-0000-0000-0000-000000000003','10000000-0000-0000-0000-000000000003',null,'Store','Store Head','Sanjay Rao','store@capco.local','+919900000003','active','{"password_seed":"Capco@123"}'),
('20000000-0000-0000-0000-000000000004','10000000-0000-0000-0000-000000000004','20000000-0000-0000-0000-000000000002','Person A Team','Person A','Kiran Shah','persona@capco.local','+919900000004','active','{"password_seed":"Capco@123"}'),
('20000000-0000-0000-0000-000000000005','10000000-0000-0000-0000-000000000005','20000000-0000-0000-0000-000000000004','Person A Team','Metal 1','Ramesh Patel','metal1@capco.local','+919900000005','active','{"password_seed":"Capco@123"}'),
('20000000-0000-0000-0000-000000000006','10000000-0000-0000-0000-000000000006','20000000-0000-0000-0000-000000000004','Person A Team','Slitting 1','Nikhil Jain','slitting1@capco.local','+919900000006','active','{"password_seed":"Capco@123"}'),
('20000000-0000-0000-0000-000000000007','10000000-0000-0000-0000-000000000007','20000000-0000-0000-0000-000000000002','Person B Team','Person B','Rajesh Kumar','personb@capco.local','+919900000007','active','{"password_seed":"Capco@123"}'),
('20000000-0000-0000-0000-000000000008','10000000-0000-0000-0000-000000000008','20000000-0000-0000-0000-000000000007','Person B Team','Winding 1','Deepak Iyer','winding1@capco.local','+919900000008','active','{"password_seed":"Capco@123"}'),
('20000000-0000-0000-0000-000000000009','10000000-0000-0000-0000-000000000009','20000000-0000-0000-0000-000000000007','Person B Team','Spray 1','Farhan Ali','spray1@capco.local','+919900000009','active','{"password_seed":"Capco@123"}'),
('20000000-0000-0000-0000-000000000010','10000000-0000-0000-0000-000000000010',null,'Sales','Sales','Meera Joshi','sales@capco.local','+919900000010','active','{"password_seed":"Capco@123"}'),
('20000000-0000-0000-0000-000000000011','10000000-0000-0000-0000-000000000011',null,'Accounts','Accountant','Anita Desai','accountant@capco.local','+919900000011','active','{"password_seed":"Capco@123"}'),
('20000000-0000-0000-0000-000000000012','10000000-0000-0000-0000-000000000005','20000000-0000-0000-0000-000000000004','Person A Team','Metal 2','Suresh Nair','metal2@capco.local','+919900000012','active','{"password_seed":"Capco@123"}'),
('20000000-0000-0000-0000-000000000013','10000000-0000-0000-0000-000000000005','20000000-0000-0000-0000-000000000004','Person A Team','Metal 3','Imran Khan','metal3@capco.local','+919900000013','active','{"password_seed":"Capco@123"}'),
('20000000-0000-0000-0000-000000000014','10000000-0000-0000-0000-000000000006','20000000-0000-0000-0000-000000000004','Person A Team','Slitting 2','Harish Babu','slitting2@capco.local','+919900000014','active','{"password_seed":"Capco@123"}'),
('20000000-0000-0000-0000-000000000015','10000000-0000-0000-0000-000000000006','20000000-0000-0000-0000-000000000004','Person A Team','Slitting 3','Manoj Verma','slitting3@capco.local','+919900000015','active','{"password_seed":"Capco@123"}'),
('20000000-0000-0000-0000-000000000016','10000000-0000-0000-0000-000000000008','20000000-0000-0000-0000-000000000007','Person B Team','Winding 2','Arun Das','winding2@capco.local','+919900000016','active','{"password_seed":"Capco@123"}'),
('20000000-0000-0000-0000-000000000017','10000000-0000-0000-0000-000000000009','20000000-0000-0000-0000-000000000007','Person B Team','Spray 2','Vijay Reddy','spray2@capco.local','+919900000017','active','{"password_seed":"Capco@123"}')
on conflict (phone) do update set full_name = excluded.full_name, role_id = excluded.role_id, reports_to = excluded.reports_to, team_name = excluded.team_name, worker_label = excluded.worker_label, email = excluded.email, status = excluded.status, updated_at = now();

insert into public.qr_references (id, entity_type, entity_code, qr_payload, qr_url, created_by) values
('30000000-0000-0000-0000-000000000001','inventory','RM-8301','capco://inventory/RM-8301',null,'20000000-0000-0000-0000-000000000001'),
('30000000-0000-0000-0000-000000000002','inventory','RM-8302','capco://inventory/RM-8302',null,'20000000-0000-0000-0000-000000000001'),
('30000000-0000-0000-0000-000000000003','inventory','RM-8303','capco://inventory/RM-8303',null,'20000000-0000-0000-0000-000000000001'),
('30000000-0000-0000-0000-000000000004','work_order','WO-2026-001','capco://work-orders/WO-2026-001',null,'20000000-0000-0000-0000-000000000002'),
('30000000-0000-0000-0000-000000000005','work_order','WO-2026-002','capco://work-orders/WO-2026-002',null,'20000000-0000-0000-0000-000000000002'),
('30000000-0000-0000-0000-000000000006','product_order','PO-CC-0001','capco://product-orders/PO-CC-0001',null,'20000000-0000-0000-0000-000000000002'),
('30000000-0000-0000-0000-000000000007','product_order','PO-CC-0002','capco://product-orders/PO-CC-0002',null,'20000000-0000-0000-0000-000000000002'),
('30000000-0000-0000-0000-000000000008','stock','PM-1001','capco://stock/PM-1001',null,'20000000-0000-0000-0000-000000000006'),
('30000000-0000-0000-0000-000000000009','metallisation','MC-1001','capco://metallisation/MC-1001',null,'20000000-0000-0000-0000-000000000005'),
('30000000-0000-0000-0000-000000000010','metallisation','MC-1002','capco://metallisation/MC-1002',null,'20000000-0000-0000-0000-000000000005'),
('30000000-0000-0000-0000-000000000011','slitting','SL-1001','capco://slitting/SL-1001',null,'20000000-0000-0000-0000-000000000006'),
('30000000-0000-0000-0000-000000000012','slitting','SL-1002','capco://slitting/SL-1002',null,'20000000-0000-0000-0000-000000000006')
on conflict (qr_payload) do nothing;

insert into public.inventory (id, raw_material_code, raw_material_name, roll_no, micron, width_m, net_weight_kg, gross_weight_kg, current_weight_kg, actual_weight_kg, damaged_weight_kg, used_weight_kg, wastage_weight_kg, wet_weight_kg, supplier, temperature_c, date_received, status, stage, assigned_work_order_id, qr_reference_id, created_by) values
('40000000-0000-0000-0000-000000000001','RM-8301','BOPP Capacitor Film','RL-2401-001',4.5,1.0,58.5,60.0,28.5,58.5,0.4,29.6,0.0,59.1,'VedaCap Industries',25,'2026-06-25','Being Used','Metallisation',null,'30000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001'),
('40000000-0000-0000-0000-000000000002','RM-8302','BOPP Capacitor Film','RL-2401-002',6.5,1.2,45.2,47.0,0,45.2,0.3,44.9,0.0,45.8,'ElectroForge Capacitors',26,'2026-06-25','Used Completely','Completed',null,'30000000-0000-0000-0000-000000000002','20000000-0000-0000-0000-000000000001'),
('40000000-0000-0000-0000-000000000003','RM-8303','BOPP Capacitor Film','RL-2401-003',5.0,0.8,62.8,64.5,62.8,62.8,0,0,0,63.0,'NextGen Metallic Pvt Ltd',24,'2026-06-26','In Inventory','Inventory',null,'30000000-0000-0000-0000-000000000003','20000000-0000-0000-0000-000000000001'),
('40000000-0000-0000-0000-000000000004','RM-8304','BOPP Capacitor Film','RL-2401-004',4.5,1.0,55.0,56.8,55.0,55.0,0,0,0,55.3,'VedaCap Industries',25,'2026-06-27','In Inventory','Inventory',null,null,'20000000-0000-0000-0000-000000000001'),
('40000000-0000-0000-0000-000000000005','RM-8305','BOPP Capacitor Film','RL-2401-005',7.5,1.5,48.3,50.1,48.3,48.3,0,0,0,48.8,'ElectroForge Capacitors',27,'2026-06-28','In Inventory','Inventory',null,null,'20000000-0000-0000-0000-000000000001')
on conflict (raw_material_code) do update set status = excluded.status, stage = excluded.stage, current_weight_kg = excluded.current_weight_kg, updated_at = now();

insert into public.work_orders (id, work_order_no, micron, width_m, quantity, stage, status, planned_start_date, due_date, assigned_to, qr_reference_id, created_by) values
('50000000-0000-0000-0000-000000000001','WO-2026-001',4.5,1.0,5000,'Stock','Completed','2026-06-26','2026-07-01','20000000-0000-0000-0000-000000000004','30000000-0000-0000-0000-000000000004','20000000-0000-0000-0000-000000000002'),
('50000000-0000-0000-0000-000000000002','WO-2026-002',6.5,1.2,3000,'Slitting','In-progress','2026-06-28','2026-07-05','20000000-0000-0000-0000-000000000004','30000000-0000-0000-0000-000000000005','20000000-0000-0000-0000-000000000002'),
('50000000-0000-0000-0000-000000000003','WO-2026-003',5.0,0.8,4500,'Raw Material','Yet to Start','2026-07-02','2026-07-08','20000000-0000-0000-0000-000000000004',null,'20000000-0000-0000-0000-000000000002')
on conflict (work_order_no) do update set stage = excluded.stage, status = excluded.status, updated_at = now();

update public.inventory set assigned_work_order_id = '50000000-0000-0000-0000-000000000001' where raw_material_code in ('RM-8301','RM-8302');

insert into public.work_order_materials (id, work_order_id, inventory_id, assigned_to, assigned_by, handover_to, handover_by, handover_at, quantity_kg, status, notes) values
('51000000-0000-0000-0000-000000000001','50000000-0000-0000-0000-000000000001','40000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000004','20000000-0000-0000-0000-000000000003','20000000-0000-0000-0000-000000000005','20000000-0000-0000-0000-000000000004','2026-06-26 09:30+05:30',58.5,'Issued','Issued to Person A then Operator 1'),
('51000000-0000-0000-0000-000000000002','50000000-0000-0000-0000-000000000001','40000000-0000-0000-0000-000000000002','20000000-0000-0000-0000-000000000004','20000000-0000-0000-0000-000000000003','20000000-0000-0000-0000-000000000005','20000000-0000-0000-0000-000000000004','2026-06-26 09:35+05:30',45.2,'Issued','Issued to Person A then Operator 1')
on conflict (work_order_id, inventory_id) do nothing;

insert into public.metallisation (id, metallisation_no, work_order_id, raw_material_id, operator_id, coil_no, machine_no, weight_kg, weight_after_metallisation_kg, optical_density, resistance_ohms, factory_wastage_kg, factory_wastage_image_url, photo_url, qc_details, next_stage, status, qr_reference_id, created_by, created_at) values
('60000000-0000-0000-0000-000000000001','MC-1001','50000000-0000-0000-0000-000000000001','40000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000005','MC-1001','MET-01',58.5,57.9,2.40,1.50,0.6,'https://example.local/qc/mc-1001-wastage.jpg','https://example.local/qc/mc-1001.jpg','{"qc":"pass","remarks":"OD stable across roll"}','Slitting','Completed','30000000-0000-0000-0000-000000000009','20000000-0000-0000-0000-000000000005','2026-06-26 13:00+05:30'),
('60000000-0000-0000-0000-000000000002','MC-1002','50000000-0000-0000-0000-000000000001','40000000-0000-0000-0000-000000000002','20000000-0000-0000-0000-000000000012','MC-1002','MET-01',45.2,44.8,2.35,1.62,0.4,'https://example.local/qc/mc-1002-wastage.jpg','https://example.local/qc/mc-1002.jpg','{"qc":"pass","remarks":"Minor edge trimming"}','Slitting','Completed','30000000-0000-0000-0000-000000000010','20000000-0000-0000-0000-000000000012','2026-06-26 17:00+05:30')
on conflict (metallisation_no) do update set status = excluded.status, updated_at = now();

insert into public.slitting (id, slitting_no, work_order_id, metallisation_id, raw_material_id, operator_id, product_no, weight_kg, thickness_micron, width_m, number_of_bags, grade, grade_each_bag, weight_each_bag, remarks, status, qr_reference_id, created_by, created_at) values
('70000000-0000-0000-0000-000000000001','SL-1001','50000000-0000-0000-0000-000000000001','60000000-0000-0000-0000-000000000001','40000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000006','PM-1001',28.5,4.5,1.0,3,'AA','["AA","AA","A"]','[9.5,9.4,9.6]','Ready for premium winding','Completed','30000000-0000-0000-0000-000000000011','20000000-0000-0000-0000-000000000006','2026-06-27 10:30+05:30'),
('70000000-0000-0000-0000-000000000002','SL-1002','50000000-0000-0000-0000-000000000001','60000000-0000-0000-0000-000000000002','40000000-0000-0000-0000-000000000002','20000000-0000-0000-0000-000000000014','PM-1002',44.8,6.5,1.2,4,'A','["A","A","A","B"]','[11.2,11.1,11.4,11.1]','Standard lot','Completed','30000000-0000-0000-0000-000000000012','20000000-0000-0000-0000-000000000014','2026-06-27 14:30+05:30')
on conflict (slitting_no) do update set status = excluded.status, updated_at = now();

insert into public.stock (id, stock_no, slitting_id, work_order_id, weight_kg, width_m, micron, grade, quantity, status, stage, qr_reference_id, created_by) values
('80000000-0000-0000-0000-000000000001','PM-1001','70000000-0000-0000-0000-000000000001','50000000-0000-0000-0000-000000000001',28.5,1.0,4.5,'AA',3,'Pending','Stock','30000000-0000-0000-0000-000000000008','20000000-0000-0000-0000-000000000006'),
('80000000-0000-0000-0000-000000000002','PM-1002','70000000-0000-0000-0000-000000000002','50000000-0000-0000-0000-000000000001',44.8,1.2,6.5,'A',4,'Quality Check Pending','Stock',null,'20000000-0000-0000-0000-000000000006')
on conflict (stock_no) do update set status = excluded.status, updated_at = now();

insert into public.product_orders (id, product_order_no, product_code, product_name, capacitor_type, grade, specifications, quantity, batch_size, customer, instructions, stage, status, planned_start_date, delivery_commitment, assigned_to, qr_reference_id, created_by) values
('90000000-0000-0000-0000-000000000001','PO-CC-0001','C-450V-100uF','Motor Run Capacitor','Motor','AA','{"capacitance":"100uF","voltage_rating":"450V AC","tolerance":"+/-5%","winding_requirement":"120 turns/layer, 3-layer","spray_requirement":"Zinc spray, batch ZS-447"}',5000,5000,'Omega Drives Pvt Ltd','Prioritize premium AA grade material','Winding','In-progress','2026-06-29','2026-07-12 09:00+05:30','20000000-0000-0000-0000-000000000007','30000000-0000-0000-0000-000000000006','20000000-0000-0000-0000-000000000002'),
('90000000-0000-0000-0000-000000000002','PO-CC-0002','MKT-250V-22uF','MKT Film Capacitor','Power','A+','{"capacitance":"22uF","voltage_rating":"250V DC","tolerance":"+/-10%","winding_requirement":"90 turns/layer, 2-layer","spray_requirement":"Tin-zinc spray"}',3000,3000,'Nova Controls','Hold after winding for QC audit','Raw Material','Yet to Start','2026-07-03','2026-07-18 09:00+05:30','20000000-0000-0000-0000-000000000007','30000000-0000-0000-0000-000000000007','20000000-0000-0000-0000-000000000002')
on conflict (product_order_no) do update set stage = excluded.stage, status = excluded.status, updated_at = now();

insert into public.product_order_materials (id, product_order_id, stock_id, linked_work_order_id, assigned_by, assigned_to, handover_by, weight_kg, width_m, micron, grade, status, created_at) values
('91000000-0000-0000-0000-000000000001','90000000-0000-0000-0000-000000000001','80000000-0000-0000-0000-000000000001','50000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000006','20000000-0000-0000-0000-000000000007','20000000-0000-0000-0000-000000000006',28.5,1.0,4.5,'AA','Issued','2026-06-29 10:00+05:30')
on conflict (product_order_id, stock_id) do nothing;

insert into public.winding (id, winding_no, product_order_id, product_material_id, operator_id, film_width, winding_tension, film_turns, turns_count, quantity_wound, weight_of_element_kg, total_film_consumed_kg, rejected_quantity, status, created_by, created_at) values
('a0000000-0000-0000-0000-000000000001','WD-1001','90000000-0000-0000-0000-000000000001','91000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000008','7mm','0.5 N',120,360,1250,0.028,12.4,15,'Completed','20000000-0000-0000-0000-000000000008','2026-06-30 15:30+05:30')
on conflict (winding_no) do update set status = excluded.status, updated_at = now();

insert into public.spray (id, spray_no, product_order_id, winding_id, operator_id, spray_type, feed_rate, pressure_setting, mfd, no_of_coats, thickness_maintained, rejected_quantity, quantity, status, created_by, created_at) values
('b0000000-0000-0000-0000-000000000001','SP-1001','90000000-0000-0000-0000-000000000001','a0000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000009','Zinc-spray','0.5 kg/hr','120 PSI','98.4',2,'Within 3 micron tolerance',8,1242,'Completed','20000000-0000-0000-0000-000000000009','2026-07-01 12:10+05:30')
on conflict (spray_no) do update set status = excluded.status, updated_at = now();

insert into public.finished_goods (id, finished_good_no, product_order_id, product_code, product_name, quantity, grade, status, created_by) values
('c0000000-0000-0000-0000-000000000001','FG-1001','90000000-0000-0000-0000-000000000001','C-450V-100uF','Motor Run Capacitor',1242,'AA','Dispatch Ready','20000000-0000-0000-0000-000000000009')
on conflict (finished_good_no) do update set quantity = excluded.quantity, updated_at = now();

insert into public.material_requests (id, request_no, material_type, stock_id, product_order_id, requested_quantity, issued_quantity, grade, requested_by, issued_by, issued_at, status, notes) values
('d0000000-0000-0000-0000-000000000001','MR-1001','stock','80000000-0000-0000-0000-000000000002','90000000-0000-0000-0000-000000000002',20.0,0,'A','20000000-0000-0000-0000-000000000007',null,null,'Pending','Person B requested slitted stock for winding queue'),
('d0000000-0000-0000-0000-000000000002','MR-1002','raw_material',null,null,55.0,55.0,null,'20000000-0000-0000-0000-000000000004','20000000-0000-0000-0000-000000000003','2026-06-28 09:15+05:30','Issued','Person A requested raw material for WO-2026-002')
on conflict (request_no) do update set status = excluded.status, updated_at = now();

insert into public.material_returns (id, return_no, material_type, stock_id, product_order_id, weight_kg, used_weight_kg, quantity_returned, reason, returned_by, status) values
('e0000000-0000-0000-0000-000000000001','RET-1001','stock','80000000-0000-0000-0000-000000000002','90000000-0000-0000-0000-000000000002',8.5,3.1,5.4,'Edge damage after trial winding','20000000-0000-0000-0000-000000000007','Pending')
on conflict (return_no) do update set status = excluded.status, updated_at = now();

insert into public.vendor_purchases (id, purchase_no, vendor_name, purchase_date, direction, order_amount, paid_amount, status, payment_type, notes, created_by) values
('f0000000-0000-0000-0000-000000000001','VP-1001','VedaCap Industries','2026-06-25','Credit',185000.00,100000.00,'Partial Payment','NEFT','June raw material purchase','20000000-0000-0000-0000-000000000011'),
('f0000000-0000-0000-0000-000000000002','VP-1002','ElectroForge Capacitors','2026-06-26','Credit',132500.00,132500.00,'Paid','UPI','Paid in full','20000000-0000-0000-0000-000000000011')
on conflict (purchase_no) do update set paid_amount = excluded.paid_amount, status = excluded.status, updated_at = now();

insert into public.vendor_purchase_items (purchase_id, item_type, rate, quantity, total) values
('f0000000-0000-0000-0000-000000000001','BOPP Film 4.5 micron',1850,100,185000),
('f0000000-0000-0000-0000-000000000002','BOPP Film 6.5 micron',2650,50,132500)
on conflict (purchase_id, item_type) do nothing;

insert into public.pipeline_tracking (entity_type, entity_id, from_stage, to_stage, status, assigned_from, assigned_to, notes, created_by, created_at) values
('work_order','50000000-0000-0000-0000-000000000001','Raw Material','Metallisation','Completed','20000000-0000-0000-0000-000000000004','20000000-0000-0000-0000-000000000005','Person A handed RM to Operator 1','20000000-0000-0000-0000-000000000004','2026-06-26 09:30+05:30'),
('work_order','50000000-0000-0000-0000-000000000001','Metallisation','Slitting','Completed','20000000-0000-0000-0000-000000000005','20000000-0000-0000-0000-000000000006','Metallised roll moved to slitting','20000000-0000-0000-0000-000000000005','2026-06-27 09:00+05:30'),
('work_order','50000000-0000-0000-0000-000000000001','Slitting','Stock','Completed','20000000-0000-0000-0000-000000000006',null,'Slitting output added to stock','20000000-0000-0000-0000-000000000006','2026-06-27 15:00+05:30'),
('product_order','90000000-0000-0000-0000-000000000001','Stock','Winding','In-progress','20000000-0000-0000-0000-000000000006','20000000-0000-0000-0000-000000000007','Stock assigned to Person B for winding','20000000-0000-0000-0000-000000000006','2026-06-29 10:00+05:30'),
('product_order','90000000-0000-0000-0000-000000000001','Winding','Spray','Completed','20000000-0000-0000-0000-000000000008','20000000-0000-0000-0000-000000000009','Winding completed and moved to spray','20000000-0000-0000-0000-000000000008','2026-07-01 09:00+05:30');
