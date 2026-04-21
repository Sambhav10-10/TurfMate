import { useState, useEffect, useContext } from 'react'
import { AdminContext } from '../../context/AdminContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const VerifyTurfs = () => {
    const { backendUrl, aToken } = useContext(AdminContext)
    const [pendingTurfs, setPendingTurfs] = useState([])
    const [verifiedTurfs, setVerifiedTurfs] = useState([])
    const [loading, setLoading] = useState(false)
    const [selectedTurf, setSelectedTurf] = useState(null)
    const [registrationFee, setRegistrationFee] = useState(5000)
    const [verifyingTurf, setVerifyingTurf] = useState(null)
    const [filter, setFilter] = useState('pending') // 'pending' or 'verified'

    useEffect(() => {
        fetchTurfs()
    }, [])

    const fetchTurfs = async () => {
        try {
            setLoading(true)
            const response = await axios.get(
                `${backendUrl}/api/admin/turfs/all`,
                { headers: { aToken } }
            )

            if (response.data.success) {
                const turfs = response.data.turfs || []
                const pending = turfs.filter(t => !t.verified)
                const verified = turfs.filter(t => t.verified)

                setPendingTurfs(pending)
                setVerifiedTurfs(verified)
            }
        } catch (error) {
            console.error('Error fetching turfs:', error)
            // toast.error('Failed to fetch turfs')
        } finally {
            setLoading(false)
        }
    }

    const handleVerify = async (turfId) => {
        if (!registrationFee || registrationFee <= 0) {
            toast.error('Please enter a valid registration fee')
            return
        }

        try {
            setVerifyingTurf(turfId)
            const response = await axios.post(
                `${backendUrl}/api/admin/verify-turf`,
                { turfId, registrationFee: parseFloat(registrationFee) },
                { headers: { aToken } }
            )

            if (response.data.success) {
                toast.success(`Turf verified! Registration fee collected: ₹${registrationFee}`)
                setSelectedTurf(null)
                setRegistrationFee(5000)
                fetchTurfs()
            } else {
                toast.error(response.data.message || 'Failed to verify turf')
            }
        } catch (error) {
            console.error('Error verifying turf:', error)
            toast.error(error.response?.data?.message || 'Failed to verify turf')
        } finally {
            setVerifyingTurf(null)
        }
    }

    const handleReject = async (turfId) => {
        if (!window.confirm('Are you sure you want to reject this turf?')) return

        try {
            const response = await axios.post(
                `${backendUrl}/api/admin/reject-turf`,
                { turfId },
                { headers: { aToken } }
            )

            if (response.data.success) {
                toast.success('Turf rejected')
                fetchTurfs()
            } else {
                toast.error('Failed to reject turf')
            }
        } catch (error) {
            console.error('Error rejecting turf:', error)
            toast.error('Failed to reject turf')
        }
    }

    const displayTurfs = filter === 'pending' ? pendingTurfs : verifiedTurfs

    return (
        <div className='p-6 bg-gray-50 min-h-screen'>
            <div className='max-w-7xl mx-auto'>
                {/* Header */}
                <div className='mb-8'>
                    <h1 className='text-3xl font-semibold text-gray-900'>Turf Verification</h1>
                    <p className='text-gray-600 mt-1'>Verify and approve turfs from owners. Collect registration fees.</p>
                </div>

                {/* Filter Tabs */}
                <div className='flex gap-4 mb-6'>
                    <button
                        onClick={() => setFilter('pending')}
                        className={`px-6 py-2 rounded-lg font-semibold transition ${filter === 'pending'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                            }`}
                    >
                        Pending ({pendingTurfs.length})
                    </button>
                    <button
                        onClick={() => setFilter('verified')}
                        className={`px-6 py-2 rounded-lg font-semibold transition ${filter === 'verified'
                            ? 'bg-green-600 text-white'
                            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                            }`}
                    >
                        ✓ Verified ({verifiedTurfs.length})
                    </button>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className='text-center py-12'>
                        <div className='inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
                        <p className='text-gray-600 mt-2'>Loading turfs...</p>
                    </div>
                )}

                {/* Empty State */}
                {!loading && displayTurfs.length === 0 && (
                    <div className='bg-white rounded-lg shadow p-12 text-center'>
                        <div className='w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-50 rounded-lg flex items-center justify-center mb-4'>
                            <span className='text-2xl font-bold text-orange-600'>{filter === 'pending' ? 'P' : 'A'}</span>
                        </div>
                        <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                            {filter === 'pending' ? 'No Pending Turfs' : 'No Verified Turfs'}
                        </h3>
                        <p className='text-gray-600'>
                            {filter === 'pending'
                                ? 'All turfs have been verified or there are no turfs pending verification.'
                                : 'No turfs have been verified yet.'}
                        </p>
                    </div>
                )}

                {/* Turfs Grid */}
                {!loading && displayTurfs.length > 0 && (
                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                        {displayTurfs.map(turf => (
                            <div
                                key={turf._id}
                                className='bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition'
                            >
                                {/* Card Header */}
                                <div className={`p-4 text-white ${filter === 'pending'
                                    ? 'bg-gradient-to-r from-orange-500 to-orange-600'
                                    : 'bg-gradient-to-r from-green-600 to-green-700'
                                    }`}>
                                    <h3 className='text-xl font-bold'>{turf.name}</h3>
                                    <p className={`text-sm mt-1 ${filter === 'pending' ? 'text-orange-100' : 'text-green-100'
                                        }`}>
                                        {turf.city}
                                    </p>
                                </div>

                                {/* Card Content */}
                                <div className='p-4 space-y-3'>
                                    {/* Owner Info */}
                                    <div className='bg-gray-50 rounded-lg p-3'>
                                        <p className='text-sm text-gray-600 font-medium'>👤 Owner</p>
                                        <p className='text-gray-900 font-semibold mt-1'>{turf.ownerName || 'Unknown'}</p>
                                        <p className='text-xs text-gray-600'>{turf.ownerEmail}</p>
                                    </div>

                                    {/* Turf Details Grid */}
                                    <div className='grid grid-cols-2 gap-3 text-sm'>
                                        <div className='bg-blue-50 p-2 rounded'>
                                            <p className='text-gray-600'>Capacity</p>
                                            <p className='font-semibold text-gray-900'>{turf.capacity} Players</p>
                                        </div>
                                        <div className='bg-blue-50 p-2 rounded'>
                                            <p className='text-gray-600'>Price/Hour</p>
                                            <p className='font-semibold text-gray-900'>₹{turf.basePrice}</p>
                                        </div>
                                        <div className='bg-blue-50 p-2 rounded'>
                                            <p className='text-gray-600'>Surface</p>
                                            <p className='font-semibold text-gray-900 capitalize'>{turf.surface}</p>
                                        </div>
                                        <div className='bg-blue-50 p-2 rounded'>
                                            <p className='text-gray-600'>Location</p>
                                            <p className='font-semibold text-gray-900 text-xs'>{turf.location}</p>
                                        </div>
                                    </div>

                                    {/* Facilities */}
                                    {turf.facilities && turf.facilities.length > 0 && (
                                        <div>
                                            <p className='text-sm font-medium text-gray-700 mb-2'>Facilities:</p>
                                            <div className='flex flex-wrap gap-1'>
                                                {turf.facilities.map(facility => (
                                                    <span
                                                        key={facility}
                                                        className='text-xs bg-green-100 text-green-800 px-2 py-1 rounded'
                                                    >
                                                        {facility}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Verification Status */}
                                    <div className={`rounded-lg p-3 text-center ${filter === 'pending'
                                        ? 'bg-orange-50 border border-orange-200'
                                        : 'bg-green-50 border border-green-200'
                                        }`}>
                                        {filter === 'pending' ? (
                                            <p className='text-orange-700 font-semibold'>Pending Verification</p>
                                        ) : (
                                            <div>
                                                <p className='text-green-700 font-semibold'>✓ Verified</p>
                                                {turf.registrationFee && (
                                                    <p className='text-xs text-green-600 mt-1'>
                                                        Registration Fee: ₹{turf.registrationFee}
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                {filter === 'pending' && (
                                    <div className='bg-gray-50 px-4 py-3 border-t flex gap-2'>
                                        <button
                                            onClick={() => setSelectedTurf(turf)}
                                            className='flex-1 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition font-medium text-sm'
                                        >
                                            ✓ Verify
                                        </button>
                                        <button
                                            onClick={() => handleReject(turf._id)}
                                            className='flex-1 bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition font-medium text-sm'
                                        >
                                            ✕ Reject
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Verification Modal */}
                {selectedTurf && (
                    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
                        <div className='bg-white rounded-xl shadow-2xl max-w-md w-full'>
                            <div className='bg-gradient-to-r from-green-600 to-green-700 text-white p-6'>
                                <h2 className='text-2xl font-bold'>Verify Turf</h2>
                                <p className='text-green-100 mt-1'>{selectedTurf.name}</p>
                            </div>

                            <div className='p-6 space-y-4'>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                                        Registration Fee (₹) *
                                    </label>
                                    <input
                                        type='number'
                                        value={registrationFee}
                                        onChange={(e) => setRegistrationFee(e.target.value)}
                                        className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent'
                                        min='0'
                                        step='100'
                                    />
                                    <p className='text-xs text-gray-600 mt-1'>
                                        This fee will be charged to the owner for turf verification
                                    </p>
                                </div>

                                {/* Turf Summary */}
                                <div className='bg-gray-50 rounded-lg p-3 space-y-2 text-sm'>
                                    <div className='flex justify-between'>
                                        <span className='text-gray-600'>Turf Name</span>
                                        <span className='font-semibold'>{selectedTurf.name}</span>
                                    </div>
                                    <div className='flex justify-between'>
                                        <span className='text-gray-600'>Owner</span>
                                        <span className='font-semibold'>{selectedTurf.ownerName}</span>
                                    </div>
                                    <div className='flex justify-between'>
                                        <span className='text-gray-600'>City</span>
                                        <span className='font-semibold'>{selectedTurf.city}</span>
                                    </div>
                                    <div className='border-t pt-2 mt-2 flex justify-between font-bold'>
                                        <span>Admin Earning</span>
                                        <span className='text-green-600'>₹{registrationFee}</span>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className='flex gap-3'>
                                    <button
                                        onClick={() => handleVerify(selectedTurf._id)}
                                        disabled={verifyingTurf === selectedTurf._id}
                                        className='flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition font-semibold disabled:opacity-50'
                                    >
                                        {verifyingTurf === selectedTurf._id ? 'Verifying...' : '✓ Verify & Approve'}
                                    </button>
                                    <button
                                        onClick={() => setSelectedTurf(null)}
                                        className='flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition font-semibold'
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default VerifyTurfs
