
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import {
  LayoutDashboard,
  Users,
  Trophy,
  CalendarDays,
  CalendarClock,
  ClipboardList,
  ArrowUpRight,
  ShieldCheck,
  LogOut,
} from "lucide-react";
import "./AdminDashboard.css";

const adminSections = [
  {
    title: "Team Management",
    description: "View and manage participating teams.",
    icon: Users,
    path: "/registration",
    label: "Manage Teams",
  },
  {
    title: "Football Matches",
    description: "View football fixtures, results, and standings.",
    icon: Trophy,
    path: "/football",
    label: "View Football",
  },
  {
    title: "Cricket Matches",
    description: "View cricket fixtures, results, and standings.",
    icon: CalendarDays,
    path: "/cricket",
    label: "View Cricket",
  },{
  title: "Cricket Fixture Management",
  description:
    "Add fixtures, edit match schedules, reschedule games, and manage match status.",
  icon: CalendarClock,
  path: "/admin/cricket-fixtures",
  label: "Manage Fixtures",
},
  {
    title: "Registrations",
    description: "Open the existing registration page.",
    icon: ClipboardList,
    path: "/registration",
    label: "View Registration",
  },
];


function AdminDashboard() {

const navigate = useNavigate();

const handleSignOut = async () => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    alert("Unable to sign out. Please try again.");
    return;
  }

  navigate("/admin/login", { replace: true });
};

  return (
    <div className="admin-dashboard">
      <aside className="admin-sidebar">
        <Link to="/" className="admin-brand">
          <Trophy size={28} />
          <span>
            BCL
            <small>ADMIN PANEL</small>
          </span>
        </Link>

        <nav className="admin-nav">
          <Link to="/admin" className="admin-nav-link active">
            <LayoutDashboard size={19} />
            Dashboard
          </Link>

          <Link to="/registration" className="admin-nav-link">
            <Users size={19} />
            Registrations
          </Link>

          <Link to="/football" className="admin-nav-link">
            <Trophy size={19} />
            Football
          </Link>

          <Link to="/cricket" className="admin-nav-link">
            <CalendarDays size={19} />
            Cricket
          </Link>

          <Link to="/" className="admin-nav-link">
            <ArrowUpRight size={19} />
            View Website
          </Link>
        </nav>

        <div className="admin-sidebar-note">
          <ShieldCheck size={18} />
          <span>Baharagora Champions League</span>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <div>
            <p className="admin-eyebrow">TOURNAMENT CONTROL</p>
            <h1>Admin Dashboard</h1>
            <p className="admin-subtitle">
              Manage your BCL tournament from one place.
            </p>
          </div>

          

          <Link to="/" className="admin-view-site">
            View Website <ArrowUpRight size={16} />
          </Link>

          <button
  type="button"
  className="admin-signout-button"
  onClick={handleSignOut}
>
  <LogOut size={16} />
  Sign Out
</button>
        </header>

        <section className="admin-welcome">
          <div>
            <span className="admin-welcome-tag">BCL MANAGEMENT</span>
            <h2>Welcome to the control room</h2>
            <p>
              Manage teams, review registrations, and access cricket
              and football sections.
            </p>
          </div>
          <Trophy size={70} />
        </section>

        <section className="admin-section">
          <div className="admin-section-heading">
            <div>
              <h2>Management Sections</h2>
              <p>Choose an area to manage.</p>
            </div>
          </div>

          <div className="admin-card-grid">
            {adminSections.map((section) => {
              const Icon = section.icon;

              return (
                <article className="admin-card" key={section.title}>
                  <div className="admin-card-icon">
                    <Icon size={24} />
                  </div>

                  <h3>{section.title}</h3>
                  <p>{section.description}</p>

                  <Link to={section.path} className="admin-card-link">
                    {section.label}
                    <ArrowUpRight size={16} />
                  </Link>
                </article>
              );
            })}
          </div>
        </section>

        <p className="admin-disclaimer">
          Dashboard preview · Live statistics and management actions
          will be connected in the next steps.
        </p>
      </main>
    </div>
  );
}

export default AdminDashboard;