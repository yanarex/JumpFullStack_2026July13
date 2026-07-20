import { useNavigate } from "react-router-dom";

export default function FormActions({
  submitText,
  loading,
  showBack = true,
}) {
  const navigate = useNavigate();

  return (
    <div className="form-actions">
      {showBack && (
        <button
          type="button"
          className="secondary-button"
          onClick={() => navigate(-1)}
          disabled={loading}
        >
          Back
        </button>
      )}

      <button
        type="submit"
        className="primary-button"
        disabled={loading}
      >
        {loading && (
          <span
            className="button-spinner"
            aria-hidden="true"
          />
        )}

        {loading ? "Loading..." : submitText}
      </button>
    </div>
  );
}