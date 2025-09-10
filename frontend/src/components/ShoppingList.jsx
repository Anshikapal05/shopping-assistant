import React from 'react'

const ShoppingList = ({ items, isLoading, onRemove, onToggle }) => {
  const getCategoryIcon = (category) => {
    const icons = {
      dairy: '🥛',
      produce: '🥬',
      meat: '🥩',
      bakery: '🍞',
      snacks: '🍿',
      beverages: '🥤',
      household: '🧻',
      frozen: '🧊',
      pantry: '🥫',
      other: '📦'
    }
    return icons[category] || icons.other
  }

  const getCategoryColor = (category) => {
    const colors = {
      dairy: 'bg-blue-100 text-blue-800',
      produce: 'bg-green-100 text-green-800',
      meat: 'bg-red-100 text-red-800',
      bakery: 'bg-yellow-100 text-yellow-800',
      snacks: 'bg-purple-100 text-purple-800',
      beverages: 'bg-cyan-100 text-cyan-800',
      household: 'bg-gray-100 text-gray-800',
      frozen: 'bg-indigo-100 text-indigo-800',
      pantry: 'bg-orange-100 text-orange-800',
      other: 'bg-gray-100 text-gray-800'
    }
    return colors[category] || colors.other
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-12 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 text-center animate-fade-in">
        <div className="text-6xl md:text-8xl mb-6 animate-bounce-gentle">🛒</div>
        <h3 className="text-xl md:text-2xl font-display font-bold text-gray-700 mb-3">
          Your shopping list is empty
        </h3>
        <p className="text-gray-500 text-sm md:text-base">
          Use voice commands, quick buttons, or the manual form to add items to your list
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 animate-fade-in">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-800">
          🛍️ Shopping List ({items.length} items)
        </h2>
      </div>
      
      <div className="divide-y divide-gray-200">
        {items.map((item) => (
          <div
            key={item._id}
            className={`p-4 md:p-6 hover:bg-gray-50 transition-all duration-200 ${
              item.completed ? 'opacity-60' : ''
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 flex-1">
                <button
                  onClick={() => onToggle(item._id)}
                  className={`w-6 h-6 md:w-7 md:h-7 hover:cursor-pointer rounded-full border-2 flex items-center justify-center transition-all duration-200 hover:scale-110 ${
                    item.completed
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 border-green-500 text-white shadow-lg'
                      : 'border-gray-300 hover:border-green-500'
                  }`}
                >
                  {item.completed && '✓'}
                </button>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3">
                    <span className="text-xl md:text-2xl">
                      {getCategoryIcon(item.category)}
                    </span>
                    <span
                      className={`font-medium text-sm md:text-base ${
                        item.completed ? 'line-through text-gray-500' : 'text-gray-900'
                      }`}
                    >
                      {item.name}
                    </span>
                    {item.quantity > 1 && (
                      <span className="text-xs md:text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        x{item.quantity}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2 mt-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(
                        item.category
                      )}`}
                    >
                      {item.category}
                    </span>
                    {item.addedByVoice && (
                      <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                        🎤 Voice
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => onRemove(item._id)}
                className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-all duration-200 hover:scale-110 hover:cursor-pointer"
                title="Remove item"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ShoppingList
