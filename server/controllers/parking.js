const { ParkingData } = require("../models");
const { parkingFee } = require("../helpers/calculateParkingFee");
const { dateChecker } = require("../helpers/dateChecker");

class ParkingController {
  static async add(req, res, next) {
    try {
      const { startTime, endTime, vehicleType, licensePlate } = req.body;
      console.log(req.body);

      if (!vehicleType) throw { name: "Vehicle type is required" };
      if (vehicleType !== "mobil" && vehicleType !== "motor")
        throw { name: "Invalid vehicle type" };
      if (!startTime) throw { name: "Start time is required" };
      if (!dateChecker(startTime)) throw { name: "Invalid date input" };
      if (!endTime) throw { name: "End time is required" };
      if (!dateChecker(endTime)) throw { name: "Invalid date input" };
      if (!licensePlate) throw { name: "License plate is required" };

      let result = parkingFee(startTime, endTime, vehicleType);
      await ParkingData.create({
        startTime,
        endTime,
        vehicleType,
        parkingFee: result.total,
        licensePlate: licensePlate.toUpperCase(),
      });
      res.status(200).json({ result });
    } catch (err) {
      next(err);
    }
  }

  static async showAllData(req, res, next) {
    try {
      let result = await ParkingData.findAll({
        attributes: { exclude: ["createdAt", "updatedAt"] },
      });
      res.status(200).json({ result });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = ParkingController;
