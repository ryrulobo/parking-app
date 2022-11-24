import moment from "moment";

const dateFormatter = (date) => {
  return moment(date).format("DD-MMM-YYYY hh:mm");
};

export default dateFormatter;
