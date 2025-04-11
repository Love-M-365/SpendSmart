import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
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

      </Routes>
     
    </Router>
  )
}

export default App
