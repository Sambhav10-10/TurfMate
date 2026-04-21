import React, { useContext, useState, useEffect } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const CreateMatch = () => {
    const { backendUrl, token, userData } = useContext(AppContext)
    const navigate = useNavigate()

    const [turfs, setTurfs] = useState([])
    const [selectedTurf, setSelectedTurf] = useState(null)
    const [loadingTurfs, setLoadingTurfs] = useState(true)

    const [form, setForm] = useState({
        sportType: 'football',
        turfId: '',
        location: '',
        turfName: '',
        date: '',
        time: '',
        totalSlots: 2,
        pricePerHead: 0,
        skillLevel: 'Beginner'
    })

    // Fetch all turfs on component mount
    useEffect(() => {
        fetchTurfs()
    }, [])

    const fetchTurfs = async () => {
        try {
            setLoadingTurfs(true)
            const { data } = await axios.get(backendUrl + '/api/owner/all-turfs')
            if (data.success) {
                setTurfs(data.turfs || [])
            }
        } catch (error) {
            console.log(error)
            toast.error('Failed to load turfs')
        } finally {
            setLoadingTurfs(false)
        }
    }

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleTurfSelect = (e) => {
        const turfId = e.target.value
        const turf = turfs.find(t => t._id === turfId)

        if (turf) {
            setSelectedTurf(turf)
            setForm({
                ...form,
                turfId: turf._id,
                location: turf.city,
                turfName: turf.name
            })
        } else {
            setSelectedTurf(null)
            setForm({
                ...form,
                turfId: '',
                location: '',
                turfName: ''
            })
        }
    }

    const submit = async () => {
        if (!token) {
            toast.warning('Login to create match')
            return navigate('/login')
        }

        if (!form.turfId) {
            toast.error('Please select a turf')
            return
        }

        try {
            const userId = userData?._id

            // Convert YYYY-MM-DD format to DD_MM_YYYY for backend
            let formattedDate = form.date
            if (form.date.includes('-')) {
                const [year, month, day] = form.date.split('-')
                formattedDate = `${day}_${month}_${year}`
            }

            const { data } = await axios.post(backendUrl + '/api/user/matches/create', { ...form, date: formattedDate, creatorId: userId }, { headers: { token } })
            if (data.success) {
                toast.success('Match created')
                navigate('/my-matches')
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            const errorMessage = error.response?.data?.message || error.message || 'Failed to create match. Please check your connection and try again.'
            toast.error(errorMessage)
        }
    }

    return (
        <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4'>
            <div className='max-w-2xl mx-auto'>
                {/* Header */}
                <div className='mb-10 text-center'>
                    <h1 className='text-4xl font-semibold text-gray-800 mb-3'>Create New Match</h1>
                    <p className='text-gray-600'>Host a match and invite players to join you</p>
                </div>

                {/* Form Card */}
                <div className='bg-white rounded-xl shadow-lg overflow-hidden'>
                    <div className='bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white'>
                        <p className='text-lg font-bold'>Match Details</p>
                    </div>

                    <div className='p-8'>
                        <div className='flex flex-col gap-6'>
                            {/* Sport Type */}
                            <div>
                                <label className='block text-sm font-semibold text-gray-700 mb-2'>Sport Type</label>
                                <select
                                    name='sportType'
                                    value={form.sportType}
                                    onChange={handleChange}
                                    className='w-full border-2 border-gray-300 rounded-lg p-3 focus:border-blue-600 focus:outline-none transition'
                                >
                                    <option value='football'>Football</option>
                                    <option value='cricket'>Cricket</option>
                                </select>
                            </div>

                            {/* Turf Selection */}
                            <div>
                                <label className='block text-sm font-semibold text-gray-700 mb-2'>Select Turf *</label>
                                {loadingTurfs ? (
                                    <div className='flex items-center gap-2'>
                                        <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600'></div>
                                        <p className='text-gray-600'>Loading turfs...</p>
                                    </div>
                                ) : turfs.length === 0 ? (
                                    <p className='text-red-600 text-sm'>No turfs available. Owners need to register turfs first.</p>
                                ) : (
                                    <select
                                        value={form.turfId}
                                        onChange={handleTurfSelect}
                                        className='w-full border-2 border-gray-300 rounded-lg p-3 focus:border-blue-600 focus:outline-none transition'
                                    >
                                        <option value=''>-- Select a Turf --</option>
                                        {turfs.map(turf => (
                                            <option key={turf._id} value={turf._id}>
                                                {turf.name} - {turf.city} (₹{turf.basePrice}/hour)
                                            </option>
                                        ))}
                                    </select>
                                )}
                            </div>

                            {/* Selected Turf Details */}
                            {selectedTurf && (
                                <div className='bg-blue-50 rounded-lg p-4 border border-blue-200'>
                                    <p className='text-sm font-semibold text-gray-700 mb-3'>Turf Details</p>
                                    <div className='grid grid-cols-2 gap-3 text-sm'>
                                        <div>
                                            <p className='text-gray-600'>Location</p>
                                            <p className='font-semibold text-gray-900'>{selectedTurf.location}</p>
                                        </div>
                                        <div>
                                            <p className='text-gray-600'>City</p>
                                            <p className='font-semibold text-gray-900'>{selectedTurf.city}</p>
                                        </div>
                                        <div>
                                            <p className='text-gray-600'>Surface</p>
                                            <p className='font-semibold text-gray-900 capitalize'>{selectedTurf.surface}</p>
                                        </div>
                                        <div>
                                            <p className='text-gray-600'>Capacity</p>
                                            <p className='font-semibold text-gray-900'>{selectedTurf.capacity} Players</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Date & Time */}
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                <div>
                                    <label className='block text-sm font-semibold text-gray-700 mb-2'>Date</label>
                                    <input
                                        name='date'
                                        type='date'
                                        value={form.date}
                                        onChange={handleChange}
                                        className='w-full border-2 border-gray-300 rounded-lg p-3 focus:border-blue-600 focus:outline-none transition'
                                    />
                                </div>
                                <div>
                                    <label className='block text-sm font-semibold text-gray-700 mb-2'>Time</label>
                                    <input
                                        name='time'
                                        type='time'
                                        value={form.time}
                                        onChange={handleChange}
                                        className='w-full border-2 border-gray-300 rounded-lg p-3 focus:border-blue-600 focus:outline-none transition'
                                    />
                                </div>
                            </div>

                            {/* Slots, Price & Skill */}
                            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                                <div>
                                    <label className='block text-sm font-semibold text-gray-700 mb-2'>Total Slots</label>
                                    <input
                                        name='totalSlots'
                                        type='number'
                                        min='1'
                                        value={form.totalSlots}
                                        onChange={handleChange}
                                        className='w-full border-2 border-gray-300 rounded-lg p-3 focus:border-blue-600 focus:outline-none transition'
                                    />
                                </div>
                                <div>
                                    <label className='block text-sm font-semibold text-gray-700 mb-2'>Price/Head</label>
                                    <input
                                        name='pricePerHead'
                                        type='number'
                                        min='0'
                                        value={form.pricePerHead}
                                        onChange={handleChange}
                                        placeholder='₹200'
                                        className='w-full border-2 border-gray-300 rounded-lg p-3 focus:border-blue-600 focus:outline-none transition'
                                    />
                                </div>
                                <div>
                                    <label className='block text-sm font-semibold text-gray-700 mb-2'>Skill Level</label>
                                    <select
                                        name='skillLevel'
                                        value={form.skillLevel}
                                        onChange={handleChange}
                                        className='w-full border-2 border-gray-300 rounded-lg p-3 focus:border-blue-600 focus:outline-none transition'
                                    >
                                        <option value='Beginner'>Beginner</option>
                                        <option value='Intermediate'>Intermediate</option>
                                        <option value='Advanced'>Advanced</option>
                                    </select>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                onClick={submit}
                                className='w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold py-3 rounded-lg mt-8 hover:shadow-lg transition transform hover:scale-105 active:scale-95'
                            >
                                Create Match
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreateMatch
