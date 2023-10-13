require("dotenv").config();
const express = require("express");
const messenger = require("./routes/messenger");
const app = express();
const port = process.env.PORT || 3000;
var cors = require("cors");

const logger = require("./config/logger");

app.use("/", express.static("./dist"));
const bodyParser = require("body-parser");
app.use(cors());
app.use(bodyParser.json());
app.use("/messenger", messenger);
app.use("/*", (req, res) => {
  res.send("Route not found").status(404);
});
const server = app.listen(port, () => {
  logger.info(
    `\n\n[${process.pid}] app listening at http://localhost:${port}\n\n`
  );
});

process.on("SIGINT", () => {
  console.log("server ending", Date.now());
  server.close(() => process.exit());
});
