import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { supabase } from "../../lib/supabase";

// Accept an optional prop 'mainAdminOnly' to lock specific routes to the Main Admin only
function AdminRoute({ mainAdminOnly = false }) {
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    let active = true;

    const checkAdmin = async () => {
      try {
        const { data: sessionData, error: sessionError } =
          await supabase.auth.getSession();

        if (sessionError) throw sessionError;

        if (!sessionData.session) {
          if (active) setStatus("unauthorized");
          return;
        }

        const user = sessionData.session.user;

        // 1. Check general BCL admin permission via RPC
        const { data: isAdmin, error: adminError } =
          await supabase.rpc("is_bcl_admin");

        if (adminError) throw adminError;

        if (!isAdmin) {
          if (active) setStatus("unauthorized");
          return;
        }

        // 2. If the route requires Main Admin access, check the email
        if (mainAdminOnly) {
          // Replace with your Main Admin email address
          const mainAdminEmail = "sitaram.hembrom123@gmail.com";
          const isMain = user.email === mainAdminEmail;

          if (active) {
            setStatus(isMain ? "authorized" : "forbidden"); // 'forbidden' can redirect to dashboard instead of login
          }
        } else {
          if (active) setStatus("authorized");
        }
      } catch {
        if (active) setStatus("unauthorized");
      }
    };

    checkAdmin();

    return () => {
      active = false;
    };
  }, [mainAdminOnly]);

  if (status === "checking") {
    return (
      <div style={{ padding: "48px 20px", textAlign: "center" }}>
        Verifying administrator access...
      </div>
    );
  }

  // If completely unauthenticated or not an admin at all
  if (status === "unauthorized") {
    return <Navigate to="/admin/login" replace />;
  }

  // If logged in as staff, but trying to access a Main Admin-only route -> send them back to the dashboard
  if (status === "forbidden") {
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
}

export default AdminRoute;