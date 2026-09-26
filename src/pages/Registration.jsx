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
      {/* HERO */}
      <section className="reg-hero">
        <div className="reg-hero-glow" />
        <div className="reg-hero-inner">
          <span className="reg-kicker">
            <Trophy size={14} /> SEASON REGISTRATIONS OPEN
          </span>
          <h1>
            Join the <span>Champions</span>
          </h1>
          <p>
            Register as a player or bring your whole team to compete in
            Baharagora's biggest football and cricket league.
          </p>
          <div className="reg-facts">
            <div><CalendarDays size={18} /> Season starts soon</div>
            <div><MapPin size={18} /> Baharagora</div>
            <div><IndianRupee size={18} /> Fees announced on confirmation</div>
          </div>
        </div>
      </section>

      <section className="reg-wrap">
        <div className="reg-card">
          {refId ? (
            <div className="reg-success">
              <CheckCircle2 size={64} />
              <h2>Registration Submitted!</h2>
              <p>
                Thanks, {isPlayer ? form.name : form.teamName}. Our team will
                contact you on {form.phone} shortly.
              </p>
              <div className="reg-ref">
                <span>Your reference ID</span>
                <strong>{refId}</strong>
              </div>

              <div className="reg-poster-wrap">
                {posterLoading ? (
                  <div className="reg-poster-loading">
                    <Loader2 className="spin" size={28} />
                    <span>Generating your registration poster…</span>
                  </div>
                ) : poster ? (
                  <>
                    <img className="reg-poster" src={poster} alt="Your registration poster" />
                    <div className="reg-actions center">
                      <a
                        href={poster}
                        download={`registered-players/bcl-registration-${refId}.png`}
                        className="reg-btn primary"
                      >
                        <Download size={16} /> Download Poster
                      </a>
                      {typeof navigator !== "undefined" && navigator.share && (
                        <button className="reg-btn ghost" onClick={sharePoster}>
                          <Share2 size={16} /> Share
                        </button>
                      )}
                    </div>

                    <div className="reg-whatsapp-box">
                      <p>
                        Download the poster above, then send it on WhatsApp
                        to confirm your registration:
                      </p>
                      <a
                        className="reg-btn whatsapp"
                        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                          buildWhatsAppMessage({ form, refId, isPlayer })
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <MessageCircle size={16} /> Send on WhatsApp ({CONTACT_PHONE})
                      </a>
                      <small>
                        This opens WhatsApp with your details pre-filled —
                        attach the downloaded poster before sending.
                      </small>
                    </div>
                  </>
                ) : null}
              </div>

              <div className="reg-actions center">
                <button className="reg-btn ghost" onClick={reset}>
                  Register Another
                </button>
                <Link to="/" className="reg-btn primary">
                  Back to Home
                </Link>
              </div>
            </div>
          ) : (
            <>
              {/* STEPPER */}
              <ol className="reg-stepper">
                {STEPS.map((s, i) => (
                  <li
                    key={s}
                    className={i === step ? "current" : i < step ? "done" : ""}
                  >
                    <span>{i < step ? "✓" : i + 1}</span>
                    {s}
                  </li>
                ))}
              </ol>

              {/* STEP 0 */}
              {step === 0 && (
                <div className="reg-step">
                  <h2>What would you like to register for?</h2>

                  <h3 className="reg-label">Sport</h3>
                  <div className="reg-choices">
                    {[
                      ["football", "⚽", "Football"],
                      ["cricket", "🏏", "Cricket"],
                    ].map(([v, icon, label]) => (
                      <button
                        key={v}
                        className={`reg-choice ${form.sport === v ? "active" : ""}`}
                        onClick={() => set("sport", v)}
                      >
                        <span className="emoji">{icon}</span>
                        <strong>{label}</strong>
                      </button>
                    ))}
                  </div>

                  <h3 className="reg-label">Register as</h3>
                  <div className="reg-choices">
                    <button
                      className={`reg-choice ${isPlayer ? "active" : ""}`}
                      onClick={() => set("type", "player")}
                    >
                      <User size={30} />
                      <strong>Individual Player</strong>
                      <small>Get picked by a team</small>
                    </button>
                    <button
                      className={`reg-choice ${!isPlayer ? "active" : ""}`}
                      onClick={() => set("type", "team")}
                    >
                      <Users size={30} />
                      <strong>Full Team</strong>
                      <small>Enter your own squad</small>
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 1 */}
              {step === 1 && (
                <div className="reg-step">
                  <h2>{isPlayer ? "Player details" : "Team details"}</h2>
                  <div className="reg-grid">
                    {isPlayer ? (
                      <>
                        <Field form={form} errors={errors} set={set} label="Full name" name="name" placeholder="e.g. Rahul Kumar" />
                        <Field form={form} errors={errors} set={set} label="Age" name="age" type="number" placeholder="18" />
                        <label className={`reg-field ${errors.position ? "has-error" : ""}`}>
                          <span>Preferred position</span>
                          <select
                            value={form.position}
                            onChange={(e) => set("position", e.target.value)}
                          >
                            <option value="">Select…</option>
                            {positions[form.sport].map((p) => (
                              <option key={p}>{p}</option>
                            ))}
                          </select>
                          {errors.position && <small>{errors.position}</small>}
                        </label>
                        <label className={`reg-field ${errors.photo ? "has-error" : ""}`}>
                          <span>Your photo (optional)</span>
                          <button
                            type="button"
                            className="reg-photo-btn"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            {form.photoDataUrl ? (
                              <img src={form.photoDataUrl} alt="Preview" />
                            ) : (
                              <Camera size={20} />
                            )}
                            {form.photoDataUrl ? "Change photo" : "Upload photo"}
                          </button>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={onPhotoChange}
                          />
                          {errors.photo && <small>{errors.photo}</small>}
                          <small className="reg-hint">
                            Used only for your registration poster below.
                          </small>
                        </label>
                      </>
                    ) : (
                      <>
                        <Field form={form} errors={errors} set={set} label="Team name" name="teamName" placeholder="e.g. Baharagora Strikers" />
                        <Field form={form} errors={errors} set={set} label="Captain name" name="captain" placeholder="Captain's full name" />
                        <Field form={form} errors={errors} set={set} label="Squad size" name="players" type="number" placeholder="11" />
                      </>
                    )}
                    <Field form={form} errors={errors} set={set} label="Mobile number" name="phone" type="tel" placeholder="10-digit number" maxLength={10} />
                    <Field form={form} errors={errors} set={set} label="Email" name="email" type="email" placeholder="you@example.com" />
                    <div className="reg-full">
                      <Field form={form} errors={errors} set={set} label="Address" name="address" placeholder="Village / Town, Baharagora" />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2 */}
              {step === 2 && (
                <div className="reg-step">
                  <h2>Review & confirm</h2>
                  <dl className="reg-review">
                    <div><dt>Sport</dt><dd>{form.sport === "football" ? "⚽ Football" : "🏏 Cricket"}</dd></div>
                    <div><dt>Type</dt><dd>{isPlayer ? "Individual Player" : "Full Team"}</dd></div>
                    {isPlayer ? (
                      <>
                        <div><dt>Name</dt><dd>{form.name}</dd></div>
                        <div><dt>Age</dt><dd>{form.age}</dd></div>
                        <div><dt>Position</dt><dd>{form.position}</dd></div>
                      </>
                    ) : (
                      <>
                        <div><dt>Team</dt><dd>{form.teamName}</dd></div>
                        <div><dt>Captain</dt><dd>{form.captain}</dd></div>
                        <div><dt>Squad size</dt><dd>{form.players}</dd></div>
                      </>
                    )}
                    <div><dt>Mobile</dt><dd>{form.phone}</dd></div>
                    <div><dt>Email</dt><dd>{form.email}</dd></div>
                    <div><dt>Address</dt><dd>{form.address}</dd></div>
                  </dl>

                  <label className="reg-agree">
                    <input
                      type="checkbox"
                      checked={form.agree}
                      onChange={(e) => set("agree", e.target.checked)}
                    />
                    <span>
                      <ShieldCheck size={16} /> I confirm the details are correct and agree
                      to follow the BCL rules and code of conduct.
                    </span>
                  </label>
                  {errors.agree && <small className="reg-error">{errors.agree}</small>}
                </div>
              )}

              {/* ACTIONS */}
              <div className="reg-actions">
                {step > 0 ? (
                  <button className="reg-btn ghost" onClick={() => setStep(step - 1)}>
                    <ArrowLeft size={16} /> Back
                  </button>
                ) : (
                  <span />
                )}
                {step < 2 ? (
                  <button className="reg-btn primary" onClick={goNext}>
                    Continue <ArrowRight size={16} />
                  </button>
                ) : (
                  <button className="reg-btn primary" onClick={submit}>
                    Submit Registration <CheckCircle2 size={16} />
                  </button>
                )}
              </div>
            </>
          )}
        </div>

        {/* SIDE INFO */}
        <aside className="reg-side">
          <h3>Why join BCL?</h3>
          <ul>
            <li><Trophy size={18} /> Compete for the championship trophy</li>
            <li><Users size={18} /> Play with the best local talent</li>
            <li><ShieldCheck size={18} /> Organised, fair & well-officiated matches</li>
          </ul>
          <div className="reg-side-note">
            <strong>Need help?</strong>
            <span>Reach out to the BCL organising committee for any questions about eligibility or fees.</span>
          </div>
        </aside>
      </section>
    </div>
  );
}

export default Registration;