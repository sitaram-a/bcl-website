
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
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return jsonResponse(
      { success: false, error: "Method not allowed." },
      405,
    );
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
    const serviceKey = Deno.env.get("BCL_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !anonKey || !serviceKey) {
      return jsonResponse(
        {
          success: false,
          error: "Server configuration is incomplete.",
        },
        500,
      );
    }

    // 1. Validate the caller's access token.
    const authorization = req.headers.get("Authorization");
    const token = authorization?.match(/^Bearer\s+(.+)$/i)?.[1];

    if (!token) {
      return jsonResponse(
        { success: false, error: "Authentication required." },
        401,
      );
    }

    const userClient = createClient(supabaseUrl, anonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    const { data: authData, error: authError } =
      await userClient.auth.getUser(token);

    if (authError || !authData.user) {
      return jsonResponse(
        {
          success: false,
          error: "Invalid or expired session.",
        },
        401,
      );
    }

    const callerId = authData.user.id;

    // 2. Create a server-side client.
    // The service-role key must never be exposed to the frontend.
    const adminClient = createClient(supabaseUrl, serviceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    // 3. Verify that the caller is an administrator.
    const { data: callerAdmin, error: callerError } = await adminClient
      .from("admin_users")
      .select("user_id")
      .eq("user_id", callerId)
      .maybeSingle();

    if (callerError) {
      console.error(
        "Caller admin check failed:",
        callerError.message,
      );

      return jsonResponse(
        {
          success: false,
          error: "Unable to verify administrator permissions.",
        },
        500,
      );
    }

    if (!callerAdmin) {
      return jsonResponse(
        {
          success: false,
          error: "Administrator access required.",
        },
        403,
      );
    }

    // 4. Validate the request body.
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
      return jsonResponse(
        {
          success: false,
          error: "Provide a valid user_id and action: grant or revoke.",
        },
        400,
      );
    }

    // 5. Prevent an administrator from revoking their own role.
    if (targetId === callerId && action === "revoke") {
      return jsonResponse(
        {
          success: false,
          error: "You cannot revoke your own administrator role.",
        },
        400,
      );
    }

    // 6. Confirm that the target account exists in Supabase Auth.
    const { data: targetUser, error: targetError } =
      await adminClient.auth.admin.getUserById(targetId);

    if (targetError || !targetUser.user) {
      return jsonResponse(
        {
          success: false,
          error: "Target user was not found.",
        },
        404,
      );
    }

    // 7. Perform the role change through the atomic database function.
    // Both grant and revoke use the same protected database operation.
    const { data: result, error: roleError } = await adminClient.rpc(
      "manage_admin_role",
      {
        target_user_id: targetId,
        operation: action,
      },
    );

    if (roleError) {
      console.error(
        "Admin role update failed:",
        roleError.message,
      );

      return jsonResponse(
        {
          success: false,
          error: "Could not update the administrator role.",
        },
        500,
      );
    }

    if (!result?.success) {
      const message =
        result?.error || "Role update was rejected.";

      let status = 400;

      if (
        message === "The last administrator cannot be removed."
      ) {
        status = 409;
      } else if (
        message === "Administrator record not found."
      ) {
        status = 404;
      }

      return jsonResponse(
        {
          success: false,
          error: message,
        },
        status,
      );
    }

    return jsonResponse(result);
  } catch (error) {
    console.error("manage-user-role error:", error);

    return jsonResponse(
      {
        success: false,
        error: "An unexpected server error occurred.",
      },
      500,
    );
  }
});
