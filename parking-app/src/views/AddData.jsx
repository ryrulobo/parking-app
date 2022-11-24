import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import rupiahFormatter from "../helpers/currencyFormatter";

export default function AddData() {
  const [parkingData, setParkingData] = useState({
    vehicleType: "",
    startTime: "",
    endTime: "",
    licensePlate: "",
  });

  const addNewData = (e) => {
    const { name, value } = e.target;
    setParkingData({
      ...parkingData,
      [name]: value,
    });
  };

  const submitForm = (e) => {
    e.preventDefault();
    postData();
  };

  const postData = async () => {
    try {
      const { data } = await axios({
        method: "POST",
        url: "http://localhost:3000/parkings",
        data: {
          vehicleType: parkingData.vehicleType,
          startTime: parkingData.startTime,
          endTime: parkingData.endTime,
          licensePlate: parkingData.licensePlate,
        },
      });

      Swal.fire({
        icon: "success",
        title: `Parking fee: ${rupiahFormatter(data.result.total)}`,
        text: `Total = ${data.result.days} days, ${data.result.hours} hours`,
      });

      setParkingData({
        vehicleType: "",
        startTime: "",
        endTime: "",
        licensePlate: "",
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: err.response.data.message,
      });
    }
  };

  return (
    <div className="container border border-secondary rounded">
      <div className="p-4">
        <h3 className="mb-4">New Data</h3>
        <div className="input-group-sm mb-3">
          <form onSubmit={submitForm}>
            <div className="mb-3">
              <label htmlFor="vehicleType" className="form-label">
                Vehicle type
              </label>
              <select
                className="form-select"
                name="vehicleType"
                onChange={addNewData}
                value={parkingData.vehicleType}
              >
                <option value="" disabled>
                  Choose vehicle type
                </option>
                <option value="mobil">Car</option>
                <option value="motor">Motorcycle</option>
              </select>
            </div>

            <div className="mb-3">
              <label htmlFor="startTime" className="form-label">
                Start time
              </label>
              <input
                className="form-control"
                type="datetime-local"
                placeholder="Select start date"
                name="startTime"
                onChange={addNewData}
                value={parkingData.startTime}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="endTime" className="form-label">
                End time
              </label>
              <input
                className="form-control"
                type="datetime-local"
                placeholder="Select end date"
                name="endTime"
                onChange={addNewData}
                value={parkingData.endTime}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="licensePlate" className="form-label">
                License Plate
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Input plate number"
                name="licensePlate"
                maxLength={9}
                onChange={addNewData}
                value={parkingData.licensePlate}
              />
            </div>

            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
