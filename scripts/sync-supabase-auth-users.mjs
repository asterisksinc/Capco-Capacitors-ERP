import "dotenv/config";

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const defaultPassword = process.env.CAPCO_SEEDED_USER_PASSWORD || "Capco@123";

if (!supabaseUrl || !serviceRoleKey) {
  console.error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.");
  process.exit(1);
}

const baseUrl = supabaseUrl.replace(/\/$/, "");

function adminHeaders(extra = {}) {
  return {
    apikey: serviceRoleKey,
    Authorization: `Bearer ${serviceRoleKey}`,
    Accept: "application/json",
    ...extra,
  };
}

async function request(path, init = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: adminHeaders(init.headers),
  });
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const message = data?.msg || data?.message || response.statusText;
    throw new Error(`${init.method || "GET"} ${path} failed: ${message}`);
  }

  return data;
}

async function getProfiles() {
  const select = "id,full_name,email,phone,status,auth_user_id,roles(code,name)";
  const path = `/rest/v1/profiles?select=${encodeURIComponent(select)}&status=eq.active&email=not.is.null&order=email.asc`;
  return request(path);
}

async function getAuthUsers() {
  const users = [];
  let page = 1;

  while (true) {
    const data = await request(`/auth/v1/admin/users?page=${page}&per_page=1000`);
    const batch = Array.isArray(data?.users) ? data.users : [];
    users.push(...batch);
    if (batch.length < 1000) break;
    page += 1;
  }

  return users;
}

async function createAuthUser(profile) {
  return request("/auth/v1/admin/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: profile.email,
      password: defaultPassword,
      email_confirm: true,
      phone: profile.phone || undefined,
      phone_confirm: Boolean(profile.phone),
      user_metadata: {
        profile_id: profile.id,
        full_name: profile.full_name,
        role: profile.roles?.code,
      },
    }),
  });
}

async function updateAuthUser(userId, profile) {
  return request(`/auth/v1/admin/users/${encodeURIComponent(userId)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: profile.email,
      password: defaultPassword,
      email_confirm: true,
      phone: profile.phone || undefined,
      phone_confirm: Boolean(profile.phone),
      user_metadata: {
        profile_id: profile.id,
        full_name: profile.full_name,
        role: profile.roles?.code,
      },
    }),
  });
}

async function linkProfile(profileId, authUserId) {
  await request(`/rest/v1/profiles?id=eq.${encodeURIComponent(profileId)}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({ auth_user_id: authUserId }),
  });
}

const profiles = await getProfiles();
const authUsers = await getAuthUsers();
const usersByEmail = new Map(authUsers.map((user) => [String(user.email || "").toLowerCase(), user]));

let created = 0;
let updated = 0;
let linked = 0;

for (const profile of profiles) {
  const email = String(profile.email || "").toLowerCase();
  const existing = usersByEmail.get(email);
  const authUser = existing ? await updateAuthUser(existing.id, profile) : await createAuthUser(profile);

  if (existing) {
    updated += 1;
  } else {
    created += 1;
    usersByEmail.set(email, authUser);
  }

  if (profile.auth_user_id !== authUser.id) {
    await linkProfile(profile.id, authUser.id);
    linked += 1;
  }
}

console.log(`Synced ${profiles.length} profile(s): ${created} created, ${updated} updated, ${linked} linked.`);
console.log(`Seeded password: ${defaultPassword}`);
