const app = require('./app'); // Main Express app setup
const config = require('./utils/config');
const logger = require('./utils/logger');

// Start the server
app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`);
});
