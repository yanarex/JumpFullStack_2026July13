export default function Message({ type = "success", children }) {
  if (!children) return null;
  return <div className={`message ${type}`}>{children}</div>;
}
