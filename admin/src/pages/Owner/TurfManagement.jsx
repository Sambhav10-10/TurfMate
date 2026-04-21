import { useState, useEffect, useContext } from 'react'
import { AdminContext } from '../../context/AdminContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const TurfManagement = () => {
    const { backendUrl, adminData } = useContext(AdminContext)
    const [turfs, setTurfs] = useState([])
    const [loading, setLoading] = useState(false)
    const [showForm, setShowForm] = useState(false)
    const [editingTurf, setEditingTurf] = useState(null)
    const [selectedTurfDetails, setSelectedTurfDetails] = useState(null)
    const [filterCity, setFilterCity] = useState('all')
    const [sortBy, setSortBy] = useState('recent')
    const [approvingTurfId, setApprovingTurfId] = useState(null)
    const [rejectingTurfId, setRejectingTurfId] = useState(null)

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        location: '',
        city: '',
        basePrice: '',
        capacity: '',
        surface: 'artificial',
        facilities: [],
        latitude: '',
        longitude: '',
    })

    const facilities = [
        'Parking',
        'Floodlights',
        'Changing Room',
        'Drinking Water',
        'Seating Area',
        'Canteen',
        'Equipment Rental',
        'Gym',
    ]

    // Get turfs for current owner
    const fetchTurfs = async () => {
        try {
            setLoading(true)
            const response = await axios.post(
                `${backendUrl}/api/owner/get-turfs`,
                { ownerId: adminData?._id },
                { headers: { Authorization: `Bearer ${localStorage.getItem('aToken')}` } }
            )
            if (response.data.success) {
                setTurfs(response.data.turfs)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to fetch turfs')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (adminData?._id) {
            fetchTurfs()
        }
    }, [adminData?._id])

    const handleFormChange = (e) => {
        const { name, value, type, checked } = e.target

        if (name === 'facilities') {
            setFormData(prev => ({
                ...prev,
                facilities: checked
                    ? [...prev.facilities, value]
                    : prev.facilities.filter(f => f !== value)
            }))
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }))
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        // Validation
        if (!formData.name.trim() || !formData.location.trim() || !formData.city.trim()) {
            toast.error('Name, location, and city are required')
            return
        }

        if (!formData.basePrice || formData.basePrice <= 0 || !formData.capacity || formData.capacity <= 0) {
            toast.error('Price and capacity must be positive numbers')
            return
        }

        try {
            setLoading(true)
            const payload = {
                ...formData,
                basePrice: parseFloat(formData.basePrice),
                capacity: parseInt(formData.capacity),
                ownerId: adminData?._id,
            }

            let response
            if (editingTurf) {
                // Update turf
                response = await axios.post(
                    `${backendUrl}/api/owner/update-turf`,
                    { ...payload, turfId: editingTurf._id },
                    { headers: { Authorization: `Bearer ${localStorage.getItem('aToken')}` } }
                )
            } else {
                // Create new turf
                response = await axios.post(
                    `${backendUrl}/api/owner/create-turf`,
                    payload,
                    { headers: { Authorization: `Bearer ${localStorage.getItem('aToken')}` } }
                )
            }

            if (response.data.success) {
                toast.success(editingTurf ? 'Turf updated successfully' : 'Turf created successfully')
                setShowForm(false)
                setEditingTurf(null)
                setFormData({
                    name: '',
                    location: '',
                    city: '',
                    basePrice: '',
                    capacity: '',
                    surface: 'artificial',
                    facilities: [],
                    latitude: '',
                    longitude: '',
                })
                fetchTurfs()
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Operation failed')
        } finally {
            setLoading(false)
        }
    }

    const handleEdit = (turf) => {
        setEditingTurf(turf)
        setFormData({
            name: turf.name,
            location: turf.location,
            city: turf.city,
            basePrice: turf.basePrice,
            capacity: turf.capacity,
            surface: turf.surface,
            facilities: turf.facilities || [],
            latitude: turf.latitude || '',
            longitude: turf.longitude || '',
        })
        setShowForm(true)
    }

    const handleDelete = async (turfId) => {
        if (!window.confirm('Are you sure you want to delete this turf?')) return

        try {
            setLoading(true)
            const response = await axios.post(
                `${backendUrl}/api/owner/delete-turf`,
                { turfId },
                { headers: { Authorization: `Bearer ${localStorage.getItem('aToken')}` } }
            )
            if (response.data.success) {
                toast.success('Turf deleted successfully')
                fetchTurfs()
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete turf')
        } finally {
            setLoading(false)
        }
    }

    // Owner approves turf after admin verification
    const handleApproveTurf = async (turfId) => {
        try {
            setApprovingTurfId(turfId)
            const response = await axios.post(
                `${backendUrl}/api/owner/approve-turf`,
                { turfId },
                { headers: { Authorization: `Bearer ${localStorage.getItem('aToken')}` } }
            )

            if (response.data.success) {
                toast.success('Turf activated successfully! Now visible to users.')
                fetchTurfs()
            } else {
                toast.error(response.data.message || 'Failed to approve turf')
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to approve turf')
        } finally {
            setApprovingTurfId(null)
        }
    }

    // Owner rejects/removes turf after admin verification
    const handleRemoveTurf = async (turfId) => {
        if (!window.confirm('Are you sure you want to remove this turf? This action cannot be undone.')) return

        try {
            setRejectingTurfId(turfId)
            const response = await axios.post(
                `${backendUrl}/api/owner/remove-turf`,
                { turfId },
                { headers: { Authorization: `Bearer ${localStorage.getItem('aToken')}` } }
            )

            if (response.data.success) {
                toast.success('Turf removed successfully')
                fetchTurfs()
            } else {
                toast.error(response.data.message || 'Failed to remove turf')
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to remove turf')
        } finally {
            setRejectingTurfId(null)
        }
    }

    const handleCancel = () => {
        setShowForm(false)
        setEditingTurf(null)
        setFormData({
            name: '',
            location: '',
            city: '',
            basePrice: '',
            capacity: '',
            surface: 'artificial',
            facilities: [],
            latitude: '',
            longitude: '',
        })
    }

    // Filter and sort turfs
    let filteredTurfs = turfs
    if (filterCity !== 'all') {
        filteredTurfs = turfs.filter(t => t.city === filterCity)
    }

    if (sortBy === 'rating') {
        filteredTurfs = [...filteredTurfs].sort((a, b) => (b.rating || 0) - (a.rating || 0))
    } else if (sortBy === 'recent') {
        filteredTurfs = [...filteredTurfs].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    }

    const uniqueCities = [...new Set(turfs.map(t => t.city))]

    // Categorize turfs by status
    const pendingTurfs = filteredTurfs.filter(t => !t.verified)
    const verifiedUnpaidTurfs = filteredTurfs.filter(t => t.verified && !t.ownerApproved)
    const activeTurfs = filteredTurfs.filter(t => t.ownerApproved)

    const TurfCard = ({ turf }) => (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
            {/* Card Header */}
            <div className={`p-4 text-white ${turf.ownerApproved ? 'bg-gradient-to-r from-green-600 to-green-700' :
                turf.verified ? 'bg-gradient-to-r from-orange-600 to-orange-700' :
                    'bg-gradient-to-r from-blue-600 to-blue-700'
                }`}>
                <h3 className="text-xl font-bold">{turf.name}</h3>
                <p className="text-opacity-75 text-sm mt-1">{turf.city}</p>
            </div>

            {/* Card Content */}
            <div className="p-4 space-y-3">
                {/* Location */}
                <div className="flex items-start gap-2">

                    <p className="text-gray-700">{turf.location}</p>
                </div>

                {/* Key Details */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="bg-blue-50 p-2 rounded">
                        <p className="text-gray-600">Capacity</p>
                        <p className="font-semibold text-gray-900">{turf.capacity} Players</p>
                    </div>
                    <div className="bg-blue-50 p-2 rounded">
                        <p className="text-gray-600">Price/Hour</p>
                        <p className="font-semibold text-gray-900">₹{turf.basePrice}</p>
                    </div>
                    <div className="bg-blue-50 p-2 rounded">
                        <p className="text-gray-600">Surface</p>
                        <p className="font-semibold text-gray-900 capitalize">{turf.surface}</p>
                    </div>
                    <div className="bg-blue-50 p-2 rounded">
                        <p className="text-gray-600">Rating</p>
                        <p className="font-semibold text-gray-900">{turf.rating || 'N/A'}</p>
                    </div>
                </div>

                {/* Registration Fee Info */}
                {turf.verified && turf.registrationFee > 0 && (
                    <div className={`p-3 rounded-lg ${turf.ownerApproved ? 'bg-green-50' : 'bg-orange-50 border-2 border-orange-300'}`}>
                        <p className={`text-sm font-medium ${turf.ownerApproved ? 'text-green-700' : 'text-orange-700'}`}>
                            Registration Fee: ₹{turf.registrationFee}
                        </p>
                        {!turf.ownerApproved && (
                            <p className="text-xs text-orange-600 mt-1">Awaiting your approval</p>
                        )}
                    </div>
                )}

                {/* Facilities */}
                {turf.facilities && turf.facilities.length > 0 && (
                    <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Facilities:</p>
                        <div className="flex flex-wrap gap-1">
                            {turf.facilities.slice(0, 3).map(facility => (
                                <span key={facility} className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                    {facility}
                                </span>
                            ))}
                            {turf.facilities.length > 3 && (
                                <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                                    +{turf.facilities.length - 3}
                                </span>
                            )}
                        </div>
                    </div>
                )}

                {/* Status Badge */}
                <div className="pt-2">
                    {turf.ownerApproved && (
                        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-green-100 text-green-800">
                            Active & Visible
                        </span>
                    )}
                    {turf.verified && !turf.ownerApproved && (
                        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-orange-100 text-orange-800">
                            Awaiting Your Approval
                        </span>
                    )}
                    {!turf.verified && (
                        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-yellow-100 text-yellow-800">
                            Pending Admin Verification
                        </span>
                    )}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-gray-50 px-4 py-3 space-y-2 border-t">
                {/* Approval Buttons (For verified but not approved) */}
                {turf.verified && !turf.ownerApproved && (
                    <div className="flex gap-2">
                        <button
                            onClick={() => handleApproveTurf(turf._id)}
                            disabled={approvingTurfId === turf._id}
                            className="flex-1 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50 font-medium text-sm"
                        >
                            {approvingTurfId === turf._id ? 'Approving...' : 'Approve & Activate'}
                        </button>
                        <button
                            onClick={() => handleRemoveTurf(turf._id)}
                            disabled={rejectingTurfId === turf._id}
                            className="flex-1 bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition disabled:opacity-50 font-medium text-sm"
                        >
                            {rejectingTurfId === turf._id ? 'Removing...' : '✕ Remove'}
                        </button>
                    </div>
                )}

                {/* Regular Edit/Delete (For pending verification or active) */}
                {(!turf.verified || turf.ownerApproved) && (
                    <div className="flex gap-2">
                        <button
                            onClick={() => setSelectedTurfDetails(turf)}
                            className="flex-1 text-blue-600 hover:text-blue-700 font-medium text-sm transition"
                        >
                            Details
                        </button>
                        <button
                            onClick={() => handleEdit(turf)}
                            className="flex-1 text-orange-600 hover:text-orange-700 font-medium text-sm transition"
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => handleDelete(turf._id)}
                            className="flex-1 text-red-600 hover:text-red-700 font-medium text-sm transition"
                        >
                            Delete
                        </button>
                    </div>
                )}
            </div>
        </div>
    )

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">My Turfs</h1>
                        <p className="text-gray-600 mt-1">Manage your sports turfs and facilities</p>
                    </div>
                    {!showForm && (
                        <button
                            onClick={() => setShowForm(true)}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                        >
                            <span>+</span> Add New Turf
                        </button>
                    )}
                </div>

                {/* Form Section */}
                {showForm && (
                    <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
                        <h2 className="text-2xl font-bold mb-6">{editingTurf ? 'Edit Turf' : 'Create New Turf'}</h2>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Turf Name *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleFormChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="e.g., Premier Sports Complex"
                                    />
                                </div>

                                {/* City */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleFormChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="e.g., Mumbai"
                                    />
                                </div>

                                {/* Location */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Location Address *</label>
                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleFormChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="e.g., 123 Sports Avenue, Bandra"
                                    />
                                </div>

                                {/* Base Price */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Base Price per Hour (₹) *</label>
                                    <input
                                        type="number"
                                        name="basePrice"
                                        value={formData.basePrice}
                                        onChange={handleFormChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="e.g., 500"
                                        min="0"
                                    />
                                </div>

                                {/* Capacity */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Capacity (Players) *</label>
                                    <input
                                        type="number"
                                        name="capacity"
                                        value={formData.capacity}
                                        onChange={handleFormChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="e.g., 22"
                                        min="1"
                                    />
                                </div>

                                {/* Surface */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Surface Type</label>
                                    <select
                                        name="surface"
                                        value={formData.surface}
                                        onChange={handleFormChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="artificial">Artificial Grass</option>
                                        <option value="concrete">Concrete</option>
                                        <option value="natural">Natural Grass</option>
                                        <option value="clay">Clay</option>
                                    </select>
                                </div>

                                {/* Latitude */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Latitude</label>
                                    <input
                                        type="number"
                                        name="latitude"
                                        value={formData.latitude}
                                        onChange={handleFormChange}
                                        step="0.0001"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="e.g., 19.0760"
                                    />
                                </div>

                                {/* Longitude */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Longitude</label>
                                    <input
                                        type="number"
                                        name="longitude"
                                        value={formData.longitude}
                                        onChange={handleFormChange}
                                        step="0.0001"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="e.g., 72.8777"
                                    />
                                </div>
                            </div>

                            {/* Facilities */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">Facilities</label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {facilities.map(facility => (
                                        <label key={facility} className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                name="facilities"
                                                value={facility}
                                                checked={formData.facilities.includes(facility)}
                                                onChange={handleFormChange}
                                                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                                            />
                                            <span className="text-sm text-gray-700">{facility}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-4 pt-6">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                                >
                                    {loading ? 'Processing...' : editingTurf ? 'Update Turf' : 'Create Turf'}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="flex-1 bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Status Summary Cards */}
                {!showForm && turfs.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="bg-white p-4 rounded-lg shadow">
                            <p className="text-gray-600 text-sm">Pending Verification</p>
                            <p className="text-3xl font-bold text-gray-900">{pendingTurfs.length}</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow">
                            <p className="text-gray-600 text-sm">Awaiting Your Approval</p>
                            <p className="text-3xl font-bold text-orange-600">{verifiedUnpaidTurfs.length}</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow">
                            <p className="text-gray-600 text-sm">Active & Visible</p>
                            <p className="text-3xl font-bold text-green-600">{activeTurfs.length}</p>
                        </div>
                    </div>
                )}

                {/* Filters */}
                {!showForm && turfs.length > 0 && (
                    <div className="bg-white rounded-lg shadow p-4 mb-6 flex gap-4 flex-wrap items-center">
                        <div>
                            <label className="text-sm font-medium text-gray-700 mr-2">Filter by City:</label>
                            <select
                                value={filterCity}
                                onChange={(e) => setFilterCity(e.target.value)}
                                className="px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="all">All Cities</option>
                                {uniqueCities.map(city => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-700 mr-2">Sort by:</label>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="recent">Recently Added</option>
                                <option value="rating">Top Rated</option>
                            </select>
                        </div>

                        <div className="ml-auto text-sm text-gray-600">
                            {filteredTurfs.length} turf{filteredTurfs.length !== 1 ? 's' : ''}
                        </div>
                    </div>
                )}

                {/* Loading State */}
                {loading && !showForm && (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <p className="text-gray-600 mt-2">Loading turfs...</p>
                    </div>
                )}

                {/* Empty State */}
                {!loading && turfs.length === 0 && !showForm && (
                    <div className="bg-white rounded-lg shadow p-12 text-center">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Turfs Yet</h3>
                        <p className="text-gray-600 mb-6">Create your first turf to get started</p>
                        <button
                            onClick={() => setShowForm(true)}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                        >
                            Create First Turf
                        </button>
                    </div>
                )}

                {/* Turfs Grid */}
                {!loading && filteredTurfs.length > 0 && !showForm && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredTurfs.map(turf => (
                            <TurfCard key={turf._id} turf={turf} />
                        ))}
                    </div>
                )}

                {/* Details Modal */}
                {selectedTurfDetails && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg shadow-2xl max-w-md w-full max-h-96 overflow-y-auto">
                            <div className={`p-6 text-white ${selectedTurfDetails.ownerApproved ? 'bg-gradient-to-r from-green-600 to-green-700' :
                                selectedTurfDetails.verified ? 'bg-gradient-to-r from-orange-600 to-orange-700' :
                                    'bg-gradient-to-r from-blue-600 to-blue-700'
                                }`}>
                                <h2 className="text-2xl font-bold">{selectedTurfDetails.name}</h2>
                                <p className="text-opacity-75 text-sm mt-1">{selectedTurfDetails.city}</p>
                            </div>

                            <div className="p-6 space-y-4">
                                <div>
                                    <p className="text-gray-600 text-sm">Location</p>
                                    <p className="text-gray-900 font-medium">{selectedTurfDetails.location}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-gray-600 text-sm">Capacity</p>
                                        <p className="text-gray-900 font-bold text-lg">{selectedTurfDetails.capacity} Players</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600 text-sm">Price/Hour</p>
                                        <p className="text-gray-900 font-bold text-lg">₹{selectedTurfDetails.basePrice}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600 text-sm">Surface</p>
                                        <p className="text-gray-900 font-bold capitalize">{selectedTurfDetails.surface}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600 text-sm">Rating</p>
                                        <p className="text-gray-900 font-bold">{selectedTurfDetails.rating || 'N/A'}</p>
                                    </div>
                                </div>

                                {selectedTurfDetails.verified && selectedTurfDetails.registrationFee > 0 && (
                                    <div className={`p-3 rounded-lg ${selectedTurfDetails.ownerApproved ? 'bg-green-50' : 'bg-orange-50'}`}>
                                        <p className={`text-sm font-medium ${selectedTurfDetails.ownerApproved ? 'text-green-700' : 'text-orange-700'}`}>
                                            Registration Fee: ₹{selectedTurfDetails.registrationFee}
                                        </p>
                                        <p className={`text-xs mt-1 ${selectedTurfDetails.ownerApproved ? 'text-green-600' : 'text-orange-600'}`}>
                                            {selectedTurfDetails.ownerApproved ? 'Approved & Activated' : 'Awaiting Your Approval'}
                                        </p>
                                    </div>
                                )}

                                {selectedTurfDetails.facilities && selectedTurfDetails.facilities.length > 0 && (
                                    <div>
                                        <p className="text-gray-600 text-sm font-medium mb-2">Facilities</p>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedTurfDetails.facilities.map(facility => (
                                                <span key={facility} className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full">
                                                    {facility}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {(selectedTurfDetails.latitude || selectedTurfDetails.longitude) && (
                                    <div className="bg-gray-50 p-3 rounded">
                                        <p className="text-gray-600 text-sm font-medium mb-1">Coordinates</p>
                                        <p className="text-gray-900 text-sm">Lat: {selectedTurfDetails.latitude}, Lon: {selectedTurfDetails.longitude}</p>
                                    </div>
                                )}

                                <div className="bg-blue-50 p-3 rounded">
                                    <p className="text-gray-600 text-sm">Status</p>
                                    <p className={selectedTurfDetails.ownerApproved ? 'text-green-600 font-medium' :
                                        selectedTurfDetails.verified ? 'text-orange-600 font-medium' : 'text-yellow-600 font-medium'}>
                                        {selectedTurfDetails.ownerApproved ? 'Active & Visible' :
                                            selectedTurfDetails.verified ? 'Awaiting Your Approval' :
                                                'Pending Admin Verification'}
                                    </p>
                                </div>
                            </div>

                            <div className="bg-gray-50 px-6 py-4 flex gap-2 border-t">
                                <button
                                    onClick={() => handleEdit(selectedTurfDetails)}
                                    className="flex-1 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => setSelectedTurfDetails(null)}
                                    className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default TurfManagement
