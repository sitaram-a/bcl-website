import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  User,
  Users,
  Trophy,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  CalendarDays,
  MapPin,
  IndianRupee,
  Camera,
  Download,
  Share2,
  Loader2,
  MessageCircle,
} from "lucide-react";

import "./Registration.css";
import { addRegistration } from "../data/registrations";

// ---- EDIT THESE FOR YOUR SEASON ----
const LEAGUE_NAME = "BAHARAGORA CHAMPIONS LEAGUE";
const SEASON_LABEL = "SESSION 5";
const CONTACT_PHONE = "7903288829";
// Include the country code, no +, no spaces (91 = India). Used for the
// WhatsApp "send" link on the success screen.
const WHATSAPP_NUMBER = `91${CONTACT_PHONE}`;
const FEES = { football: "₹300", cricket: "₹300" };
// -------------------------------------

const STEPS = ["Choose", "Details", "Review"];

const positions = {
  football: ["Goalkeeper", "Defender", "Midfielder", "Forward"],
  cricket: ["Batsman", "Bowler", "All-rounder", "Wicket-keeper"],
};

const initial = {
  sport: "football",
  type: "player",
  name: "",
  phone: "",
  email: "",
  age: "",
  position: "",
  teamName: "",
  captain: "",
  players: "",
  address: "",
  agree: false,
  photoDataUrl: null,
};

// Draws a rounded rectangle path
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function buildWhatsAppMessage({ form, refId, isPlayer }) {
  const lines = [
    `*New ${form.sport === "football" ? "Football" : "Cricket"} Registration*`,
    isPlayer ? `Player: ${form.name}` : `Team: ${form.teamName}`,
    isPlayer ? `Position: ${form.position}` : `Captain: ${form.captain}`,
    !isPlayer && `Squad size: ${form.players}`,
    `Place: ${form.address}`,
    `Phone: ${form.phone}`,
    `Reg. No: ${refId}`,
    "",
    "(Poster image attached separately)",
  ].filter(Boolean);
  return lines.join("\n");
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

// Builds the shareable registration poster on an in-memory canvas
// and returns a PNG data URL. Runs entirely in the browser.
async function buildPoster({ form, refId, isPlayer }) {
  const W = 1080;
  const H = 1350;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");

  // Background
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, "#06172f");
  bg.addColorStop(1, "#123e73");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = "rgba(255,255,255,0.05)";
  ctx.beginPath();
  ctx.arc(W - 100, 100, 220, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(60, H - 120, 260, 0, Math.PI * 2);
  ctx.fill();

  // Header
  ctx.textAlign = "center";
  ctx.fillStyle = "#8fc1ff";
  ctx.font = "800 26px 'Segoe UI', Arial, sans-serif";
  ctx.fillText(LEAGUE_NAME, W / 2, 95);

  ctx.fillStyle = "#ffffff";
  ctx.font = "900 34px 'Segoe UI', Arial, sans-serif";
  ctx.fillText(SEASON_LABEL, W / 2, 140);

  const sportEmoji = form.sport === "football" ? "⚽" : "🏏";
  ctx.font = "56px 'Segoe UI', Arial, sans-serif";
  ctx.fillText(sportEmoji, W / 2, 210);

  // Ribbon
  const ribbonY = 240;
  ctx.fillStyle = "#e63946";
  roundRect(ctx, W / 2 - 300, ribbonY, 600, 64, 14);
  ctx.fill();
  ctx.fillStyle = "#fff";
  ctx.font = "800 30px 'Segoe UI', Arial, sans-serif";
  ctx.fillText(
    isPlayer ? "PLAYER REGISTRATION" : "TEAM REGISTRATION",
    W / 2,
    ribbonY + 43
  );

  // Photo circle (player only, if uploaded)
  let contentTop = 350;
  if (isPlayer && form.photoDataUrl) {
    try {
      const img = await loadImage(form.photoDataUrl);
      const cx = W / 2;
      const cy = 470;
      const r = 130;
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
      // cover-fit the image into the circle
      const scale = Math.max((r * 2) / img.width, (r * 2) / img.height);
      const dw = img.width * scale;
      const dh = img.height * scale;
      ctx.drawImage(img, cx - dw / 2, cy - dh / 2, dw, dh);
      ctx.restore();
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.lineWidth = 8;
      ctx.strokeStyle = "#ffd166";
      ctx.stroke();
      contentTop = 640;
    } catch {
      contentTop = 350;
    }
  }

  // Info rows
  const rows = isPlayer
    ? [
        ["PLAYER NAME", form.name],
        ["ROLE", form.position],
        ["PLACE", form.address],
        ["REG. NO.", refId],
        ["PH. NO.", form.phone],
      ]
    : [
        ["TEAM NAME", form.teamName],
        ["CAPTAIN", form.captain],
        ["SQUAD SIZE", form.players],
        ["PLACE", form.address],
        ["REG. NO.", refId],
        ["PH. NO.", form.phone],
      ];

  const rowH = 76;
  const rowW = 880;
  const rowX = (W - rowW) / 2;
  let y = contentTop;

  ctx.textAlign = "left";
  rows.forEach(([label, value], i) => {
    ctx.fillStyle = i % 2 === 0 ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.05)";
    roundRect(ctx, rowX, y, rowW, rowH - 10, 14);
    ctx.fill();

    ctx.fillStyle = "#ffd166";
    roundRect(ctx, rowX, y, 8, rowH - 10, 4);
    ctx.fill();

    ctx.fillStyle = "#9fb2cc";
    ctx.font = "700 20px 'Segoe UI', Arial, sans-serif";
    ctx.fillText(label, rowX + 34, y + 30);

    ctx.fillStyle = "#ffffff";
    ctx.font = "800 28px 'Segoe UI', Arial, sans-serif";
    ctx.fillText(String(value || "—"), rowX + 34, y + 58);

    y += rowH;
  });

  // Footer bar
  const footerH = 150;
  const footerY = H - footerH;
  ctx.fillStyle = "rgba(0,0,0,0.35)";
  ctx.fillRect(0, footerY, W, footerH);
  ctx.fillStyle = "#ffd166";
  ctx.fillRect(0, footerY, W, 4);

  ctx.textAlign = "center";
  ctx.fillStyle = "#9fb2cc";
  ctx.font = "700 18px 'Segoe UI', Arial, sans-serif";
  ctx.fillText("REGISTRATION FEE", W / 4, footerY + 48);
  ctx.fillStyle = "#ffffff";
  ctx.font = "900 40px 'Segoe UI', Arial, sans-serif";
  ctx.fillText(FEES[form.sport] || "—", W / 4, footerY + 95);

  ctx.fillStyle = "#9fb2cc";
  ctx.font = "700 18px 'Segoe UI', Arial, sans-serif";
  ctx.fillText("FOR REGISTRATION, CONTACT", (W / 4) * 3, footerY + 48);
  ctx.fillStyle = "#ffffff";
  ctx.font = "900 34px 'Segoe UI', Arial, sans-serif";
  ctx.fillText(CONTACT_PHONE, (W / 4) * 3, footerY + 95);

  ctx.strokeStyle = "rgba(255,255,255,0.2)";
  ctx.beginPath();
  ctx.moveTo(W / 2, footerY + 20);
  ctx.lineTo(W / 2, H - 20);
  ctx.stroke();

  return canvas.toDataURL("image/png");
}

