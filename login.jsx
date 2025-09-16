// Account.jsx (uses the same CSS)
import { useState } from "react";
import "./login.css";

function usePasswordToggle() {
  const [show, setShow] = useState(false);
  return {
    type: show ? "text" : "password",
    btnProps: (id) => ({
      "aria-controls": id,
      "aria-pressed": show,
      "aria-label": show ? "Hide password" : "Show password",
      onClick: () => setShow(s => !s),
    }),
  };
}

export default function Account() {
  const login = usePasswordToggle();
  const reg = usePasswordToggle();
  const [loginMsg, setLoginMsg] = useState("");
  const [regMsg, setRegMsg] = useState("");

  const onSubmit = (setter, msg) => (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.checkValidity()) return form.querySelector(":invalid")?.focus();
    // TODO: call API
    setter(msg);
    setTimeout(()=>setter(""), 4000);
  };

  return (
    <section id="account" className="account" aria-labelledby="account-title">
      <div className="account__header">
        <h2 id="account-title" className="account__title">Welcome back</h2>
        <p className="account__sub">Log in to track orders and earn rewards, or create an account.</p>
      </div>

      <div className="account__grid">
        <form className="card form" onSubmit={onSubmit(setLoginMsg, "Signed in. Redirecting…")} noValidate aria-labelledby="login-title">
          <h3 id="login-title">Login</h3>

          <div className="field">
            <label htmlFor="login-phone">Mobile number</label>
            <input id="login-phone" name="phone" type="tel" inputMode="tel" autoComplete="username" pattern="^[0-9+\-\s]{7,15}$" required />
            <small className="help">Enter a valid phone number (7–15 digits).</small>
          </div>

          <div className="field">
            <label htmlFor="login-password">Password</label>
            <div className="pass">
              <input id="login-password" name="password" type={login.type} autoComplete="current-password" spellCheck={false} required />
              <button type="button" className="pass__toggle" {...login.btnProps("login-password")}>👁️</button>
            </div>
            <small className="help">At least 8 characters.</small>
          </div>

          <div className="row">
            <label className="check">
              <input type="checkbox" name="remember" />
              <span>Remember me</span>
            </label>
            <a className="link" href="#forgot">Forgot password?</a>
          </div>

          <button className="btn btn--primary" type="submit">Sign in</button>
          {loginMsg && <p className="status" role="status" aria-live="polite">{loginMsg}</p>}
        </form>

        <form className="card form" onSubmit={onSubmit(setRegMsg, "Account created. Check SMS/email to verify.")} noValidate aria-labelledby="register-title">
          <h3 id="register-title">Create account</h3>

          <div className="field">
            <label htmlFor="reg-name">Full name</label>
            <input id="reg-name" name="name" type="text" autoComplete="name" required />
          </div>

          <div className="field">
            <label htmlFor="reg-phone">Mobile number</label>
            <input id="reg-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" pattern="^[0-9+\-\s]{7,15}$" required />
          </div>

          <div className="field">
            <label htmlFor="reg-password">Password</label>
            <div className="pass">
              <input id="reg-password" name="password" type={reg.type} autoComplete="new-password" spellCheck={false} required aria-describedby="reg-pass-req" />
              <button type="button" className="pass__toggle" {...reg.btnProps("reg-password")}>👁️</button>
            </div>
            <small id="reg-pass-req" className="help">8+ chars, mix of letters & numbers recommended.</small>
          </div>

          <div className="row">
            <label className="check">
              <input type="checkbox" name="terms" required />
              <span>I agree to the Terms & Privacy</span>
            </label>
          </div>

          <button className="btn btn--primary" type="submit">Create account</button>
          {regMsg && <p className="status" role="status" aria-live="polite">{regMsg}</p>}
        </form>
      </div>
    </section>
  );
}
