# Voice Shopping Assistant

A voice-powered shopping list with smart suggestions and voice search. Built with React (Vite + Tailwind), Express.js, and MongoDB.

## Features

### ✅ Implemented
- **Voice input**: Add/remove/toggle items via speech
- **Text command input**: Type natural phrases (e.g., "add 2 apples")
- **Quick commands**: One-click add of common commands (non-voice)
- **Shopping list**: Add, remove, toggle complete, categories, quantities
- **Smart suggestions**: Recommendations, seasonal picks, and substitutes
- **Voice search**: Search catalog by name/brand and filter by price (e.g., "find toothpaste under $5")
- **Responsive UI** with Tailwind CSS

### 🚧 Planned
- Multilingual voice commands
- Auth and multi-user lists
- Store integrations and richer catalog

## Tech Stack

### Frontend
- React 19 + Vite
- Tailwind CSS
- react-speech-kit (browser speech API)
- Axios

### Backend
- Express.js
- MongoDB with Mongoose
- Simple NLP in `shoppingList.js`
- In-memory catalog in `backend/utils/catalog.js` for suggestions/search

## Project Structure

```
voice-shopping-assistant/
├── frontend/                 # React + Vite frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── Header.jsx
│   │   │   ├── VoiceRecorder.jsx
│   │   │   ├── QuickCommands.jsx
│   │   │   ├── Suggestions.jsx
│   │   │   ├── SearchResults.jsx
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
│   ├── utils/
│   │   └── catalog.js       # lightweight demo catalog
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
The frontend will run on `http://localhost:5173` (or the next free port)

## Usage

### Voice Commands & Search
The app supports:

**Adding Items:**
- "Add milk to my list"
- "I need apples"
- "Add 2 bottles of water"
- "I want to buy organic bananas"

**Removing Items:**
- "Remove milk from my list"
- "Delete apples"

**Voice Search:**
- "Find organic apples"
- "Search toothpaste under $5"
- "Look for milk by DairyPure"

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
- `POST /api/shopping-list/voice-command` - Process voice command or voice search
- `GET /api/shopping-list/suggestions` - Smart suggestions (recommendations/seasonal/substitutes)

### Voice command processing
- Adds/removes items and can interpret search queries with brand/price filters.

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

## Deploying (Firebase Hosting + hosted backend)

1. Set API base URL in the frontend:
   - In `frontend/src/App.jsx` ensure:
     ```js
     const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'
     ```
   - Create `frontend/.env.production` with:
     ```
     VITE_API_BASE_URL=https://YOUR-BACKEND-URL/api
     ```
2. Build frontend:
   ```bash
   cd frontend && npm run build
   ```
3. Firebase Hosting:
   ```bash
   npm i -g firebase-tools
   firebase login
   firebase init hosting   # public dir: frontend/dist, SPA: yes
   firebase deploy --only hosting
   ```
4. Host backend (Render/Railway/Cloud Run) and point `VITE_API_BASE_URL` to it.

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
