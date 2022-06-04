const http = require('http');

const initializeServer = () => {
  http
    .createServer((req, res) => {
      res.write('Hello!');
      res.end();
    })
    .listen(5000);
};

module.exports = { initializeServer };
