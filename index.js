const config = require("./config/index");
const server = require("./server");

Promise = require("bluebird");

server.listen(
  config.port,
  console.log(`Server started on port ${config.port}`)
);
