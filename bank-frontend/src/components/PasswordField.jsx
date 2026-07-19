import { useState } from "react";

export default function PasswordField({
  label,
  value,
  onChange,
  autoComplete = "current-password",
  minLength,
  name,
}) {
  const [visible, setVisible] = useState(false);

  return (
    <label className="form-field">
      <span>{label}</span>

      <div className="password-field">
        <input
          required
          name={name}
          type={visible ? "text" : "password"}
          value={value}
          minLength={minLength}
          autoComplete={autoComplete}
          onChange={onChange}
        />

        <button
          className="password-toggle"
          type="button"
          aria-label={visible ? `Hide ${label}` : `Show ${label}`}
          onClick={() => setVisible((current) => !current)}
        >
          {visible ? "Hide" : "Show"}
        </button>
      </div>
    </label>
  );
}
