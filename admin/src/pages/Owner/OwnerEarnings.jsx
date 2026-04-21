import { useState, useEffect, useContext } from 'react'
import { AdminContext } from '../../context/AdminContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const OwnerEarnings = () => {
    const { backendUrl, adminData } = useContext(AdminContext)
    const [turfs, setTurfs] = useState([])
    const [allMatches, setAllMatches] = useState([])
    const [loading, setLoading] = useState(false)
    const [earnings, setEarnings] = useState({
        totalEarnings: 0,
        totalMatches: 0,
        averageRevenuePerMatch: 0,
        topTurf: null
    })

    useEffect(() => {
        fetchEarningsData()
    }, [adminData?._id])

    const fetchEarningsData = async () => {
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

                    // Calculate earnings
                    calculateEarnings(ownerMatches, turfsRes.data.turfs)
                }
            }
        } catch (error) {
            console.error('Error fetching earnings data:', error)
            toast.error('Failed to load earnings data')
        } finally {
            setLoading(false)
        }
    }

    const calculateEarnings = (matches, turfs) => {
        let totalEarnings = 0
        const earningsByTurf = {}
        let processedMatches = 0

        // Only count matches where revenue has been processed
        matches.forEach(match => {
            if (match.revenueProcessed && match.ownerEarning) {
                totalEarnings += match.ownerEarning
                processedMatches += 1

                // Track earnings by turf
                if (!earningsByTurf[match.turfId]) {
                    earningsByTurf[match.turfId] = 0
                }
                earningsByTurf[match.turfId] += match.ownerEarning
            }
        })

        // Find top turf
        let topTurfId = null
        let maxEarnings = 0
        Object.entries(earningsByTurf).forEach(([turfId, amount]) => {
            if (amount > maxEarnings) {
                maxEarnings = amount
                topTurfId = turfId
            }
        })

        const topTurf = turfs.find(t => t._id === topTurfId)

        setEarnings({
            totalEarnings,
            totalMatches: processedMatches,
            averageRevenuePerMatch: processedMatches > 0 ? Math.round(totalEarnings / processedMatches) : 0,
            topTurf,
            earningsByTurf
        })
    }

    return (
        <div className='p-6 bg-gray-50 min-h-screen'>
            <div className='max-w-6xl mx-auto'>
                {/* Header */}
                <div className='mb-8'>
                    <h1 className='text-3xl font-semibold text-gray-900'>Your Earnings</h1>
                    <p className='text-gray-600 mt-1'>Track your revenue from matches booked on your turfs</p>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className='text-center py-12'>
                        <div className='inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
                        <p className='text-gray-600 mt-2'>Loading earnings data...</p>
                    </div>
                )}

                {!loading && (
                    <>
                        {/* Stats Cards */}
                        <div className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-8'>
                            {/* Total Earnings */}
                            <div className='bg-white rounded-lg shadow p-6 border-l-4 border-green-600'>
                                <div className='flex items-center justify-between'>
                                    <div>
                                        <p className='text-gray-600 text-sm font-medium'>Total Earnings</p>
                                        <p className='text-3xl font-semibold text-gray-900 mt-2'>₹{earnings.totalEarnings}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Total Matches */}
                            <div className='bg-white rounded-lg shadow p-6 border-l-4 border-blue-600'>
                                <div className='flex items-center justify-between'>
                                    <div>
                                        <p className='text-gray-600 text-sm font-medium'>Total Matches</p>
                                        <p className='text-3xl font-semibold text-gray-900 mt-2'>{earnings.totalMatches}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Average Per Match */}
                            <div className='bg-white rounded-lg shadow p-6 border-l-4 border-purple-600'>
                                <div className='flex items-center justify-between'>
                                    <div>
                                        <p className='text-gray-600 text-sm font-medium'>Avg/Match</p>
                                        <p className='text-3xl font-semibold text-gray-900 mt-2'>₹{earnings.averageRevenuePerMatch}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Top Turf */}
                            <div className='bg-white rounded-lg shadow p-6 border-l-4 border-orange-600'>
                                <div className='flex items-center justify-between'>
                                    <div>
                                        <p className='text-gray-600 text-sm font-medium'>Top Earning Turf</p>
                                        <p className='text-lg font-semibold text-gray-900 mt-2'>{earnings.topTurf?.name || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Earnings by Turf Table */}
                        <div className='bg-white rounded-lg shadow-lg overflow-hidden'>
                            <div className='p-6 border-b'>
                                <h2 className='text-2xl font-semibold text-gray-900'>Earnings by Turf</h2>
                            </div>

                            {turfs.length === 0 ? (
                                <div className='p-12 text-center'>
                                    <p className='text-gray-600'>No turfs created yet</p>
                                </div>
                            ) : (
                                <div className='overflow-x-auto'>
                                    <table className='w-full'>
                                        <thead className='bg-gray-50 border-b'>
                                            <tr>
                                                <th className='px-6 py-3 text-left text-sm font-semibold text-gray-900'>Turf Name</th>
                                                <th className='px-6 py-3 text-left text-sm font-semibold text-gray-900'>Location</th>
                                                <th className='px-6 py-3 text-left text-sm font-semibold text-gray-900'>Matches</th>
                                                <th className='px-6 py-3 text-left text-sm font-semibold text-gray-900'>Earnings</th>
                                                <th className='px-6 py-3 text-left text-sm font-semibold text-gray-900'>Rating</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {turfs.map((turf, idx) => {
                                                const turfMatches = allMatches.filter(m => m.turfId === turf._id)
                                                const turfEarnings = earnings.earningsByTurf?.[turf._id] || 0
                                                return (
                                                    <tr key={turf._id} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                                        <td className='px-6 py-4 text-sm font-semibold text-gray-900'>{turf.name}</td>
                                                        <td className='px-6 py-4 text-sm text-gray-600'>{turf.city}</td>
                                                        <td className='px-6 py-4 text-sm text-gray-900 font-semibold'>{turfMatches.length}</td>
                                                        <td className='px-6 py-4 text-sm text-green-600 font-bold'>₹{turfEarnings}</td>
                                                        <td className='px-6 py-4 text-sm'>
                                                            <span className='bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold'>
                                                                {turf.rating || 'N/A'}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>

                        {/* Empty State */}
                        {earnings.totalMatches === 0 && turfs.length > 0 && (
                            <div className='mt-8 bg-white rounded-lg shadow p-12 text-center'>
                                <h3 className='text-lg font-semibold text-gray-900 mb-2'>No Earnings Yet</h3>
                                <p className='text-gray-600'>Once players book matches on your turfs, earnings will appear here</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}

export default OwnerEarnings
