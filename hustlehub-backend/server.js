const app = require('./app');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

// TODO (Sayali): replace app.listen with https.createServer using SSL cert/key per Req 6
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});