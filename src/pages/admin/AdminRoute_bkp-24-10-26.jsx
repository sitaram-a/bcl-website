
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { supabase } from "../../lib/supabase";

function AdminRoute() {
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

        const { data: isAdmin, error: adminError } =
          await supabase.rpc("is_bcl_admin");

        if (adminError) throw adminError;

        if (active) {
          setStatus(isAdmin ? "authorized" : "unauthorized");
        }
      } catch {
        if (active) setStatus("unauthorized");
      }
    };

    checkAdmin();

    return () => {
      active = false;
    };
  }, []);

  if (status === "checking") {
    return (
      <div style={{ padding: "48px 20px", textAlign: "center" }}>
        Verifying administrator access...
      </div>
    );
  }

  if (status === "unauthorized") {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}

export default AdminRoute;