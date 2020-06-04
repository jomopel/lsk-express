const express = require("express");
const router = express.Router();
const practice = require("../../Practice");

//get all
router.get("/", (req, res) => {
  res.json(practice);
});

//plus

module.exports = router;
