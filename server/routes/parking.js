const router = require("express").Router();
const ParkingController = require("../controllers/parking");

router.post("/", ParkingController.add);
router.get("/data", ParkingController.showAllData);

module.exports = router;
