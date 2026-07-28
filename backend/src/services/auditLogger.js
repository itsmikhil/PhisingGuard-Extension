const logEvent = async (event, details = {}) => {
  try {
    const safeDetails = { ...details };

    delete safeDetails.password;
    delete safeDetails.token;
    delete safeDetails.jwt;

    console.log(`[audit] ${event}`, safeDetails);
  } catch (error) {
    console.error("Audit logging failed", error.message);
  }
};

module.exports = {
  logEvent,
};
