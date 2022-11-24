const { ParkingData } = require("../models");
const { parkingFee } = require("../helpers/calculateParkingFee");
const { dateChecker } = require("../helpers/dateChecker");
const { Op } = require("sequelize");
const { getPagination } = require("../helpers/pagination");

class ParkingController {
  static async add(req, res, next) {
    try {
      const { startTime, endTime, vehicleType, licensePlate } = req.body;

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
      res.status(201).json({ result });
    } catch (err) {
      next(err);
    }
  }

  static async showAllData(req, res, next) {
    try {
      let { type, startDate, endDate, page, size, min, max, plate } = req.query;

      const { limit, offset } = getPagination(page - 1, size);

      if (min && max && +min > +max)
        throw { name: "Invalid parking fee value" };

      if (
        startDate &&
        endDate &&
        new Date(startDate).getTime() > new Date(endDate).getTime()
      )
        throw { name: "Invalid date filter" };

      const option = {
        attributes: { exclude: ["createdAt", "updatedAt"] },
        order: [["endTime", "DESC"]],
        limit,
        offset,
      };

      //! Filter by vehicle type
      if (!!type) {
        option.where = {
          ...option.where,
          vehicleType: { [Op.eq]: `${type}` },
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
      if (!!startDate && !endDate) {
        startDate = new Date(startDate);
        option.where = {
          ...option.where,
          endTime: { [Op.between]: [startDate, new Date()] },
        };
      }

      //! Filter by parking fee
      // 1. Shows data between 2 values
      if (!!min && !!max) {
        option.where = {
          ...option.where,
          parkingFee: { [Op.between]: [min, max] },
        };
      }

      // 2. Shows data which is greater than given value
      if (!!min && !max) {
        option.where = {
          ...option.where,
          parkingFee: { [Op.gte]: min },
        };
      }

      // 3. Shows data which is smaller than given value
      if (!min && !!max) {
        option.where = {
          ...option.where,
          parkingFee: { [Op.between]: [0, max] },
        };
      }

      //! Filter by plate number
      if (!!plate) {
        option.where = {
          ...option.where,
          licensePlate: { [Op.iLike]: `%${plate}%` },
        };
      }

      let result = await ParkingData.findAndCountAll(option);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = ParkingController;
