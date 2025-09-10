import React from 'react'

const QuickCommands = ({ onQuickAdd }) => {
  const quickCommands = [
    { text: "Add milk", icon: "🥛" },
    { text: "Add 2 apples", icon: "🍎" },
    { text: "Add bread", icon: "🍞" },
    { text: "Add chicken", icon: "🐔" },
    { text: "Remove milk", icon: "❌" },
    { text: "Add organic bananas", icon: "🍌" }
  ]

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 animate-fade-in">
      <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-800 mb-4">
        🚀 Quick Commands
      </h2>
      <p className="text-gray-600 mb-6 text-sm md:text-base">
        Click any command below to add it to your shopping list instantly!
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {quickCommands.map((command, index) => (
          <button
            key={index}
            onClick={() => onQuickAdd(command.text)}
            className="group flex items-center space-x-3 p-4 bg-gradient-to-r from-pastel-blue/80 to-pastel-lavender/80 hover:from-pastel-blue/90 hover:to-pastel-lavender/90 border border-blue-300 rounded-xl transition-all duration-300 text-left hover:scale-105 hover:shadow-lg hover:cursor-pointer"
          >
            <span className="text-2xl group-hover:scale-110 transition-transform duration-200">{command.icon}</span>
            <span className="text-sm md:text-base font-medium text-blue-800 group-hover:text-blue-900">{command.text}</span>
          </button>
        ))}
      </div>
      
    </div>
  )
}

export default QuickCommands
