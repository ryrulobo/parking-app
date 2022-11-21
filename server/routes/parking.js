const router = require("express").Router();
const ParkingRouter = require("../controllers/parking");

router.post("/", ParkingRouter.add);

module.exports = router;
