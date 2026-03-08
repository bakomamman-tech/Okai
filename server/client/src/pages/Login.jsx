import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";
import AuthLayout from "../components/AuthLayout";

export default function Login() {
  const { authenticate, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirectPath = location.state?.from?.pathname || "/feed";

  if (isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setError("");
      setIsSubmitting(true);
      const data = await api.login(form);
      authenticate(data);
      navigate(redirectPath, { replace: true });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      eyebrow="Return to your circle"
      title="Feel the pulse before the scroll."
      description="Okai now opens with a sharper identity system, cleaner auth flow, and a feed that feels built instead of assembled."
      footer={
        <p>
          New here? <Link to="/register">Create your account</Link>
        </p>
      }
    >
      <div className="auth-copy">
        <span className="eyebrow">Log in</span>
        <h2>Enter your workspace</h2>
      </div>

      <form className="stack-form" onSubmit={handleSubmit}>
        <input
          className="text-field"
          type="email"
          placeholder="Email address"
          value={form.email}
          onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
          required
        />
        <input
          className="text-field"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(event) =>
            setForm((current) => ({ ...current, password: event.target.value }))
          }
          required
        />
        <button className="primary-button wide-button" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Opening..." : "Log in"}
        </button>
      </form>

      {error && <p className="field-error">{error}</p>}
    </AuthLayout>
  );
}
