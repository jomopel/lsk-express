const { Router } = require("express");
const router = Router();

router.get("/", (req, res) => {
  res.render("index", {
    title: "Upload",
  });
});

module.exports = router;
