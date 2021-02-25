const express = require("express");
const cors = require("cors");

const resultRoute = require("./routes/checkPlagiarism");

const app = express();

app.use(express.json());
app.use(cors());

app.use("/", resultRoute);

app.listen(5000, () => {
  console.log("The server is up and running");
});
