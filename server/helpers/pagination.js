const default_limit = 20;
const default_offset = 0;

const getPagination = (page, size) => {
  const limit = size ? +size : default_limit;
  const offset = page ? +page * limit : default_offset;
  return { limit, offset };
};

module.exports = { getPagination };
