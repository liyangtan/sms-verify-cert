require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const SmsProxy = require("./SmsProxy");
const Nexmo = require("nexmo");
const smsProxy = new SmsProxy();
let verifyRequestId;

const nexmo = new Nexmo({
  apiKey: process.env.API_KEY,
  apiSecret: process.env.API_SECRET,
});

const app = express();
app.set("port", process.env.PORT || 3000);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(app.get("port"), function () {
  console.log("SMS Proxy App listening on port", app.get("port"));
});

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.post("/register", (req, res) => {
  const newUser = req.body.newUser;
  console.log("----/register----");
  console.log(newUser);
  res.send("OK");

  nexmo.verify.request(
    {
      number: newUser,
      brand: process.env.BRAND_NAME,
      worflow_id: 6,
    },
    (err, result) => {
      if (err) {
        console.error(err);
      } else {
        verifyRequestId = result.request_id;
        console.log("request_id", verifyRequestId);
      }
    }
  );
});

app.post("/verify", (req, res) => {
  const request_id = verifyRequestId;
  const code = req.body.code;
  console.log("----/verify----");
  console.log("Received Request Id", request_id);
  console.log("Received code", code);
  res.send("OK");

  nexmo.verify.check(
    {
      request_id: request_id,
      code: code,
    },
    (err, result) => {
      if (err) {
        console.error(err);
      } else {
        console.log(result);
      }
    }
  );
});

// Handle and route incoming SMS to virtual numbers
app.post("/webhooks/inbound-sms", (req, res) => {
  const from = req.body.msisdn;
  const text = req.body.text;
  console.log(req.body);
  // Route virtual number to real number
  smsProxy.proxySms(parseInt(from), text);

  res.sendStatus(204);
});

// Start a chat
app.post("/chat", (req, res) => {
  const userANumber = req.body.userANumber;
  const userBNumber = req.body.userBNumber;
  console.log("----/chat----");
  console.log("User A", userANumber);
  console.log("User B", userBNumber);
  smsProxy.createChat(userANumber, userBNumber, (err, result) => {
    if (err) {
      res.status(500).json(err);
    } else {
      res.json(result);
    }
  });
  res.send("OK");
});
