import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { useEffect } from 'react';

const HomePage = () => {
  useEffect(() => {
    // ScrollSpy will auto-activate with the correct HTML attributes, no manual init needed
  }, []);

  return (
    <>
      {/* Navbar */}
      <nav
        id="navbar-example"
        className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top shadow-sm px-4"
      >
        <a className="navbar-brand fw-bold" href="#">
          SpendSmart
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarTabs"
          aria-controls="navbarTabs"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarTabs">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a className="nav-link active" href="#section1">
                Home
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#section2">
                About
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#section3">
                Features
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#section4">
                Contact
              </a>
            </li>
          </ul>
        </div>
      </nav>

      {/* ScrollSpy Container */}
      <div
        data-bs-spy="scroll"
        data-bs-target="#navbar-example"
        data-bs-offset="70"
        className="scrollspy-example"
        tabIndex="0"
      >
        <section
          id="section1"
          className="vh-100 d-flex flex-column justify-content-center align-items-center bg-light border-bottom"
        >
          <h1 className="display-4 fw-bold">Welcome to SpendSmart</h1>
          <p className="lead text-muted text-center w-75">
            Scroll or use the navigation bar to explore the sections of this homepage.
          </p>
        </section>

        <section
          id="section2"
          className="vh-100 d-flex flex-column justify-content-center align-items-center bg-white border-bottom"
        >
          <h2 className="fw-bold">About Us</h2>
          <p className="text-center w-75 text-muted">
            We are passionate about building great user experiences with clean and
            professional design. This homepage is powered by React + Bootstrap using ScrollSpy.
          </p>
        </section>

        <section
          id="section3"
          className="vh-100 d-flex flex-column justify-content-center align-items-center bg-light border-bottom"
        >
          <h2 className="fw-bold">Features</h2>
          <ul className="list-unstyled text-center text-muted w-50">
            <li>💡 Smooth section scrolling</li>
            <li>🧭 Navbar updates on scroll</li>
            <li>🧱 Bootstrap-powered design</li>
            <li>⚛️ Fully responsive layout</li>
          </ul>
        </section>

        <section
          id="section4"
          className="vh-100 d-flex flex-column justify-content-center align-items-center bg-white"
        >
          <h2 className="fw-bold">Contact Us</h2>
          <p className="text-center text-muted w-75">
            Have questions or want to collaborate? Drop us a message at{' '}
            <a href="mailto:info@myapp.com">info@myapp.com</a>.
          </p>
        </section>
      </div>
    </>
  );
};

export default HomePage;
