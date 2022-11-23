import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link to="/" className="navbar-brand">
          Parking App
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {location.pathname === "/" ? (
              <Link to="/reports" className="nav-link">
                Reports
              </Link>
            ) : (
              <Link to="/" className="nav-link">
                Add data
              </Link>
            )}
            <li className="nav-item"></li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
