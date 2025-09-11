import React, { createContext, useCallback, useContext, useMemo, useState } from 'react'

const ToastContext = createContext(null)

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const add = useCallback((toast) => {
    const id = Math.random().toString(36).slice(2)
    const ttlMs = toast.ttlMs ?? 2500
    const newToast = {
      id,
      type: toast.type || 'info',
      message: toast.message || '',
    }
    setToasts((prev) => [newToast, ...prev])
    // auto-remove
    window.setTimeout(() => remove(id), ttlMs)
  }, [remove])

  const value = useMemo(() => ({ add, remove }), [add, remove])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`min-w-[240px] max-w-sm px-4 py-3 rounded-lg shadow-lg border text-sm font-medium animate-fade-in pointer-events-auto ${
              t.type === 'success'
                ? 'bg-green-50 border-green-200 text-green-800'
                : t.type === 'error'
                ? 'bg-red-50 border-red-200 text-red-800'
                : 'bg-blue-50 border-blue-200 text-blue-800'
            }`}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const ctx = useContext(ToastContext)
  if (!ctx) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return ctx
}


