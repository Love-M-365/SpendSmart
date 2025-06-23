import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Includes Popper for navbar toggling

import './App.css'
import Homepage from './components/Homepage'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './components/LoginPage'
import Register from './components/RegisterPage'
import Dashboard from './components/Dashboard'
import BillScanner from './components/BillScanner'
import AddTransaction from './components/Manual'
import TransactionHistory from './components/TransactionHistory'
import BalancePage from './components/BalancePage'
import AddMoneyTransaction from './components/AddMoney'
import ConfirmTransaction from './components/Confirm'
import AllUsers from './components/Friends'
import WelcomePage from './components/Sample'
import PaymentStatus from './components/Payments'
import UnderConstruction from './components/UnderConstruction'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <Routes>
        <Route path='/' element={<Homepage></Homepage>} ></Route>
        <Route path='/login' element={<Login></Login>} ></Route>
        <Route path='/register' element={<Register></Register>} ></Route>
        <Route path='/dashboard' element={<Dashboard></Dashboard>} ></Route>
        <Route path='/scan' element={<BillScanner></BillScanner>} ></Route>
        <Route path='/manual' element={<AddTransaction></AddTransaction>} ></Route>
        <Route path='/transactions' element={<TransactionHistory></TransactionHistory>} ></Route>
        <Route path='/balance' element={<BalancePage></BalancePage>} ></Route>
        <Route path='/addmoney' element={<AddMoneyTransaction></AddMoneyTransaction>} ></Route>
        <Route path='/confirm' element={<ConfirmTransaction></ConfirmTransaction>} ></Route>
        <Route path='/sample' element={<WelcomePage></WelcomePage>} ></Route>
        <Route path='/friends' element={<AllUsers></AllUsers>} ></Route>
        <Route path='/payments' element={<PaymentStatus></PaymentStatus>} ></Route>
        <Route path="/underconstruction" element={<UnderConstruction></UnderConstruction>}></Route>
      </Routes>
     
    </Router>
  )
}

export default App
