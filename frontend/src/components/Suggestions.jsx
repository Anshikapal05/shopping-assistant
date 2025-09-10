import React from 'react'

const Suggestions = ({ data = {}, onAdd }) => {
  const { recommendations = [], seasonal = [], substitutes = [] } = data
  const Section = ({ title, items }) => (
    items && items.length > 0 ? (
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
        <h3 className="text-xl font-display font-bold text-gray-800 mb-4">{title}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((p) => (
            <div key={p.id} className="p-4 border border-gray-200 rounded-xl flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">{p.name}</p>
                <p className="text-sm text-gray-600">{p.brand} • {p.category} • {p.price != null ? `$${p.price}` : '—'}</p>
              </div>
              <button
                onClick={() => onAdd && onAdd({ name: p.name, quantity: 1, category: p.category })}
                className="px-3 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 hover:cursor-pointer"
              >
                Add
              </button>
            </div>
          ))}
        </div>
      </div>
    ) : null
  )

  return (
    <div className="space-y-6">
      <Section title="Recommended for you" items={recommendations} />
      <Section title="Seasonal picks" items={seasonal} />
      {substitutes && substitutes.map((s) => (
        <Section key={s.for} title={`Alternatives for ${s.for}`} items={s.alternatives} />
      ))}
    </div>
  )
}

export default Suggestions


