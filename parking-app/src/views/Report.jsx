import { useState, useEffect } from "react";
import axios from "axios";
import Loading from "../components/Loading";
import Swal from "sweetalert2";
import rupiahFormatter from "../helpers/currencyFormatter";
import dateFormatter from "../helpers/dateFormatter";

export default function Report() {
  const [reportData, setReportData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  //! Filter
  const initialState = {
    vehicleType: "",
    min: "",
    max: "",
    startDate: "",
    endDate: "",
    plate: "",
  };
  const [filter, setFilter] = useState(initialState);

  const filterHandler = (e) => {
    const { name, value } = e.target;
    setFilter({
      ...filter,
      [name]: value,
    });
  };

  const clearFilter = (e) => {
    setFilter({ ...initialState });
  };

  useEffect(() => {
    fetchData();
  }, [page]);

  //! Fetch data
  const fetchData = async () => {
    try {
      setIsLoading(true);
      let options = {
        method: "GET",
        url: `http://localhost:3000/parkings/data?page=${page}&type=${filter.vehicleType}&min=${filter.min}&max=${filter.max}&startDate=${filter.startDate}&endDate=${filter.endDate}&plate=${filter.plate}`,
      };
      const { data } = await axios(options);
      setReportData(data.rows);
      setTotalPage(Math.ceil(data.count / 20));
      setIsLoading(false);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: err.response.data.message,
        timer: 2500,
      }).then(() => {
        window.location.reload();
      });
    }
  };

  //! Pagination
  const nextPage = (e) => {
    e.preventDefault();
    if (page + 1 > totalPage) return;
    setPage(page + 1);
  };

  const prevPage = (e) => {
    e.preventDefault();
    if (page === 1) return;
    setPage(page - 1);
  };

  //! Loading
  if (isLoading) {
    return <Loading />;
  }

  return (
    <div>
      {/* Filter */}
      <div className="container">
        <div className="p-2">
          <form
            onSubmit={(e) => {
              fetchData();
            }}
          >
            <div className="row g-3 mb-3 align-items-center justify-content-center">
              <div className="col-auto">
                <label className="col-form-label fw-bold">Vehicle Type</label>
              </div>
              <div className="col-2">
                <select
                  className="form-select"
                  name="vehicleType"
                  onChange={filterHandler}
                  value={filter.vehicleType}
                >
                  <option value="">All</option>
                  <option value="mobil">Mobil</option>
                  <option value="motor">Motor</option>
                </select>
              </div>

              <div className="col-auto">
                <label className="col-form-label fw-bold">Parking Fee</label>
              </div>
              <div className="col-2">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Minimum"
                  name="min"
                  value={filter.min}
                  onChange={filterHandler}
                />
              </div>
              <div className="col-auto fw-bold">
                <span>to</span>
              </div>
              <div className="col-2">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Maximum"
                  name="max"
                  value={filter.max}
                  onChange={filterHandler}
                />
              </div>
            </div>

            <div className="row g-3 mb-3 align-items-center justify-content-center">
              <div className="col-auto">
                <label className="col-form-label fw-bold">Date from</label>
              </div>
              <div className="col-2">
                <input
                  type="datetime-local"
                  className="form-control"
                  name="startDate"
                  value={filter.startDate}
                  onChange={filterHandler}
                />
              </div>
              <div className="col-auto fw-bold">
                <span>to</span>
              </div>
              <div className="col-2">
                <input
                  type="datetime-local"
                  className="form-control"
                  name="endDate"
                  value={filter.endDate}
                  onChange={filterHandler}
                />
              </div>
            </div>

            <div className="row g-3 mb-4 align-items-center justify-content-center">
              <div className="col-auto">
                <label className="col-form-label fw-bold">License plate</label>
              </div>
              <div className="col-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="..."
                  name="plate"
                  value={filter.plate}
                  onChange={filterHandler}
                />
              </div>
            </div>

            <div className="text-center mb-3">
              <button
                className="btn btn-danger"
                type="button"
                onClick={clearFilter}
              >
                Clear Filter
              </button>
              <button className="btn btn-dark ms-2" type="submit">
                Apply Filter
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Table */}
      {reportData.length === 0 ? (
        <h2 className="mb-4 d-flex justify-content-center">Data not found</h2>
      ) : (
        <div className="col-8 container table-responsive">
          <table className=" table table-striped table-hover align-middle bg-white ">
            <thead className="table-light bg-white">
              <tr style={{ textAlign: "center" }}>
                <th scope="col">No</th>
                <th scope="col">Vehicle Type</th>
                <th scope="col">License Plate</th>
                <th scope="col">Start Time</th>
                <th scope="col">End Time</th>
                <th scope="col">Parking Fee</th>
              </tr>
            </thead>
            <tbody>
              {reportData.map((el, i) => {
                return (
                  <tr key={i} style={{ textAlign: "center" }}>
                    <td className="fw-bold">{i + 1 + (page - 1) * 20}</td>
                    <td>{el.vehicleType}</td>
                    <td>{el.licensePlate}</td>
                    <td>{dateFormatter(el.startTime)}</td>
                    <td>{dateFormatter(el.endTime)}</td>
                    <td>{rupiahFormatter(el.parkingFee)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className="container d-flex justify-content-center">
        <div className="row">
          <div className="col">
            <nav>
              <ul className="pagination">
                <li className="page-item">
                  <button className="page-link" onClick={prevPage}>
                    Previous
                  </button>
                </li>
                {(() => {
                  let td = [];
                  for (let i = 1; i <= totalPage; i++) {
                    td.push(
                      <li className="page-item">
                        <button
                          className="page-link"
                          onClick={(e) => {
                            setPage(i);
                          }}
                        >
                          {i}
                        </button>
                      </li>
                    );
                  }
                  return td;
                })()}
                <li className="page-item">
                  <button className="page-link" onClick={nextPage}>
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}
