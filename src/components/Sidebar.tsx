// @ts-ignore: allow CSS side-effect import without type declarations
import './Sidebar.css'
import { Link } from "react-router-dom";

export default function Navbar() {

  return (
    <div>
        <nav className="navbar">
          <div className="navbar-links">
            <Link to="/" className="navbar-link">
              Dashboard
            </Link>
            <Link to="/VendorQuotes" className="navbar-link">
              Vendor Quotes
            </Link>
            <Link to="/Budget" className="navbar-link">
              Budget
            </Link>
          </div>
      </nav>
    
    </div>
  );
}