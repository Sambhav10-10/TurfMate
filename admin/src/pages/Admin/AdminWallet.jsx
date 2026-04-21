import { useState, useEffect, useContext } from 'react'
import { AdminContext } from '../../context/AdminContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const AdminWallet = () => {
    const { backendUrl, aToken } = useContext(AdminContext)
    const [walletData, setWalletData] = useState(null)
    const [loading, setLoading] = useState(false)

    const fetchWalletData = async () => {
        try {
            setLoading(true)
            const response = await axios.get(
                `${backendUrl}/api/admin/wallet`,
                { headers: { aToken } }
            )

            if (response.data.success) {
                setWalletData(response.data)
            } else {
                toast.error(response.data.message || 'Failed to fetch wallet data')
            }
        } catch (error) {
            console.error('Error fetching wallet:', error)
            toast.error(error.response?.data?.message || 'Failed to fetch wallet data')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchWalletData()
    }, [])

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A'
        const date = new Date(dateString)
        return date.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })
    }

    if (loading) {
        return (
            <div className="p-6 bg-gray-50 min-h-screen">
                <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <p className="text-gray-600 mt-2">Loading wallet data...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-semibold text-gray-900">Admin Wallet</h1>
                    <p className="text-gray-600 mt-1">Track registration fees and platform earnings</p>
                </div>

                {/* Top Stats */}
                {walletData && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        {/* Total Earnings Card */}
                        <div className="bg-gradient-to-br from-green-500 to-green-700 rounded-lg shadow-lg p-8 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-green-100 text-sm font-medium">Total Earnings</p>
                                    <p className="text-4xl font-bold mt-2">₹{walletData.totalEarnings.toLocaleString('en-IN')}</p>
                                    <p className="text-green-100 text-sm mt-2">From {walletData.totalTurfsVerified} verified turfs</p>
                                </div>
                            </div>
                        </div>

                        {/* Turfs Verified Card */}
                        <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg shadow-lg p-8 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-blue-100 text-sm font-medium">Turfs Verified & Paid</p>
                                    <p className="text-4xl font-bold mt-2">{walletData.totalTurfsVerified}</p>
                                    <p className="text-blue-100 text-sm mt-2">Average fee: ₹{walletData.totalTurfsVerified > 0 ? Math.round(walletData.totalEarnings / walletData.totalTurfsVerified).toLocaleString('en-IN') : '0'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Turfs Breakdown Table */}
                {walletData && walletData.turfsBreakdown && walletData.turfsBreakdown.length > 0 ? (
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-xl font-bold text-gray-900">Registration Fees Breakdown</h2>
                            <p className="text-gray-600 text-sm mt-1">Detailed list of all verified and paid turfs</p>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Turf Name</th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">City</th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Owner</th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                                        <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Registration Fee</th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Approved Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {walletData.turfsBreakdown.map((turf, index) => (
                                        <tr key={turf.turfId} className="hover:bg-gray-50 transition">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                    <p className="font-medium text-gray-900">{turf.turfName}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-600">{turf.city}</td>
                                            <td className="px-6 py-4 text-gray-900 font-medium">{turf.ownerName}</td>
                                            <td className="px-6 py-4 text-gray-600 text-sm">{turf.ownerEmail}</td>
                                            <td className="px-6 py-4 text-right">
                                                <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                                                    ₹{turf.registrationFee.toLocaleString('en-IN')}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-600 text-sm">{formatDate(turf.feeConfirmedDate)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot className="bg-gray-50 border-t border-gray-200">
                                    <tr>
                                        <td colSpan="4" className="px-6 py-4 text-right font-bold text-gray-900">Total:</td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="text-xl font-bold text-green-600">
                                                ₹{walletData.totalEarnings.toLocaleString('en-IN')}
                                            </span>
                                        </td>
                                        <td></td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow p-12 text-center">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-3xl font-bold text-gray-400">$</span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Earnings Yet</h3>
                        <p className="text-gray-600 mb-6">Earnings will appear here when owners approve turfs and confirm the registration fees</p>
                        <a href="/verify-turfs" className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
                            Go to Verify Turfs
                        </a>
                    </div>
                )}
            </div>
        </div>
    )
}

export default AdminWallet
