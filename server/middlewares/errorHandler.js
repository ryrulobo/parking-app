function errorHandler(err, req, res, next) {
  console.log("Error:", err);

  let errCode = 500;
  let message = "Internal Server Error";

  switch (err.name) {
    case "SequelizeValidationError":
    case "SequelizeUniqueConstraintError":
      errCode = 400;
      message = err.errors[0].message;
      break;
    case "Vehicle type is required":
      errCode = 400;
      message = "Vehicle type is required";
      break;
    case "Invalid vehicle type":
      errCode = 400;
      message = "Invalid vehicle type";
      break;
    case "Start time is required":
      errCode = 400;
      message = "Start time is required";
      break;
    case "End time is required":
      errCode = 400;
      message = "End time is required";
      break;
    case "Invalid date input":
      errCode = 400;
      message = "Input must be a valid date";
      break;
    case "startTime > endTime":
      errCode = 400;
      message = "Start time cannot be greater than the end date";
      break;
    case "License plate is required":
      errCode = 400;
      message = "License plate is required";
      break;
    case "Invalid parking fee value":
      errCode = 400;
      message = "Min fee cannot be greater than the max fee";
      break;
    case "Invalid date filter":
      errCode = 400;
      message = "Start date cannot be greater than the end date";
      break;
  }
  res.status(errCode).json({ message });
}

module.exports = errorHandler;
