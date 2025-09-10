import React from 'react'

const Header = () => {
  return (
    <header className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-r from-primary-500 to-secondary-500  flex items-center justify-center ">
                
                  <img src="/logo.png" alt="EchoCart" className="w-5 h-5 md:w-7 md:h-7" />
                
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                  Voice Shopping
                </h1>
                <p className="text-gray-600 text-xs md:text-sm font-medium">
                  Smart Assistant
                </p>
              </div>
            </div>
            
            {/* Subtitle */}
            <div className="hidden lg:block ml-8">
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2 bg-green-50 px-3 py-2 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-green-700 font-medium">Voice Ready</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
