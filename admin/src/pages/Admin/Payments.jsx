import React, { useContext, useEffect, useState } from 'react'
import { AdminContext } from '../../context/AdminContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const Payments = () => {
    const { aToken, getPaymentData, paymentData, earningsData, cancellationData } = useContext(AdminContext)

    const [filters, setFilters] = useState({
        status: 'all', // all, confirmed, pending
        sportType: 'all'
    })

    useEffect(() => {
        if (aToken) {
            getPaymentData()
        }
    }, [aToken])

    // Filter payment data based on status
    const filteredPayments = paymentData.filter(payment => {
        if (filters.status !== 'all' && payment.paymentStatus !== filters.status) return false
        if (filters.sportType !== 'all' && payment.sportType !== filters.sportType) return false
        return true
    })

    // Filter cancellation data
    const filteredCancellations = (cancellationData || []).filter(cancellation => {
        if (filters.sportType !== 'all' && cancellation.sportType !== filters.sportType) return false
        return true
    })

    // Calculate statistics
    const stats = {
        totalEarnings: earningsData?.totalEarnings || 0,
        totalConfirmed: earningsData?.totalConfirmed || 0,
        totalPending: earningsData?.totalPending || 0,
        totalPenalties: earningsData?.totalPenalties || 0,
        totalCancellations: earningsData?.totalCancellations || 0,
        confirmedCount: paymentData.filter(p => p.paymentStatus === 'confirmed').length,
        pendingCount: paymentData.filter(p => p.paymentStatus === 'pending').length,
        penaltiesApplied: (cancellationData || []).filter(c => c.penaltyApplied).length
    }

    return (
        <div className='m-5'>
            {/* Page Header */}
            <div className='flex items-center gap-3 mb-8'>
                <div>
                    <h1 className='text-3xl font-semibold text-gray-800'>Payment Management</h1>
                    <p className='text-gray-600 text-sm'>Track all earnings, payments, and penalties</p>
                </div>
            </div>

            {/* Earnings Summary Cards */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8'>
                <div className='bg-white p-6 rounded-lg border-2 border-green-100 shadow-sm hover:shadow-md transition-all'>
                    <div className='flex items-start justify-between mb-3'>
                        <p className='text-gray-500 text-sm font-semibold'>Total Earnings</p>
                    </div>
                    <p className='text-3xl font-bold text-green-600'>₹{stats.totalEarnings.toLocaleString()}</p>
                    <p className='text-xs text-gray-400 mt-2'>From all matches</p>
                </div>

                <div className='bg-white p-6 rounded-lg border-2 border-blue-100 shadow-sm hover:shadow-md transition-all'>
                    <div className='flex items-start justify-between mb-3'>
                        <p className='text-gray-500 text-sm font-semibold'>Confirmed Payments</p>
                    </div>
                    <p className='text-3xl font-bold text-blue-600'>₹{stats.totalConfirmed.toLocaleString()}</p>
                    <p className='text-xs text-gray-400 mt-2'>{stats.confirmedCount} players</p>
                </div>

                <div className='bg-white p-6 rounded-lg border-2 border-yellow-100 shadow-sm hover:shadow-md transition-all'>
                    <div className='flex items-start justify-between mb-3'>
                        <p className='text-gray-500 text-sm font-semibold'>Pending Payments</p>
                    </div>
                    <p className='text-3xl font-bold text-yellow-600'>₹{stats.totalPending.toLocaleString()}</p>
                    <p className='text-xs text-gray-400 mt-2'>{stats.pendingCount} players</p>
                </div>

                <div className='bg-white p-6 rounded-lg border-2 border-red-100 shadow-sm hover:shadow-md transition-all'>
                    <div className='flex items-start justify-between mb-3'>
                        <p className='text-gray-500 text-sm font-semibold'>Cancellations</p>
                        <span className='text-3xl'></span>
                    </div>
                    <p className='text-3xl font-bold text-red-600'>{stats.totalCancellations}</p>
                    <p className='text-xs text-gray-400 mt-2'>{stats.penaltiesApplied} with penalties</p>
                </div>

                <div className='bg-white p-6 rounded-lg border-2 border-orange-100 shadow-sm hover:shadow-md transition-all'>
                    <div className='flex items-start justify-between mb-3'>
                        <p className='text-gray-500 text-sm font-semibold'>Penalties Collected</p>
                    </div>
                    <p className='text-3xl font-bold text-orange-600'>₹{stats.totalPenalties.toLocaleString()}</p>
                    <p className='text-xs text-gray-400 mt-2'>From late cancellations</p>
                </div>

                <div className='bg-white p-6 rounded-lg border-2 border-purple-100 shadow-sm hover:shadow-md transition-all'>
                    <div className='flex items-start justify-between mb-3'>
                        <p className='text-gray-500 text-sm font-semibold'>Avg Per Match</p>
                    </div>
                    <p className='text-3xl font-bold text-purple-600'>₹{paymentData.length > 0 ? Math.round(stats.totalEarnings / paymentData.length) : 0}</p>
                    <p className='text-xs text-gray-400 mt-2'>{paymentData.length} total slots</p>
                </div>
            </div>

            {/* Filters */}
            <div className='bg-white p-4 rounded-lg mb-6 flex gap-4'>
                <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>Filter by Status</label>
                    <select
                        value={filters.status}
                        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                        className='border border-gray-300 rounded px-3 py-2 text-sm'
                    >
                        <option value="all">All Statuses</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="pending">Pending</option>
                    </select>
                </div>
                <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>Filter by Sport</label>
                    <select
                        value={filters.sportType}
                        onChange={(e) => setFilters({ ...filters, sportType: e.target.value })}
                        className='border border-gray-300 rounded px-3 py-2 text-sm'
                    >
                        <option value="all">All Sports</option>
                        <option value="football">Football</option>
                        <option value="cricket">Cricket</option>
                    </select>
                </div>
            </div>

            {/* Payments Table Heading */}
            <h3 className='text-lg font-semibold text-gray-800 mb-4 mt-6'>Payment Transactions</h3>

            {/* Payments Table */}
            <div className='bg-white rounded-lg overflow-hidden shadow-md'>
                <div className='overflow-x-auto'>
                    <table className='w-full'>
                        <thead className='bg-gray-100 border-b'>
                            <tr>
                                <th className='px-4 py-3 text-left text-sm font-semibold text-gray-700'>Match</th>
                                <th className='px-4 py-3 text-left text-sm font-semibold text-gray-700'>Date</th>
                                <th className='px-4 py-3 text-left text-sm font-semibold text-gray-700'>Player</th>
                                <th className='px-4 py-3 text-left text-sm font-semibold text-gray-700'>Amount</th>
                                <th className='px-4 py-3 text-left text-sm font-semibold text-gray-700'>Status</th>
                                <th className='px-4 py-3 text-left text-sm font-semibold text-gray-700'>Payment Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPayments.length > 0 ? (
                                filteredPayments.map((payment) => (
                                    <tr key={payment._id} className='border-b hover:bg-gray-50'>
                                        <td className='px-4 py-3 text-sm'>
                                            <div>
                                                <p className='font-medium text-gray-900'>{payment.sportType}</p>
                                                <p className='text-xs text-gray-500'>{payment.location} • {payment.turfName}</p>
                                            </div>
                                        </td>
                                        <td className='px-4 py-3 text-sm text-gray-600'>
                                            {new Date(payment.matchDate).toLocaleDateString('en-IN')}
                                        </td>
                                        <td className='px-4 py-3 text-sm'>
                                            <p className='text-gray-900'>{payment.playerEmail || 'N/A'}</p>
                                            <p className='text-xs text-gray-500'>{payment.playerName || 'Unknown'}</p>
                                        </td>
                                        <td className='px-4 py-3 text-sm font-semibold text-gray-900'>
                                            ₹{payment.amount}
                                        </td>
                                        <td className='px-4 py-3 text-sm'>
                                            {payment.paymentStatus === 'confirmed' ? (
                                                <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800'>
                                                    Confirmed
                                                </span>
                                            ) : (
                                                <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800'>
                                                    Pending
                                                </span>
                                            )}
                                        </td>
                                        <td className='px-4 py-3 text-sm text-gray-600'>
                                            {payment.confirmedAt
                                                ? new Date(payment.confirmedAt).toLocaleString('en-IN')
                                                : 'Awaiting'
                                            }
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className='px-4 py-8 text-center text-gray-500'>
                                        No payments found with selected filters
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Cancellations Table */}
            {filteredCancellations.length > 0 && (
                <div className='mt-8'>
                    <h3 className='text-lg font-bold text-gray-800 mb-4'>⚠️ Player Cancellations & Penalties</h3>
                    <div className='bg-white rounded-lg overflow-hidden shadow-md'>
                        <div className='overflow-x-auto'>
                            <table className='w-full'>
                                <thead className='bg-red-50 border-b-2 border-red-200'>
                                    <tr>
                                        <th className='px-4 py-3 text-left text-sm font-semibold text-red-700'>Match</th>
                                        <th className='px-4 py-3 text-left text-sm font-semibold text-red-700'>Player</th>
                                        <th className='px-4 py-3 text-left text-sm font-semibold text-red-700'>Cancelled At</th>
                                        <th className='px-4 py-3 text-left text-sm font-semibold text-red-700'>Hours Before</th>
                                        <th className='px-4 py-3 text-left text-sm font-semibold text-red-700'>Penalty</th>
                                        <th className='px-4 py-3 text-left text-sm font-semibold text-red-700'>Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredCancellations.map((cancellation) => (
                                        <tr key={cancellation._id} className={`border-b hover:bg-red-50 ${cancellation.penaltyApplied ? 'bg-red-50' : ''}`}>
                                            <td className='px-4 py-3 text-sm'>
                                                <div>
                                                    <p className='font-medium text-gray-900'>{cancellation.sportType}</p>
                                                    <p className='text-xs text-gray-500'>{cancellation.location} • {cancellation.turfName}</p>
                                                </div>
                                            </td>
                                            <td className='px-4 py-3 text-sm'>
                                                <p className='text-gray-900'>{cancellation.playerEmail || 'N/A'}</p>
                                                <p className='text-xs text-gray-500'>{cancellation.playerName || 'Unknown'}</p>
                                            </td>
                                            <td className='px-4 py-3 text-sm text-gray-600'>
                                                {new Date(cancellation.cancelledAt).toLocaleString('en-IN')}
                                            </td>
                                            <td className='px-4 py-3 text-sm text-gray-600'>
                                                <span className={`font-semibold ${cancellation.hoursBeforeMatch < 2 && cancellation.hoursBeforeMatch >= 0 ? 'text-red-600' : 'text-gray-600'}`}>
                                                    {cancellation.hoursBeforeMatch}h
                                                </span>
                                            </td>
                                            <td className='px-4 py-3 text-sm'>
                                                {cancellation.penaltyApplied ? (
                                                    <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-800'>
                                                        Applied
                                                    </span>
                                                ) : (
                                                    <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600'>
                                                        None
                                                    </span>
                                                )}
                                            </td>
                                            <td className='px-4 py-3 text-sm font-bold'>
                                                <span className={cancellation.penaltyApplied ? 'text-red-600' : 'text-gray-600'}>
                                                    ₹{cancellation.penaltyAmount || 0}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {filteredCancellations.length === 0 && (
                <div className='mt-8 bg-green-50 rounded-lg p-8 text-center border-2 border-green-200'>
                    <p className='text-2xl text-green-600 mb-2'>No Cancellations</p>
                    <p className='text-green-700'>All players have shown up for their matches!</p>
                </div>
            )}

            {/* Summary Stats */}
            <div className='mt-8 grid grid-cols-1 md:grid-cols-3 gap-4'>
                <div className='bg-white p-4 rounded-lg border'>
                    <p className='text-gray-500 text-sm mb-2'>Showing</p>
                    <p className='text-2xl font-bold text-gray-900'>{filteredPayments.length}</p>
                    <p className='text-xs text-gray-400'>Payment records</p>
                </div>
                <div className='bg-white p-4 rounded-lg border'>
                    <p className='text-gray-500 text-sm mb-2'>Filtered Earnings</p>
                    <p className='text-2xl font-bold text-green-600'>
                        ₹{filteredPayments.reduce((sum, p) => sum + p.amount, 0).toLocaleString()}
                    </p>
                    <p className='text-xs text-gray-400'>From filtered results</p>
                </div>
                <div className='bg-white p-4 rounded-lg border'>
                    <p className='text-gray-500 text-sm mb-2'>Confirmation Rate</p>
                    <p className='text-2xl font-bold text-blue-600'>
                        {paymentData.length > 0
                            ? Math.round((stats.confirmedCount / paymentData.length) * 100)
                            : 0}%
                    </p>
                    <p className='text-xs text-gray-400'>Of all payments</p>
                </div>
            </div>
        </div>
    )
}

export default Payments
