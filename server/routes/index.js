const express = require("express");
const router = express.Router();
const parkingRouter = require("./parking");

router.get("/", (req, res) => {
  res.status(200).json({
    message: "Parking App",
  });
});

router.use("/parkings", parkingRouter);

module.exports = router;
