import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { useEffect } from 'react';
import logo from '../assets/spend-nobg.png'
import bg from '../assets/bg.jpg'
import about from '../assets/istockphoto-1342226806-612x612.jpg'
import bills from '../assets/bills.jpg'
import {Link} from 'react-router-dom'
import ai from '../assets/aic.jpeg'
import piechrt from '../assets/piechart.jpeg'
import billsplit from '../assets/billsplit.jpeg'
const HomePage = () => {
  useEffect(() => {
    // ScrollSpy will auto-activate with the correct HTML attributes, no manual init needed
  }, []);

  return (
    <>
      <nav
        id="navbar-example"
        className="navbar navbar-expand-lg custom-navbar sticky-top" 
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
              <a className="nav-link text-white active" href="#section1">
                Home
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-white" href="#section2">
                About
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-white" href="#section3">
                Features
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-white" href="#section4">
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
          style={{backgroundImage: `url(${bg})`,backgroundPosition:"center",backgroundSize:"cover",color:"white",borderRadius:"1rem", margin:"1rem",padding:"2rem"}}
        >
          <h2 className="display-4 fw-bol" style={{color:"black",marginRight:"40rem"}}>Welcome to </h2><h1 style={{fontFamily:"Gravitas One",fontSize:"4rem",color:"green",marginLeft:"9rem"}}>SpendSmart</h1>
          <p className="lead  w-75" style={{fontFamily:"Montserrat",marginLeft:"20rem"}}>
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
        <img src={bills} className="me-3" alt="Feature 1" style={{ height: '5rem',width:"5rem" }} />
        <div>
          <h5 className="fw-bold">Just scan, and we’ll handle the rest.</h5>
          <p className="text-muted mb-0">No more manual entries! With Spend Smart’s Bill Scan & Track feature, simply upload or snap a photo of your bills and receipts — our smart scanner will automatically extract the important details like amount, category, and date, and instantly add it to your expense list.</p>
        </div>
      </div>
      <div className="col-md-6 d-flex mb-4">
        <img src={billsplit} className="me-3" alt="Feature 2" style={{ height: '5rem',width:"5rem" }} />
        <div>
          <h5 className="fw-bold">Effortless Bill Splitting</h5>
          <p className="text-muted mb-0">Streamline the process of dividing expenses among friends. Simply input your bills, and the system automatically calculates and distributes the amounts to each individual, eliminating manual calculations and ensuring accuracy.</p>
        </div>
      </div>
      <div className="col-md-6 d-flex mb-4">
        <img src={ai} className="me-3" alt="Feature 3" style={{ height: '5rem',width:"5rem" }} />
        <div>
          <h5 className="fw-bold">AI-Powered Categorization</h5>
          <p className="text-muted mb-0">Automatically organize scanned bill items into clear categories. This intelligent segregation provides detailed insights into spending patterns, empowering users with a comprehensive overview of their financial allocations.</p>
        </div>
      </div>
      <div className="col-md-6 d-flex mb-4">
        <img src={piechrt} className="me-3" alt="Feature 4" style={{ height: '5rem',width:"5rem" }} />
        <div>
          <h5 className="fw-bold">Interactive Pie Chart Visualization</h5>
          <p className="text-muted mb-0">Gain a clear, visual representation of monthly expenses through an intuitive pie chart. This feature helps users track spending across categories, identify areas for optimization, and make informed financial decisions</p>
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
          
        </section>
      </div>
    </>
  );
};

export default HomePage;
