import { useState, useEffect, useContext } from 'react'
import { AdminContext } from '../../context/AdminContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const ProcessRevenue = () => {
    const { backendUrl, aToken } = useContext(AdminContext)
    const [completedMatches, setCompletedMatches] = useState([])
    const [loading, setLoading] = useState(false)
    const [selectedMatch, setSelectedMatch] = useState(null)
    const [commissionPercent, setCommissionPercent] = useState(20)
    const [processing, setProcessing] = useState(false)
    const [revenueStats, setRevenueStats] = useState(null)

    const fetchCompletedMatches = async () => {
        try {
            setLoading(true)
            const response = await axios.get(
                `${backendUrl}/api/admin/completed-matches`,
                { headers: { aToken } }
            )

            if (response.data.success) {
                setCompletedMatches(response.data.matches)
            }
        } catch (error) {
            console.error('Error fetching matches:', error)
            toast.error(error.response?.data?.message || 'Failed to fetch matches')
        } finally {
            setLoading(false)
        }
    }

    const fetchRevenueStats = async () => {
        try {
            const response = await axios.get(
                `${backendUrl}/api/admin/revenue-stats`,
                { headers: { aToken } }
            )

            if (response.data.success) {
                setRevenueStats(response.data)
            }
        } catch (error) {
            console.error('Error fetching stats:', error)
        }
    }

    useEffect(() => {
        fetchCompletedMatches()
        fetchRevenueStats()
    }, [])

    const handleProcessRevenue = async () => {
        if (!selectedMatch) {
            toast.error('Please select a match')
            return
        }

        try {
            setProcessing(true)
            const response = await axios.post(
                `${backendUrl}/api/admin/process-revenue`,
                {
                    matchId: selectedMatch._id,
                    adminCommissionPercent: parseFloat(commissionPercent)
                },
                { headers: { aToken } }
            )

            if (response.data.success) {
                toast.success('Revenue split processed successfully!')
                setSelectedMatch(null)
                setCommissionPercent(20)
                fetchCompletedMatches()
                fetchRevenueStats()
            } else {
                toast.error(response.data.message || 'Failed to process revenue')
            }
        } catch (error) {
            console.error('Error processing revenue:', error)
            toast.error(error.response?.data?.message || 'Failed to process revenue')
        } finally {
            setProcessing(false)
        }
    }

    const calculateSplit = (match) => {
        const confirmedPlayers = match.confirmedPlayers || 0
        const totalAmount = confirmedPlayers * match.pricePerHead
        const adminEarning = (totalAmount * commissionPercent) / 100
        const ownerEarning = totalAmount - adminEarning

        return { totalAmount, adminEarning, ownerEarning }
    }

    const currentSplit = selectedMatch ? calculateSplit(selectedMatch) : null

    if (loading) {
        return (
            <div className="p-6 bg-gray-50 min-h-screen">
                <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <p className="text-gray-600 mt-2">Loading matches...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-semibold text-gray-900">Process Revenue Share</h1>
                    <p className="text-gray-600 mt-1">Distribute earnings between platform and turf owners</p>
                </div>

                {/* Revenue Stats */}
                {revenueStats && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg shadow-lg p-6 text-white">
                            <p className="text-blue-100 text-sm">Total Revenue Processed</p>
                            <p className="text-3xl font-bold mt-2">₹{revenueStats.totalRevenue.toLocaleString('en-IN')}</p>
                            <p className="text-blue-100 text-xs mt-2">{revenueStats.matchesProcessed} matches</p>
                        </div>

                        <div className="bg-gradient-to-br from-green-500 to-green-700 rounded-lg shadow-lg p-6 text-white">
                            <p className="text-green-100 text-sm">Admin Earnings</p>
                            <p className="text-3xl font-bold mt-2">₹{revenueStats.adminTotal.toLocaleString('en-IN')}</p>
                            <p className="text-green-100 text-xs mt-2">Commission collected</p>
                        </div>

                        <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg shadow-lg p-6 text-white">
                            <p className="text-purple-100 text-sm">Owner Earnings</p>
                            <p className="text-3xl font-bold mt-2">₹{revenueStats.ownerTotal.toLocaleString('en-IN')}</p>
                            <p className="text-purple-100 text-xs mt-2">Distributed to owners</p>
                        </div>
                    </div>
                )}

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Matches List */}
                    <div className="lg:col-span-2 bg-white rounded-lg shadow-lg overflow-hidden">
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-xl font-bold">Awaiting Revenue Split</h2>
                            <p className="text-gray-600 text-sm mt-1">{completedMatches.length} matches</p>
                        </div>

                        {completedMatches.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Match</th>
                                            <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Players</th>
                                            <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Total Amount</th>
                                            <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {completedMatches.map(match => {
                                            const total = (match.confirmedPlayers || 0) * match.pricePerHead
                                            return (
                                                <tr key={match._id} className={`hover:bg-gray-50 ${selectedMatch?._id === match._id ? 'bg-blue-50' : ''}`}>
                                                    <td className="px-4 py-3">
                                                        <div>
                                                            <p className="font-medium text-gray-900">{match.sportType}</p>
                                                            <p className="text-xs text-gray-600">{match.turfOwnerName}</p>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 text-center">
                                                        <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                                                            {match.confirmedPlayers || 0}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-right font-bold text-gray-900">
                                                        ₹{total.toLocaleString('en-IN')}
                                                    </td>
                                                    <td className="px-4 py-3 text-center">
                                                        <button
                                                            onClick={() => {
                                                                setSelectedMatch(match)
                                                                setCommissionPercent(20)
                                                            }}
                                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${selectedMatch?._id === match._id
                                                                ? 'bg-blue-600 text-white'
                                                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                                                }`}
                                                        >
                                                            {selectedMatch?._id === match._id ? '✓ Selected' : 'Select'}
                                                        </button>
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="p-12 text-center">
                                <p className="text-gray-600">No matches awaiting revenue split</p>
                            </div>
                        )}
                    </div>

                    {/* Commission Calculator */}
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <div className="border-b pb-4 mb-4">
                            <h3 className="text-lg font-bold text-gray-900">Commission Calculator</h3>
                            <p className="text-sm text-gray-600 mt-1">
                                {selectedMatch ? 'Adjust admin commission %' : 'Select a match first'}
                            </p>
                        </div>

                        {selectedMatch && currentSplit && (
                            <div className="space-y-6">
                                {/* Commission Slider */}
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="text-sm font-semibold text-gray-700">Admin Commission %</label>
                                        <span className="text-lg font-bold text-blue-600">{commissionPercent}%</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        step="1"
                                        value={commissionPercent}
                                        onChange={(e) => setCommissionPercent(parseInt(e.target.value))}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                    />
                                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                                        <span>0%</span>
                                        <span>50%</span>
                                        <span>100%</span>
                                    </div>
                                </div>

                                {/* Money Breakdown */}
                                <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-700">Total Payment:</span>
                                        <span className="font-bold text-gray-900">₹{currentSplit.totalAmount.toLocaleString('en-IN')}</span>
                                    </div>
                                    <div className="border-t pt-3">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-blue-700 font-medium">Your Commission ({commissionPercent}%):</span>
                                            <span className="font-bold text-blue-700">₹{currentSplit.adminEarning.toLocaleString('en-IN')}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-green-700 font-medium">Turf Owner ({100 - commissionPercent}%):</span>
                                            <span className="font-bold text-green-700">₹{currentSplit.ownerEarning.toLocaleString('en-IN')}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Match Info */}
                                <div className="bg-amber-50 p-4 rounded-lg space-y-2">
                                    <p className="text-sm text-gray-700">
                                        <span className="font-medium">Turf:</span> {selectedMatch.turfId?.name || 'Unknown'}
                                    </p>
                                    <p className="text-sm text-gray-700">
                                        <span className="font-medium">Owner:</span> {selectedMatch.turfOwnerName}
                                    </p>
                                    <p className="text-sm text-gray-700">
                                        <span className="font-medium">Players:</span> {selectedMatch.confirmedPlayers}
                                    </p>
                                    <p className="text-sm text-gray-700">
                                        <span className="font-medium">Price/Head:</span> ₹{selectedMatch.pricePerHead}
                                    </p>
                                </div>

                                {/* Confirm Button */}
                                <button
                                    onClick={handleProcessRevenue}
                                    disabled={processing}
                                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {processing ? (
                                        <>
                                            <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            ✓ Confirm & Process
                                        </>
                                    )}
                                </button>

                                {/* Cancel Button */}
                                <button
                                    onClick={() => setSelectedMatch(null)}
                                    className="w-full bg-gray-200 text-gray-700 font-medium py-2 rounded-lg hover:bg-gray-300 transition"
                                >
                                    Cancel
                                </button>
                            </div>
                        )}

                        {!selectedMatch && (
                            <div className="text-center py-8">
                                <p className="text-gray-400 text-sm">Select a match from the list to set commission</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProcessRevenue
