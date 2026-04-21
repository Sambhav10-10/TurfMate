import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from 'axios'

export const AppContext = createContext()

const AppContextProvider = (props) => {

    const currencySymbol = '₹'
    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const [matches, setMatches] = useState([])
    const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : '')
    const [userData, setUserData] = useState(false)

    // Getting matches using API
    const getMatchesData = async () => {

        try {

            const { data } = await axios.get(backendUrl + '/api/user/matches', { headers: { token } })
            if (data.success) {
                setMatches(data.matches)
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error)
            const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch matches. Please check your connection.'
            toast.error(errorMessage)
        }

    }

    // Getting User Profile using API
    const loadUserProfileData = async () => {

        try {

            const { data } = await axios.get(backendUrl + '/api/user/get-profile', { headers: { token } })

            if (data.success) {
                setUserData(data.userData)
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error)
            const errorMessage = error.response?.data?.message || error.message || 'Failed to load profile. Please check your connection.'
            toast.error(errorMessage)
        }

    }

    // Rate another player
    const ratePlayer = async (ratedUserId, rating) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/user/matches/rate',
                { raterId: userData._id, ratedUserId, rating },
                { headers: { token } }
            )
            if (data.success) {
                toast.success('Player rated successfully!')
                return true
            } else {
                toast.error(data.message)
                return false
            }
        } catch (error) {
            console.log(error)
            const errorMessage = error.response?.data?.message || error.message || 'Failed to rate player. Please try again.'
            toast.error(errorMessage)
            return false
        }
    }

    useEffect(() => {
        if (token) getMatchesData()
    }, [token])

    useEffect(() => {
        if (token) {
            loadUserProfileData()
        }
    }, [token])

    const value = {
        matches, getMatchesData,
        currencySymbol,
        backendUrl,
        token, setToken,
        userData, setUserData, loadUserProfileData,
        ratePlayer
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )

}

export default AppContextProvider