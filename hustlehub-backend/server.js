const fs = require('fs');
const path = require('path');
const https = require('https');
const app = require('./app');
require('dotenv').config();

const PORT = process.env.PORT || 5000;
const connectDB = require('./config/db');


const sslOptions = {
  key: fs.readFileSync(path.join(__dirname, 'ssl', 'key.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'ssl', 'cert.pem'))
};

https.createServer(sslOptions, app).listen(PORT, () => {
  console.log(`Server running on https://localhost:${PORT}`);
});

connectDB()
  .then(() => {
    https.createServer(sslOptions, app).listen(PORT, () => {
      console.log(`Server running on https://localhost:${PORT}`);
    });
  })
  .catch(() => {
    console.error('Failed to connect to database');
    process.exit(1);
  });