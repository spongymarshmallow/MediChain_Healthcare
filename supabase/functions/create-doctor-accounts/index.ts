import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  // Get all registered doctors
  const { data: doctors, error: fetchError } = await supabase
    .from("registered_doctors")
    .select("id, name");

  if (fetchError) {
    return new Response(JSON.stringify({ error: fetchError.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const password = "doctor123";
  const results: { id: string; name: string; status: string }[] = [];

  for (const doctor of doctors || []) {
    const email = `doctor-${doctor.id.replace("doc-", "")}@medichain.app`;

    // Try to create the user
    const { data: userData, error: createError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        doctor_id: doctor.id,
        name: doctor.name,
        role: "doctor",
      },
    });

    if (createError) {
      if (createError.message.includes("already registered")) {
        results.push({ id: doctor.id, name: doctor.name, status: "already exists" });
      } else {
        results.push({ id: doctor.id, name: doctor.name, status: `error: ${createError.message}` });
      }
    } else {
      results.push({ id: doctor.id, name: doctor.name, status: "created" });
    }
  }

  return new Response(JSON.stringify({ results, password }), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
