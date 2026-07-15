import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="page-width footer-grid">
        <div>
          <div className="footer-brand">Jump Bank</div>
          <p>
            A student-built full-stack banking application designed to
            demonstrate secure account management and REST API integration.
          </p>
        </div>

        <div>
          <h3>Explore</h3>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact us</Link>
          <Link to="/create-account">Create account</Link>
        </div>

        <div>
          <h3>Online banking</h3>
          <Link to="/login">Sign on</Link>
          <span>Account overview</span>
          <span>Transfers</span>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="page-width">
          © 2026 Jump Bank. Educational demonstration project.
        </div>
      </div>
    </footer>
  );
}
