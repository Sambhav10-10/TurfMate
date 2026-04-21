import React, { useContext } from 'react'
import { AdminContext } from './context/AdminContext';
import { Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Admin Components
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Admin/Dashboard';
import AllMatches from './pages/Admin/AllMatches';
import Payments from './pages/Admin/Payments';
import VerifyTurfs from './pages/Admin/VerifyTurfs';
import AdminWallet from './pages/Admin/AdminWallet';
import ProcessRevenue from './pages/Admin/ProcessRevenue';

// Owner Components
import OwnerNavbar from './components/OwnerNavbar'
import OwnerSidebar from './components/OwnerSidebar'
import OwnerDashboard from './pages/Owner/OwnerDashboard';
import OwnerMatches from './pages/Owner/OwnerMatches';
import OwnerEarnings from './pages/Owner/OwnerEarnings';
import OwnerProfile from './pages/Owner/OwnerProfile';
import TurfManagement from './pages/Owner/TurfManagement';

import Login from './pages/Login';

const App = () => {

  const { aToken, userRole } = useContext(AdminContext)

  // Owner Layout
  if (aToken && userRole === 'owner') {
    return (
      <div className='bg-[#F8F9FD]'>
        <ToastContainer />
        <OwnerNavbar />
        <div className='flex items-start'>
          <OwnerSidebar />
          <Routes>
            <Route path='/owner' element={<OwnerDashboard />} />
            <Route path='/owner/turfs' element={<TurfManagement />} />
            <Route path='/owner/matches' element={<OwnerMatches />} />
            <Route path='/owner/earnings' element={<OwnerEarnings />} />
            <Route path='/owner/profile' element={<OwnerProfile />} />
          </Routes>
        </div>
      </div>
    )
  }

  // Admin Layout
  if (aToken && userRole === 'admin') {
    return (
      <div className='bg-[#F8F9FD]'>
        <ToastContainer />
        <Navbar />
        <div className='flex items-start'>
          <Sidebar />
          <Routes>
            <Route path='/' element={<></>} />
            <Route path='/admin-dashboard' element={<Dashboard />} />
            <Route path='/matches' element={<AllMatches />} />
            <Route path='/payments' element={<Payments />} />
            <Route path='/verify-turfs' element={<VerifyTurfs />} />
            <Route path='/wallet' element={<AdminWallet />} />
            <Route path='/process-revenue' element={<ProcessRevenue />} />
          </Routes>
        </div>
      </div>
    )
  }

  // Login Page (No token)
  return (
    <>
      <ToastContainer />
      <Login />
    </>
  )
}

export default App