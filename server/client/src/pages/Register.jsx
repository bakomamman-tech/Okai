import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";
import AuthLayout from "../components/AuthLayout";

export default function Register() {
  const { authenticate, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/feed" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setError("");
      setIsSubmitting(true);
      const data = await api.register(form);
      authenticate(data);
      navigate("/feed", { replace: true });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      eyebrow="Set the tone"
      title="Create an account that already looks lived in."
      description="Registration now lands you inside a real app state with profile defaults, cleaner navigation, and a feed that can actually react to activity."
      footer={
        <p>
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      }
    >
      <div className="auth-copy">
        <span className="eyebrow">Create account</span>
        <h2>Claim your place on Okai</h2>
      </div>

      <form className="stack-form" onSubmit={handleSubmit}>
        <input
          className="text-field"
          type="text"
          placeholder="Display name"
          value={form.name}
          onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
          required
        />
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
          {isSubmitting ? "Creating..." : "Create account"}
        </button>
      </form>

      {error && <p className="field-error">{error}</p>}
    </AuthLayout>
  );
}