function Field({ label, name, type = "text", placeholder, form, errors, set, ...rest }) {
  return (
    <label className={`reg-field ${errors[name] ? "has-error" : ""}`}>
      <span>{label}</span>
      <input
        type={type}
        value={form[name]}
        placeholder={placeholder}
        onChange={(e) => set(name, e.target.value)}
        {...rest}
      />
      {errors[name] && <small>{errors[name]}</small>}
    </label>
  );
}

function Registration() {
    const REGISTRATION_CLOSED = true;
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const [refId, setRefId] = useState(null);
  const [poster, setPoster] = useState(null);
  const fileInputRef = useRef(null);

  const isPlayer = form.type === "player";
  const posterLoading = Boolean(refId) && !poster;

  useEffect(() => {
    if (!refId) return;
    let cancelled = false;
    buildPoster({ form, refId, isPlayer }).then((url) => {
      if (!cancelled) setPoster(url);
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refId]);

  const onPhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setErrors((er) => ({ ...er, photo: "Photo must be under 5MB" }));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => set("photoDataUrl", reader.result);
    reader.readAsDataURL(file);
  };

  const sharePoster = async () => {
    if (!poster) return;
    try {
      if (navigator.share && navigator.canShare) {
        const blob = await (await fetch(poster)).blob();
        const file = new File([blob], "bcl-registration.png", { type: "image/png" });
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: `${LEAGUE_NAME} Registration`,
            text: "I just registered for BCL!",
          });
          return;
        }
      }
      if (navigator.share) {
        await navigator.share({ title: `${LEAGUE_NAME} Registration`, url: poster });
      }
    } catch {
      // user cancelled share sheet — ignore
    }
  };

  const set = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const validate = () => {
    const e = {};
    const isPlayer = form.type === "player";
    if (isPlayer) {
      if (!form.name.trim()) e.name = "Full name is required";
      if (!form.age || form.age < 10 || form.age > 60) e.age = "Enter age between 10 and 60";
      if (!form.position) e.position = "Select a position";
    } else {
      if (!form.teamName.trim()) e.teamName = "Team name is required";
      if (!form.captain.trim()) e.captain = "Captain name is required";
      const min = form.sport === "football" ? 7 : 8;
      if (!form.players || form.players < min || form.players > 25)
        e.players = `Enter squad size between ${min} and 25`;
    }
    if (!/^[6-9]\d{9}$/.test(form.phone)) e.phone = "Enter a valid 10-digit mobile number";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter a valid email address";
    if (!form.address.trim()) e.address = "Address is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const goNext = () => {
    if (step === 1 && !validate()) return;
    setStep((s) => s + 1);
  };

  const submit = () => {
    if (!form.agree) {
      setErrors({ agree: "Please accept the rules to continue" });
      return;
    }
    const id = `BCL-${form.sport === "football" ? "FB" : "CR"}-${Math.floor(
      100000 + Math.random() * 900000
    )}`;

    // Saves to this browser only — see the note in data/registrations.js.
    // TODO: also send `form` to a real backend (Google Sheet / API) so
    // registrations from every visitor reach you, not just this device.
    addRegistration(form.sport, {
      id,
      sport: form.sport,
      type: form.type,
      name: form.name,
      age: form.age,
      position: form.position,
      teamName: form.teamName,
      captain: form.captain,
      players: form.players,
      phone: form.phone,
      email: form.email,
      address: form.address,
      hasPhoto: Boolean(form.photoDataUrl),
      submittedAt: new Date().toISOString(),
    });

    setRefId(id);
  };

  const reset = () => {
    setForm(initial);
    setErrors({});
    setRefId(null);
    setStep(0);
    setPoster(null);
  };

  return (
  <div className="reg-page">
    {/* REGISTRATION CLOSED HERO */}
    <section className="reg-hero">
      <div className="reg-hero-glow" />

      <div className="reg-hero-inner">
        <span className="reg-kicker">
          <Trophy size={14} /> BCL 2026
        </span>

        <h1>
          Registration <span>Closed</span>
        </h1>

        <p>
          Player and team registrations for Baharagora Champions League
          Season 5 are now closed.
        </p>

        <div className="reg-facts">
          <div>
            <CalendarDays size={18} />
            Registration Closed
          </div>

          <div>
            <MapPin size={18} />
            Baharagora
          </div>

          <div>
            <Trophy size={18} />
            BCL Cricket 2026
          </div>
        </div>
      </div>
    </section>

    {/* CLOSED MESSAGE */}
    <section className="reg-wrap">
      <div className="reg-card">
        <div className="reg-success reg-closed">
          <CheckCircle2 size={72} />

          <h2>Registration Is Closed</h2>

          <p>
            Thank you for your interest in the Baharagora Champions League.
            Registration for BCL Cricket 2026 has now ended.
          </p>

          <div className="reg-ref reg-closed-info">
            <span>Tournament</span>
            <strong>BCL Cricket 2026</strong>
          </div>

          <div className="reg-closed-details">
            <div>
              <CalendarDays size={20} />
              <span>
                <small>Tournament Starts</small>
                <strong>25 October 2026</strong>
              </span>
            </div>

            <div>
              <MapPin size={20} />
              <span>
                <small>Location</small>
                <strong>Baharagora</strong>
              </span>
            </div>
          </div>

          <div className="reg-actions center">
            <Link to="/" className="reg-btn primary">
              <ArrowLeft size={16} />
              Back to Home
            </Link>
          </div>
        </div>
      </div>

      {/* SIDE INFO */}
      <aside className="reg-side">
        <h3>BCL Cricket 2026</h3>

        <ul>
          <li>
            <Trophy size={18} />
            Get ready for the championship
          </li>

          <li>
            <CalendarDays size={18} />
            Tournament starts on 25 October 2026
          </li>

          <li>
            <MapPin size={18} />
            Venue: Baharagora
          </li>
        </ul>

        <div className="reg-side-note">
          <strong>Registration Closed</strong>

          <span>
            Player and team registration is no longer accepting new
            submissions for this season.
          </span>
        </div>
      </aside>
    </section>
  </div>
);
}

export default Registration;