import axios from "axios";
import { createContext, useState } from "react";
import { toast } from "react-toastify";


export const AdminContext = createContext()

const AdminContextProvider = (props) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const [aToken, setAToken] = useState(localStorage.getItem('aToken') ? localStorage.getItem('aToken') : '')
    const [userRole, setUserRole] = useState(localStorage.getItem('userRole') || 'admin')
    const [adminData, setAdminData] = useState(() => {
        const data = localStorage.getItem('adminData')
        return data ? JSON.parse(data) : null
    })

    const [matches, setMatches] = useState([])
    const [dashData, setDashData] = useState(false)
    const [paymentData, setPaymentData] = useState([])
    const [cancellationData, setCancellationData] = useState([])
    const [earningsData, setEarningsData] = useState(null)

    // fetch all matches
    const getAllMatches = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/admin/matches', { headers: { aToken } })
            if (data.success) {
                setMatches(data.matches.reverse())
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch matches. Please check your connection.'
            toast.error(errorMessage)
        }
    }

    // delete a match
    const deleteMatch = async (matchId) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/admin/delete-match', { matchId }, { headers: { aToken } })
            if (data.success) {
                toast.success(data.message)
                getAllMatches()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            const errorMessage = error.response?.data?.message || error.message || 'Failed to delete match. Please try again.'
            toast.error(errorMessage)
        }
    }



    // Getting Admin Dashboard data from Database using API
    const getDashData = async () => {
        try {

            const { data } = await axios.get(backendUrl + '/api/admin/dashboard', { headers: { aToken } })

            if (data.success) {
                setDashData(data.dashData)
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error)
            const errorMessage = error.response?.data?.message || error.message || 'Failed to load dashboard. Please check your connection.'
            toast.error(errorMessage)
        }

    }

    // Get payment and earnings data
    const getPaymentData = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/admin/payments', { headers: { aToken } })

            if (data.success) {
                setPaymentData(data.payments)
                setCancellationData(data.cancellations || [])
                setEarningsData(data.earnings)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            const errorMessage = error.response?.data?.message || error.message || 'Failed to load payment data.'
            toast.error(errorMessage)
        }
    }

    const value = {
        aToken, setAToken,
        userRole, setUserRole,
        adminData, setAdminData,
        matches,
        getAllMatches,
        deleteMatch,
        getDashData,
        dashData,
        getPaymentData,
        paymentData,
        cancellationData,
        earningsData,
        backendUrl
    }

    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    )

}

export default AdminContextProvider