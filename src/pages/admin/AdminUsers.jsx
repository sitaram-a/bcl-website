
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Users,
  ShieldCheck,
  RefreshCw,
  AlertCircle,
  Search,
  Mail,
  CalendarDays,
  Clock3,
  ShieldPlus,
  ShieldMinus,
} from "lucide-react";
import { supabase } from "../../lib/supabase";
import "./AdminUsers.css";

function formatDate(value) {
  if (!value) return "Never";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  
  
const testRoleFunction = async () => {
  setErrorMessage("");
  setSuccessMessage("");

  try {
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) throw sessionError;
    if (!session) throw new Error("Please sign in first.");

    const { data, error } = await supabase.functions.invoke(
      "manage-user-role",
      {
        body: {
          user_id: "00000000-0000-4000-8000-000000000000",
          action: "grant",
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      }
    );

    const status = error?.context?.status;

    if (status === 404) {
      setSuccessMessage(
        "Authorization test passed: the function rejected the nonexistent user (HTTP 404). No role was changed."
      );
      return;
    }

    if (error) {
      throw new Error(
        `Test returned HTTP ${status ?? "unknown"}: ${error.message}`
      );
    }

    if (data?.success === false && /not found/i.test(data.error || "")) {
      setSuccessMessage(
        "Authorization test passed: the function rejected the nonexistent user. No role was changed."
      );
      return;
    }

    throw new Error(
      "Unexpected response. Do not attempt any role changes; inspect the function logs."
    );
  } catch (error) {
    setErrorMessage(error.message || "Authorization test failed.");
  }
};



  const loadUsers = useCallback(async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) throw sessionError;

      if (!session) {
        throw new Error("Please sign in with your BCL admin account.");
      }

      setCurrentUserId(session.user.id);

      const { data, error } = await supabase.functions.invoke("list-users", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;

      if (!data?.success || !Array.isArray(data.users)) {
        throw new Error(data?.error || "Unable to load registered users.");
      }

      setUsers(data.users);

      setSelectedUser((previous) => {
        if (!previous) return null;
        return data.users.find((user) => user.id === previous.id) ?? null;
      });
    } catch (error) {
      setErrorMessage(error.message || "Unable to load registered users.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleRoleChange = async (user, action) => {
    const granting = action === "grant";
    const actionLabel = granting ? "grant administrator access to" : "revoke administrator access from";

    if (!window.confirm(`Are you sure you want to ${actionLabel} ${user.email || user.id}?`)) {
      return;
    }

    setActionLoadingId(user.id);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) throw sessionError;
      if (!session) throw new Error("Your session has expired. Please sign in again.");

      const { data, error } = await supabase.functions.invoke(
        "manage-user-role",
        {
          body: {
            user_id: user.id,
            action,
          },
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );

      if (error) {
        let message = error.message || "Role update failed.";

        try {
          const response = error.context;
          if (response && typeof response.json === "function") {
            const details = await response.json();
            if (details?.error) message = details.error;
          }
        } catch {
          // Keep the original error message if no response body is available.
        }

        throw new Error(message);
      }

      if (!data?.success) {
        throw new Error(data?.error || "Role update failed.");
      }

      setSuccessMessage(data.message || "Administrator role updated.");
      await loadUsers();
    } catch (error) {
      setErrorMessage(error.message || "Unable to update administrator role.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const filteredUsers = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) return users;

    return users.filter((user) =>
      [user.email, user.role, user.id].some((value) =>
        String(value ?? "").toLowerCase().includes(query)
      )
    );
  }, [users, searchTerm]);

  const adminCount = users.filter((user) => user.role === "Admin").length;

  return (
    <main className="admin-users-page">
      <header className="admin-users-header">
        <div>
          <Link to="/admin" className="admin-users-back">
            <ArrowLeft size={17} />
            Back to Dashboard
          </Link>

          <p className="admin-users-eyebrow">BCL ADMINISTRATION</p>
          <h1>User Management</h1>
          <p>View registered accounts and administrator access.</p>
        </div>

        <button
          className="admin-users-refresh"
          type="button"
          onClick={loadUsers}
          disabled={loading || Boolean(actionLoadingId)}
        >
          <RefreshCw
            size={16}
            className={loading ? "admin-users-spinning" : ""}
          />
          {loading ? "Loading…" : "Refresh"}
        </button>

                
        <button
        type="button"
        className="admin-users-refresh"
        onClick={testRoleFunction}
        disabled={loading || Boolean(actionLoadingId)}
        >
        Test role endpoint
        </button>

      </header>

      {errorMessage && (
        <div className="admin-users-error" role="alert">
          <AlertCircle size={20} />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="admin-users-success" role="status">
          <ShieldCheck size={18} />
          <span>{successMessage}</span>
        </div>
      )}

      <section className="admin-users-stats">
        <article className="admin-users-stat">
          <div className="admin-users-stat-icon">
            <Users size={24} />
          </div>
          <div>
            <p>Total registered users</p>
            <h2>{loading ? "…" : users.length}</h2>
          </div>
        </article>

        <article className="admin-users-stat">
          <div className="admin-users-stat-icon admin-users-admin-icon">
            <ShieldCheck size={24} />
          </div>
          <div>
            <p>Administrator accounts</p>
            <h2>{loading ? "…" : adminCount}</h2>
          </div>
        </article>
      </section>

      <section className="admin-users-panel">
        <div className="admin-users-table-heading">
          <div>
            <h2>Registered accounts</h2>
            <p>Account information retrieved securely from Supabase.</p>
          </div>

          <label className="admin-users-search">
            <Search size={18} />
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search email, role or ID"
              aria-label="Search registered users"
            />
          </label>
        </div>

        {loading ? (
          <div className="admin-users-empty">Loading registered users…</div>
        ) : errorMessage && users.length === 0 ? (
          <div className="admin-users-empty">
            User information could not be loaded.
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="admin-users-empty">
            {users.length === 0
              ? "No registered accounts found."
              : "No users match your search."}
          </div>
        ) : (
          <div className="admin-users-table-wrap">
            <table className="admin-users-table">
              <thead>
                <tr>
                  <th>Account</th>
                  <th>Registered</th>
                  <th>Last sign-in</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => {
                  const isAdmin = user.role === "Admin";
                  const isSelf = user.id === currentUserId;
                  const isBusy = actionLoadingId === user.id;

                  return (
                    <tr key={user.id}>
                      <td>
                        <div className="admin-users-account">
                          <span className="admin-users-avatar">
                            {(user.email?.[0] || "U").toUpperCase()}
                          </span>
                          <div className="admin-users-email">
                            <span>{user.email || "No email address"}</span>
                            <small title={user.id}>
                              ID: {user.id.slice(0, 8)}…
                            </small>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span className="admin-users-date">
                          <CalendarDays size={15} />
                          {formatDate(user.created_at)}
                        </span>
                      </td>

                      <td>
                        <span className="admin-users-date">
                          <Clock3 size={15} />
                          {formatDate(user.last_sign_in_at)}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`admin-users-role ${
                            isAdmin
                              ? "admin-users-role-admin"
                              : "admin-users-role-user"
                          }`}
                        >
                          {isAdmin ? (
                            <ShieldCheck size={14} />
                          ) : (
                            <Mail size={14} />
                          )}
                          {user.role}
                        </span>
                      </td>

                      <td>
                        <div className="admin-users-actions">
                          <button
                            type="button"
                            className="admin-users-view-button"
                            onClick={() => setSelectedUser(user)}
                          >
                            View details
                          </button>

                          {isAdmin ? (
                            <button
                              type="button"
                              className="admin-users-role-action admin-users-revoke-button"
                              disabled={isSelf || Boolean(actionLoadingId)}
                              title={
                                isSelf
                                  ? "You cannot revoke your own admin role."
                                  : "Revoke administrator access"
                              }
                              onClick={() => handleRoleChange(user, "revoke")}
                            >
                              <ShieldMinus size={15} />
                              {isBusy ? "Updating…" : "Revoke Admin"}
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="admin-users-role-action admin-users-grant-button"
                              disabled={Boolean(actionLoadingId)}
                              onClick={() => handleRoleChange(user, "grant")}
                            >
                              <ShieldPlus size={15} />
                              {isBusy ? "Updating…" : "Grant Admin"}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <footer className="admin-users-table-footer">
          Showing {filteredUsers.length} of {users.length} accounts
        </footer>
      </section>

      {selectedUser && (
        <div
          className="admin-users-modal-backdrop"
          onClick={() => setSelectedUser(null)}
        >
          <section
            className="admin-users-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-users-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="admin-users-modal-header">
              <h2 id="admin-users-modal-title">User details</h2>
              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                aria-label="Close user details"
              >
                ×
              </button>
            </div>

            <dl className="admin-users-details">
              <dt>Email address</dt>
              <dd>{selectedUser.email || "Not available"}</dd>

              <dt>User ID</dt>
              <dd className="admin-users-break">{selectedUser.id}</dd>

              <dt>Role</dt>
              <dd>{selectedUser.role}</dd>

              <dt>Registered</dt>
              <dd>{formatDate(selectedUser.created_at)}</dd>

              <dt>Last sign-in</dt>
              <dd>{formatDate(selectedUser.last_sign_in_at)}</dd>

              <dt>Email verification</dt>
              <dd>
                {selectedUser.email_confirmed_at
                  ? "Verified"
                  : "Not verified"}
              </dd>
            </dl>

            <button
              type="button"
              className="admin-users-refresh"
              onClick={() => setSelectedUser(null)}
            >
              Close
            </button>
          </section>
        </div>
      )}
    </main>
  );
}
