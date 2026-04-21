import React from 'react'
import { assets } from '../assets/assets'

const About = () => {
  return (
    <div className='bg-gradient-to-br from-gray-50 to-gray-100 py-12'>
      {/* Header */}
      <div className='text-center mb-12 pt-8'>
        <h1 className='text-4xl md:text-5xl font-bold text-gray-800 mb-3'>📖 About <span className='text-blue-600'>TurfMate</span></h1>
        <p className='text-gray-600 text-lg max-w-2xl mx-auto'>Connecting sports enthusiasts and making turf match booking effortless</p>
      </div>

      {/* Main Section */}
      <div className='max-w-6xl mx-auto px-4 mb-16'>
        <div className='bg-white rounded-xl shadow-lg overflow-hidden'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-8 p-8 md:p-12'>
            {/* Image */}
            <div className='flex items-center justify-center'>
              <img
                className='w-full max-w-sm rounded-lg shadow-md'
                loading="lazy"
                width="360"
                height="270"
                src={assets.about_image}
                alt="About TurfMate"
              />
            </div>

            {/* Content */}
            <div className='flex flex-col justify-center gap-6'>
              <div>
                <p className='text-2xl font-bold text-gray-800 mb-4'>🎯 Our Mission</p>
                <p className='text-gray-600 leading-relaxed'>
                  Welcome to TurfMate, the ultimate platform for turf sports enthusiasts. Whether you're looking to host a match, join a game, or connect with fellow players, TurfMate makes it easy to find and book the perfect turf slot in your area.
                </p>
              </div>
              <div>
                <p className='text-2xl font-bold text-gray-800 mb-4'>✨ Our Vision</p>
                <p className='text-gray-600 leading-relaxed'>
                  We envision a world where finding and joining turf matches is as simple as a tap. We strive to make every game accessible, enjoyable, and well-organized, so you can focus on playing your best.
                </p>
              </div>
              <div>
                <p className='text-sm text-gray-500'>
                  TurfMate constantly evolves with new features and improvements to ensure a seamless, engaging experience for athletes of all levels.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className='max-w-6xl mx-auto px-4 mb-12'>
        <h2 className='text-3xl font-bold text-gray-800 mb-8 text-center'>
          💪 Why Choose <span className='text-blue-600'>TurfMate</span>
        </h2>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <div className='bg-white rounded-xl shadow-md hover:shadow-lg transition transform hover:-translate-y-1 p-8 border-l-4 border-blue-600'>
            <div className='text-4xl mb-4'>⚡</div>
            <p className='text-xl font-bold text-gray-800 mb-3'>Efficiency</p>
            <p className='text-gray-600'>
              Quickly discover and join turf matches without the hassle of back-and-forth messaging.
            </p>
          </div>

          <div className='bg-white rounded-xl shadow-md hover:shadow-lg transition transform hover:-translate-y-1 p-8 border-l-4 border-green-600'>
            <div className='text-4xl mb-4'>🎯</div>
            <p className='text-xl font-bold text-gray-800 mb-3'>Convenience</p>
            <p className='text-gray-600'>
              Find nearby turfs and available matches with just a few clicks.
            </p>
          </div>

          <div className='bg-white rounded-xl shadow-md hover:shadow-lg transition transform hover:-translate-y-1 p-8 border-l-4 border-purple-600'>
            <div className='text-4xl mb-4'>🤝</div>
            <p className='text-xl font-bold text-gray-800 mb-3'>Community</p>
            <p className='text-gray-600'>
              Connect with players of similar skill levels and build your turf network.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About
