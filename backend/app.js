require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT;

// Middleware to parse JSON
app.use(express.json());

//sample route
app.get('/', (req,res) =>{
    res.send("Hello World");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});