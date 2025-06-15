const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Commented out OpenAI API configuration
// const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
// const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.post('/api/generate-menu', async (req, res) => {
  const { eventType, guests, preferences, budget } = req.body;

  try {
    // Generate a realistic menu based on inputs
    const menu = {
      appetizer: preferences.includes('Vegan')
        ? `Vegan ${eventType} Canapés`
        : preferences.includes('Vegetarian')
        ? `Vegetarian ${eventType} Bruschetta`
        : preferences.includes('Gluten-Free')
        ? `Gluten-Free ${eventType} Skewers`
        : `${eventType} Mini Quiches`,
      main_course: preferences.includes('Vegan')
        ? 'Vegan Lentil Curry'
        : preferences.includes('Vegetarian')
        ? 'Vegetarian Stuffed Peppers'
        : preferences.includes('Gluten-Free')
        ? 'Gluten-Free Grilled Salmon with Quinoa'
        : 'Herb-Roasted Chicken',
      dessert: budget > 1000 ? 'Premium Chocolate Torte' : 'Fresh Fruit Sorbet',
    };
    res.json(menu);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Failed to generate menu' });
  }

  // Commented out original OpenAI API call beacause it requires an API key and is not functional in this environment


  /*           ........I will adjest the prompt as per your requirements........
  const prompt = `
  You are a professional catering assistant. Your task is to generate a menu for an event based on the provided details. Follow these instructions:
  - Create a menu with exactly one appetizer, one main course, and one dessert.
  - Respect the dietary preferences: ${preferences.join(', ') || 'None'}.
  - Ensure the menu fits within the budget of $${budget} for ${guests} guests (budget includes all costs: food, prep, service).
  - Consider the event type (${eventType}) for appropriate menu style (e.g., elegant for weddings, casual for birthdays).
  - Return the response as a JSON object with keys: "appetizer", "main_course", "dessert".
  - Ensure each dish is realistic, cost-effective, and strictly adheres to the preferences.
  - Do not include any extra text outside the JSON object.

  Example inputs and outputs:
  Input: Event type: Birthday, Guests: 20, Preferences: Vegan, Budget: $500
  Output: {
    "appetizer": "Vegan Stuffed Mushrooms",
    "main_course": "Vegan Lentil Shepherd's Pie",
    "dessert": "Vegan Chocolate Avocado Mousse"
  }
  Input: Event type: Corporate, Guests: 100, Preferences: Gluten-Free, Budget: $2000
  Output: {
    "appetizer": "Gluten-Free Caprese Skewers",
    "main_course": "Gluten-Free Grilled Chicken with Quinoa",
    "dessert": "Gluten-Free Lemon Tart"
  }

  Now, generate a menu for:
  - Event type: ${eventType}
  - Number of guests: ${guests}
  - Dietary preferences: ${preferences.join(', ') || 'None'}
  - Budget: $${budget}

  Return only the JSON object.
  `;

  try {
    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: 'You are a helpful catering assistant.' },
          { role: 'user', content: prompt },
        ],
        max_tokens: 200,
        temperature: 0.7,
        top_p: 0.9,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    let menu;
    try {
      menu = JSON.parse(response.data.choices[0].message.content);
    } catch (e) {
      return res.status(500).json({ error: 'Invalid JSON response from OpenAI API' });
    }

    res.json(menu);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Failed to generate menu' });
  }
  */
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));