import { useContext, useEffect, useState } from 'react'
import { AdminContext } from '../../context/AdminContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const OwnerDashboard = () => {
    const { backendUrl, adminData } = useContext(AdminContext)
    const [turfs, setTurfs] = useState([])
    const [stats, setStats] = useState({
        totalTurfs: 0,
        totalMatches: 0,
        averageRating: 0,
        totalEarnings: 0
    })
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        fetchTurfStats()
    }, [])

    const fetchTurfStats = async () => {
        try {
            setLoading(true)
            const response = await axios.post(
                `${backendUrl}/api/owner/get-turfs`,
                { ownerId: adminData?._id },
                { headers: { Authorization: `Bearer ${localStorage.getItem('aToken')}` } }
            )

            if (response.data.success) {
                const ownerTurfs = response.data.turfs
                setTurfs(ownerTurfs)

                // Calculate stats
                const totalTurfs = ownerTurfs.length
                const averageRating = ownerTurfs.length > 0
                    ? (ownerTurfs.reduce((sum, t) => sum + (t.rating || 0), 0) / ownerTurfs.length).toFixed(2)
                    : 0
                const totalMatches = ownerTurfs.reduce((sum, t) => sum + (t.matches?.length || 0), 0)

                setStats({
                    totalTurfs,
                    totalMatches,
                    averageRating,
                    totalEarnings: 0 // TODO: calculate from match bookings
                })
            }
        } catch (error) {
            console.error('Error fetching stats:', error)
            toast.error('Failed to load dashboard data')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='p-6 bg-gray-50 min-h-screen'>
            <div className='max-w-6xl mx-auto'>
                {/* Header Welcome */}
                <div className='mb-8'>
                    <h1 className='text-4xl font-semibold text-gray-900'>Welcome, {adminData?.name}!</h1>
                    <p className='text-gray-600 mt-2'>Manage your turfs and track your business performance</p>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className='text-center py-12'>
                        <div className='inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
                        <p className='text-gray-600 mt-2'>Loading your data...</p>
                    </div>
                )}

                {/* Stats Cards */}
                {!loading && (
                    <>
                        <div className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-8'>
                            {/* Total Turfs Card */}
                            <div className='bg-white rounded-lg shadow p-6 border-l-4 border-blue-600'>
                                <div className='flex items-center justify-between'>
                                    <div>
                                        <p className='text-gray-600 text-sm font-medium'>Total Turfs</p>
                                        <p className='text-4xl font-semibold text-gray-900 mt-2'>{stats.totalTurfs}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Average Rating Card */}
                            <div className='bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500'>
                                <div className='flex items-center justify-between'>
                                    <div>
                                        <p className='text-gray-600 text-sm font-medium'>Average Rating</p>
                                        <p className='text-4xl font-semibold text-gray-900 mt-2'>{stats.averageRating}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Total Matches Card */}
                            <div className='bg-white rounded-lg shadow p-6 border-l-4 border-green-600'>
                                <div className='flex items-center justify-between'>
                                    <div>
                                        <p className='text-gray-600 text-sm font-medium'>Total Matches</p>
                                        <p className='text-4xl font-semibold text-gray-900 mt-2'>{stats.totalMatches}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Total Earnings Card */}
                            <div className='bg-white rounded-lg shadow p-6 border-l-4 border-purple-600'>
                                <div className='flex items-center justify-between'>
                                    <div>
                                        <p className='text-gray-600 text-sm font-medium'>Total Earnings</p>
                                        <p className='text-4xl font-semibold text-gray-900 mt-2'>₹{stats.totalEarnings}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Turfs */}
                        <div className='bg-white rounded-lg shadow-lg'>
                            <div className='p-6 border-b'>
                                <h2 className='text-2xl font-semibold text-gray-900'>Your Turfs</h2>
                                <p className='text-gray-600 mt-1'>Manage and monitor all your sports turfs</p>
                            </div>

                            {turfs.length === 0 ? (
                                <div className='p-12 text-center'>
                                    <h3 className='text-lg font-semibold text-gray-900 mb-2'>No Turfs Yet</h3>
                                    <p className='text-gray-600 mb-6'>Create your first turf to get started managing your business</p>
                                    <a
                                        href='/owner/turfs'
                                        className='inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition'
                                    >
                                        Create Your First Turf
                                    </a>
                                </div>
                            ) : (
                                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6'>
                                    {turfs.slice(0, 6).map(turf => (
                                        <div key={turf._id} className='border rounded-lg overflow-hidden hover:shadow-lg transition'>
                                            <div className='bg-gradient-to-r from-blue-600 to-blue-700 p-4 text-white'>
                                                <h3 className='font-bold text-lg'>{turf.name}</h3>
                                                <p className='text-blue-100 text-sm'>{turf.city}</p>
                                            </div>
                                            <div className='p-4 space-y-3'>
                                                <div className='flex justify-between items-center'>
                                                    <span className='text-gray-600'>Capacity</span>
                                                    <span className='font-semibold'>{turf.capacity} Players</span>
                                                </div>
                                                <div className='flex justify-between items-center'>
                                                    <span className='text-gray-600'>Price/Hour</span>
                                                    <span className='font-semibold'>₹{turf.basePrice}</span>
                                                </div>
                                                <div className='flex justify-between items-center'>
                                                    <span className='text-gray-600'>Rating</span>
                                                    <span className='font-semibold'>{turf.rating || 'N/A'}</span>
                                                </div>
                                                <div className='flex justify-between items-center'>
                                                    <span className='text-gray-600'>Surface</span>
                                                    <span className='font-semibold capitalize'>{turf.surface}</span>
                                                </div>
                                            </div>
                                            <div className='bg-gray-50 px-4 py-3 border-t'>
                                                <a
                                                    href={`/owner/turfs?edit=${turf._id}`}
                                                    className='text-blue-600 hover:text-blue-700 font-medium text-sm'
                                                >
                                                    Manage →
                                                </a>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {turfs.length > 6 && (
                                <div className='p-6 border-t text-center'>
                                    <a
                                        href='/owner/turfs'
                                        className='text-blue-600 hover:text-blue-700 font-medium'
                                    >
                                        View All Turfs ({turfs.length})
                                    </a>
                                </div>
                            )}
                        </div>

                        {/* Quick Actions */}
                        <div className='mt-8 grid grid-cols-1 md:grid-cols-3 gap-4'>
                            <a
                                href='/owner/turfs'
                                className='bg-blue-600 text-white p-6 rounded-lg hover:bg-blue-700 transition text-center'
                            >
                                <p className='font-semibold'>Manage Turfs</p>
                                <p className='text-sm text-blue-100 mt-1'>Add, edit or delete turfs</p>
                            </a>

                            <a
                                href='/owner/turfs'
                                className='bg-green-600 text-white p-6 rounded-lg hover:bg-green-700 transition text-center'
                            >
                                <p className='font-semibold'>Add New Turf</p>
                                <p className='text-sm text-green-100 mt-1'>Create a new sports turf</p>
                            </a>

                            <a
                                href='#'
                                className='bg-orange-600 text-white p-6 rounded-lg hover:bg-orange-700 transition text-center'
                            >
                                <p className='font-semibold'>View Analytics</p>
                                <p className='text-sm text-orange-100 mt-1'>Coming Soon</p>
                            </a>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default OwnerDashboard
