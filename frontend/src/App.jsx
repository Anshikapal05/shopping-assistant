import { useState, useEffect } from 'react'
import VoiceRecorder from './components/VoiceRecorder'
import ShoppingList from './components/ShoppingList'
import Header from './components/Header'
import AddItemForm from './components/AddItemForm'
import QuickCommands from './components/QuickCommands'
import Suggestions from './components/Suggestions'
import SearchResults from './components/SearchResults'

import axios from 'axios'

function App() {
  const [shoppingItems, setShoppingItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [suggestions, setSuggestions] = useState(null)
  const [searchResults, setSearchResults] = useState([])

  const API_BASE_URL = 'http://localhost:5000/api'

  useEffect(() => {
    // Ensure any previous dark mode state is cleared
    if (document?.documentElement?.classList?.contains('dark')) {
      document.documentElement.classList.remove('dark')
    }
    try {
      localStorage.removeItem('theme')
    } catch (e) {
      // ignore storage errors
    }
    fetchShoppingItems()
  }, [])

  const fetchShoppingItems = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/shopping-list`)
      setShoppingItems(response.data)
      // Fetch suggestions in parallel
      try {
        const s = await axios.get(`${API_BASE_URL}/shopping-list/suggestions`)
        setSuggestions(s.data)
      } catch (e) {
        // ignore suggestions error
      }
    } catch (error) {
      console.error('Error fetching shopping items:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const addItem = async (item) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/shopping-list`, item)
      setShoppingItems(prev => [response.data, ...prev])
    } catch (error) {
      console.error('Error adding item:', error)
    }
  }

  const quickAdd = async (text) => {
    // Parse simple commands like "Add milk", "Add 2 apples"
    const lower = String(text || '').toLowerCase()
    // quantity: first number, default 1
    const matchNum = lower.match(/\b(\d+)\b/)
    const quantity = matchNum ? parseInt(matchNum[1], 10) : 1
    // strip common words
    const name = lower
      .replace(/add|please|i\s*need|i\s*want|\b\d+\b|to|some|a|an/gi, ' ')
      .trim()
      .replace(/\s+/g, ' ')
    const item = {
      name: name || text,
      quantity,
      category: 'other',
      addedByVoice: false,
    }
    await addItem(item)
    return `Added ${item.quantity > 1 ? item.quantity + ' ' : ''}${item.name}`
  }

  const removeItem = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/shopping-list/${id}`)
      setShoppingItems(prev => prev.filter(item => item._id !== id))
    } catch (error) {
      console.error('Error removing item:', error)
    }
  }

  const toggleItem = async (id) => {
    try {
      const response = await axios.patch(`${API_BASE_URL}/shopping-list/${id}/toggle`)
      setShoppingItems(prev => 
        prev.map(item => 
          item._id === id ? response.data : item
        )
      )
    } catch (error) {
      console.error('Error toggling item:', error)
    }
  }

  const processVoiceCommand = async (command) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/shopping-list/voice-command`, {
        command: command
      })
      
      // Always refresh list so removals/other changes reflect immediately
      await fetchShoppingItems()
      if (response.data.results) {
        setSearchResults(response.data.results)
      } else {
        setSearchResults([])
      }
      
      return response.data.message
    } catch (error) {
      console.error('Error processing voice command:', error)
      return 'Sorry, I could not process that command.'
    }
  }

  return (
    <div className="min-h-screen bg-white transition-all duration-500">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <VoiceRecorder onVoiceCommand={processVoiceCommand} onQuickAdd={quickAdd} />
          <QuickCommands onQuickAdd={quickAdd} />
          {searchResults.length > 0 && (
            <SearchResults results={searchResults} onAdd={addItem} />
          )}
          {suggestions && (
            <Suggestions data={suggestions} onAdd={addItem} />
          )}
          <AddItemForm onAddItem={addItem} />
          <ShoppingList 
            items={shoppingItems}
            isLoading={isLoading}
            onRemove={removeItem}
            onToggle={toggleItem}
          />
        </div>
      </main>
    </div>
  )
}

export default App
