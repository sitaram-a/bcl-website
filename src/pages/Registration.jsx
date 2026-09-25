import { useState } from "react";
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
} from "lucide-react";

import "./Registration.css";

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
};

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
    // TODO: send `form` to your backend / Google Sheet / Formspree here.
    setRefId(
      `BCL-${form.sport === "football" ? "FB" : "CR"}-${Math.floor(
        100000 + Math.random() * 900000
      )}`
    );
  };

  const reset = () => {
    setForm(initial);
    setErrors({});
    setRefId(null);
    setStep(0);
  };

  const isPlayer = form.type === "player";

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