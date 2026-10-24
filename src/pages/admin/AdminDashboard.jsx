import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import {
  LayoutDashboard,
  Users,
  UserCog,
  Trophy,
  CalendarDays,
  CalendarClock,
  ClipboardList,
  ArrowUpRight,
  ShieldCheck,
  LogOut,
  Radio,
  Image,
  Images,
  FileText,
} from "lucide-react";
import "./AdminDashboard.css";

const allAdminSections = [
  {
    title: "User Management",
    description: "View registered users, review account details, and manage user access securely.",
    icon: UserCog,
    path: "/admin/users",
    label: "Manage Users",
    mainAdminOnly: true,
  },
  {
    title: "Team Management",
    description: "View and manage participating teams.",
    icon: Users,
    path: "/registration",
    label: "Manage Teams",
    mainAdminOnly: false,
  },
  {
    title: "Cricket Fixture Management",
    description: "Add fixtures, edit match schedules, reschedule games, and manage match status.",
    icon: CalendarClock,
    path: "/admin/cricket-fixtures",
    label: "Manage Fixtures",
    mainAdminOnly: false,
  },
  {
    title: "Live Match Control",
    description: "Update live scores, runs, wickets, overs, and match status in real time.",
    icon: Radio,
    path: "/admin/live-scores",
    label: "Manage Live Scores",
    mainAdminOnly: false,
  },
  {
    title: "Cricket Team Management",
    description: "Manage cricket teams, logos, captains, and active status.",
    icon: Users,
    path: "/admin/cricket-teams",
    label: "Manage Cricket Teams",
    mainAdminOnly: false,
  },
  {
    title: "Cricket Player Management",
    description: "Manage player profiles, team assignments, jersey numbers, and roles.",
    icon: Users,
    path: "/admin/cricket-players",
    label: "Manage Cricket Players",
    mainAdminOnly: false,
  },
  {
    title: "Media Management",
    description: "Upload photos and videos, manage categories, and control what appears on the website.",
    icon: Image,
    path: "/admin/media",
    label: "Manage Media",
    mainAdminOnly: false,
  },
  {
    title: "Poster Management",
    description: "Add, edit, reorder, publish, hide, and delete homepage posters.",
    icon: Images,
    path: "/admin/posters",
    label: "Manage Posters",
    mainAdminOnly: false,
  },
  {
    title: "Website Pages CMS",
    description: "Create, edit, publish, and manage About, Contact, Rules, and FAQ pages.",
    icon: FileText,
    path: "/admin/website-pages",
    label: "Manage Website Pages",
    mainAdminOnly: true,
  },
  {
    title: "Homepage Content CMS",
    description: "Manage hero slides, announcements and featured content",
    icon: ClipboardList,
    path: "/admin/homepage-content",
    label: "Manage homepage content",
    mainAdminOnly: true,
  },
  {
    title: "Registrations",
    description: "Open the existing registration page.",
    icon: ClipboardList,
    path: "/registration",
    label: "View Registration",
    mainAdminOnly: false,
  },
];

function AdminDashboard() {
  const navigate = useNavigate();
  const [isMainAdmin, setIsMainAdmin] = useState(false);
  const [loadingRole, setLoadingRole] = useState(true);

  useEffect(() => {
    async function checkRole() {
      try {
        // You can check via a specific rpc or metadata. 
        // Assuming is_bcl_admin returns true for admins, let's also check if they are the designated main admin email or have a specific role flag.
        const { data: { user } } = await supabase.auth.getUser();
        
        // Example check: Main admin can be identified by a specific email or database flag. 
        // Replace 'sitaram.hembrom123@gmail.com' with your actual Main Admin email or check a user metadata role.
        const mainAdminEmail = "sitaram.hembrom123@gmail.com"; 
        if (user && user.email === mainAdminEmail) {
          setIsMainAdmin(true);
        } else {
          // Alternatively, check via an RPC function if you have role separation in your DB:
          // const { data: roleData } = await supabase.rpc("get_user_role");
          // setIsMainAdmin(roleData === 'main_admin');
          setIsMainAdmin(false); 
        }
      } catch (err) {
        console.error("Error checking admin role:", err);
      } finally {
        setLoadingRole(false);
      }
    }
    checkRole();
  }, []);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      alert("Unable to sign out. Please try again.");
      return;
    }
    navigate("/admin/login", { replace: true });
  };

  const filteredSections = allAdminSections.filter(
    (section) => !section.mainAdminOnly || isMainAdmin
  );

  return (
    <div className="admin-dashboard">
      <aside className="admin-sidebar">
        <Link to="/" className="admin-brand">
          <Trophy size={28} />
          <span>
            BCL
            <small>{isMainAdmin ? "MAIN ADMIN" : "STAFF PORTAL"}</small>
          </span>
        </Link>

        <nav className="admin-nav">
          <Link to="/admin" className="admin-nav-link active">
            <LayoutDashboard size={19} />
            Dashboard
          </Link>

          {isMainAdmin && (
            <Link to="/admin/users" className="admin-nav-link">
              <UserCog size={19} />
              User Management
            </Link>
          )}

          <Link to="/admin/cricket-fixtures" className="admin-nav-link">
            <CalendarClock size={19} />
            Manage Fixtures
          </Link>

          <Link to="/admin/live-scores" className="admin-nav-link">
            <Radio size={19} />
            Live Match Control
          </Link>

          <Link to="/admin/cricket-teams" className="admin-nav-link">
            <Users size={19} />
            Cricket Teams
          </Link>

          <Link to="/admin/cricket-players" className="admin-nav-link">
            <Users size={19} />
            Cricket Players
          </Link>

          <Link to="/admin/media" className="admin-nav-link">
            <Image size={19} />
            Media Management
          </Link>

          <Link to="/admin/posters" className="admin-nav-link">
            <Images size={19} />
            Poster Management
          </Link>

          {isMainAdmin && (
            <>
              <Link to="/admin/website-pages" className="admin-nav-link">
                <FileText size={19} />
                Website Pages CMS
              </Link>
              <Link to="/admin/homepage-content" className="admin-nav-link">
                <ClipboardList size={19} />
                Homepage CMS
              </Link>
            </>
          )}

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
            <h1>{isMainAdmin ? "Main Admin Dashboard" : "Staff Control Panel"}</h1>
            <p className="admin-subtitle">
              {isMainAdmin ? "Full system control and user management." : "Manage fixtures, scores, teams, and media."}
            </p>
          </div>

          <Link to="/" className="admin-view-site">
            View Website <ArrowUpRight size={16} />
          </Link>

          <button type="button" className="admin-signout-button" onClick={handleSignOut}>
            <LogOut size={16} /> Sign Out
          </button>
        </header>

        <section className="admin-welcome">
          <div>
            <span className="admin-welcome-tag">BCL MANAGEMENT</span>
            <h2>Welcome back, {isMainAdmin ? "Main Administrator" : "Staff Member"}</h2>
            <p>
              {isMainAdmin 
                ? "You have full privileges to manage users, content, and tournament operations." 
                : "You have access to fixture controls, live scoring, team rosters, and media uploads."}
            </p>
          </div>
          <Trophy size={70} />
        </section>

        <section className="admin-section">
          <div className="admin-section-heading">
            <div>
              <h2>Management Sections</h2>
              <p>Choose an area to manage based on your permissions.</p>
            </div>
          </div>

          <div className="admin-card-grid">
            {filteredSections.map((section) => {
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
      </main>
    </div>
  );
}

export default AdminDashboard;