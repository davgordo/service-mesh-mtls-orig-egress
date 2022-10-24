const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app)

const PRODUCTION = app.get('env') === 'production';

app.get('/', (req, res) => {
  req.log.info({message: 'Hello from Node.js server Application!'});
  res.send('Hello from Node.js server Application!');
});

app.get('*', (req, res) => {
  res.status(404).send("Not Found");
});

// Listen and serve.
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`App started on PORT ${PORT}`);
});