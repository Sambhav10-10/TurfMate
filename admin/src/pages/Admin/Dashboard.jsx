import React, { useContext, useEffect } from 'react'
import { assets } from '../../assets/assets'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'

const Dashboard = () => {

  const { aToken, getDashData, dashData } = useContext(AdminContext)
  const { slotDateFormat } = useContext(AppContext)

  useEffect(() => {
    if (aToken) {
      getDashData()
    }
  }, [aToken])

  return dashData && (
    <div className='m-5'>
      {/* Page Header */}
      <div className='flex items-center gap-3 mb-8'>
        <span className='text-4xl'>📊</span>
        <div>
          <h1 className='text-3xl font-bold text-gray-800'>Dashboard</h1>
          <p className='text-gray-600 text-sm'>Overview of platform statistics and activity</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className='flex flex-wrap gap-4 mb-8'>
        <div className='flex items-center gap-4 bg-gradient-to-br from-blue-50 to-blue-100 p-6 min-w-64 rounded-xl border-2 border-blue-200 shadow-sm hover:shadow-md transition-all hover:scale-105'>
          <div className='text-5xl'>👥</div>
          <div>
            <p className='text-sm font-semibold text-gray-600'>Total Users</p>
            <p className='text-3xl font-bold text-blue-600'>{dashData.totalUsers}</p>
            <p className='text-xs text-gray-500 mt-1'>registered players</p>
          </div>
        </div>

        <div className='flex items-center gap-4 bg-gradient-to-br from-green-50 to-green-100 p-6 min-w-64 rounded-xl border-2 border-green-200 shadow-sm hover:shadow-md transition-all hover:scale-105'>
          <div className='text-5xl'>⚽</div>
          <div>
            <p className='text-sm font-semibold text-gray-600'>Total Matches</p>
            <p className='text-3xl font-bold text-green-600'>{dashData.totalMatches}</p>
            <p className='text-xs text-gray-500 mt-1'>matches created</p>
          </div>
        </div>

        <div className='flex items-center gap-4 bg-gradient-to-br from-orange-50 to-orange-100 p-6 min-w-64 rounded-xl border-2 border-orange-200 shadow-sm hover:shadow-md transition-all hover:scale-105'>
          <div className='text-5xl'>🔥</div>
          <div>
            <p className='text-sm font-semibold text-gray-600'>Full Matches</p>
            <p className='text-3xl font-bold text-orange-600'>{dashData.fullMatches}</p>
            <p className='text-xs text-gray-500 mt-1'>at capacity</p>
          </div>
        </div>
      </div>

      {/* Recent Matches Section */}
      <div className='bg-white rounded-xl shadow-lg overflow-hidden'>
        <div className='bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white flex items-center gap-3'>
          <span className='text-3xl'>📋</span>
          <div>
            <p className='text-lg font-bold'>Recent Matches</p>
            <p className='text-blue-100 text-sm'>Latest matches on the platform</p>
          </div>
        </div>

        <div className='p-6'>
          <p className='text-gray-500 text-center py-8'>
            ℹ️ No recent matches display implemented yet. Matches will appear here as they are created.
          </p>
        </div>
      </div>

    </div>
  )
}

export default Dashboard