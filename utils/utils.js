const SendResponse = (res, status, message = "", data = [], success = true) => {
  const response = { success, message, data };
  return res.status(status).json(response);
};

const SendError = (err, req, res, next) => {
  let errorMessage = err.message || "Sometning Went Wrong";
  const errorStatus = err.status || 500;

  // checking if error is an array...

  if (Array.isArray(err)) {
    errorMessage = err.map((e) => e.message);
  }

  res
    .status(errorStatus)
    .json({ success: false, message: errorMessage.toString() });

  next();
};

const PageNotFound = (req, res, next) => {
  res.send(`Page Not Found`);
  next();
};

const generateDate = () => {
  return new Date();
};

module.exports = { SendResponse, SendError, PageNotFound, generateDate };
