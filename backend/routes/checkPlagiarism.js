const express = require("express");
const router = express.Router();
const { postResult } = require("../controllers/result-controller");

router.post("/results", postResult);

module.exports = router;
