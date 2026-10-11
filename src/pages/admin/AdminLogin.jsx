
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LockKeyhole, Trophy } from "lucide-react";
import { supabase } from "../../lib/supabase";
import "./AdminLogin.css";

function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data, error: loginError } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

      if (loginError) throw loginError;

      const { data: isAdmin, error: adminError } =
        await supabase.rpc("is_bcl_admin");

      if (adminError) throw adminError;

      if (!isAdmin) {
        await supabase.auth.signOut();
        setError("Access denied. This account is not a BCL administrator.");
        return;
      }

      navigate("/admin", { replace: true });
    } catch (err) {
      setError(err.message || "Unable to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <form className="admin-login-card" onSubmit={handleLogin}>
        <Link to="/" className="admin-login-brand">
          <Trophy size={32} />
          <span>BCL <small>ADMIN PORTAL</small></span>
        </Link>

        <div className="admin-login-icon">
          <LockKeyhole size={26} />
        </div>

        <h1>Admin Login</h1>
        <p>Sign in with your authorized administrator account.</p>

        {error && (
          <div className="admin-login-error" role="alert">
            {error}
          </div>
        )}

        <label htmlFor="admin-email">Email address</label>
        <input
          id="admin-email"
          type="email"
          autoComplete="username"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Enter admin email"
          required
        />

        <label htmlFor="admin-password">Password</label>
        <input
          id="admin-password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Enter password"
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </button>

        <Link to="/" className="admin-login-back">
          Back to BCL Website
        </Link>
      </form>
    </div>
  );
}

export default AdminLogin;