# Voice Command Shopping Assistant

A voice-based shopping list manager with smart suggestions built with React, Express.js, and MongoDB.

## Features

### ✅ Implemented
- **Voice Input**: Voice command recognition for adding/removing items
- **Natural Language Processing**: Understands varied user phrases
- **Shopping List Management**: Add, remove, and categorize items
- **Real-time UI**: Visual feedback for voice commands
- **Responsive Design**: Mobile-optimized interface with Tailwind CSS

### 🚧 Planned Features
- **Smart Suggestions**: Product recommendations based on history
- **Seasonal Recommendations**: Suggest seasonal items
- **Substitutes**: Offer product alternatives
- **Multilingual Support**: Voice commands in multiple languages
- **Price Range Filtering**: Voice-based price filtering
- **Quantity Management**: Specify quantities via voice

## Tech Stack

### Frontend
- **React 19** with Vite
- **Tailwind CSS** for styling
- **react-speech-kit** for voice recognition
- **Axios** for API calls

### Backend
- **Express.js** server
- **MongoDB** with Mongoose
- **CORS** enabled for cross-origin requests
- **RESTful API** endpoints

## Project Structure

```
voice-shopping-assistant/
├── frontend/                 # React + Vite frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── Header.jsx
│   │   │   ├── VoiceRecorder.jsx
│   │   │   └── ShoppingList.jsx
│   │   ├── App.jsx          # Main app component
│   │   └── index.css        # Tailwind CSS
│   ├── package.json
│   └── tailwind.config.js
├── backend/                  # Express.js backend
│   ├── models/              # MongoDB models
│   │   └── ShoppingItem.js
│   ├── routes/              # API routes
│   │   └── shoppingList.js
│   ├── server.js            # Main server file
│   └── package.json
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- Modern web browser with microphone access

### 1. Clone and Setup
```bash
# Navigate to the project directory
cd voice-shopping-assistant

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Database Setup
Make sure MongoDB is running on your system:
```bash
# For local MongoDB
mongod

# Or use MongoDB Atlas (cloud)
# Update the connection string in backend/.env
```

### 3. Environment Configuration
Create a `.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/voice-shopping
NODE_ENV=development
```

### 4. Start the Application

#### Start Backend Server
```bash
cd backend
npm run dev
```
The backend will run on `http://localhost:5000`

#### Start Frontend Development Server
```bash
cd frontend
npm run dev
```
The frontend will run on `http://localhost:5173`

## Usage

### Voice Commands
The app supports various voice commands:

**Adding Items:**
- "Add milk to my list"
- "I need apples"
- "Add 2 bottles of water"
- "I want to buy organic bananas"

**Removing Items:**
- "Remove milk from my list"
- "Delete apples"

### Manual Interaction
- Click the microphone button to start voice recognition
- Click items to mark them as completed
- Click the trash icon to remove items
- Items are automatically categorized (dairy, produce, meat, etc.)

## API Endpoints

### Shopping List
- `GET /api/shopping-list` - Get all items
- `POST /api/shopping-list` - Add new item
- `PUT /api/shopping-list/:id` - Update item
- `DELETE /api/shopping-list/:id` - Delete item
- `PATCH /api/shopping-list/:id/toggle` - Toggle completion
- `POST /api/shopping-list/voice-command` - Process voice command

## Development

### Adding New Features
1. **Frontend**: Add components in `frontend/src/components/`
2. **Backend**: Add routes in `backend/routes/` and models in `backend/models/`
3. **Voice Processing**: Extend the `processVoiceCommand` function in `backend/routes/shoppingList.js`

### Voice Command Processing
The app uses a simple NLP approach to process voice commands:
- Extracts item names by removing common command words
- Identifies quantities from numbers in the command
- Categorizes items based on keyword matching
- Supports add/remove operations

## Browser Compatibility
- Chrome/Chromium (recommended for best voice recognition)
- Firefox
- Safari
- Edge

**Note**: Voice recognition requires HTTPS in production or localhost for development.

## Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License
MIT License - feel free to use this project for learning and development.

## Future Enhancements
- Integration with grocery store APIs
- Machine learning for better item categorization
- Offline support with PWA features
- Multi-user support with authentication
- Shopping history analytics
- Integration with smart home devices
