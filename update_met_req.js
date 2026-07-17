const fs = require('fs');

const file = 'C:\\Users\\hp\\OneDrive\\Documents\\AsterisksInc\\capco\\app\\person-a-metallisation\\material-requests\\page.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace fallback strings
content = content.replace(/user\?\.id \|\| "Metallisation"/g, 'user?.id || ""');

// Add Reject button
content = content.replace(
  /\{row\.notes\.includes\("\[Slitting\]"\) && row\.status === "Pending" && \(\s*<button onClick=\{\(\) => openIssueModal\(row\)\} className="text-\[11px\] bg-\[#00B6E2\] text-white px-2 py-1 rounded-\[4px\] hover:bg-\[#0092b5\]">Issue<\/button>\s*\)\}/,
  `{row.notes.includes("[Slitting]") && row.status === "Pending" && (
                          <>
                            <button onClick={() => openIssueModal(row)} className="text-[11px] bg-[#00B6E2] text-white px-2 py-1 rounded-[4px] hover:bg-[#0092b5]">Issue</button>
                            <button onClick={() => rejectMaterialRequest(row.originalId)} className="text-[11px] bg-[#FB3748] text-white px-2 py-1 rounded-[4px] hover:bg-[#d92d20]">Reject</button>
                          </>
                        )}`
);

// Implement Change 4: Filter out Metallisation's own requests
content = content.replace(
  /relevantRows = rows\.filter\(\(r: any\) => r\.notes\?\.includes\("\[Metallisation\]"\) \|\| r\.notes\?\.includes\("\[Slitting\]"\)\);/,
  `relevantRows = rows.filter((r: any) => r.notes?.includes("[Slitting]"));`
);

fs.writeFileSync(file, content, 'utf8');
console.log("Updated Metallisation material-requests page");
