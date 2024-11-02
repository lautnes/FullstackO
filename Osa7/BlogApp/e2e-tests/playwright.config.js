const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  use: {
    baseURL: 'http://localhost:5173', 
  },
  timeout: 6000,  
  fullyParallel: false,
  workers: 1,
});
