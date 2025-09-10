import React, { useState, useRef, useEffect } from 'react'
import { Mic, Square } from "lucide-react"; // mic + stop icons

const VoiceRecorder = ({ onVoiceCommand, onQuickAdd }) => {
  const [isListening, setIsListening] = useState(false)
  const [message, setMessage] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [textInput, setTextInput] = useState('')
  const [showTextInput, setShowTextInput] = useState(false)
  const recognitionRef = useRef(null)
  const timeoutRef = useRef(null)

  useEffect(() => {
    // Check if browser supports speech recognition
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setMessage('❌ Speech recognition not supported in this browser. Please use Chrome or Edge.')
      setShowTextInput(true) // Show text input as fallback
      return
    }

    // Initialize speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    recognitionRef.current = new SpeechRecognition()
    
    recognitionRef.current.continuous = false
    recognitionRef.current.interimResults = false
    recognitionRef.current.lang = 'en-US'
    recognitionRef.current.maxAlternatives = 1

    recognitionRef.current.onstart = () => {
      setIsListening(true)
      setMessage('🎤 Listening... Speak now!')
      
      // Set a timeout to handle cases where speech recognition hangs
      timeoutRef.current = setTimeout(() => {
        if (isListening) {
          setMessage('❌ No speech detected. Please try again or use text input.')
          setIsListening(false)
          if (recognitionRef.current) {
            recognitionRef.current.stop()
          }
        }
      }, 10000) // 10 second timeout
    }

    recognitionRef.current.onresult = (event) => {
      // Clear the timeout since we got a result
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
      
      const transcript = event.results[0][0].transcript
      setTranscript(transcript)
      setMessage(`📝 Heard: "${transcript}"`)
      
      // Process the command
      processCommand(transcript)
    }

    recognitionRef.current.onerror = (event) => {
      console.error('Speech recognition error:', event.error)
      setIsListening(false)
      
      // Clear timeout on error
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
      
      // Handle specific error types
      switch (event.error) {
        case 'network':
          setMessage('❌ Network error. Voice recognition requires internet connection. Use text input below instead.')
          setShowTextInput(true) // Automatically show text input
          break
        case 'not-allowed':
          setMessage('❌ Microphone access denied. Please allow microphone access and refresh the page.')
          setShowTextInput(true)
          break
        case 'no-speech':
          setMessage('❌ No speech detected. Please try speaking again or use text input.')
          break
        case 'audio-capture':
          setMessage('❌ No microphone found. Please check your microphone connection.')
          setShowTextInput(true)
          break
        case 'service-not-allowed':
          setMessage('❌ Speech recognition service not allowed. Please use HTTPS or localhost.')
          setShowTextInput(true)
          break
        default:
          setMessage(`❌ Speech recognition error: ${event.error}. Please use text input below.`)
          setShowTextInput(true)
      }
    }

    recognitionRef.current.onend = () => {
      setIsListening(false)
      // Clear timeout when recognition ends
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setMessage('')
      setTranscript('')
      
      // Check internet connectivity first
      if (!navigator.onLine) {
        setMessage('❌ No internet connection. Voice recognition requires internet. Use text input instead.')
        setShowTextInput(true)
        return
      }
      
      try {
        recognitionRef.current.start()
      } catch (error) {
        console.error('Error starting speech recognition:', error)
        setMessage('❌ Failed to start speech recognition. Please use text input instead.')
        setShowTextInput(true)
      }
    }
  }

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
    }
  }

  const processCommand = async (command) => {
    if (!command.trim()) return

    setIsProcessing(true)
    try {
      const response = await onVoiceCommand(command)
      setMessage(`✅ ${response}`)
    } catch (error) {
      console.error('Error processing command:', error)
      setMessage('❌ Error processing command')
    } finally {
      setIsProcessing(false)
      // Clear message after 5 seconds
      setTimeout(() => setMessage(''), 5000)
    }
  }

  const handleTextSubmit = async (e) => {
    e.preventDefault()
    if (!textInput.trim()) return
    
    setIsProcessing(true)
    try {
      const resultMsg = await (onQuickAdd ? onQuickAdd(textInput) : onVoiceCommand(textInput))
      setMessage(`✅ ${resultMsg || 'Added'}`)
    } catch (error) {
      console.error('Error processing text input:', error)
      setMessage('❌ Error adding item')
    } finally {
      setIsProcessing(false)
    }
    setTextInput('')
    setShowTextInput(false)
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 animate-fade-in">
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-800 mb-4">
          🎤 Voice Commands
        </h2>
        
        <div className="mb-6">
          {/* <div className="bg-gradient-to-r from-pastel-yellow/80 to-pastel-peach/80 border border-yellow-300 rounded-xl p-4 mb-6">
            <p className="text-sm text-yellow-900">
              <strong>⚠️ Voice Recognition Note:</strong> Voice recognition requires a stable internet connection. 
              If you experience network errors, use the text input below - it works perfectly!
            </p>
          </div> */}
          <div className="bg-yellow-100 border border-yellow-200 rounded-xl p-4 mb-6">
  <p className="text-sm text-yellow-800">
    <strong>⚠️ Voice Recognition Note:</strong> Voice recognition requires a stable internet connection. 
    If you experience network errors, use the text input below - it works perfectly!
  </p>
</div>

          
          {/* <button
            onClick={isListening ? stopListening : startListening}
            disabled={isProcessing}
            className={`w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center text-white font-bold text-2xl transition-all duration-300 shadow-lg hover:shadow-xl ${
              isListening 
                ? 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 animate-bounce-gentle' 
                : 'bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 hover:scale-105 hover:cursor-pointer'
            } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isListening ? '🛑' : '🎤'}
          </button> */}
          <button
  onClick={isListening ? stopListening : startListening}
  disabled={isProcessing}
  className={`w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center text-white transition-all duration-300 shadow-lg hover:shadow-xl ${
    isListening 
      ? 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 animate-bounce-gentle' 
      : 'bg-black hover:bg-gray-800 hover:scale-105 hover:cursor-pointer'
  } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
>
  {isListening 
    ? <Square className="w-10 h-10 text-white" />   // stop icon
    : <Mic className="w-10 h-10 text-white" />      // mic icon
  }
</button>
          
<p className="text-sm md:text-base text-gray-600 mt-3 font-medium">
  {isListening ? 'Listening... Speak clearly!' : 'Click to speak'}
</p>

{/* ✅ Message will show here just below mic */}
{message && (
  <div className={`mt-4 p-4 rounded-lg text-sm font-medium ${
    message.includes('✅') 
      ? 'bg-green-100 text-green-800' 
      : message.includes('❌')
      ? 'bg-red-100 text-red-800'
      : 'bg-blue-100 text-blue-800'
  }`}>
    {message}
  </div>
)}

{message && message.includes('❌') && (
  <div className="mt-2 space-x-2">
    <button
      onClick={startListening}
      className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors text-sm"
    >
      🔄 Try Voice Again
    </button>
  </div>  
        )}
        </div>
        <div className="mt-6 text-left">
          <h3 className="text-lg font-medium text-gray-700 mb-3">
            Try saying:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <h4 className="font-medium text-gray-800 mb-2">Adding Items:</h4>
              <ul className="space-y-1">
                <li>• "Add milk"</li>
                <li>• "I need 2 apples"</li>
                <li>• "Buy organic bananas"</li>
                <li>• "Get some bread"</li>
                <li>• "Pick up chicken"</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-800 mb-2">Removing Items:</h4>
              <ul className="space-y-1">
                <li>• "Remove milk"</li>
                <li>• "Delete apples"</li>
                <li>• "Don't need bread"</li>
                <li>• "Cross off chicken"</li>
              </ul>
            </div>
          </div>
        {/* Text Input Section - Always visible as fallback */}
        <div className="mt-10 mb-6 p-6 bg-gradient-to-r from-pastel-green/80 to-pastel-mint/80 border-2 border-green-300 rounded-xl">
          <h3 className="text-lg md:text-xl font-display font-bold text-green-900 mb-4">
          ✏️ Type Your Command
          </h3>
          <form onSubmit={handleTextSubmit}>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Type your command (e.g., add milk, remove bread, I need 2 apples)"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
              />
              <button
                type="submit"
                disabled={!textInput.trim() || isProcessing}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg hover:shadow-xl hover:cursor-pointer"
              >
                {isProcessing ? 'Processing...' : 'Send'}
              </button>
            </div>
          </form>
          <p className="text-sm text-green-700 mt-3">
            💡 This always works even when voice recognition fails! Try: "add milk", "remove bread", "I need 2 apples"
          </p>
        </div>


        

        
          
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <h4 className="font-medium text-blue-800 mb-2">💡 Voice Recognition Tips:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• <strong>Network Error?</strong> Use the text input above - it always works!</li>
              <li>• Use Chrome or Edge browser for best voice results</li>
              <li>• Allow microphone access when prompted</li>
              <li>• Ensure stable internet connection for voice recognition</li>
              <li>• Speak clearly and at normal volume</li>
              <li>• Try the manual form below for adding items directly</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VoiceRecorder

