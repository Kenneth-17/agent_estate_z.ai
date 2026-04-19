"use client";

import { useState, useEffect, FormEvent, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import "@/styles/signin.css";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading, signInWithGoogle, signInWithEmail, signUp } = useAuth();

  const [mode, setMode] = useState<"signin" | "signup">(
    searchParams.get("new") === "1" ? "signup" : "signin"
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState("Signed in.");

  // Validation state
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && user) {
      router.push("/onboard");
    }
  }, [user, authLoading, router]);

  function validateEmail(value: string): boolean {
    if (!value.trim()) {
      setEmailError("Email is required");
      return false;
    }
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(value.trim())) {
      setEmailError("Enter a valid email address");
      return false;
    }
    setEmailError("");
    return true;
  }

  function validatePassword(value: string): boolean {
    if (!value) {
      setPasswordError("Password is required");
      return false;
    }
    if (value.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return false;
    }
    setPasswordError("");
    return true;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    const emailOk = validateEmail(email);
    const pwOk = validatePassword(password);
    if (!emailOk || !pwOk) return;

    setSubmitting(true);

    try {
      if (mode === "signup") {
        await signUp(email.trim(), password);
        setSuccessMsg("Account created.");
      } else {
        await signInWithEmail(email.trim(), password);
        setSuccessMsg("Signed in.");
      }

      setShowSuccess(true);
      setTimeout(() => {
        router.push("/onboard");
      }, 900);
    } catch (err: any) {
      setError(err.message || "Authentication failed");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleGoogle() {
    setError("");
    setSubmitting(true);
    try {
      await signInWithGoogle();
      // OAuth redirects away — no need for overlay
    } catch (err: any) {
      setError(err.message || "Google sign-in failed");
      setSubmitting(false);
    }
  }

  function switchMode(newMode: "signin" | "signup") {
    setMode(newMode);
    setError("");
    setEmailError("");
    setPasswordError("");
  }

  return (
    <>
      <div className="page">
        {/* LEFT: Sign-in form */}
        <div className="panel">
          <div className="panel-top">
            <a href="/" className="brand">
              <div className="brand-mark">Z</div>
              <span>Agent Estate Z <span className="brand-sub">&middot; Rental Passport</span></span>
            </a>
            <a href="/" className="back">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M19 12 H5 M11 6 L5 12 L11 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Back
            </a>
          </div>

          <div className="form-wrap">
            <span className="supa"><span className="supa-dot"></span>Secured by Supabase Auth</span>

            {mode === "signup" ? (
              <h1 className="signin-h1">Create your <em>Rental Passport</em>.</h1>
            ) : (
              <h1 className="signin-h1">Welcome back.</h1>
            )}

            <p className="subtitle">
              {mode === "signup"
                ? "Takes two minutes. Free while in beta. Delete your data any time."
                : "Sign in to pick up where you left off \u2014 or create a new Rental Passport."}
            </p>

            <div className="tabs" role="tablist">
              <button
                className={`tab${mode === "signin" ? " active" : ""}`}
                role="tab"
                type="button"
                onClick={() => switchMode("signin")}
              >
                Sign in
              </button>
              <button
                className={`tab${mode === "signup" ? " active" : ""}`}
                role="tab"
                type="button"
                onClick={() => switchMode("signup")}
              >
                Create account
              </button>
            </div>

            <form onSubmit={handleSubmit} autoComplete="on" noValidate>
              <div className="field">
                <label className="label" htmlFor="email">Email</label>
                <input
                  className={`input${emailError ? " input-error" : ""}`}
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); if (emailError) validateEmail(e.target.value); }}
                  onBlur={() => validateEmail(email)}
                />
                {emailError && <span className="error-text">{emailError}</span>}
              </div>

              <div className="field">
                <label className="label" htmlFor="password">Password</label>
                <input
                  className={`input${passwordError ? " input-error" : ""}`}
                  id="password"
                  type="password"
                  placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
                  autoComplete={mode === "signup" ? "new-password" : "current-password"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); if (passwordError) validatePassword(e.target.value); }}
                  onBlur={() => validatePassword(password)}
                />
                {passwordError && <span className="error-text">{passwordError}</span>}
              </div>

              {mode === "signin" && (
                <div className="opts">
                  <label className="remember"><input type="checkbox" defaultChecked /> Remember me</label>
                  <a href="#" className="forgot">Forgot password?</a>
                </div>
              )}

              {error && <div className="error-text" style={{ marginBottom: 14 }}>{error}</div>}

              <button className="submit" type="submit" disabled={submitting}>
                {submitting ? (
                  <>
                    <span className="spin"></span>
                    <span>Authenticating&hellip;</span>
                  </>
                ) : (
                  <>
                    <span>{mode === "signup" ? "Create account" : "Sign in"}</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12 H19 M13 6 L19 12 L13 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </>
                )}
              </button>
            </form>

            <div className="divider">OR CONTINUE WITH</div>
            <div className="oauth-row">
              <button className="oauth-btn" type="button" onClick={handleGoogle} disabled={submitting}>
                <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#4285F4" d="M22 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.6c-.2 1.3-1 2.4-2.1 3.1v2.6h3.4c2-1.8 3.1-4.5 3.1-7.5z"/><path fill="#34A853" d="M12 22c2.8 0 5.1-.9 6.9-2.5l-3.4-2.6c-.9.6-2.2 1-3.5 1-2.7 0-5-1.8-5.9-4.3H2.7v2.7C4.5 19.8 8 22 12 22z"/><path fill="#FBBC04" d="M6.1 13.7c-.2-.6-.3-1.2-.3-1.7s.1-1.1.3-1.7V7.6H2.7C2 8.9 1.6 10.4 1.6 12s.4 3.1 1.1 4.4l3.4-2.7z"/><path fill="#EA4335" d="M12 5.4c1.5 0 2.9.5 3.9 1.5l2.9-2.9C17 2.3 14.7 1.3 12 1.3 8 1.3 4.5 3.5 2.7 7.6l3.4 2.7c.9-2.5 3.2-4.3 5.9-4.3z"/></svg>
                Continue with Google
              </button>
              <button className="oauth-btn" type="button" onClick={handleGoogle} disabled={submitting}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2 A10 10 0 0 0 8.84 21.5 C9.34 21.58 9.5 21.27 9.5 21 V19.3 C6.73 19.9 6.14 17.97 6.14 17.97 C5.68 16.81 5.03 16.5 5.03 16.5 C4.12 15.88 5.1 15.9 5.1 15.9 C6.1 15.97 6.63 16.93 6.63 16.93 C7.5 18.45 8.97 18 9.54 17.76 C9.63 17.11 9.89 16.67 10.17 16.42 C7.95 16.17 5.62 15.31 5.62 11.5 C5.62 10.39 6 9.5 6.65 8.79 C6.55 8.54 6.2 7.5 6.75 6.15 C6.75 6.15 7.59 5.88 9.5 7.17 A9.4 9.4 0 0 1 14.5 7.17 C16.41 5.88 17.25 6.15 17.25 6.15 C17.8 7.5 17.45 8.54 17.35 8.79 C18 9.5 18.38 10.39 18.38 11.5 C18.38 15.32 16.04 16.17 13.81 16.41 C14.17 16.72 14.5 17.33 14.5 18.26 V21 C14.5 21.27 14.66 21.59 15.17 21.5 A10 10 0 0 0 12 2 Z"/></svg>
                Continue with GitHub
              </button>
            </div>

            <p className="footer-note">
              {mode === "signup" ? (
                <>Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); switchMode("signin"); }}>Sign in</a></>
              ) : (
                <>New to Agent Estate Z? <a href="#" onClick={(e) => { e.preventDefault(); switchMode("signup"); }}>Create an account</a></>
              )}
            </p>

            <p className="legal">
              By signing in, you agree to our <a href="#">Terms</a> and <a href="#">Privacy Policy</a>.
              We never share your data with listing agents. Your Rental Passport is encrypted at rest and deletable in one click.
            </p>
          </div>
        </div>

        {/* RIGHT: Hero panel */}
        <div className="page-hero">
          <div className="page-hero-head">
            <span className="tiny-mono">Hackathon Track 3 &middot; The Invisible Tube</span>
          </div>

          <div className="page-hero-main">
            <div className="quote-eyebrow">Why we built this</div>
            <blockquote className="quote-text">
              London rental search is broken &mdash; fifteen tabs, six filters, and still no clear answer. The Passport flips it: <em>one profile, every listing scored against your life.</em>
            </blockquote>
            <div className="quote-author">
              <div className="quote-avatar">AE</div>
              <div>
                <div style={{ color: "#f5f3ee", fontWeight: 500 }}>Agent Estate Z</div>
                <div>Built in London, 2026</div>
              </div>
            </div>
          </div>

          <div className="page-hero-foot">
            <div><div className="stat-n">1,284</div><div className="stat-l">LIVE LISTINGS</div></div>
            <div><div className="stat-n">6</div><div className="stat-l">DATA SOURCES</div></div>
            <div><div className="stat-n">2 min</div><div className="stat-l">SETUP TIME</div></div>
          </div>
        </div>
      </div>

      {/* Success overlay */}
      <div className={`success-overlay${showSuccess ? " show" : ""}`}>
        <div className="success-inner">
          <div className="success-check">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><path d="M5 12 L10 17 L19 7" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <h2>{successMsg}</h2>
          <p>Redirecting to your Rental Passport&hellip;</p>
        </div>
      </div>
    </>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
