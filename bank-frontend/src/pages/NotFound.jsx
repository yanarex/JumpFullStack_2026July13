import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main className="not-found">
      <div className="page-width">
        <p className="eyebrow">404</p>
        <h1>Page not found</h1>
        <p>The page you requested does not exist.</p>
        <Link className="button primary" to="/">Return home</Link>
      </div>
    </main>
  );
}
