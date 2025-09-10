import React, { useState } from 'react'

const AddItemForm = ({ onAddItem }) => {
  const [itemName, setItemName] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [category, setCategory] = useState('other')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const categories = [
    { value: 'dairy', label: '🥛 Dairy' },
    { value: 'produce', label: '🥬 Produce' },
    { value: 'meat', label: '🥩 Meat' },
    { value: 'bakery', label: '🍞 Bakery' },
    { value: 'snacks', label: '🍿 Snacks' },
    { value: 'beverages', label: '🥤 Beverages' },
    { value: 'household', label: '🧻 Household' },
    { value: 'frozen', label: '🧊 Frozen' },
    { value: 'pantry', label: '🥫 Pantry' },
    { value: 'other', label: '📦 Other' }
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!itemName.trim()) return

    setIsSubmitting(true)
    try {
      await onAddItem({
        name: itemName.trim(),
        quantity: parseInt(quantity),
        category: category
      })
      setItemName('')
      setQuantity(1)
      setCategory('other')
    } catch (error) {
      console.error('Error adding item:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 animate-fade-in">
      <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-800 mb-6">
        ✏️ Add Item Manually
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="itemName" className="block text-sm font-medium text-gray-700 mb-2">
            Item Name
          </label>
          <input
            type="text"
            id="itemName"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            placeholder="e.g., Milk, Apples, Bread..."
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
              Quantity
            </label>
            <input
              type="number"
              id="quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              min="1"
              max="99"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-gray-900"
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-gray-900"
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !itemName.trim()}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg hover:shadow-xl hover:cursor-pointer"
        >
          {isSubmitting ? 'Adding...' : 'Add to Shopping List'}
        </button>
      </form>
    </div>
  )
}

export default AddItemForm
