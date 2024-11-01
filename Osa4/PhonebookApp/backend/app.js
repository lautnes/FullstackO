const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const config = require('./utils/config');
const logger = require('./utils/logger');
const middleware = require('./utils/middleware');
const blogsRouter = require('./controllers/blogs');
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');

const app = express();

// Connect to MongoDB
mongoose.connect(config.MONGODB_URI)
  .then(() => logger.info('Connected to MongoDB'))
  .catch(error => logger.error('Error connecting to MongoDB:', error.message));

// Middleware
app.use(cors());
app.use(express.json());
app.use(middleware.requestLogger);
app.use(middleware.tokenExtractor); // Token extractor for all requests

// Routes
app.use('/api/login', loginRouter); // Add a login route for token creation
app.use('/api/users', usersRouter);
app.use('/api/blogs', middleware.userExtractor, blogsRouter); // Apply user extraction to /api/blogs

// Unknown endpoint and error handling middleware
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
