
export default function VisibilityToggle({
  visible,
  onToggle,
  label,
}) {
  return (
    <button
      type="button"
      className={`visibility-toggle ${
        visible ? "visibility-toggle-active" : ""
      }`}
      onClick={onToggle}
      aria-label={`${visible ? "Hide" : "Show"} ${label}`}
      aria-pressed={visible}
      title={`${visible ? "Hide" : "Show"} ${label}`}
    >
      {visible ? "👁" : "◉"}
    </button>
  );
}