const express = require('express')
const mongoose = require('mongoose');
const env = require('dotenv')
const app = express();
env.config();

// Connect DB
mongoose.connect(process.env.MONGODB_URL, () => {
    console.log('Connected to db.');
})

// Import routes
app.use(express.json());
app.use('/api/user', require('./controller/userController'));
app.use('/api/game/calendar', require('./controller/calendarController'));

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
