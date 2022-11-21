function parkingFee(startTime, endTime, type) {
  startTime = new Date(startTime);
  endTime = new Date(endTime);

  if (startTime > endTime) throw { name: "startTime > endTime" };

  let seconds = Math.floor((endTime - startTime) / 1000);
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);
  let days = Math.floor(hours / 24);

  hours = hours - days * 24;
  minutes = minutes - days * 24 * 60 - hours * 60;
  seconds = seconds - days * 24 * 60 * 60 - hours * 60 * 60 - minutes * 60;

  if (minutes > 0) hours++;

  let total;
  type === "mobil"
    ? (total = days * 80000 + hours * 5000)
    : (total = days * 40000 + hours * 2000);

  return { days, hours, total };
}

module.exports = { parkingFee };
