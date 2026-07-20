import { useState } from "react";

export default function PasswordField({
  label = "Password",
  value,
  onChange,
  autoComplete = "current-password",
  required = true,
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <label className="form-field">
      <span>{label}</span>

      <div className="password-input-wrapper">
        <input
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          required={required}
        />

        <button
          className="password-show-button"
          type="button"
          onClick={() => setShowPassword((current) => !current)}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? "Hide" : "Show"}
        </button>
      </div>
    </label>
  );
}