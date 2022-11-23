const router = require("express").Router();
const ParkingRouter = require("../controllers/parking");

router.post("/", ParkingRouter.add);
router.get("/data", ParkingRouter.showAllData);

module.exports = router;
