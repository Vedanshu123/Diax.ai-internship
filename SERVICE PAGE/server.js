const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;

// Initialize responses object to store survey responses
let responses = {
  q1: { yes: 0, no: 0, NC: 0 },
  q2: { yes: 0, no: 0, NC: 0 },
  q3: { yes: 0, no: 0, NC: 0 },
  totalSubmissions: 0,
};

app.use(bodyParser.json());
app.use(express.static("public"));

app.post("/request", (req, res) => {
  const response = JSON.parse(req.body.response);

  // Increment total submissions count
  responses.totalSubmissions++;

  // Aggregate responses
  aggregateResponses(responses.q1, response.q1);
  aggregateResponses(responses.q2, response.q2);
  aggregateResponses(responses.q3, response.q3);

  // Send response with aggregated data
  res.json({
    success: true,
    message: "Feedback submitted successfully",
    totalSubmissions: responses.totalSubmissions,
    aggregatedResponses: responses,
  });
});

// Function to aggregate responses
function aggregateResponses(question, response) {
  if (response === "yes") {
    question.yes++;
  } else if (response === "no") {
    question.no++;
  } else {
    question.NC++;
  }
}

app.get("/results", (req, res) => {
  res.json(responses);
});

app.listen(port, () => {
  console.log(`Server is running on port "enter IP ADDRESS" ${port}`);
});
