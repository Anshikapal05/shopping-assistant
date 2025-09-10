const express = require('express');
const router = express.Router();
const ShoppingItem = require('../models/ShoppingItem');
const catalog = require('../utils/catalog');

// Get all shopping items
router.get('/', async (req, res) => {
  try {
    const items = await ShoppingItem.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Suggestions: basic recommendations and substitutes
router.get('/suggestions', async (req, res) => {
  try {
    const recent = await ShoppingItem.find().sort({ updatedAt: -1 }).limit(25);
    const names = new Set(recent.map(i => i.name.toLowerCase()));
    // Product recommendations (not in cart recently)
    const recommendations = catalog.filter(p => !names.has(p.name.toLowerCase())).slice(0, 8);

    // Seasonal (mock: produce prioritized)
    const seasonal = catalog.filter(p => p.category === 'produce').slice(0, 6);

    // Substitutes map for common items
    const substitutes = [];
    if (names.has('milk')) {
      substitutes.push({ for: 'milk', alternatives: catalog.filter(p => /almond milk/i.test(p.name)).slice(0, 3) });
    }
    if (names.has('bread')) {
      substitutes.push({ for: 'bread', alternatives: catalog.filter(p => /bread|bagel|roll/i.test(p.name)).slice(0, 3) });
    }

    res.json({ recommendations, seasonal, substitutes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add new shopping item
router.post('/', async (req, res) => {
  try {
    const item = new ShoppingItem(req.body);
    await item.save();
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update shopping item
router.put('/:id', async (req, res) => {
  try {
    const item = await ShoppingItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete shopping item
router.delete('/:id', async (req, res) => {
  try {
    const item = await ShoppingItem.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Toggle item completion
router.patch('/:id/toggle', async (req, res) => {
  try {
    const item = await ShoppingItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    item.completed = !item.completed;
    await item.save();
    res.json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Process voice command
router.post('/voice-command', async (req, res) => {
  try {
    const { command } = req.body;
    
    // Simple voice command processing
    const processedCommand = processVoiceCommand(command);
    
    if (processedCommand.action === 'search') {
      const results = searchCatalog({
        query: processedCommand.query,
        brand: processedCommand.brand,
        minPrice: processedCommand.minPrice,
        maxPrice: processedCommand.maxPrice
      });
      return res.json({ message: `Found ${results.length} results`, results });
    } else if (processedCommand.action === 'add') {
      const item = new ShoppingItem({
        ...processedCommand.item,
        addedByVoice: true,
        voiceCommand: command
      });
      await item.save();
      res.json({ item, message: `Added ${processedCommand.item.name} to your shopping list` });
    } else if (processedCommand.action === 'remove') {
      const item = await ShoppingItem.findOneAndDelete({ 
        name: { $regex: processedCommand.item.name, $options: 'i' } 
      });
      if (item) {
        res.json({ message: `Removed ${item.name} from your shopping list` });
      } else {
        res.json({ message: `Could not find ${processedCommand.item.name} in your shopping list` });
      }
    } else {
      res.json({ message: 'Command processed', processedCommand });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Enhanced voice command processing function
function processVoiceCommand(command) {
  const lowerCommand = command.toLowerCase().trim();
  // Search commands
  const searchPatterns = ['find', 'search', 'look for'];
  const isSearch = searchPatterns.some(p => lowerCommand.includes(p));
  if (isSearch) {
    const brandMatch = lowerCommand.match(/\bby\s+([a-z0-9\- ]+)/i);
    const brand = brandMatch ? brandMatch[1].trim() : undefined;
    const priceMatch = lowerCommand.match(/under\s*\$?\s*(\d+(?:\.\d+)?)/i);
    const maxPrice = priceMatch ? parseFloat(priceMatch[1]) : undefined;
    const minMatch = lowerCommand.match(/over\s*\$?\s*(\d+(?:\.\d+)?)/i);
    const minPrice = minMatch ? parseFloat(minMatch[1]) : undefined;
    // strip keywords to extract query
    const query = lowerCommand
      .replace(/find|search|look for|under|over|\$|by/gi, ' ')
      .replace(/\d+(?:\.\d+)?/g, ' ')
      .replace(/\s+/g, ' ') 
      .trim();
    return { action: 'search', query, brand, minPrice, maxPrice };
  }
  
  console.log('Processing command:', lowerCommand);
  
  // Add commands - more comprehensive patterns
  const addPatterns = [
    'add', 'i need', 'i want', 'buy', 'get', 'pick up', 'grab', 
    'put', 'include', 'i should get', 'i have to get', 'i forgot to get'
  ];
  
  const isAddCommand = addPatterns.some(pattern => lowerCommand.includes(pattern));
  
  if (isAddCommand) {
    const itemName = extractItemName(lowerCommand);
    const quantity = extractQuantity(lowerCommand);
    const category = categorizeItem(itemName);
    
    if (itemName && itemName.length > 0) {
      return {
        action: 'add',
        item: {
          name: itemName,
          quantity: quantity,
          category: category
        }
      };
    }
  }
  
  // Remove commands - more comprehensive patterns
  const removePatterns = [
    'remove', 'delete', 'take off', 'cross off', 'cross out', 
    'don\'t need', 'don\'t want', 'cancel', 'forget'
  ];
  
  const isRemoveCommand = removePatterns.some(pattern => lowerCommand.includes(pattern));
  
  if (isRemoveCommand) {
    const itemName = extractItemName(lowerCommand);
    if (itemName && itemName.length > 0) {
      return {
        action: 'remove',
        item: { name: itemName }
      };
    }
  }
  
  // If no clear action, try to extract item name anyway (assume add)
  const itemName = extractItemName(lowerCommand);
  if (itemName && itemName.length > 0) {
    const quantity = extractQuantity(lowerCommand);
    const category = categorizeItem(itemName);
    
    return {
      action: 'add',
      item: {
        name: itemName,
        quantity: quantity,
        category: category
      }
    };
  }
  
  return { action: 'unknown', item: null };
}

function searchCatalog({ query, brand, minPrice, maxPrice }) {
  const q = (query || '').toLowerCase();
  return catalog.filter(p => {
    const matchesQuery = !q || p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
    const matchesBrand = !brand || (p.brand && p.brand.toLowerCase().includes(brand.toLowerCase()));
    const matchesMin = minPrice == null || (p.price != null && p.price >= minPrice);
    const matchesMax = maxPrice == null || (p.price != null && p.price <= maxPrice);
    return matchesQuery && matchesBrand && matchesMin && matchesMax && p.available !== false;
  }).slice(0, 25);
}

function extractItemName(command) {
  // Remove common command words and extract the item name
  const words = command.split(' ');
  const removeWords = [
    'add', 'i', 'need', 'want', 'to', 'buy', 'get', 'remove', 'delete', 
    'from', 'my', 'list', 'pick', 'up', 'grab', 'put', 'include', 
    'should', 'have', 'forgot', 'take', 'off', 'cross', 'out', 
    'don\'t', 'cancel', 'forget', 'the', 'a', 'an', 'some'
  ];
  
  const filteredWords = words.filter(word => 
    !removeWords.includes(word.toLowerCase()) && 
    word.length > 0 &&
    !/^\d+$/.test(word) // Remove standalone numbers
  );
  
  let itemName = filteredWords.join(' ').trim();
  
  // Clean up common speech recognition artifacts
  itemName = itemName.replace(/\b(um|uh|er|ah)\b/g, '').trim();
  itemName = itemName.replace(/\s+/g, ' ').trim();
  
  return itemName;
}

function extractQuantity(command) {
  const numbers = command.match(/\d+/);
  return numbers ? parseInt(numbers[0]) : 1;
}

function categorizeItem(itemName) {
  const categories = {
    dairy: ['milk', 'cheese', 'yogurt', 'butter', 'cream', 'dairy', 'milk', 'cheese', 'yogurt', 'butter', 'cream', 'sour cream', 'cottage cheese', 'mozzarella', 'cheddar'],
    produce: ['apple', 'banana', 'orange', 'lettuce', 'tomato', 'carrot', 'onion', 'potato', 'broccoli', 'spinach', 'cucumber', 'pepper', 'avocado', 'lemon', 'lime', 'grape', 'strawberry', 'blueberry', 'organic'],
    meat: ['chicken', 'beef', 'pork', 'fish', 'turkey', 'salmon', 'tuna', 'ham', 'bacon', 'sausage', 'ground beef', 'steak'],
    bakery: ['bread', 'roll', 'bagel', 'muffin', 'cake', 'croissant', 'donut', 'cookie', 'pastry', 'tortilla', 'pita'],
    snacks: ['chips', 'crackers', 'nuts', 'cookies', 'candy', 'popcorn', 'pretzel', 'granola', 'trail mix', 'chocolate'],
    beverages: ['water', 'juice', 'soda', 'coffee', 'tea', 'beer', 'wine', 'milk', 'smoothie', 'energy drink', 'sports drink'],
    household: ['toilet paper', 'soap', 'shampoo', 'detergent', 'tissue', 'paper towel', 'cleaning', 'laundry', 'dish soap', 'toothpaste', 'deodorant'],
    frozen: ['frozen', 'ice cream', 'frozen dinner', 'frozen pizza', 'frozen vegetables'],
    pantry: ['rice', 'pasta', 'cereal', 'oats', 'flour', 'sugar', 'salt', 'pepper', 'oil', 'vinegar', 'sauce', 'soup', 'canned']
  };
  
  const lowerItemName = itemName.toLowerCase();
  
  for (const [category, items] of Object.entries(categories)) {
    if (items.some(item => lowerItemName.includes(item.toLowerCase()))) {
      return category;
    }
  }
  
  return 'other';
}

module.exports = router;
