import { useState } from "react";

export default function PostComposer({ onCreate, isSubmitting }) {
  const [form, setForm] = useState({ content: "", image: "" });

  const updateField = (field, value) => {
    setForm((currentForm) => ({ ...currentForm, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      content: form.content.trim(),
      image: form.image.trim(),
    };

    if (!payload.content && !payload.image) {
      return;
    }

    const didCreate = await onCreate(payload);

    if (didCreate !== false) {
      setForm({ content: "", image: "" });
    }
  };

  return (
    <section className="surface composer">
      <div className="section-heading">
        <div>
          <span className="eyebrow">Start something</span>
          <h2>Publish a sharper update</h2>
        </div>
        <span className="muted-copy">{form.content.length}/1200</span>
      </div>

      <form className="composer-form" onSubmit={handleSubmit}>
        <textarea
          className="textarea-field"
          placeholder="Share what your circle should see next."
          value={form.content}
          onChange={(event) => updateField("content", event.target.value)}
          maxLength={1200}
        />

        <div className="field-row">
          <input
            className="text-field"
            type="url"
            placeholder="Optional image URL"
            value={form.image}
            onChange={(event) => updateField("image", event.target.value)}
          />
          <button className="primary-button" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Publishing..." : "Publish"}
          </button>
        </div>
      </form>
    </section>
  );
}
