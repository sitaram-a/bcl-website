
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return jsonResponse({ success: false, error: "Method not allowed." }, 405);
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
    const serviceKey = Deno.env.get("BCL_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !anonKey || !serviceKey) {
      return jsonResponse({
        success: false,
        error: "Server configuration is incomplete.",
      }, 500);
    }

    const authorization = req.headers.get("Authorization");
    const token = authorization?.match(/^Bearer\s+(.+)$/i)?.[1];

    if (!token) {
      return jsonResponse({
        success: false,
        error: "Authentication required.",
      }, 401);
    }

    const userClient = createClient(supabaseUrl, anonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { data: authData, error: authError } =
      await userClient.auth.getUser(token);

    if (authError || !authData.user) {
      return jsonResponse({
        success: false,
        error: "Invalid or expired session.",
      }, 401);
    }

    const callerId = authData.user.id;

    const adminClient = createClient(supabaseUrl, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { data: callerAdmin, error: callerError } = await adminClient
      .from("admin_users")
      .select("user_id")
      .eq("user_id", callerId)
      .maybeSingle();

    if (callerError) {
      console.error("Caller admin check failed:", callerError.message);
      return jsonResponse({
        success: false,
        error: "Unable to verify administrator permissions.",
      }, 500);
    }

    if (!callerAdmin) {
      return jsonResponse({
        success: false,
        error: "Administrator access required.",
      }, 403);
    }

    const body = await req.json().catch(() => null);
    const targetId = body?.user_id;
    const action = body?.action;

    const uuidPattern =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    if (
      typeof targetId !== "string" ||
      !uuidPattern.test(targetId) ||
      !["grant", "revoke"].includes(action)
    ) {
      return jsonResponse({
        success: false,
        error: "Provide a valid user_id and action: grant or revoke.",
      }, 400);
    }

    if (targetId === callerId && action === "revoke") {
      return jsonResponse({
        success: false,
        error: "You cannot revoke your own administrator role.",
      }, 400);
    }

    const { data: targetUser, error: targetError } =
      await adminClient.auth.admin.getUserById(targetId);

    if (targetError || !targetUser.user) {
      return jsonResponse({
        success: false,
        error: "Target user was not found.",
      }, 404);
    }

    if (action === "grant") {
      const { error } = await adminClient
        .from("admin_users")
        .upsert({ user_id: targetId }, { onConflict: "user_id" });

      if (error) {
        console.error("Admin grant failed:", error.message);
        return jsonResponse({
          success: false,
          error: "Could not grant administrator role.",
        }, 500);
      }

      return jsonResponse({
        success: true,
        message: "Administrator role granted.",
      });
    }

    const { count, error: countError } = await adminClient
      .from("admin_users")
      .select("user_id", { count: "exact", head: true });

    if (countError) {
      console.error("Admin count failed:", countError.message);
      return jsonResponse({
        success: false,
        error: "Could not verify the administrator count.",
      }, 500);
    }

    if ((count ?? 0) <= 1) {
      return jsonResponse({
        success: false,
        error: "The last administrator cannot be removed.",
      }, 409);
    }

    const { error: deleteError } = await adminClient
      .from("admin_users")
      .delete()
      .eq("user_id", targetId);

    if (deleteError) {
      console.error("Admin revoke failed:", deleteError.message);
      return jsonResponse({
        success: false,
        error: "Could not revoke administrator role.",
      }, 500);
    }

    return jsonResponse({
      success: true,
      message: "Administrator role revoked.",
    });
  } catch (error) {
    console.error("manage-user-role error:", error);
    return jsonResponse({
      success: false,
      error: "An unexpected server error occurred.",
    }, 500);
  }
});
