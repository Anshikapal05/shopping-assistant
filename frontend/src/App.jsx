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

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'
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
    // Parse commands like "Add milk" or "Remove milk" and common removal variants
    const lower = String(text || '').toLowerCase()
    const isRemove = /(\bremove\b|\bdelete\b|don'?t\s+need|dont\s+need|\bcross\s+off\b|don'?t\s+want)/i.test(lower)
    // quantity: first number, default 1 (only relevant for add)
    const matchNum = lower.match(/\b(\d+)\b/)
    const quantity = matchNum ? parseInt(matchNum[1], 10) : 1
    // strip common command words (standalone) and numbers, keep item text intact
    const cleanedName = lower
      .replace(/\b(add|remove|delete|please|i\s*need|i\s*want|to|some|a|an|all|the|item|items|cross\s+off|don'?t\s+need|dont\s+need|don'?t\s+want)\b/gi, ' ')
      .replace(/\b\d+\b/g, ' ')
      .replace(/[^a-z0-9\s]/gi, ' ')
      .replace(/\s+/g, ' ')
      .trim()

    if (isRemove) {
      // Prevent removing everything if the query is empty
      if (!cleanedName) {
        return 'Please specify what to remove'
      }
      // Remove any items whose name includes the cleanedName substring
      const query = cleanedName
      const targets = shoppingItems.filter((it) => it.name?.toLowerCase().includes(query))
      if (targets.length === 0) {
        return `No items found to remove for "${query || text}"`
      }
      await Promise.all(targets.map((t) => removeItem(t._id)))
      return `Removed ${targets.length} item${targets.length > 1 ? 's' : ''}${query ? ` matching "${query}"` : ''}`
    }

    const name = cleanedName
    // categorize by keywords (mirror of backend)
    const categorize = (itemName) => {
      const categories = {
        dairy: ['milk', 'cheese', 'yogurt', 'butter', 'cream', 'sour cream', 'cottage cheese', 'mozzarella', 'cheddar'],
        produce: ['apple', 'banana', 'orange', 'lettuce', 'tomato', 'carrot', 'onion', 'potato', 'broccoli', 'spinach', 'cucumber', 'pepper', 'avocado', 'lemon', 'lime', 'grape', 'strawberry', 'blueberry', 'organic'],
        meat: ['chicken', 'beef', 'pork', 'fish', 'turkey', 'salmon', 'tuna', 'ham', 'bacon', 'sausage', 'ground beef', 'steak'],
        bakery: ['bread', 'roll', 'bagel', 'muffin', 'cake', 'croissant', 'donut', 'cookie', 'pastry', 'tortilla', 'pita'],
        snacks: ['chips', 'crackers', 'nuts', 'cookies', 'candy', 'popcorn', 'pretzel', 'granola', 'trail mix', 'chocolate'],
        beverages: ['water', 'juice', 'soda', 'coffee', 'tea', 'beer', 'wine', 'smoothie', 'energy drink', 'sports drink'],
        household: ['toilet paper', 'soap', 'shampoo', 'detergent', 'tissue', 'paper towel', 'cleaning', 'laundry', 'dish soap', 'toothpaste', 'deodorant'],
        frozen: ['frozen', 'ice cream', 'frozen dinner', 'frozen pizza', 'frozen vegetables'],
        pantry: ['rice', 'pasta', 'cereal', 'oats', 'flour', 'sugar', 'salt', 'pepper', 'oil', 'vinegar', 'sauce', 'soup', 'canned']
      }
      const lowerName = (itemName || '').toLowerCase()
      for (const [cat, words] of Object.entries(categories)) {
        if (words.some(w => lowerName.includes(w))) return cat
      }
      return 'other'
    }
    const category = categorize(name || text)
    const item = {
      name: name || text,
      quantity,
      category,
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
