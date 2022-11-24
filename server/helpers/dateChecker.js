function dateChecker(input) {
  input = new Date(input);
  return input instanceof Date && !isNaN(input);
}

module.exports = { dateChecker };
