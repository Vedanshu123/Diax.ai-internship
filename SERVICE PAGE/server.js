const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;

let responses = {
  q1: { yes: 0, no: 0, NC: 0 },
  q2: { yes: 0, no: 0, NC: 0 },
  q3: { yes: 0, no: 0, NC: 0 },
  totalSubmissions: 0,
};

app.use(bodyParser.json());
app.use(express.static("public"));

app.post("/submit", (req, res) => {
  const { q1, q2, q3 } = req.body.responses;

  responses.q1[q1]++;
  responses.q2[q2]++;
  responses.q3[q3]++;
  responses.totalSubmissions++;

  res.sendStatus(200);
});

app.get("/responses", (req, res) => {
  res.json(responses);
});

app.listen(port, () => {
  console.log(`Server running on "IP ADDRESS":${port}`);
});
