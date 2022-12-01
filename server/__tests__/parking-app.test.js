const request = require("supertest");
const app = require("../app");
const { sequelize } = require("../models");
const { queryInterface } = sequelize;

beforeAll(async () => {
  const { ParkingData } = require("./dummy-data.json");
  ParkingData.forEach((el) => {
    delete el.id;
  });
  await queryInterface.bulkInsert("ParkingData", ParkingData);
});

afterAll(async () => {
  await queryInterface.bulkDelete("ParkingData", null, {
    truncate: true,
    restartIdentity: true,
    cascade: true,
  });
});

//! Test Cases
describe("POST /parkings", () => {
  test("POST /parkings - success test", async () => {
    const payload = {
      vehicleType: "mobil",
      startTime: "2022-11-08T13:15",
      endTime: "2022-11-08T16:15",
      licensePlate: "B9999XYZ",
    };
    const response = await request(app).post("/parkings").send(payload);

    expect(response.status).toBe(201);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body.result).toHaveProperty("days", expect.any(Number));
    expect(response.body.result).toHaveProperty("hours", expect.any(Number));
    expect(response.body.result).toHaveProperty("total", expect.any(Number));
  });

  test("POST /parkings - failed test - empty vehicle type", async () => {
    const payload = {
      startTime: "2022-11-08T13:15",
      endTime: "2022-11-08T16:15",
      licensePlate: "B9999XYZ",
    };
    const response = await request(app).post("/parkings").send(payload);

    expect(response.status).toBe(400);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", "Vehicle type is required");
  });

  test("POST /parkings - failed test - empty start time", async () => {
    const payload = {
      vehicleType: "mobil",
      endTime: "2022-11-08T16:15",
      licensePlate: "B9999XYZ",
    };
    const response = await request(app).post("/parkings").send(payload);

    expect(response.status).toBe(400);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", "Start time is required");
  });

  test("POST /parkings - failed test - empty end time", async () => {
    const payload = {
      vehicleType: "mobil",
      startTime: "2022-11-08T13:15",
      licensePlate: "B9999XYZ",
    };
    const response = await request(app).post("/parkings").send(payload);

    expect(response.status).toBe(400);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", "End time is required");
  });

  test("POST /parkings - failed test - empty license plate", async () => {
    const payload = {
      vehicleType: "mobil",
      startTime: "2022-11-08T13:15",
      endTime: "2022-11-08T16:15",
    };
    const response = await request(app).post("/parkings").send(payload);

    expect(response.status).toBe(400);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty(
      "message",
      "License plate is required"
    );
  });

  test("POST /parkings - failed test - invalid vehicle type", async () => {
    const payload = {
      vehicleType: "tank",
      startTime: "2022-11-08T13:15",
      endTime: "2022-11-08T16:15",
      licensePlate: "B9999XYZ",
    };
    const response = await request(app).post("/parkings").send(payload);

    expect(response.status).toBe(400);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", "Invalid vehicle type");
  });

  test("POST /parkings - failed test - invalid date input", async () => {
    const payload = {
      vehicleType: "motor",
      startTime: "xxx",
      endTime: "xxx",
      licensePlate: "B9999XYZ",
    };
    const response = await request(app).post("/parkings").send(payload);

    expect(response.status).toBe(400);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty(
      "message",
      "Input must be a valid date"
    );
  });

  test("POST /parkings - failed test - startTime > endTime", async () => {
    const payload = {
      vehicleType: "motor",
      startTime: "2022-11-08T16:15",
      endTime: "2022-11-08T13:15",
      licensePlate: "B9999XYZ",
    };
    const response = await request(app).post("/parkings").send(payload);

    expect(response.status).toBe(400);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty(
      "message",
      "Start time cannot be greater than the end date"
    );
  });
});

describe("GET /parkings/data", () => {
  test("GET /parkings/data - success test", async () => {
    const response = await request(app).get("/parkings/data");

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body.rows).toBeInstanceOf(Array);
    expect(response.body.rows[0]).toHaveProperty("id", expect.any(Number));
    expect(response.body.rows[0]).toHaveProperty(
      "vehicleType",
      expect.any(String)
    );
    expect(response.body.rows[0]).toHaveProperty(
      "startTime",
      expect.any(String)
    );
    expect(response.body.rows[0]).toHaveProperty("endTime", expect.any(String));
    expect(response.body.rows[0]).toHaveProperty(
      "parkingFee",
      expect.any(Number)
    );
    expect(response.body.rows[0]).toHaveProperty(
      "licensePlate",
      expect.any(String)
    );
  });

  test("GET /parkings/data - success test - filter by vehicle type", async () => {
    const response = await request(app).get("/parkings/data?type=mobil");

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body.rows).toBeInstanceOf(Array);
    expect(response.body.rows[0]).toHaveProperty("vehicleType", "mobil");
  });

  test("GET /parkings/data - success test - filter by date (between start and end date)", async () => {
    const start = "2022-11-09";
    const end = "2022-11-12";
    const startDate = Number(start.slice(-2));
    const endDate = Number(end.slice(-2));

    const response = await request(app).get(
      `/parkings/data?startDate=${start}&endDate=${end}`
    );
    const len = response.body.count;

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body.rows).toBeInstanceOf(Array);
    expect(response.body.rows[0]).toHaveProperty(
      "startTime",
      expect.any(String)
    );
    expect(response.body.rows[len - 1]).toHaveProperty(
      "endTime",
      expect.any(String)
    );

    // Check if the output match the date filter criteria
    const startResult = Number(
      response.body.rows[0].startTime.substring(8, 10)
    );
    const endResult = Number(
      response.body.rows[len - 1].endTime.substring(8, 10)
    );

    expect(startResult).toBeGreaterThanOrEqual(startDate);
    expect(endResult).toBeLessThanOrEqual(endDate);
  });

  test("GET /parkings/data - success test - filter by parking fee (between two values)", async () => {
    const min = 10000;
    const max = 50000;
    const response = await request(app).get(
      `/parkings/data?min=${min}&max=${max}`
    );

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body.rows).toBeInstanceOf(Array);

    const feeCheck = response.body.rows[0].parkingFee;
    expect(feeCheck).toBeGreaterThanOrEqual(min);
    expect(feeCheck).toBeLessThanOrEqual(max);
  });

  test("GET /parkings/data - success test - filter by parking fee (greater than min value)", async () => {
    const min = 1000000;
    const response = await request(app).get(`/parkings/data?min=${min}`);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body.rows).toBeInstanceOf(Array);

    const feeCheck = response.body.rows[0].parkingFee;
    expect(feeCheck).toBeGreaterThan(min);
  });

  test("GET /parkings/data - failed test - filter by parking fee (min value greater than max value)", async () => {
    const min = 100000;
    const max = 50000;
    const response = await request(app).get(
      `/parkings/data?min=${min}&max=${max}`
    );

    expect(response.status).toBe(400);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty(
      "message",
      "Min fee cannot be greater than the max fee"
    );
  });

  test("GET /parkings/data - success test - filter by vehicle plate number", async () => {
    const response = await request(app).get(`/parkings/data?plate=nas`);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body.rows).toBeInstanceOf(Array);
    expect(response.body.rows[0].licensePlate).toMatch(/[nas]/i);
  });

  test("GET /parkings/data - failed test - filter by date (start time greater than end time)", async () => {
    const start = "2022-11-12";
    const end = "2022-11-10";

    const response = await request(app).get(
      `/parkings/data?startDate=${start}&endDate=${end}`
    );

    expect(response.status).toBe(400);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty(
      "message",
      "Start date cannot be greater than the end date"
    );
  });
});
