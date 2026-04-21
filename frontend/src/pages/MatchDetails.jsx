import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const MatchDetails = () => {
    const { matchId } = useParams()
    const { backendUrl, token, userData } = useContext(AppContext)
    const [match, setMatch] = useState(null)

    const loadMatch = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/user/matches', { headers: { token } })
            if (data.success) {
                const m = data.matches.find(m => m._id === matchId)
                setMatch(m)
            }
        } catch (error) {
            console.log(error)
            const errorMessage = error.response?.data?.message || error.message || 'Failed to load match details. Please check your connection.'
            toast.error(errorMessage)
        }
    }

    const join = async () => {
        if (!token) {
            toast.warning('Login to join match')
            return
        }
        try {
            const userId = userData?._id
            const { data } = await axios.post(backendUrl + '/api/user/matches/join', { matchId, userId }, { headers: { token } })
            if (data.success) {
                toast.success('Joined match')
                loadMatch()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            const errorMessage = error.response?.data?.message || error.message || 'Failed to join match. Please try again.'
            toast.error(errorMessage)
        }
    }

    useEffect(() => {
        if (matchId) loadMatch()
    }, [matchId])

    if (!match) return <p>Loading...</p>

    return (
        <div className='p-4'>
            <h2 className='text-xl font-semibold'>{match.sportType} @ {match.location}</h2>
            <p>Turf: {match.turfName}</p>
            <p>Date: {match.date} Time: {match.time}</p>
            <p>Slots: {match.joinedPlayers.length}/{match.totalSlots}</p>
            <p>Price/head: {match.pricePerHead}</p>
            <p>Skill: {match.skillLevel}</p>
            <p>Status: {match.isFull ? 'Full' : match.isCancelled ? 'Cancelled' : 'Open'}</p>
            <button disabled={match.isFull || match.joinedPlayers.includes(userData?._id) || match.isCancelled} onClick={join} className='mt-4 px-4 py-2 bg-primary text-white rounded'>
                {match.isFull ? 'Full' : match.joinedPlayers.includes(userData?._id) ? 'Joined' : 'Join Match'}
            </button>
        </div>
    )
}

export default MatchDetails
