"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ParkingData extends Model {
    static associate(models) {
      // define association here
    }
  }
  ParkingData.init(
    {
      vehicleType: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Vehicle type is required" },
          notEmpty: { msg: "Vehicle type is required" },
        },
      },
      startTime: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          notNull: { msg: "Start time is required" },
          notEmpty: { msg: "Start time is required" },
          isDate: { msg: "Start time must be a valid date" },
        },
      },
      endTime: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          notNull: { msg: "End time is required" },
          notEmpty: { msg: "End time is required" },
          isDate: { msg: "End time must be a valid date" },
        },
      },
      parkingFee: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "Parking fee is required" },
          notEmpty: { msg: "Parking fee is required" },
        },
      },
      licensePlate: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "License plate is required" },
          notEmpty: { msg: "License plate is required" },
        },
      },
    },
    {
      sequelize,
      modelName: "ParkingData",
    }
  );
  return ParkingData;
};
