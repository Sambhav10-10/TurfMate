import React, { useEffect } from 'react'
import { assets } from '../../assets/assets'
import { useContext } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'

const AllMatches = () => {

  const { aToken, matches, deleteMatch, getAllMatches } = useContext(AdminContext)
  const { slotDateFormat } = useContext(AppContext)

  useEffect(() => {
    if (aToken) {
      getAllMatches()
    }
  }, [aToken])

  return (
    <div className='w-full max-w-6xl mx-auto m-5'>
      {/* Page Header */}
      <div className='flex items-center gap-3 mb-8'>
        <span className='text-4xl'>🎯</span>
        <div>
          <h1 className='text-3xl font-bold text-gray-800'>All Matches</h1>
          <p className='text-gray-600 text-sm'>Manage all matches on the platform</p>
        </div>
      </div>

      {/* Matches Table */}
      <div className='bg-white rounded-xl shadow-lg overflow-hidden'>
        <div className='bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white'>
          <p className='font-semibold text-lg text-gray-900'>Match Registry</p>
        </div>

        <div className='overflow-x-auto'>
          <table className='w-full text-sm'>
            {/* Table Header */}
            <thead>
              <tr className='bg-gray-100 border-b-2 border-gray-200'>
                <th className='px-6 py-4 text-left font-bold text-gray-700'>#</th>
                <th className='px-6 py-4 text-left font-bold text-gray-700'>⚽ Sport</th>
                <th className='px-6 py-4 text-left font-semibold text-gray-700'>Location</th>
                <th className='px-6 py-4 text-left font-bold text-gray-700'>📅 Date & Time</th>
                <th className='px-6 py-4 text-left font-bold text-gray-700'>👥 Slots</th>
                <th className='px-6 py-4 text-left font-bold text-gray-700'>⚙️ Action</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {matches.length > 0 ? (
                matches.map((item, index) => (
                  <tr
                    key={item._id}
                    className='border-b hover:bg-blue-50 transition-colors'
                  >
                    <td className='px-6 py-4 font-semibold text-gray-700'>{index + 1}</td>
                    <td className='px-6 py-4'>
                      <span className={`inline-block px-3 py-1 rounded-full font-semibold text-white ${item.sportType === 'football' ? 'bg-blue-500' : 'bg-green-500'}`}>
                        {item.sportType === 'football' ? '⚽' : '🏏'} {item.sportType}
                      </span>
                    </td>
                    <td className='px-6 py-4 text-gray-600'>{item.location}</td>
                    <td className='px-6 py-4 text-gray-600'>
                      <div>
                        <p className='font-semibold'>{slotDateFormat(item.date)}</p>
                        <p className='text-xs text-gray-500'>@ {item.time}</p>
                      </div>
                    </td>
                    <td className='px-6 py-4'>
                      <div className='flex flex-col'>
                        <p className='font-bold text-purple-600'>{item.joinedPlayers.length}/{item.totalSlots}</p>
                        <div className='w-24 bg-gray-200 rounded-full h-2 mt-1'>
                          <div
                            className='bg-purple-600 h-2 rounded-full transition-all'
                            style={{ width: `${(item.joinedPlayers.length / item.totalSlots) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className='px-6 py-4'>
                      <button
                        onClick={() => deleteMatch(item._id)}
                        className='bg-red-50 hover:bg-red-100 text-red-600 font-bold px-4 py-2 rounded-lg transition transform hover:scale-105 active:scale-95'
                        title='Delete match'
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className='px-6 py-12 text-center text-gray-500'>
                    <p className='text-lg'>😔 No matches found</p>
                    <p className='text-sm'>Matches will appear here once they are created</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        {matches.length > 0 && (
          <div className='bg-gray-50 px-6 py-4 border-t text-sm text-gray-600'>
            <p className='font-semibold text-gray-700'>Total: {matches.length} matches</p>
          </div>
        )}
      </div>

    </div>
  )
}

export default AllMatches