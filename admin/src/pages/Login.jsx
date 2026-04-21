import axios from 'axios'
import React, { useContext, useState } from 'react'
import { AdminContext } from '../context/AdminContext'
import { toast } from 'react-toastify'

const Login = () => {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [loginAs, setLoginAs] = useState('admin') // 'admin' or 'owner'
  const [isRegister, setIsRegister] = useState(false) // Toggle between login and register
  const [loading, setLoading] = useState(false)

  const backendUrl = import.meta.env.VITE_BACKEND_URL

  const { setAToken, setAdminData, setUserRole } = useContext(AdminContext)

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setLoading(true)

    try {
      if (isRegister) {
        // Registration flow - only for turf owner
        if (!name.trim() || !email.trim() || !password.trim() || !phone.trim()) {
          toast.error('All fields are required')
          setLoading(false)
          return
        }

        const registerUrl = backendUrl + '/api/admin/owner/register'
        const { data } = await axios.post(registerUrl, {
          name,
          email,
          password,
          phone
        })

        if (data.success) {
          toast.success('Registration successful! Please login with your credentials.')
          // Reset form and switch to login
          setIsRegister(false)
          setName('')
          setEmail('')
          setPassword('')
          setPhone('')
        } else {
          toast.error(data.message || 'Registration failed')
        }
      } else {
        // Login flow
        const loginUrl = loginAs === 'admin'
          ? backendUrl + '/api/admin/login'
          : backendUrl + '/api/admin/owner/login'

        const { data } = await axios.post(loginUrl, { email, password })
        if (data.success) {
          setAToken(data.token)
          setUserRole(loginAs)
          localStorage.setItem('aToken', data.token)
          localStorage.setItem('userRole', loginAs) // Store role for future reference

          // Store admin/owner data if available (from owner login)
          if (data.user) {
            setAdminData(data.user)
            localStorage.setItem('adminData', JSON.stringify(data.user))
          }

          toast.success(`${loginAs === 'admin' ? 'Admin' : 'Turf Owner'} logged in successfully`)
        } else {
          toast.error(data.message || 'Login failed')
        }
      }
    } catch (error) {
      console.error('Auth error:', error)
      const errorMessage = error.response?.data?.message || error.message || 'Network error. Please check if backend is running on ' + backendUrl
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center'>
      <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg'>
        <p className='text-2xl font-semibold m-auto'><span className='text-primary'>{isRegister ? 'Register' : 'Login'}</span></p>

        {/* Register Mode */}
        {isRegister ? (
          <>
            <div className='w-full text-center mb-2'>
              <p className='text-sm text-gray-600'>Register as Turf Owner</p>
            </div>

            {/* Name Field */}
            <div className='w-full'>
              <p>Full Name *</p>
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                className='border border-[#DADADA] rounded w-full p-2 mt-1'
                type="text"
                placeholder="Enter your full name"
                required
              />
            </div>

            {/* Phone Field */}
            <div className='w-full'>
              <p>Phone Number *</p>
              <input
                onChange={(e) => setPhone(e.target.value)}
                value={phone}
                className='border border-[#DADADA] rounded w-full p-2 mt-1'
                type="tel"
                placeholder="Enter your phone number"
                required
              />
            </div>

            {/* Email Field */}
            <div className='w-full'>
              <p>Email *</p>
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                className='border border-[#DADADA] rounded w-full p-2 mt-1'
                type="email"
                placeholder="Enter your email"
                required
              />
            </div>

            {/* Password Field */}
            <div className='w-full'>
              <p>Password *</p>
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                className='border border-[#DADADA] rounded w-full p-2 mt-1'
                type="password"
                placeholder="Create a password"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className='bg-primary text-white w-full py-2 rounded-md text-base disabled:opacity-50'
            >
              {loading ? 'Creating Account...' : 'Register'}
            </button>

            {/* Toggle to Login */}
            <p className='text-center w-full text-gray-600'>
              Already have an account?
              <button
                type="button"
                onClick={() => {
                  setIsRegister(false)
                  setName('')
                  setPhone('')
                  setEmail('')
                  setPassword('')
                }}
                className='text-primary font-semibold ml-1 hover:underline'
              >
                Login here
              </button>
            </p>
          </>
        ) : (
          <>
            {/* Login Mode */}
            {/* Login Role Selector */}
            <div className='w-full'>
              <p className='font-semibold mb-2'>Login As</p>
              <div className='flex gap-4'>
                <label className='flex items-center gap-2 cursor-pointer'>
                  <input
                    type="radio"
                    value="admin"
                    checked={loginAs === 'admin'}
                    onChange={(e) => setLoginAs(e.target.value)}
                    className='cursor-pointer'
                  />
                  Admin
                </label>
                <label className='flex items-center gap-2 cursor-pointer'>
                  <input
                    type="radio"
                    value="owner"
                    checked={loginAs === 'owner'}
                    onChange={(e) => setLoginAs(e.target.value)}
                    className='cursor-pointer'
                  />
                  Turf Owner
                </label>
              </div>
            </div>

            {/* Email Field */}
            <div className='w-full'>
              <p>Email</p>
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                className='border border-[#DADADA] rounded w-full p-2 mt-1'
                type="email"
                required
              />
            </div>

            {/* Password Field */}
            <div className='w-full'>
              <p>Password</p>
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                className='border border-[#DADADA] rounded w-full p-2 mt-1'
                type="password"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className='bg-primary text-white w-full py-2 rounded-md text-base disabled:opacity-50'
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>

            {/* Toggle to Register - Only for Turf Owner */}
            {loginAs === 'owner' && (
              <p className='text-center w-full text-gray-600'>
                Don't have an account?
                <button
                  type="button"
                  onClick={() => {
                    setIsRegister(true)
                    setEmail('')
                    setPassword('')
                  }}
                  className='text-primary font-semibold ml-1 hover:underline'
                >
                  Register here
                </button>
              </p>
            )}
          </>
        )}
      </div>
    </form>
  )
}

export default Login