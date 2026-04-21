import { useState, useEffect, useContext } from 'react'
import { AdminContext } from '../../context/AdminContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const OwnerMatches = () => {
    const { backendUrl, adminData } = useContext(AdminContext)
    const [turfs, setTurfs] = useState([])
    const [allMatches, setAllMatches] = useState([])
    const [loading, setLoading] = useState(false)
    const [filterTurf, setFilterTurf] = useState('all')
    const [filterStatus, setFilterStatus] = useState('all')

    useEffect(() => {
        fetchOwnerData()
    }, [adminData?._id])

    const fetchOwnerData = async () => {
        try {
            setLoading(true)

            // Fetch owner's turfs
            const turfsRes = await axios.post(
                `${backendUrl}/api/owner/get-turfs`,
                { ownerId: adminData?._id },
                { headers: { Authorization: `Bearer ${localStorage.getItem('aToken')}` } }
            )

            if (turfsRes.data.success) {
                setTurfs(turfsRes.data.turfs)

                // Fetch all matches and filter by this owner's turfs
                const matchesRes = await axios.get(
                    `${backendUrl}/api/admin/matches`,
                    { headers: { aToken: localStorage.getItem('aToken') } }
                )

                if (matchesRes.data.success) {
                    const turfIds = turfsRes.data.turfs.map(t => t._id)
                    const ownerMatches = matchesRes.data.matches.filter(m => turfIds.includes(m.turfId))
                    setAllMatches(ownerMatches)
                }
            }
        } catch (error) {
            console.error('Error fetching data:', error)
            toast.error('Failed to load matches')
        } finally {
            setLoading(false)
        }
    }

    // Filter matches
    let filteredMatches = allMatches

    if (filterTurf !== 'all') {
        filteredMatches = filteredMatches.filter(m => m.turfId === filterTurf)
    }

    if (filterStatus !== 'all') {
        if (filterStatus === 'upcoming') {
            filteredMatches = filteredMatches.filter(m => !m.isCancelled && !m.isFull)
        } else if (filterStatus === 'full') {
            filteredMatches = filteredMatches.filter(m => m.isFull)
        } else if (filterStatus === 'cancelled') {
            filteredMatches = filteredMatches.filter(m => m.isCancelled)
        }
    }

    return (
        <div className='p-6 bg-gray-50 min-h-screen'>
            <div className='max-w-6xl mx-auto'>
                {/* Header */}
                <div className='mb-8'>
                    <h1 className='text-3xl font-semibold text-gray-900'>Matches on Your Turfs</h1>
                    <p className='text-gray-600 mt-1'>View all matches booked at your turfs</p>
                </div>

                {/* Filters */}
                {!loading && (
                    <div className='bg-white rounded-lg shadow p-4 mb-6 flex gap-4 flex-wrap items-center'>
                        <div>
                            <label className='text-sm font-medium text-gray-700 mr-2'>Filter by Turf:</label>
                            <select
                                value={filterTurf}
                                onChange={(e) => setFilterTurf(e.target.value)}
                                className='px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600'
                            >
                                <option value='all'>All Turfs</option>
                                {turfs.map(turf => (
                                    <option key={turf._id} value={turf._id}>{turf.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className='text-sm font-medium text-gray-700 mr-2'>Status:</label>
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className='px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600'
                            >
                                <option value='all'>All Status</option>
                                <option value='upcoming'>Upcoming</option>
                                <option value='full'>Full</option>
                                <option value='cancelled'>Cancelled</option>
                            </select>
                        </div>

                        <div className='ml-auto text-sm text-gray-600'>
                            {filteredMatches.length} match{filteredMatches.length !== 1 ? 'es' : ''}
                        </div>
                    </div>
                )}

                {/* Loading State */}
                {loading && (
                    <div className='text-center py-12'>
                        <div className='inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
                        <p className='text-gray-600 mt-2'>Loading matches...</p>
                    </div>
                )}

                {/* Empty State */}
                {!loading && filteredMatches.length === 0 && (
                    <div className='bg-white rounded-lg shadow p-12 text-center'>
                        <div className='text-6xl mb-4'></div>
                        <h3 className='text-lg font-semibold text-gray-900 mb-2'>No Matches Found</h3>
                        <p className='text-gray-600'>No matches booked at your turfs yet</p>
                    </div>
                )}

                {/* Matches Grid */}
                {!loading && filteredMatches.length > 0 && (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                        {filteredMatches.map(match => {
                            const turf = turfs.find(t => t._id === match.turfId)
                            return (
                                <div key={match._id} className='bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition'>
                                    {/* Card Header */}
                                    <div className='bg-gradient-to-r from-blue-600 to-blue-700 p-4 text-white'>
                                        <h3 className='text-xl font-bold'>{match.sportType?.toUpperCase()}</h3>
                                        <p className='text-blue-100 text-sm mt-1'>{turf?.name}</p>
                                    </div>

                                    {/* Card Content */}
                                    <div className='p-4 space-y-3'>
                                        {/* Date & Time */}
                                        <div className='flex items-center gap-2'>
                                            <span className='text-gray-400'></span>
                                            <div>
                                                <p className='text-gray-600 text-sm'>Date</p>
                                                <p className='text-gray-900 font-semibold'>{match.date || 'TBD'}</p>
                                            </div>
                                        </div>

                                        {/* Players */}
                                        <div className='bg-blue-50 p-3 rounded-lg'>
                                            <p className='text-gray-600 text-sm'>Players</p>
                                            <p className='text-gray-900 font-semibold'>{match.joinedPlayers?.length || 0}/{match.totalSlots}</p>
                                        </div>

                                        {/* Price */}
                                        <div className='bg-green-50 p-3 rounded-lg'>
                                            <p className='text-gray-600 text-sm'>Price/Head</p>
                                            <p className='text-gray-900 font-semibold'>₹{match.pricePerHead}</p>
                                        </div>

                                        {/* Status */}
                                        <div className='flex gap-2'>
                                            {match.isCancelled ? (
                                                <span className='flex-1 bg-red-100 text-red-800 text-center px-3 py-2 rounded-lg text-sm font-semibold'>
                                                    Cancelled
                                                </span>
                                            ) : match.isFull ? (
                                                <span className='flex-1 bg-yellow-100 text-yellow-800 text-center px-3 py-2 rounded-lg text-sm font-semibold'>
                                                    Full
                                                </span>
                                            ) : (
                                                <span className='flex-1 bg-green-100 text-green-800 text-center px-3 py-2 rounded-lg text-sm font-semibold'>
                                                    Open
                                                </span>
                                            )}
                                        </div>

                                        {/* Skill Level */}
                                        <div className='bg-purple-50 p-3 rounded-lg'>
                                            <p className='text-gray-600 text-sm'>Skill Level</p>
                                            <p className='text-gray-900 font-semibold'>{match.skillLevel}</p>
                                        </div>
                                    </div>

                                    {/* Footer */}
                                    <div className='bg-gray-50 px-4 py-3 border-t text-center'>
                                        <p className='text-xs text-gray-600'>Created by: {match.creatorName || 'User'}</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}

export default OwnerMatches
