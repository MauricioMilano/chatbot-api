var express = require("express");
var router = express.Router();
const pipeline = require("../pipelines/messengerToWatson");
const logger = require("../config/logger");
const SpreadsheetAPI = require("../repositories/spreadsheetRepository");
const spreadsheetInstance = new SpreadsheetAPI("1c5FDbAJiHw1dqv06cxQ46Uegsy4uJ_7q2lbr_jwJpCM", {
  keyFile: "credentials.json",
  scopes: "https://www.googleapis.com/auth/spreadsheets",
});

router.get("/webhook", (req, res) => {
  req.logger = logger;
  // Your verify token. Should be a random string.
  let VERIFY_TOKEN = "teste123";

  // Parse the query params
  let mode = req.query["hub.mode"];
  let token = req.query["hub.verify_token"];
  let challenge = req.query["hub.challenge"];

  // Checks if a token and mode is in the query string of the request
  if (mode && token) {
    // Checks the mode and token sent is correct
    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      // Responds with the challenge token from the request
      console.log("WEBHOOK_VERIFIED");
      try {
        res.status(200).send(challenge);
      } catch (err) {
        console.log(err);
      }
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  } else {
    res.sendStatus(400);
  }
});

router.post("/webhook", async (req, res) => {
  req.logger = logger;

  req.repository = spreadsheetInstance;
  // let body = req.body;

  // Checks this is an event from a page subscription
  // if (body.object === 'page') {
  try{

    // Iterates over each entry - there may be multiple if batched
    // body.entry.forEach(async function (entry) {
      // Gets the message. entry.messaging is an array, but
      // will only ever contain one message, so we get index 0
      // req.messengerEvent = entry;
    let response = await pipeline.processa(req, res);
    // });
    
    // Returns a '200 OK' response to all requests
    res.status(200).send(response);
    // } else {
      //     res.sendStatus(404);
      //     // Returns a '404 Not Found' if event is not from a page subscription
    }catch(error){
      logger.error(error)
    }
  // }
});

module.exports = router;
