const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const validateRequest =
  (rules = {}) =>
  async (req, res, next) => {
    try {
      const { body = {}, query = {} } = req;
      const source = { ...body, ...query };

      for (const [field, rule] of Object.entries(rules)) {
        const value = source[field];

        if (
          rule.required &&
          (value === undefined || value === null || value === "")
        ) {
          return res.status(400).json({
            success: false,
            message: `${field} is required.`,
          });
        }

        if (rule.type === "url" && value) {
          try {
            const parsedUrl = new URL(value);
            if (!["http:", "https:"].includes(parsedUrl.protocol)) {
              throw new Error();
            }
          } catch (error) {
            return res.status(400).json({
              success: false,
              message: `Please provide a valid URL for ${field}.`,
            });
          }
        }

        if (rule.type === "email" && value) {
          if (!isValidEmail(value)) {
            return res.status(400).json({
              success: false,
              message: `Please provide a valid email for ${field}.`,
            });
          }
        }

        if (rule.minLength && value && String(value).length < rule.minLength) {
          return res.status(400).json({
            success: false,
            message: `${field} must be at least ${rule.minLength} characters.`,
          });
        }
      }

      next();
    } catch (error) {
      next(error);
    }
  };

module.exports = validateRequest;
