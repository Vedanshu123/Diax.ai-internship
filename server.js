const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, "public")));

// Helper function to update statistics
function updateStatistics(feedback) {
  const statsPath = path.join(__dirname, "statistics.json");
  const stats = JSON.parse(fs.readFileSync(statsPath, "utf-8"));

  stats.question1[feedback.question1]++;
  stats.question2[feedback.question2]++;
  stats.question3[feedback.question3]++;

  fs.writeFileSync(statsPath, JSON.stringify(stats, null, 2), "utf-8");
}

// Endpoint to handle form submission
app.post("/submit-feedback", (req, res) => {
  const feedback = req.body;

  // Append feedback to feedback.json
  fs.appendFile("feedback.json", JSON.stringify(feedback) + "\n", (err) => {
    if (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    } else {
      // Update statistics.json
      updateStatistics(feedback);
      res.status(200).send("Feedback received");
    }
  });
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, "192.168.111.215", () => {
  console.log(`Server is running on http://192.168.111.215:${PORT}`);
});
