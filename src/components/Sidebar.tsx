// @ts-ignore: allow CSS side-effect import without type declarations
import './Sidebar.css'
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div>
        <nav className="navbar">
          <div className="navbar-links">
            {user && (
              <>
                <Link to="/" className="navbar-link">
                  Dashboard
                </Link>
                <Link to="/VendorQuotes" className="navbar-link">
                  Vendor Quotes
                </Link>
                <Link to="/Budget" className="navbar-link">
                  Budget
                </Link>
              </>
            )}
          </div>
          <div className="navbar-auth">
            {user ? (
              <>
                <span className="navbar-user">{user.role}</span>
                <button type="button" className="navbar-logout" onClick={handleLogout}>
                  Log Out
                </button>
              </>
            ) : (
              <Link to="/login" className="navbar-link">
                Log In
              </Link>
            )}
          </div>
      </nav>

    </div>
  );
}