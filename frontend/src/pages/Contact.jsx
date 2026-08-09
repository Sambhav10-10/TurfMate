import React from 'react'
import { assets } from '../assets/assets'

const Contact = () => {
  return (
    <div className='bg-gradient-to-br from-gray-50 to-gray-100 py-12'>
      {/* Header */}
      <div className='text-center mb-12 pt-8'>
        <h1 className='text-4xl md:text-5xl font-bold text-gray-800 mb-3'>📞 Contact <span className='text-blue-600'>TurfMate</span></h1>
        <p className='text-gray-600 text-lg max-w-2xl mx-auto'>Get in touch with us for any queries or support</p>
      </div>

      <div className='max-w-6xl mx-auto px-4 mb-12'>
        {/* Contact Info & Image */}
        <div className='bg-white rounded-xl shadow-lg overflow-hidden mb-8'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-8 p-8 md:p-12'>
            {/* Image */}
            <div className='flex items-center justify-center'>
              <img
                className='w-full max-w-sm rounded-lg shadow-md'
                loading="lazy"
                width="360"
                height="270"
                src={assets.contact_image}
                alt="Contact TurfMate"
              />
            </div>

            {/* Contact Details */}
            <div className='flex flex-col justify-center gap-8'>
              {/* Office Info */}
              <div className='bg-blue-50 rounded-lg p-6 border-l-4 border-blue-600'>
                <p className='text-lg font-semibold text-gray-800 mb-3'>Our Office</p>
                <div className='text-gray-600 space-y-2'>
                  <p className='font-semibold'>TurfMate Headquarters</p>
                  <p>54709 Willms Station</p>
                  <p>Suite 350, Washington, USA</p>
                </div>
              </div>

              {/* Contact Info */}
              <div className='bg-green-50 rounded-lg p-6 border-l-4 border-green-600'>
                <p className='text-lg font-bold text-gray-800 mb-3'>📧 Get In Touch</p>
                <div className='text-gray-600 space-y-2'>
                  <p>
                    <span className='font-semibold'>📱 Phone:</span> +91-7828759100
                  </p>
                  <p>
                    <span className='font-semibold'>✉️ Email:</span> koshtasambhav18@gmail.com
                  </p>
                </div>
              </div>

              {/* Careers */}
              <div className='bg-purple-50 rounded-lg p-6 border-l-4 border-purple-600'>
                <p className='text-lg font-semibold text-gray-800 mb-3'>Careers at TurfMate</p>
                <p className='text-gray-600 mb-4'>
                  Join our team and help revolutionize the sports industry. Learn more about our job openings and opportunities.
                </p>
                <button className='bg-purple-600 hover:bg-purple-700 text-white font-bold px-6 py-2 rounded-lg transition'>
                  🚀 Explore Jobs
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className='max-w-6xl mx-auto px-4'>
        <h2 className='text-2xl font-bold text-gray-800 mb-6 text-center'>🔗 Quick Links</h2>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <div className='bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition text-center'>
            <p className='text-3xl mb-3'>❓</p>
            <p className='font-bold text-gray-800'>FAQ</p>
            <p className='text-sm text-gray-600 mt-2'>Find answers to common questions</p>
          </div>
          <div className='bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition text-center'>
            <p className='text-3xl mb-3'>📋</p>
            <p className='font-bold text-gray-800'>Terms of Service</p>
            <p className='text-sm text-gray-600 mt-2'>Review our policies and terms</p>
          </div>
          <div className='bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition text-center'>
            <p className='text-3xl mb-3'>🔒</p>
            <p className='font-bold text-gray-800'>Privacy Policy</p>
            <p className='text-sm text-gray-600 mt-2'>How we protect your data</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact
