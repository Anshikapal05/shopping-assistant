import React from 'react'
import { useToast } from '../contexts/ToastContext.jsx'

const SearchResults = ({ results = [], onAdd }) => {
  const { add: addToast } = useToast()
  if (!results || results.length === 0) return null
  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
      <h3 className="text-xl font-display font-bold text-gray-800 mb-4">Search Results</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {results.map((p, idx) => (
          <div key={p.id || idx} className="p-4 border border-gray-200 rounded-xl flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">{p.name}</p>
              <p className="text-sm text-gray-600">{p.brand} • {p.category} • {p.price != null ? `$${p.price}` : '—'}</p>
            </div>
            <button
              onClick={async () => {
                if (!onAdd) return
                try {
                  await onAdd({ name: p.name, quantity: 1, category: p.category })
                  addToast({ type: 'success', message: `Added ${p.name} successfully` })
                } catch (e) {
                  addToast({ type: 'error', message: 'Failed to add item' })
                }
              }}
              className="px-3 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700"
            >
              Add
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SearchResults


