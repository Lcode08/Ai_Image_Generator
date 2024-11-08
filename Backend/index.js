require('dotenv').config(); // Load environment variables
const express = require('express');
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors()); // Enable CORS for all routes

app.use(express.json()); // Middleware to parse JSON requests

// Route to handle Hugging Face API requests
app.post('/api/query', async (req, res) => {
  try {
    const response = await fetch("https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HUGGING_FACE_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(req.body)
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Error from Hugging Face API:", error);
      return res.status(response.status).json({ error });
    }

    const result = await response.blob();
    const buffer = await result.arrayBuffer();
    res.type("image/png").send(Buffer.from(buffer)); // Send the image as response
  } catch (error) {
    console.error("Error fetching data from API:", error);
    res.status(500).json({ error: "Failed to fetch data from API" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
