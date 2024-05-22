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
  const { object, action, crn, name, response } = req.body;

  if (action === "A") {
    // Ensure response is parsed correctly
    const parsedResponse = JSON.parse(response);

    // Increment total submissions count
    responses.totalSubmissions++;

    // Aggregate responses
    aggregateResponses(responses.q1, parsedResponse.q1);
    aggregateResponses(responses.q2, parsedResponse.q2);
    aggregateResponses(responses.q3, parsedResponse.q3);

    // Log the survey name
    console.log(`Survey from: ${name}`);

    // Send response indicating success
    res.json({
      success: true,
      message: "Feedback submitted successfully",
      totalSubmissions: responses.totalSubmissions,
    });
  } else if (action === "R") {
    // Send response with aggregated data
    res.json({
      response: [
        {
          response: responses,
        },
      ],
    });
  } else {
    res.status(400).json({ success: false, message: "Invalid action" });
  }
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

app.listen(port, () => {
  console.log(`Server is running on "http://ip address":${port}`);
});
