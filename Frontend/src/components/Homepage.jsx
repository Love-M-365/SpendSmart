import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { useEffect } from 'react';
import logo from '../assets/spend-nobg.png'
import bg from '../assets/spendsmart.png'
import about from '../assets/istockphoto-1342226806-612x612.jpg'
import bills from '../assets/bills.jpg'
import {Link} from 'react-router-dom'
const HomePage = () => {
  useEffect(() => {
    // ScrollSpy will auto-activate with the correct HTML attributes, no manual init needed
  }, []);

  return (
    <>
      
      <nav
        id="navbar-example"
        className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top shadow-sm px-4"
      >
        <a className="navbar-brand fw-bold" href="#">
        <img src={logo} style={{height:"3rem", width:"3rem"}} alt="logo" />
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
        <div className="ms-auto p-2">
        <button type="button" className="btn btn-dark m-2"><Link to="/register" style={{textDecoration:"none", color:"white"}}>Register</Link></button>
        <button type="button" className="btn btn-light">
          <Link to="/login" style={{textDecoration:"none", color:"black"}}>Login &rarr;</Link>
        </button>
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
          className="vh-100 d-flex flex-column   border-bottom "
          style={{backgroundImage: `url(${bg})`,backgroundPosition:"center",backgroundSize:"cover",color:"white",marginTop:"3rem",borderRadius:"1rem"}}
        >
          <h2 className="display-4 fw-bold m-3">Welcome to </h2><h1 style={{fontFamily:"Bungee spice",fontSize:"4rem"}}>SpendSmart</h1>
          <p className="lead  w-75" style={{fontFamily:"Montserrat",marginLeft:"10rem"}}>
            The Financial Wingman</p>
          
            <img className="m-3"src={logo}style={{height:"15rem",width:"15rem"}}></img>
          
        </section>

        <section
  id="section2"
  className="vh-100 d-flex align-items-center bg-white border-bottom px-5"
>
  <div className="container">
    <div className="row align-items-center">
      <div className="col-md-6">
        <h2 className="fw-bold mb-4">About Us</h2>
        <p className="text-muted" style={{fontSize:"1.5rem"}}>
          <strong>Your all-in-one expense tracker powered by smart insights.</strong><br /><br />
          Spend Smart helps you take full control of your finances — whether you're a student, a working professional, or managing a household.
          Track your daily expenses, analyze spending habits, and get personalized savings suggestions powered by AI.<br /><br />
          <strong>Simple. Smart. Stress-free money management.</strong>
        </p>
      </div>
      <div className="col-md-6 text-center">
        <img src={about} alt="About SpendSmart" className="img-fluid" style={{ maxHeight: '300px' }} />
      </div>
    </div>
  </div>
</section>

<section
  id="section3"
  className="py-5 bg-light border-bottom"
>
  <div className="container">
    <h2 className="fw-bold text-center mb-5">Features</h2>
    <div className="row">
      <div className="col-md-6 d-flex mb-4">
        <img src={bills} className="me-3" alt="Feature 1" style={{ height: '5rem' }} />
        <div>
          <h5 className="fw-bold">Just scan, and we’ll handle the rest.</h5>
          <p className="text-muted mb-0">No more manual entries! With Spend Smart’s Bill Scan & Track feature, simply upload or snap a photo of your bills and receipts — our smart scanner will automatically extract the important details like amount, category, and date, and instantly add it to your expense list.</p>
        </div>
      </div>
      <div className="col-md-6 d-flex mb-4">
        <img src={logo} className="me-3" alt="Feature 2" style={{ height: '60px' }} />
        <div>
          <h5 className="fw-bold">Navbar Updates on Scroll</h5>
          <p className="text-muted mb-0">Dynamic navbar highlights the current section in view.</p>
        </div>
      </div>
      <div className="col-md-6 d-flex mb-4">
        <img src={logo} className="me-3" alt="Feature 3" style={{ height: '60px' }} />
        <div>
          <h5 className="fw-bold">Bootstrap-Powered Design</h5>
          <p className="text-muted mb-0">Clean, responsive layout using Bootstrap's components and grid.</p>
        </div>
      </div>
      <div className="col-md-6 d-flex mb-4">
        <img src={logo} className="me-3" alt="Feature 4" style={{ height: '60px' }} />
        <div>
          <h5 className="fw-bold">Fully Responsive Layout</h5>
          <p className="text-muted mb-0">Optimized for all screen sizes — mobile, tablet, and desktop.</p>
        </div>
      </div>
    </div>
  </div>
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
