import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Header.css";

export default function Header({ session, onLogout }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  function closeMenu() {
    setOpen(false);
  }

  function signOut() {
    onLogout();
    closeMenu();
    navigate("/");
  }

  return (
    <>
      <div className="utility-bar">
        <div className="page-width utility-inner">
          <span>Personal banking</span>
          <span className="utility-right">Secure online access</span>
        </div>
      </div>

      <header className="main-header">
        <div className="page-width header-inner">
          <NavLink className="brand" to="/" onClick={closeMenu}>
            <span className="brand-symbol">J</span>
            <span className="brand-name">Jump Bank</span>
          </NavLink>

          <button
            className="menu-button"
            type="button"
            aria-label="Toggle navigation"
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            <span />
            <span />
            <span />
          </button>

          <nav className={`main-nav ${open ? "open" : ""}`}>
            <NavLink to="/" onClick={closeMenu}>Home</NavLink>
            <NavLink to="/about" onClick={closeMenu}>About</NavLink>
            <NavLink to="/contact" onClick={closeMenu}>Contact us</NavLink>

            {!session && (
              <>
                <NavLink to="/create-account" onClick={closeMenu}>
                  Create account
                </NavLink>
                <NavLink className="sign-on-link" to="/login" onClick={closeMenu}>
                  Sign on
                </NavLink>
              </>
            )}

            {session && (
              <>
                <NavLink
                  to={String(session.userType).toUpperCase() === "ADMIN"
                    ? "/admin"
                    : "/dashboard"}
                  onClick={closeMenu}
                >
                  Dashboard
                </NavLink>
                <button className="sign-out-button" onClick={signOut}>
                  Sign out
                </button>
              </>
            )}
          </nav>
        </div>
      </header>
    </>
  );
}
