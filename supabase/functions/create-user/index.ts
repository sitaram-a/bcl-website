
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
        { success: false, error: "Server configuration is incomplete." },
        500,
      );
    }

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
        { success: false, error: "Invalid or expired session." },
        401,
      );
    }

    const adminClient = createClient(supabaseUrl, serviceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    // Only existing administrators may use this function.
    const { data: callerAdmin, error: callerError } = await adminClient
      .from("admin_users")
      .select("user_id")
      .eq("user_id", authData.user.id)
      .maybeSingle();

    if (callerError) {
      console.error("Admin verification failed:", callerError.message);
      return jsonResponse(
        { success: false, error: "Unable to verify administrator permissions." },
        500,
      );
    }

    if (!callerAdmin) {
      return jsonResponse(
        { success: false, error: "Administrator access required." },
        403,
      );
    }

    const body = await req.json().catch(() => null);
    const action = body?.action;

    // Confirm an existing account by its UUID.
    if (action === "confirm") {
      const targetId = body?.user_id;

      const uuidPattern =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

      if (typeof targetId !== "string" || !uuidPattern.test(targetId)) {
        return jsonResponse(
          { success: false, error: "Provide a valid user_id." },
          400,
        );
      }

      // Protect the original administrator account from accidental changes.
      if (targetId === authData.user.id) {
        return jsonResponse(
          { success: false, error: "This action cannot be used on your own account." },
          400,
        );
      }

      const { data: updated, error: updateError } =
        await adminClient.auth.admin.updateUserById(targetId, {
          email_confirm: true,
        });

      if (updateError || !updated.user) {
        console.error("Email confirmation failed:", updateError?.message);
        return jsonResponse(
          { success: false, error: "Could not confirm this account. Check the user ID." },
          400,
        );
      }

      return jsonResponse({
        success: true,
        message: "The account email has been confirmed.",
        user: {
          id: updated.user.id,
          email: updated.user.email,
          confirmed_at: updated.user.email_confirmed_at,
        },
      });
    }

    // Default action: create a normal user account.
    if (action !== "create") {
      return jsonResponse(
        { success: false, error: "Action must be create or confirm." },
        400,
      );
    }

    const email =
      typeof body?.email === "string" ? body.email.trim() : "";
    const password =
      typeof body?.password === "string" ? body.password : "";

    if (
      !email ||
      email.length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      return jsonResponse(
        { success: false, error: "Enter a valid email address." },
        400,
      );
    }

    if (password.length < 12 || password.length > 128) {
      return jsonResponse(
        { success: false, error: "Password must be between 12 and 128 characters." },
        400,
      );
    }

    const { data: created, error: createError } =
      await adminClient.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });

    if (createError || !created.user) {
      console.error("User creation failed:", createError?.message);
      return jsonResponse(
        {
          success: false,
          error: "Could not create the account. Check the email and whether an account already exists.",
        },
        400,
      );
    }

    return jsonResponse(
      {
        success: true,
        message: "User account created and email confirmed.",
        user: {
          id: created.user.id,
          email: created.user.email,
          created_at: created.user.created_at,
          confirmed_at: created.user.email_confirmed_at,
          role: "User",
        },
      },
      201,
    );
  } catch (error) {
    console.error("create-user error:", error);
    return jsonResponse(
      { success: false, error: "An unexpected server error occurred." },
      500,
    );
  }
});
