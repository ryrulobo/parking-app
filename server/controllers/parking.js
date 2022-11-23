const { ParkingData } = require("../models");
const { parkingFee } = require("../helpers/calculateParkingFee");
const { dateChecker } = require("../helpers/dateChecker");
const { Op } = require("sequelize");
const { getPagination } = require("../helpers/pagination");

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
      let { type, startDate, endDate, page, size } = req.query;
      const { limit, offset } = getPagination(page - 1, size);

      const option = {
        attributes: { exclude: ["createdAt", "updatedAt"] },
        order: [["id", "DESC"]],
        limit,
        offset,
      };

      //! Filter by vehicle type
      if (!!type) {
        option.where = {
          ...option.where,
          vehicleType: { [Op.iLike]: `%${type}%` },
        };
      }

      //! Filter by date
      // 1. Shows data from start date to end date
      if (!!startDate && !!endDate) {
        option.where = {
          ...option.where,
          startTime: { [Op.between]: [startDate, endDate] },
        };
      }

      // 2. Shows data from start date until today
      if (!!startDate & !endDate) {
        startDate = new Date(startDate);
        option.where = {
          ...option.where,
          startTime: { [Op.between]: [startDate, new Date()] },
        };
      }

      let result = await ParkingData.findAll(option);

      res.status(200).json({ result });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = ParkingController;
