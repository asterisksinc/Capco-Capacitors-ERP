import { supabaseRest } from "./src/services/supabaseClient";

async function test() {
  const returns = await supabaseRest.list("material_returns", { limit: 1 });
  console.log("returns:", returns);
  if (returns.length > 0) {
    const invId = returns[0].inventory_id || returns[0].material_id;
    const inv = await supabaseRest.getById("inventory", invId);
    console.log("inventory:", inv);
  }
}

test().catch(console.error);
