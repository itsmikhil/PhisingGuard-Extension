const { deleteExpiredCache } = require("./detection/cacheService");

const cleanupExpiredCache = async () => {
  await deleteExpiredCache();
};

module.exports = {
  cleanupExpiredCache,
};
