
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed." }, 405);
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
    const serviceKey = Deno.env.get("BCL_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !anonKey || !serviceKey) {
      console.error("Required server environment configuration is missing.");
      return jsonResponse(
        { error: "Server configuration is incomplete." },
        500,
      );
    }

    const authHeader = req.headers.get("Authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return jsonResponse({ error: "Authentication required." }, 401);
    }

    const token = authHeader.slice("Bearer ".length);

    // Verify the caller's access token with Supabase Auth.
    const userClient = createClient(supabaseUrl, anonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
      global: {
        headers: { Authorization: `Bearer ${token}` },
      },
    });

    const {
      data: { user },
      error: authError,
    } = await userClient.auth.getUser(token);

    if (authError || !user) {
      return jsonResponse({ error: "Invalid or expired session." }, 401);
    }

    // This privileged client is used only inside this server-side function.
    const adminClient = createClient(supabaseUrl, serviceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    // Confirm the caller is in the BCL administrator allowlist.
    const { data: adminRecord, error: adminCheckError } = await adminClient
      .from("admin_users")
      .select("user_id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (adminCheckError) {
      console.error("Administrator verification failed.");
      return jsonResponse({ error: "Unable to verify administrator access." }, 500);
    }

    if (!adminRecord) {
      return jsonResponse({ error: "Administrator access required." }, 403);
    }

    // Retrieve Auth accounts only after administrator verification.
    const users = [];
    const perPage = 100;
    let page = 1;

    while (true) {
      const { data, error } = await adminClient.auth.admin.listUsers({
        page,
        perPage,
      });

      if (error) {
        console.error("Auth user listing failed.");
        return jsonResponse({ error: "Unable to retrieve users." }, 500);
      }

      users.push(...data.users);

      if (data.users.length < perPage) break;
      page += 1;
    }

    const { data: adminRecords, error: adminsError } = await adminClient
      .from("admin_users")
      .select("user_id");

    if (adminsError) {
      console.error("Administrator role lookup failed.");
      return jsonResponse({ error: "Unable to retrieve user roles." }, 500);
    }

    const adminIds = new Set(
      (adminRecords ?? []).map((record) => record.user_id),
    );

    // Return only fields needed for the dashboard. Never return passwords,
    // password hashes, tokens, or raw Auth user metadata.
   
const safeUsers = users.map((account) => ({
  id: account.id,
  email: account.email ?? "",
  created_at: account.created_at,
  last_sign_in_at: account.last_sign_in_at ?? null,
  email_confirmed_at: account.email_confirmed_at ?? null,
  role: adminIds.has(account.id) ? "Admin" : "User",
}));


    return jsonResponse({
      success: true,
      total: safeUsers.length,
      users: safeUsers,
    });
  } catch (error) {
    console.error(
      "Unexpected list-users error:",
      error instanceof Error ? error.message : "Unknown error",
    );

    return jsonResponse({ error: "An unexpected server error occurred." }, 500);
  }
});
